-- ==========================================================
-- SCOREFLOW V1.0 - BASELINE DE BANCO DE DADOS
-- Data de criação: 28/07/2026
-- Descrição: Criação inicial das tabelas, RLS e Triggers
-- ==========================================================

-- ---------------------------------------------------------
-- 1. TABELAS GLOBAIS (MASTER DATA)
-- ---------------------------------------------------------

-- Aparelhos (Gerenciado pelo SYSADMIN)
CREATE TABLE IF NOT EXISTS public.apparatus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.apparatus ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 2. TABELAS MULTI-TENANT (FEDERAÇÕES)
-- ---------------------------------------------------------

-- Federações (Os Tenants)
CREATE TABLE IF NOT EXISTS public.federations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sigla text NOT NULL,
  image_url text,
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TRIAL')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.federations ENABLE ROW LEVEL SECURITY;

-- Perfis (Vincula o Auth do Supabase ao nosso sistema)
-- Nota: A tabela profiles já vem com a extensão do Supabase (auth.users), 
-- mas aqui está o script de ALTER caso precise recriar em outro banco limpo.
/*
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text NOT NULL CHECK (role IN ('FEDERATION_ADMIN', 'CLUB_ADMIN', 'JUDGE', 'SYSADMIN'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS federation_id uuid REFERENCES public.federations(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS club_id uuid;
*/

-- Árbitros (Juízes)
CREATE TABLE IF NOT EXISTS public.judges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  federation_id uuid REFERENCES public.federations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  cpf text UNIQUE,
  brevet text NOT NULL,
  telefone text,
  active boolean DEFAULT true,
  status text DEFAULT 'INVITED' CHECK (status IN ('INVITED', 'ACTIVE')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;

-- Campeonatos
CREATE TABLE IF NOT EXISTS public.championships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  federation_id uuid REFERENCES public.federations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  location text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'LIVE', 'FINISHED')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------
-- 3. POLÍTICAS DE SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- ---------------------------------------------------------

-- Federações: Qualquer logado pode ler (para o portal público no futuro)
CREATE POLICY "Authenticated users can read federations" ON public.federations FOR SELECT USING (auth.role() = 'authenticated');

-- Árbitros: Só a própria federação do usuário logado
CREATE POLICY "Federation can see own judges" ON public.judges FOR SELECT USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can insert own judges" ON public.judges FOR INSERT WITH CHECK (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can update own judges" ON public.judges FOR UPDATE USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));

-- Campeonatos: Só a própria federação
CREATE POLICY "Federation can see own championships" ON public.championships FOR SELECT USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can insert own championships" ON public.championships FOR INSERT WITH CHECK (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can update own championships" ON public.championships FOR UPDATE USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));

-- Aparelhos: Só o SYSADMIN
CREATE POLICY "Only SYSADMIN can see apparatus" ON public.apparatus FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can insert apparatus" ON public.apparatus FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can update apparatus" ON public.apparatus FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can delete apparatus" ON public.apparatus FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');

-- 1. Cria a tabela de Modalidades (Master Data Nível 1)
create table public.modalities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.modalities enable row level security;

-- RLS do Admin para Modalidades
create policy "Only SYSADMIN can see modalities" on public.modalities for select
  using ((select role from public.profiles where id = auth.uid()) = 'SYSADMIN');
create policy "Only SYSADMIN can insert modalities" on public.modalities for insert
  with check ((select role from public.profiles where id = auth.uid()) = 'SYSADMIN');
create policy "Only SYSADMIN can update modalities" on public.modalities for update
  using ((select role from public.profiles where id = auth.uid()) = 'SYSADMIN');

-- 2. Adiciona a chave estrangeira na tabela de Aparelhos
alter table public.apparatus 
add column modality_id uuid references public.modalities(id) on delete cascade;

-- 3. Popula as Modalidades da CBG (Seed Oficial)
insert into public.modalities (name, slug) values
('Ginástica Artística', 'artistica'),
('Ginástica Rítmica', 'ritmica'),
('Ginástica de Trampolim', 'trampolim'),
('Ginástica Aeróbica', 'aerobica'),
('Ginástica Acrobática', 'acrobatica'),
('Ginástica de Parkour', 'parkour');


-- 1. Permite que o SYSADMIN faça UPLOAD (INSERT) de imagens
CREATE POLICY "SYSADMIN can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN'
);

-- 2. Permite que o SYSADMIN SUBSTITUA (UPDATE) imagens
CREATE POLICY "SYSADMIN can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN'
);

-- 3. Permite que o SYSADMIN DELETE imagens
CREATE POLICY "SYSADMIN can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN'
);

-- ---------------------------------------------------------
-- 4. TRIGGERS (AUTOMAÇÃO DE BANCO)
-- ---------------------------------------------------------

-- Trigger: Cria automaticamente o perfil de ÁRBITRO quando ele confirma o e-mail
CREATE OR REPLACE FUNCTION public.handle_new_judge_user()
RETURNS trigger AS $$ BEGIN
  IF EXISTS (SELECT 1 FROM public.judges WHERE email = new.email) THEN
    DECLARE v_fed_id uuid;
    BEGIN
      SELECT federation_id INTO v_fed_id FROM public.judges WHERE email = new.email LIMIT 1;
      
      INSERT INTO public.profiles (id, role, full_name, federation_id)
      VALUES (
        new.id, 
        'JUDGE', 
        (SELECT name FROM public.judges WHERE email = new.email LIMIT 1), 
        v_fed_id
      );
      
      UPDATE public.judges SET status = 'ACTIVE' WHERE email = new.email;
    END;
  END IF;
  RETURN new;
END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_judge_user();


-- ---------------------------------------------------------
-- 5. DADOS INICIAIS (SEED)
-- ---------------------------------------------------------
-- Inserção da Federação Mineira para testes
-- INSERT INTO public.federations (id, name, slug, sigla) 
-- VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Federação Mineira de Ginástica', 'fmg', 'FMG');