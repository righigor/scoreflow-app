-- =============================================
-- 1. FUNÇÕES AUXILIARES (schema public)
-- =============================================

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$   SELECT role FROM public.profiles WHERE id = auth.uid();
 $$;

CREATE OR REPLACE FUNCTION public.get_current_user_club_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$   SELECT club_id FROM public.profiles WHERE id = auth.uid();
 $$;

CREATE OR REPLACE FUNCTION public.get_current_user_federation_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$   SELECT federation_id FROM public.profiles WHERE id = auth.uid();
 $$;


-- =============================================
-- 2. CRIAR O BUCKET (privado)
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;


-- =============================================
-- 3. POLÍTICAS
-- =============================================

-- 3a. CLUB_ADMIN → CRUD completo
CREATE POLICY "club_admin_documents_crud"
ON storage.objects
FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'CLUB_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'athletes'
  AND (
    SELECT club_id
    FROM public.athletes
    WHERE id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_current_user_club_id()
)
WITH CHECK (
  public.get_current_user_role() = 'CLUB_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'athletes'
  AND (
    SELECT club_id
    FROM public.athletes
    WHERE id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_current_user_club_id()
);


-- 3b. FEDERATION_ADMIN → Apenas leitura
CREATE POLICY "federation_admin_documents_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'athletes'
  AND (
    SELECT c.federation_id
    FROM public.athletes a
    JOIN public.clubs c ON c.id = a.club_id
    WHERE a.id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_current_user_federation_id()
);


-- 3c. SYSADMIN → Leitura global
CREATE POLICY "sysadmin_documents_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  public.get_current_user_role() = 'SYSADMIN'
  AND bucket_id = 'documents'
);