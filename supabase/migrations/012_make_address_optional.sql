-- Libera cidade e estado para serem nulos (Clubes/Feds podem não ter endereço ainda)
ALTER TABLE public.addresses ALTER COLUMN city DROP NOT NULL;
ALTER TABLE public.addresses ALTER COLUMN state DROP NOT NULL;