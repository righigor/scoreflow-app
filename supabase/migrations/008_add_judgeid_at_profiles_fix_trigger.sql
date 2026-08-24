-- ==========================================================
-- CORREÇÃO: Adiciona judge_id no perfil do árbitro
-- ==========================================================

-- 1. Adiciona a coluna (nullable, pois nem todo perfil é juiz)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS judge_id uuid REFERENCES public.judges(id) ON DELETE SET NULL;

-- 2. Corrige perfis existentes que já são juízes (preenche o judge_id pelo email)
UPDATE public.profiles p
SET judge_id = j.id
FROM public.judges j
WHERE p.role = 'JUDGE' 
  AND p.judge_id IS NULL 
  AND p.id IN (SELECT id FROM auth.users WHERE email = j.email);

-- 3. Atualiza o trigger para preencher judge_id automaticamente em novos cadastros
CREATE OR REPLACE FUNCTION public.handle_new_judge_user()
RETURNS trigger AS $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM public.judges WHERE email = new.email) THEN
    DECLARE v_fed_id uuid;
    DECLARE v_judge_id uuid;
    BEGIN
      SELECT federation_id, id INTO v_fed_id, v_judge_id 
      FROM public.judges 
      WHERE email = new.email 
      LIMIT 1;
      
      INSERT INTO public.profiles (id, role, full_name, federation_id, judge_id)
      VALUES (
        new.id, 
        'JUDGE', 
        (SELECT name FROM public.judges WHERE email = new.email LIMIT 1), 
        v_fed_id,
        v_judge_id
      );
      
      UPDATE public.judges 
      SET status = 'ACTIVE' 
      WHERE email = new.email;
    END;
  END IF;
  RETURN new;
END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recria o trigger (não dói ser idempotente)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_judge_user();