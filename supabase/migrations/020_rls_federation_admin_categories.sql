-- modalities
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_modalities_read"
ON public.modalities FOR SELECT
TO authenticated
USING (true);

-- apparatus
ALTER TABLE public.apparatus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_apparatus_read"
ON public.apparatus FOR SELECT
TO authenticated
USING (true);

-- base_categories
ALTER TABLE public.base_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_base_categories_read"
ON public.base_categories FOR SELECT
TO authenticated
USING (true);

-- staff_roles (se já não tiver)
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_staff_roles_read"
ON public.staff_roles FOR SELECT
TO authenticated
USING (true);