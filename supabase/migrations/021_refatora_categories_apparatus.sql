-- 1. Remove PK composta
ALTER TABLE public.championship_category_apparatus
  DROP CONSTRAINT championship_category_apparatus_pkey;

-- 2. Adiciona id e sort_order
ALTER TABLE public.championship_category_apparatus
  ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ADD COLUMN sort_order int NOT NULL DEFAULT 0;

-- 3. Recria a restrição de unicidade
ALTER TABLE public.championship_category_apparatus
  ADD CONSTRAINT championship_category_apparatus_unique
  UNIQUE (championship_category_id, apparatus_id);