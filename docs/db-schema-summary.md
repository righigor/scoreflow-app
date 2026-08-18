# ScoreFlow V1.0 - Mapa do Banco de Dados (Sprint 4)
> **Atenção IA:** Todas as tabelas abaixo JÁ EXISTEM. Não tente criá-las com `CREATE TABLE`. 
> O foco agora é criar Queries, Interfaces TypeScript e Telas React baseadas nesta estrutura.

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
- **`staff_roles`**: `id`, `name`, `slug` *(Seeds: Treinador Principal, Auxiliar, Fisioterapeuta, etc)*

---

## 3. Tenants (Inquilinos)
- **`federations`**: `id`, `name`, `slug`, `sigla`, `status`, `image_url`, `address_id` (FK), `bio`, `contact_email`, `cnpj`, `foundation_date`, `primary_color`, `secondary_color`, `president_name`, `president_instagram`, `vice_president_name`, `vice_president_instagram`, `phones` (jsonb array), `social_links` (jsonb object)
- **`addresses`** *(Reusável no futuro)*: `id`, `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `zip_code`
- **`federation_invites`**: `id`, `federation_id` (FK), `token` (unique), `expires_at`

---

## 4. Entidades do Campeonato (Tenant Data)
- **`clubs`**: `id`, `federation_id` (FK), `name`, `short_name`, `sigla`, `email` (unique), `status` ('PENDING', 'ACTIVE', 'INACTIVE'), `cnpj`, `address`, `phone`, `image_url`, `bio`, `president`, `foundation_date`
- **`club_modalities`** (N:N): `club_id`, `modality_id`

- **`judges`**: `id`, `federation_id` (FK), `name`, `email` (unique), `brevet`, `telefone`, `active`, `status` ('INVITED', 'ACTIVE'), `image_url`, `updated_at`
- **`judge_profile`** *(Dados sensíveis 1:1)*: `id`, `judge_id` (unique FK), `cpf`, `pis`, `phone`, `bank`, `bank_branch`, `bank_account`, `pix_key`, `updated_at`

- **`athletes`**: `id`, `club_id` (FK), `name`, `cpf` (unique), `phone`, `birthdate`, `gender`, `profile_picture_url`, `status` ('ACTIVE', 'INJURED', 'INACTIVE', 'RETIRED', 'FREE_AGENT'), `instagram_url`, `identity_pdf_url`, `residence_proof_pdf_url`, `image_right_term_pdf_url`, `updated_at`
- **`athlete_modalities`** (N:N): `athlete_id`, `modality_id`

- **`staff`** *(Comissão Técnica)*: `id`, `club_id` (FK), `staff_role_id` (FK), `previous_athlete_id` (FK athletes), `name`, `cpf` (unique), `phone`, `gender`, `profile_picture_url`, `status`, `instagram_url`, `identity_pdf_url`, `residence_proof_pdf_url`, `image_right_term_pdf_url`, `updated_at`
- **`staff_modalities`** (N:N): `staff_id`, `modality_id`

---

## 5. Auditoria & Histórico
- **`movement_history`** *(Tabela Polimórfica)*: 
  - `target_id` (uuid), `target_type` ('ATHLETE', 'STAFF')
  - `movement_type` ('JOIN', 'LEAVE', 'TRANSFER', 'CHANGE_MODALITY', 'BECAME_STAFF')
  - `club_id` (FK), `previous_club_id` (FK)
  - `modality_id` (FK), `previous_modality_id` (FK)
  - `movement_date`

---

## 6. Regras de Negócio Importantes (Triggers & RPCs)
1. **Automação de Histórico:** As tabelas `athletes` e `staff` possuem trigger (`handle_movement_history`). Qualquer INSERT ou UPDATE no `club_id` gera um registro automático na `movement_history`. O Front-end NÃO precisa criar registro de histórico manualmente.
2. **Cadastro de Juiz:** Quando um email é confirmado no `auth.users`, um trigger verifica se existe na tabela `judges`. Se sim, cria o `profile` com role 'JUDGE' e preenche o `judge_id`.
3. **`register_club_with_invite(p_user_id, p_token, p_name, p_short_name, p_sigla, p_modalities)`:** RPC que valida o token, cria o profile CLUBE, cria o clube PENDING e vincula as modalidades.
4. **`convert_athlete_to_staff(p_athlete_id, p_staff_role_id, p_modalities)`:** RPC que copia os dados do atleta, cria o staff, aposenta o atleta (status RETIRED, clube NULL) e dispara os gatilhos de histórico automaticamente.

---

## 7. Segurança (RLS Resumido)
- **SYSADMIN:** Leitura global de tudo. Escrita apenas em Master Data (`modalities`, `apparatus`, etc).
- **FEDERATION_ADMIN:** Leitura/Escrita em tudo que tiver o `federation_id` dela (Clubes, Juízes, Atletas, etc). Leitura dos `judge_profile` dos seus juízes.
- **CLUB_ADMIN:** Leitura/Escrita APENAS no clube correspondente ao `club_id` do perfil logado (Atletas, Staff próprio, Modalidades próprias).
- **JUDGE:** Leitura/Escrita apenas no próprio `judges` e `judge_profile` (usando o `judge_id` do perfil logado).
- **Storage (bucket: 'images'):** SYSADMIN, FEDERATION_ADMIN e JUDGE podem fazer upload/update.
