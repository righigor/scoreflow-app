-- =============================================
-- 1. FUNÇÕES AUXILIARES
-- =============================================

CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$   SELECT regexp_replace(
    regexp_replace(
      lower(
        translate(
          input_text,
          'ÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåèéêëìíîïòóôõöùúûüýÇçÑñ',
          'AAAAAAEEEEIIIIOOOOOUUUUYaaaaaaeeeeiiiiooooouuuuyCcNn'
        )
      ),
      '[^a-z0-9]+',
      '-',
      'g'
    ),
    '(^-|-$)',
    '',
    'g'
  );
 $$;

CREATE OR REPLACE FUNCTION public.get_my_federation_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$   SELECT COALESCE(
    p.federation_id,
    (SELECT federation_id FROM public.clubs WHERE id = p.club_id),
    (SELECT federation_id FROM public.judges WHERE id = p.judge_id)
  )
  FROM public.profiles p
  WHERE p.id = auth.uid();
 $$;

CREATE OR REPLACE FUNCTION public.handle_championship_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$ BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
 $$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$ BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
 $$;


-- =============================================
-- 2. TABELAS
-- =============================================

CREATE TABLE public.championships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  federation_id uuid NOT NULL REFERENCES public.federations(id) ON DELETE CASCADE,
  modality_id uuid NOT NULL REFERENCES public.modalities(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL,
  location text,
  start_date date,
  end_date date,
  inscription_start_date date,
  inscription_end_date date,
  description text,
  regulation_pdf_url text,
  fee_per_athlete numeric(10,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'OPEN', 'IN_PROGRESS', 'FINISHED')),
  inscription_token text NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.championship_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id uuid NOT NULL REFERENCES public.championships(id) ON DELETE CASCADE,
  base_category_id uuid NOT NULL REFERENCES public.base_categories(id) ON DELETE RESTRICT,
  custom_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(championship_id, base_category_id)
);

CREATE TABLE public.championship_category_apparatus (
  championship_category_id uuid NOT NULL
    REFERENCES public.championship_categories(id) ON DELETE CASCADE,
  apparatus_id uuid NOT NULL
    REFERENCES public.apparatus(id) ON DELETE RESTRICT,
  PRIMARY KEY (championship_category_id, apparatus_id)
);


-- =============================================
-- 3. ÍNDICES
-- =============================================

CREATE INDEX idx_championships_fed_status
  ON public.championships(federation_id, status);
CREATE UNIQUE INDEX idx_championships_slug
  ON public.championships(slug);
CREATE UNIQUE INDEX idx_championships_token
  ON public.championships(inscription_token);
CREATE INDEX idx_champ_categories_champ
  ON public.championship_categories(championship_id);
CREATE INDEX idx_champ_cat_apparatus_cat
  ON public.championship_category_apparatus(championship_category_id);


-- =============================================
-- 4. TRIGGERS
-- =============================================

CREATE TRIGGER trg_championship_slug
  BEFORE INSERT OR UPDATE OF name ON public.championships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_championship_slug();

CREATE TRIGGER trg_championships_updated_at
  BEFORE UPDATE ON public.championships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- =============================================
-- 5. RLS — HABILITAR
-- =============================================

ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.championship_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.championship_category_apparatus ENABLE ROW LEVEL SECURITY;


-- =============================================
-- 6. RLS — championships
-- =============================================

CREATE POLICY "fed_admin_championships_all"
ON public.championships FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND federation_id = public.get_my_federation_id()
)
WITH CHECK (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND federation_id = public.get_my_federation_id()
);

CREATE POLICY "sysadmin_championships_read"
ON public.championships FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'SYSADMIN');

CREATE POLICY "auth_championships_read"
ON public.championships FOR SELECT
TO authenticated
USING (federation_id = public.get_my_federation_id());

CREATE POLICY "anon_championships_read"
ON public.championships FOR SELECT
TO anon
USING (status IN ('OPEN', 'IN_PROGRESS', 'FINISHED'));


-- =============================================
-- 7. RLS — championship_categories
-- =============================================

CREATE POLICY "fed_admin_champ_categories_all"
ON public.championship_categories FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (SELECT federation_id FROM public.championships WHERE id = championship_id)
      = public.get_my_federation_id()
)
WITH CHECK (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (SELECT federation_id FROM public.championships WHERE id = championship_id)
      = public.get_my_federation_id()
);

CREATE POLICY "sysadmin_champ_categories_read"
ON public.championship_categories FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'SYSADMIN');

CREATE POLICY "auth_champ_categories_read"
ON public.championship_categories FOR SELECT
TO authenticated
USING (
  (SELECT federation_id FROM public.championships WHERE id = championship_id)
  = public.get_my_federation_id()
);

CREATE POLICY "anon_champ_categories_read"
ON public.championship_categories FOR SELECT
TO anon
USING (
  (SELECT status FROM public.championships WHERE id = championship_id)
  IN ('OPEN', 'IN_PROGRESS', 'FINISHED')
);


-- =============================================
-- 8. RLS — championship_category_apparatus
-- =============================================

CREATE POLICY "fed_admin_champ_cat_apparatus_all"
ON public.championship_category_apparatus FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (
    SELECT c.federation_id
    FROM public.championship_categories cc
    JOIN public.championships c ON c.id = cc.championship_id
    WHERE cc.id = championship_category_id
  ) = public.get_my_federation_id()
)
WITH CHECK (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND (
    SELECT c.federation_id
    FROM public.championship_categories cc
    JOIN public.championships c ON c.id = cc.championship_id
    WHERE cc.id = championship_category_id
  ) = public.get_my_federation_id()
);

CREATE POLICY "sysadmin_champ_cat_apparatus_read"
ON public.championship_category_apparatus FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'SYSADMIN');

CREATE POLICY "auth_champ_cat_apparatus_read"
ON public.championship_category_apparatus FOR SELECT
TO authenticated
USING (
  (
    SELECT c.federation_id
    FROM public.championship_categories cc
    JOIN public.championships c ON c.id = cc.championship_id
    WHERE cc.id = championship_category_id
  ) = public.get_my_federation_id()
);

CREATE POLICY "anon_champ_cat_apparatus_read"
ON public.championship_category_apparatus FOR SELECT
TO anon
USING (
  (
    SELECT c.status
    FROM public.championship_categories cc
    JOIN public.championships c ON c.id = cc.championship_id
    WHERE cc.id = championship_category_id
  ) IN ('OPEN', 'IN_PROGRESS', 'FINISHED')
);


-- =============================================
-- 9. STORAGE — championships/ no bucket documents
-- =============================================

CREATE POLICY "fed_admin_championships_docs_crud"
ON storage.objects FOR ALL
TO authenticated
USING (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'championships'
  AND (
    SELECT federation_id FROM public.championships
    WHERE id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_my_federation_id()
)
WITH CHECK (
  public.get_current_user_role() = 'FEDERATION_ADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'championships'
  AND (
    SELECT federation_id FROM public.championships
    WHERE id = SPLIT_PART(storage.objects.name, '/', 2)::uuid
  ) = public.get_my_federation_id()
);

CREATE POLICY "sysadmin_championships_docs_read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  public.get_current_user_role() = 'SYSADMIN'
  AND bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'championships'
);

CREATE POLICY "anon_championships_docs_read"
ON storage.objects FOR SELECT
TO anon
USING (
  bucket_id = 'documents'
  AND SPLIT_PART(storage.objects.name, '/', 1) = 'championships'
);