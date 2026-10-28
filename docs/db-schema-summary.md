````markdown
# ScoreFlow V1.0 - Mapa do Banco de Dados (Pós-Sprint 6 + Arbitragem)
> **Atenção:** Este documento reflete o estado atual do banco após a Sprint 5 & 6 + 3 migrations de Arbitragem (PK/sort_order em championship_category_apparatus; criação de championship_arbitration_assignments; criação de judge_modalities).

---

## 1. Auth & Perfis (Controle de Acesso)
- **`auth.users`** *(Tabela interna do Supabase)*
- **`profiles`** *(Linka com auth.users)*
  - `id` (uuid, PK = auth.uid)
  - `role` (text: SYSADMIN, FEDERATION_ADMIN, CLUB_ADMIN, JUDGE)
  - `full_name` (text)
  - `federation_id` (uuid, FK federations)
  - `club_id` (uuid)
  - `judge_id` (uuid, FK judges)

---

## 2. Master Data (Dados Globais - SYSADMIN)
- **`modalities`**: `id`, `name`, `slug`, `image_url`
- **`apparatus`**: `id`, `modality_id` (FK), `name`, `slug`, `image_url`
- **`base_categories`**: `id`, `modality_id` (FK), `name`, `slug`, `gender` ('F', 'M', 'MIXED')
- **`staff_roles`**: `id`, `name`, `slug`

---

