-- 1. Tabela de Endereços (REUSÁVEL NO FUTURO PARA CLUBES)
CREATE TABLE IF NOT EXISTS public.addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    street text,
    number text,
    complement text,
    neighborhood text,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 2. Adicionando as colunas na tabela Federation
ALTER TABLE public.federations 
ADD COLUMN IF NOT EXISTS address_id uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS cnpj text,
ADD COLUMN IF NOT EXISTS foundation_date date,
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS president_name text,
ADD COLUMN IF NOT EXISTS president_instagram text,
ADD COLUMN IF NOT EXISTS vice_president_name text,
ADD COLUMN IF NOT EXISTS vice_president_instagram text,
ADD COLUMN IF NOT EXISTS phones jsonb DEFAULT '[]'::jsonb, -- Array de strings
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb; -- Objeto chave-valor

-- 3. Permissão RLS para o novo endereço (Apenas o dono edita)
CREATE POLICY "Federation can update own address" ON public.addresses FOR UPDATE
    USING (
        id IN (
            SELECT address_id 
            FROM public.federations 
            WHERE id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())
        )
    );