-- ==========================================================
-- AJUSTE: Remove CPF de judges (dado sensível)
-- ==========================================================

-- 1. Migra CPF existente para judge_profile (não perde dados)
UPDATE public.judge_profile jp
SET cpf = j.cpf
FROM public.judges j
WHERE jp.judge_id = j.id 
  AND j.cpf IS NOT NULL 
  AND (jp.cpf IS NULL OR jp.cpf = '');

-- 2. Remove a coluna
ALTER TABLE public.judges DROP COLUMN IF EXISTS cpf;