## 3. Tenants (Inquilinos)
- **`federations`**: `id`, `name`, `slug`, `sigla`, `status`, `image_url`, `address_id` (FK), `bio`, `contact_email`, `cnpj`, `foundation_date`, `primary_color`, `secondary_color`, `president_name`, `president_instagram`, `vice_president_name`, `vice_president_instagram`, `phones` (jsonb array), `social_links` (jsonb object)
- **`addresses`**: `id`, `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `zip_code`
- **`federation_invites`**: `id`, `federation_id` (FK), `token` (unique), `expires_at`

---

## 4. Entidades do Clube (Tenant Data)
- **`clubs`**: `id`, `federation_id` (FK), `name`, `short_name`, `sigla`, `email` (unique), `status` ('PENDING', 'ACTIVE', 'INACTIVE'), `cnpj`, `address`, `phone`, `image_url`, `bio`, `president`, `foundation_date`
- **`club_modalities`** (N:N): `club_id`, `modality_id`

- **`judges`**: `id`, `federation_id` (FK), `name`, `email` (unique), `brevet`, `telefone`, `active`, `status` ('INVITED', 'ACTIVE'), `image_url`, `updated_at`
- **`judge_profile`**: `id`, `judge_id` (unique FK), `cpf`, `pis`, `phone`, `bank`, `bank_branch`, `bank_account`, `pix_key`, `updated_at`
- **`judge_modalities`** (N:N juiz → modalidades de atuação) — NOVO:
  - `judge_id` (uuid, FK judges, on delete CASCADE)
  - `modality_id` (uuid, FK modalities, on delete CASCADE)
  - PK composta `(judge_id, modality_id)`

- **`athletes`**: `id`, `club_id` (FK), `name`, `cpf` (unique), `phone`, `birthdate`, `gender`, `profile_picture_url`, `status` ('ACTIVE', 'INJURED', 'INACTIVE', 'RETIRED', 'FREE_AGENT'), `instagram_url`, `identity_pdf_url`, `residence_proof_pdf_url`, `image_right_term_pdf_url`, `updated_at`
- **`athlete_modalities`** (N:N): `athlete_id`, `modality_id`

- **`staff`**: `id`, `club_id` (FK), `staff_role_id` (FK), `previous_athlete_id` (FK athletes), `name`, `cpf` (unique), `phone`, `gender`, `profile_picture_url`, `status`, `instagram_url`, `identity_pdf_url`, `residence_proof_pdf_url`, `image_right_term_pdf_url`, `updated_at`
- **`staff_modalities`** (N:N): `staff_id`, `modality_id`

---

## 5. Entidades do Campeonato (Tenant Data)
- **`championships`**:
  - `id` (uuid, PK)
  - `federation_id` (uuid, FK federations)
  - `modality_id` (uuid, FK modalities)
  - `name` (text)
  - `slug` (text, único, auto-gerado)
  - `location` (text, nullable)
  - `start_date` (date, nullable)
  - `end_date` (date, nullable)
  - `inscription_start_date` (date, nullable)
  - `inscription_end_date` (date, nullable)
  - `description` (text, nullable)
  - `regulation_pdf_url` (text, nullable) — path no bucket `documents`
  - `fee_per_athlete` (numeric(10,2), default 0)
  - `status` (text, default 'DRAFT') — DRAFT, OPEN, IN_PROGRESS, FINISHED
  - `inscription_token` (text, único, auto-gerado)
  - `logo_url` (text, nullable) — URL no bucket `images`
  - `trophy_image_url` (text, nullable) — URL no bucket `images`
  - `created_at`, `updated_at` (timestamptz)

- **`championship_categories`** (N:N campeonato → categoria base):
  - `id` (uuid, PK)
  - `championship_id` (uuid, FK championships, on delete CASCADE)
  - `base_category_id` (uuid, FK base_categories, on delete RESTRICT)
  - `custom_name` (text, nullable) — preparado para variações de categoria
  - `UNIQUE(championship_id, base_category_id)`

- **`championship_category_apparatus`** (N:N categoria → aparelho, com ordem) — ATUALIZADO:
  - `id` (uuid, PK, default gen_random_uuid()) — *substitui a antiga PK composta (migration)*
  - `championship_category_id` (uuid, FK, on delete CASCADE)
  - `apparatus_id` (uuid, FK apparatus, on delete RESTRICT)
  - `sort_order` (int, NOT NULL, default 0) — define a ordem de apresentação das sessões
  - `UNIQUE(championship_category_id, apparatus_id)` — constraint `championship_category_apparatus_unique`

- **`championship_arbitration_assignments`** (Vínculo juiz → papel no campeonato):
  - `id` (uuid, PK)
  - `championship_id` (uuid, FK championships, on delete CASCADE)
  - `judge_id` (uuid, FK judges, on delete CASCADE)
  - `role` (text) — DIRECTOR, SECRETARY, A, E, DA, DB
  - `slot_position` (int, nullable) — 1-4 para painéis, null para diretor/secretário
  - `status` (text, default 'INVITED') — INVITED, CONFIRMED, DECLINED
  - `invited_at` (timestamptz, default now())
  - `confirmed_at` (timestamptz, nullable)
  - `created_at`, `updated_at` (timestamptz)
  - Índices: `idx_arb_assignments_championship` (championship_id), `idx_arb_assignments_judge` (judge_id)
  - Trigger `trg_arb_assignments_updated_at` → `handle_updated_at()`
  - CHECK `chk_slot_range`: `(role IN ('DIRECTOR','SECRETARY') AND slot_position IS NULL) OR (role NOT IN ('DIRECTOR','SECRETARY') AND slot_position BETWEEN 1 AND 4)`

---

## 6. Auditoria & Histórico
- **`movement_history`** *(Tabela Polimórfica)*:
  - `target_id` (uuid), `target_type` ('ATHLETE', 'STAFF')
  - `movement_type` ('JOIN', 'LEAVE', 'TRANSFER', 'CHANGE_MODALITY', 'BECAME_STAFF')
  - `club_id` (FK), `previous_club_id` (FK)
  - `modality_id` (FK), `previous_modality_id` (FK)
  - `movement_date`

---

## 7. Regras de Negócio Importantes (Triggers & RPCs)
1. **Automação de Histórico:** As tabelas `athletes` e `staff` possuem trigger (`handle_movement_history`). Qualquer INSERT ou UPDATE no `club_id` gera um registro automático na `movement_history`. O Front-end NÃO precisa criar registro de histórico manualmente.
2. **Cadastro de Juiz:** Quando um email é confirmado no `auth.users`, um trigger verifica se existe na tabela `judges`. Se sim, cria o `profile` com role 'JUDGE' e preenche o `judge_id`.
3. **`register_club_with_invite(...)`:** RPC que valida o token, cria o profile CLUBE, cria o clube PENDING e vincula as modalidades.
4. **`convert_athlete_to_staff(...)`:** RPC que copia os dados do atleta, cria o staff, aposenta o atleta (status RETIRED, clube NULL) e dispara os gatilhos de histórico automaticamente.
5. **Slug do Campeonato:** Trigger `handle_championship_slug` gera slug automaticamente a partir do nome (remove acentos, minúsculo, traços).
6. **Função `get_my_federation_id()`:** Resolve o `federation_id` do usuário logado independentemente do role (direto no profile, ou via clubs, ou via judges).
7. **`updated_at` Automático:** `championship_arbitration_assignments` usa trigger `trg_arb_assignments_updated_at` (função `handle_updated_at()`) para manter o timestamp de atualização. O Front não envia `updated_at` manualmente.

---

## 8. Segurança (RLS Resumido)

### Bancos de Dados
- **SYSADMIN:** Leitura global de tudo. Escrita apenas em Master Data.
- **FEDERATION_ADMIN:** Leitura/Escrita em tudo com `federation_id` da federação (Clubes, Juízes, Atletas, Staff, Campeonatos, Categorias, Aparelhos, Arbitragem, Modalidades de Juízes).
- **CLUB_ADMIN:** Leitura/Escrita apenas no clube correspondente ao `club_id` do perfil logado (Atletas, Staff próprio, Modalidades próprias).
- **JUDGE:** Leitura/Escrita apenas em `judges`/`judge_profile` (via `judge_id`), `championship_arbitration_assignments` (via `judge_id`) e `judge_modalities` (próprias modalidades).
- **Anônimo:** Leitura de campeonatos com status OPEN/IN_PROGRESS/FINISHED e suas categorias/aparelhos.

### Políticas Específicas — NOVO
- **`championship_arbitration_assignments`:**
  - FEDERATION_ADMIN: FOR ALL (CRUD) se o campeonato pertence à sua federação (`fed_admin_arb_assignments_all`).
  - JUDGE: SELECT apenas das próprias atribuições, via `judge_id` do profile (`judge_arb_assignments_read`).
  - SYSADMIN: SELECT global (`sysadmin_arb_assignments_read`).
  - Demais autenticados: SELECT se o campeonato pertence à sua federação (`auth_arb_assignments_read`).
- **`judge_modalities`:**
  - SYSADMIN: FOR ALL global (`sysadmin_judge_modalities_all`).
  - FEDERATION_ADMIN: FOR ALL se o juiz pertence à sua federação (`fed_admin_judge_modalities_all`).
  - JUDGE: FOR ALL nas próprias modalidades (`judge_judge_modalities_crud`).
  - Demais autenticados: SELECT se o juiz pertence à sua federação (`auth_judge_modalities_read`).

### Storage (Bucket `images`)
- **SYSADMIN, FEDERATION_ADMIN, JUDGE:** Upload/update em todo o bucket.
- **Políticas específicas:** `athletes/` e `staff/` restringidos ao clube, `championships/` à federação.

### Storage (Bucket `documents`)
- **`athletes/` e `staff/`:** CLUB_ADMIN CRUD, FEDERATION_ADMIN leitura, SYSADMIN leitura.
- **`championships/`:** FEDERATION_ADMIN CRUD, SYSADMIN leitura, Anônimo leitura.
- **RLS:** Uso de `get_my_federation_id()` e subqueries para validar belong-to-tenancy.
````
