-- ==========================================================
-- CORREÇÃO RLS: DÁ PODER DE LEITURA GLOBAL AO SYSADMIN
-- ==========================================================

-- 1. Clubes (SYSADMIN pode ver todos)
CREATE POLICY "SYSADMIN can see all clubs" ON public.clubs FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');

-- 2. Atletas (SYSADMIN pode ver todos)
CREATE POLICY "SYSADMIN can see all athletes" ON public.athletes FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');

-- 3. Staff (SYSADMIN pode ver todos)
CREATE POLICY "SYSADMIN can see all staff" ON public.staff FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');

-- 4. Convites (SYSADMIN pode ver todos)
CREATE POLICY "SYSADMIN can see all invites" ON public.federation_invites FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');

-- 5. Histórico de Movimentações (SYSADMIN pode ver todos)
CREATE POLICY "SYSADMIN can see all movements" ON public.movement_history FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');