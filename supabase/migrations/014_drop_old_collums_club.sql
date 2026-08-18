-- ==========================================================
-- LIMPEZA: Remove colunas antigas do Clube (Substituídas por JSONB/Relacionamentos)
-- ==========================================================

ALTER TABLE public.clubs DROP COLUMN IF EXISTS address;
ALTER TABLE public.clubs DROP COLUMN IF EXISTS phone;
ALTER TABLE public.clubs DROP COLUMN IF EXISTS president;