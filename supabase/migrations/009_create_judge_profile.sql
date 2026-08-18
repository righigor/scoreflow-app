-- ==========================================================
-- SPRINT 3/4 (CONT.): Perfil do Árbitro + Dados Financeiros
-- Descrição: Tabela judges ganha image_url e updated_at.
--             Nova tabela judge_profile para dados sensíveis (RLS isolado).
-- ==========================================================

-- ---------------------------------------------------------
-- 1. Adiciona image_url e updated_at na tabela judges
-- ---------------------------------------------------------
ALTER TABLE public.judges 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Trigger de updated_at (reaproveita o existente da sprint 3/4)
DROP TRIGGER IF EXISTS set_updated_at ON public.judges;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.judges
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ---------------------------------------------------------
-- 2. Tabela judge_profile (dados sensíveis, isolada)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.judge_profile (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_id uuid UNIQUE REFERENCES public.judges(id) ON DELETE CASCADE NOT NULL,
    cpf text,
    pis text,
    phone text,
    bank text,
    bank_branch text,
    bank_account text,
    pix_key text,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.judge_profile ENABLE ROW LEVEL SECURITY;

-- Trigger de updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.judge_profile;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.judge_profile
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ---------------------------------------------------------
-- 3. Seed: Cria profile vazio para juízes que ainda não têm
-- ---------------------------------------------------------
INSERT INTO public.judge_profile (judge_id)
SELECT j.id
FROM public.judges j
WHERE NOT EXISTS (
    SELECT 1 FROM public.judge_profile jp WHERE jp.judge_id = j.id
)
ON CONFLICT (judge_id) DO NOTHING;


-- ---------------------------------------------------------
-- 4. RLS: judges (adiciona acesso do próprio juiz)
-- ---------------------------------------------------------
-- O juiz lê e edita o próprio registro
CREATE POLICY "Judge can read own judge" ON public.judges FOR SELECT
    USING (id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Judge can update own judge" ON public.judges FOR UPDATE
    USING (id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid()));


-- ---------------------------------------------------------
-- 5. RLS: judge_profile (acesso do próprio juiz + federação)
-- ---------------------------------------------------------
-- Juiz lê e edita o próprio profile financeiro
CREATE POLICY "Judge can read own profile" ON public.judge_profile FOR SELECT
    USING (judge_id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Judge can insert own profile" ON public.judge_profile FOR INSERT
    WITH CHECK (judge_id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Judge can update own profile" ON public.judge_profile FOR UPDATE
    USING (judge_id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid()));

-- Federação lê os profiles dos seus juízes (para gerar recibos)
CREATE POLICY "Federation can read own judge profiles" ON public.judge_profile FOR SELECT
    USING (
        judge_id IN (
            SELECT id FROM public.judges 
            WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())
        )
    );


-- ---------------------------------------------------------
-- 6. Storage: Árbitro pode fazer upload da própria foto
-- ---------------------------------------------------------
CREATE POLICY "Judge can upload own image" ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'images' 
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'JUDGE'
    );

CREATE POLICY "Judge can update own image" ON storage.objects FOR UPDATE 
    WITH CHECK (
        bucket_id = 'images' 
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'JUDGE'
    );