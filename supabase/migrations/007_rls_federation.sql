CREATE POLICY "Federation can update own federation" ON public.federations FOR
UPDATE USING (
    id = (
        SELECT federation_id
        FROM public.profiles
        WHERE
            id = auth.uid ()
    )
);

CREATE POLICY "Federation can insert own federation" ON public.federations FOR
INSERT
WITH
    CHECK (
        id = (
            SELECT federation_id
            FROM public.profiles
            WHERE
                id = auth.uid ()
        )
    );

CREATE POLICY "Federation can upload to own folder" ON storage.objects FOR
INSERT
WITH
    CHECK (
        bucket_id = 'images'
        AND (
            SELECT role
            FROM public.profiles
            WHERE
                id = auth.uid ()
        ) = 'FEDERATION_ADMIN'
    );

CREATE POLICY "Federation can update own files" ON storage.objects FOR
UPDATE
WITH
    CHECK (
        bucket_id = 'images'
        AND (
            SELECT role
            FROM public.profiles
            WHERE
                id = auth.uid ()
        ) = 'FEDERATION_ADMIN'
    );

-- Permite que a federação crie um endereço novo
CREATE POLICY "Federation can insert own address" ON public.addresses FOR INSERT
    WITH CHECK (true);