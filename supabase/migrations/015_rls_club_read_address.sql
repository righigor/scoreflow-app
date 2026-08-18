-- ==========================================================
-- CORREÇÃO CRÍTICA: Permite que o Clube LEIA seu próprio endereço
-- Sem isso, o JOIN do Supabase retorna null por conta do RLS
-- ==========================================================

CREATE POLICY "Club can read own address" ON public.addresses FOR SELECT
    USING (
        id IN (
            SELECT address_id 
            FROM public.clubs 
            WHERE id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())
        )
    );