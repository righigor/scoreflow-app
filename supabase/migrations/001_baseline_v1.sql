-- ==========================================================
-- SCOREFLOW V1.0 - BASELINE DE BANCO DE DADOS
-- Data de criação: 28/07/2026
-- Descrição: Criação inicial das tabelas, RLS, Triggers e Seeds.
-- Arquitetura: Parent-Child Order & Idempotent (Pode ser rodado N vezes)
-- ==========================================================

-- ---------------------------------------------------------
-- 1. TABELAS GLOBAIS / MASTER DATA (PAIS PRIMEIRO)
-- ---------------------------------------------------------

-- 1.1. Modalidades (Nível 1 da hierarquia)
CREATE TABLE IF NOT EXISTS public.modalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;

-- 1.2. Aparelhos (Depende de Modalidades)
CREATE TABLE IF NOT EXISTS public.apparatus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modality_id uuid REFERENCES public.modalities(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.apparatus ENABLE ROW LEVEL SECURITY;

-- 1.3. Categorias Base (Depende de Modalidades)
CREATE TABLE IF NOT EXISTS public.base_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modality_id uuid REFERENCES public.modalities(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  gender text CHECK (gender IN ('F', 'M', 'MIXED')) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.base_categories ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------
-- 2. TABELAS MULTI-TENANT (FEDERAÇÕES)
-- ---------------------------------------------------------

-- 2.1. Federações (Os Tenants)
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

-- 2.2. Perfis (Vincula o Auth do Supabase)
-- NOTA: A tabela profiles já vem com a extensão do Supabase (auth.users). 
-- Script de ALTER deixado aqui caso precise recriar em um banco limpo.
/*
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text NOT NULL CHECK (role IN ('FEDERATION_ADMIN', 'CLUB_ADMIN', 'JUDGE', 'SYSADMIN'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS federation_id uuid REFERENCES public.federations(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS club_id uuid;
*/

-- 2.3. Árbitros (Depende de Federações)
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

-- 2.4. Campeonatos (Depende de Federações)
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
-- 3. POLÍTICAS DE SEGURANÇA (RLS - AGRUPADAS POR TABELA)
-- ---------------------------------------------------------

-- 3.1. Federações
CREATE POLICY "Authenticated users can read federations" ON public.federations FOR SELECT USING (auth.role() = 'authenticated');

-- 3.2. Árbitros
CREATE POLICY "Federation can see own judges" ON public.judges FOR SELECT USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can insert own judges" ON public.judges FOR INSERT WITH CHECK (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can update own judges" ON public.judges FOR UPDATE USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));

-- 3.3. Campeonatos
CREATE POLICY "Federation can see own championships" ON public.championships FOR SELECT USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can insert own championships" ON public.championships FOR INSERT WITH CHECK (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Federation can update own championships" ON public.championships FOR UPDATE USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));

-- 3.4. Modalidades (SYSADMIN + Público para formulários)
CREATE POLICY "Only SYSADMIN can see modalities" ON public.modalities FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can insert modalities" ON public.modalities FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can update modalities" ON public.modalities FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
-- Permite que QUALQUER pessoa (até anônimos) leia as modalidades para usar nos formulários de convite
CREATE POLICY "Anyone can read modalities" ON public.modalities FOR SELECT USING (true);

-- 3.5. Aparelhos (SYSADMIN)
CREATE POLICY "Only SYSADMIN can see apparatus" ON public.apparatus FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can insert apparatus" ON public.apparatus FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can update apparatus" ON public.apparatus FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can delete apparatus" ON public.apparatus FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');

-- 3.6. Categorias Base (SYSADMIN)
CREATE POLICY "Only SYSADMIN can see base_categories" ON public.base_categories FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can insert base_categories" ON public.base_categories FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can update base_categories" ON public.base_categories FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can delete base_categories" ON public.base_categories FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');


-- ---------------------------------------------------------
-- 4. STORAGE / BUCKET DE IMAGENS
-- ---------------------------------------------------------
CREATE POLICY "SYSADMIN can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "SYSADMIN can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "SYSADMIN can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');


-- ---------------------------------------------------------
-- 5. TRIGGERS (AUTOMAÇÃO DE BANCO)
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_judge_user()
RETURNS trigger AS $$ 
BEGIN
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
-- 6. DADOS INICIAIS (SEEDS IDEMPOTENTES)
-- ---------------------------------------------------------

