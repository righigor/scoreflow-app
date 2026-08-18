-- ==========================================================
-- SPRINT 3/4 (CONT.): Padroniza Perfil do Clube com a Federação
-- ==========================================================

-- 1. Adiciona as novas colunas na tabela clubs
ALTER TABLE public.clubs 
ADD COLUMN IF NOT EXISTS address_id uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS president_name text,
ADD COLUMN IF NOT EXISTS president_instagram text,
ADD COLUMN IF NOT EXISTS vice_president_name text,
ADD COLUMN IF NOT EXISTS vice_president_instagram text,
ADD COLUMN IF NOT EXISTS phones jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS instagram_url text;

-- 2. Migra dados antigos para não perder o que já foi preenchido
UPDATE public.clubs SET president_name = president WHERE president IS NOT NULL AND (president_name IS NULL OR president_name = '');
UPDATE public.clubs SET phones = jsonb_build_array(phone) WHERE phone IS NOT NULL AND phones = '[]'::jsonb;
UPDATE public.clubs SET contact_email = email WHERE contact_email IS NULL;

-- 3. RLS: Permite que o próprio clube crie e edite seu endereço
CREATE POLICY "Club can update own address" ON public.addresses FOR UPDATE
    USING (
        id IN (
            SELECT address_id 
            FROM public.clubs 
            WHERE id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Club can insert own address" ON public.addresses FOR INSERT
    WITH CHECK (true);