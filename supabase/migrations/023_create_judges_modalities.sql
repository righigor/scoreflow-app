-- =============================================
-- Tabela: judge_modalities (N:N)
-- =============================================

CREATE TABLE public.judge_modalities (
  judge_id uuid NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  modality_id uuid NOT NULL REFERENCES public.modalities(id) ON DELETE CASCADE,
  PRIMARY KEY (judge_id, modality_id)
);

-- =============================================
-- RLS
-- =============================================

ALTER TABLE public.judge_modalities ENABLE ROW LEVEL SECURITY;

-- SYSADMIN: CRUD global
CREATE POLICY "sysadmin_judge_modalities_all"
ON public.judge_modalities FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'SYSADMIN')
WITH CHECK (public.get_current_user_role() = 'SYSADMIN');

-- FEDERATION_ADMIN: CRUD nos juízes da sua federação
CREATE POLICY "fed_admin_judge_modalities_all"
ON public.judge_modalities FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (SELECT federation_id FROM public.judges WHERE id = judge_id)
    = public.get_my_federation_id()
)
WITH CHECK (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (SELECT federation_id FROM public.judges WHERE id = judge_id)
    = public.get_my_federation_id()
);

-- JUDGE: Leitura/Escrita nas próprias modalidades
CREATE POLICY "judge_judge_modalities_crud"
ON public.judge_modalities FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'JUDGE'
  AND judge_id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid())
)
WITH CHECK (
  public.get_current_user_role() = 'JUDGE'
  AND judge_id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid())
);

-- Demais (CLUB_ADMIN etc): Leitura apenas
CREATE POLICY "auth_judge_modalities_read"
ON public.judge_modalities FOR SELECT
TO authenticated
USING (
  (SELECT federation_id FROM public.judges WHERE id = judge_id)
  = public.get_my_federation_id()
);