-- 6.1. Modalidades da CBG
INSERT INTO public.modalities (name, slug) VALUES
  ('Ginástica Artística', 'artistica'),
  ('Ginástica Rítmica', 'ritmica'),
  ('Ginástica de Trampolim', 'trampolim'),
  ('Ginástica Aeróbica', 'aerobica'),
  ('Ginástica Acrobática', 'acrobatica'),
  ('Ginástica de Parkour', 'parkour')
ON CONFLICT (slug) DO NOTHING;

-- 6.2. Federação Mineira (Para testes locais)
-- INSERT INTO public.federations (id, name, slug, sigla) 
-- VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Federação Mineira de Ginástica', 'fmg', 'FMG')
-- ON CONFLICT (slug) DO NOTHING;


-- ==========================================================
-- SPRINT 2: GESTÃO DE CLUBES E CONVITES
-- ==========================================================

-- ---------------------------------------------------------
-- 2.1. TABELA DE CONVITES GENÉRICOS DA FEDERAÇÃO
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.federation_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  federation_id uuid REFERENCES public.federations(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.federation_invites ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 2.2. TABELA DE CLUBES (TENANT DATA)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  federation_id uuid REFERENCES public.federations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  short_name text NOT NULL,
  sigla text NOT NULL,
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE')),
  cnpj text,
  address text,
  phone text,
  image_url text,
  bio text,
  president text,
  foundation_date date,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 2.3. TABELA N pra N (CLUBES X MODALIDADES)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.club_modalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  modality_id uuid REFERENCES public.modalities(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(club_id, modality_id)
);
ALTER TABLE public.club_modalities ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 2.4. RLS - SEGURANÇA DOS CLUBES
-- ---------------------------------------------------------

-- RLS: Só a federação dona pode ver/gerar/deletar convites
CREATE POLICY "Federation can manage own invites" ON public.federation_invites FOR ALL 
  USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));

-- RLS: A federação pode VER e ATUALIZAR (aprovar/rejeitar) seus clubes
CREATE POLICY "Federation can see own clubs" ON public.clubs FOR SELECT 
  USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));
  
CREATE POLICY "Federation can update own clubs" ON public.clubs FOR UPDATE 
  USING (federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid()));

-- RLS: Permite que o próprio clube leia os dados dele
CREATE POLICY "Club can read own club" ON public.clubs FOR SELECT 
  USING (id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));

-- RLS: Federação consegue ver as modalidades dos clubes para o painel
CREATE POLICY "Federation can see own club modalities" ON public.club_modalities FOR SELECT
  USING (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));


-- ---------------------------------------------------------
-- 2.5. RPC: Cadastro Seguro de Clubes via Convite
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_club_with_invite(
  p_user_id uuid,
  p_token text,
  p_name text,
  p_short_name text,
  p_sigla text,
  p_modalities jsonb
) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER AS $$ 
DECLARE
  v_invite record;
  v_new_club uuid;
  v_mod_array text[];
BEGIN
  -- 1. Segurança: Garante que quem está chamando a função é realmente o dono da conta que acabou de ser criada
  IF p_user_id != auth.uid() THEN
    RETURN json_build_object('error', 'Ação não autorizada')::json;
  END IF;

  -- 2. Busca o convite e verifica se ainda é válido
  SELECT * INTO v_invite FROM public.federation_invites 
  WHERE token = p_token AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Convite inválido ou expirado')::json;
  END IF;

  -- 3. Cria o perfil do tipo CLUBE, atrelado à federação do convite
  INSERT INTO public.profiles (id, role, full_name, federation_id)
  VALUES (p_user_id, 'CLUB_ADMIN', p_name, v_invite.federation_id);

  -- 4. Cria o registro do Clube com status PENDING
  INSERT INTO public.clubs (federation_id, name, short_name, sigla, email, status)
  VALUES (
    v_invite.federation_id, 
    p_name, 
    p_short_name, 
    p_sigla, 
    (SELECT email FROM auth.users WHERE id = p_user_id), 
    'PENDING'
  )
  RETURNING id INTO v_new_club;

  -- 5. Converte o JSON do React para array nativo do Postgres de forma segura
  IF p_modalities IS NOT NULL THEN
    v_mod_array := ARRAY(SELECT jsonb_array_elements_text(p_modalities));
    
    INSERT INTO public.club_modalities (club_id, modality_id)
    SELECT v_new_club, mod_id::uuid
    FROM unnest(v_mod_array) AS mod_id;
  END IF;

  -- 6. Atualiza o profile para dizer a qual clube esse usuário pertence
  UPDATE public.profiles SET club_id = v_new_club WHERE id = p_user_id;

  RETURN json_build_object('success', true, 'club_id', v_new_club)::json;
END;
 $$;