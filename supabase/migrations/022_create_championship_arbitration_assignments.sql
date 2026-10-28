-- =============================================
-- TABELA
-- =============================================

CREATE TABLE public.championship_arbitration_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id uuid NOT NULL REFERENCES public.championships(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('DIRECTOR', 'SECRETARY', 'A', 'E', 'DA', 'DB')),
  slot_position int,
  status text NOT NULL DEFAULT 'INVITED' CHECK (status IN ('INVITED', 'CONFIRMED', 'DECLINED')),
  invited_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_slot_range CHECK (
    (role IN ('DIRECTOR', 'SECRETARY') AND slot_position IS NULL)
    OR
    (role NOT IN ('DIRECTOR', 'SECRETARY') AND slot_position BETWEEN 1 AND 4)
  )
);


-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_arb_assignments_championship
  ON public.championship_arbitration_assignments(championship_id);

CREATE INDEX idx_arb_assignments_judge
  ON public.championship_arbitration_assignments(judge_id);


-- =============================================
-- TRIGGER updated_at
-- =============================================

CREATE TRIGGER trg_arb_assignments_updated_at
  BEFORE UPDATE ON public.championship_arbitration_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- =============================================
-- RLS
-- =============================================

ALTER TABLE public.championship_arbitration_assignments ENABLE ROW LEVEL SECURITY;

-- FEDERATION_ADMIN: CRUD nos seus campeonatos
CREATE POLICY "fed_admin_arb_assignments_all"
ON public.championship_arbitration_assignments FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (
    SELECT federation_id FROM public.championships
    WHERE id = championship_id
  ) = public.get_my_federation_id()
)
WITH CHECK (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (
    SELECT federation_id FROM public.championships
    WHERE id = championship_id
  ) = public.get_my_federation_id()
);

-- JUDGE: Leitura das próprias atribuições
CREATE POLICY "judge_arb_assignments_read"
ON public.championship_arbitration_assignments FOR SELECT
TO authenticated
USING (
  public.get_current_user_role() = 'JUDGE'
  AND judge_id = (SELECT judge_id FROM public.profiles WHERE id = auth.uid())
);

-- SYSADMIN: Leitura global
CREATE POLICY "sysadmin_arb_assignments_read"
ON public.championship_arbitration_assignments FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'SYSADMIN');

-- Demais autenticados: leitura da federação
CREATE POLICY "auth_arb_assignments_read"
ON public.championship_arbitration_assignments FOR SELECT
TO authenticated
USING (
  (SELECT federation_id FROM public.championships
   WHERE id = championship_id
  ) = public.get_my_federation_id()
);