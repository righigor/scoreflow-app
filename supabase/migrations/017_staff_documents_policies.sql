CREATE POLICY "club_admin_staff_documents_crud"
ON storage.objects
FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'CLUB_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'staff'
  AND (
    SELECT club_id
    FROM public.staff
    WHERE id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_current_user_club_id()
)
WITH CHECK (
  public.get_current_user_role() = 'CLUB_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'staff'
  AND (
    SELECT club_id
    FROM public.staff
    WHERE id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_current_user_club_id()
);

CREATE POLICY "federation_admin_staff_documents_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'staff'
  AND (
    SELECT c.federation_id
    FROM public.staff s
    JOIN public.clubs c ON c.id = s.club_id
    WHERE s.id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_current_user_federation_id()
);

CREATE POLICY "sysadmin_staff_documents_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  public.get_current_user_role() = 'SYSADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'staff'
);