-- ==========================================================
-- CORREÇÃO: Permite que CLUB_ADMIN faça upload de imagens
-- ==========================================================

CREATE POLICY "Club can upload images" ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'images' 
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'CLUB_ADMIN'
    );

CREATE POLICY "Club can update images" ON storage.objects FOR UPDATE 
    WITH CHECK (
        bucket_id = 'images' 
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'CLUB_ADMIN'
    );