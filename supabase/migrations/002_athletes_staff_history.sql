-- ==========================================================
-- SPRINT 3 & 4: O MUNDO DOS CLUBES (ATLETAS, STAFF E HISTÓRICO)
-- Data de criação: 29/07/2026
-- Descrição: Tabelas de Atletas, Staff, Funções, Modalidades e Histórico.
-- Arquitetura: Idempotent (Pode ser rodado N vezes)
-- ==========================================================

-- ---------------------------------------------------------
-- 0. FUNÇÃO AUXILIAR PARA UPDATED_AT
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
 $$ LANGUAGE plpgsql;

-- ---------------------------------------------------------
-- 1. TABELAS GLOBAIS / MASTER DATA
-- ---------------------------------------------------------
-- 1.1. Funções de Staff (Cargos da Comissão Técnica)
CREATE TABLE IF NOT EXISTS public.staff_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 2. TABELAS MULTI-TENANT (DADOS DOS CLUBES)
-- ---------------------------------------------------------
-- 2.1. Atletas
CREATE TABLE IF NOT EXISTS public.athletes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
    name text NOT NULL,
    cpf text UNIQUE,
    phone text,
    birthdate date,
    gender text CHECK (gender IN ('F', 'M', 'OTHER')) NOT NULL,
    profile_picture_url text,
    status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INJURED', 'INACTIVE', 'RETIRED', 'FREE_AGENT')),
    instagram_url text,
    identity_pdf_url text,
    residence_proof_pdf_url text,
    image_right_term_pdf_url text,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_updated_at ON public.athletes;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.athletes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.2. Staff (Comissão Técnica)
CREATE TABLE IF NOT EXISTS public.staff (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
    staff_role_id uuid REFERENCES public.staff_roles(id) ON DELETE SET NULL NOT NULL,
    previous_athlete_id uuid REFERENCES public.athletes(id) ON DELETE SET NULL,
    name text NOT NULL,
    cpf text UNIQUE,
    phone text,
    gender text CHECK (gender IN ('F', 'M', 'OTHER')) NOT NULL,
    profile_picture_url text,
    status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'RETIRED', 'FREE_AGENT')),
    instagram_url text,
    identity_pdf_url text,
    residence_proof_pdf_url text,
    image_right_term_pdf_url text,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_updated_at ON public.staff;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.staff
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------
-- 3. TABELAS N pra N (MODALIDADES)
-- ---------------------------------------------------------
-- 3.1. Modalidades dos Atletas
CREATE TABLE IF NOT EXISTS public.athlete_modalities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id uuid REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
    modality_id uuid REFERENCES public.modalities(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(athlete_id, modality_id)
);
ALTER TABLE public.athlete_modalities ENABLE ROW LEVEL SECURITY;

-- 3.2. Modalidades do Staff
CREATE TABLE IF NOT EXISTS public.staff_modalities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id uuid REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    modality_id uuid REFERENCES public.modalities(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(staff_id, modality_id)
);
ALTER TABLE public.staff_modalities ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 4. TABELA DE HISTÓRICO DE MOVIMENTAÇÕES (UNIFICADA)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.movement_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    target_id uuid NOT NULL,
    target_type text NOT NULL CHECK (target_type IN ('ATHLETE', 'STAFF')),
    movement_type text NOT NULL CHECK (movement_type IN ('JOIN', 'LEAVE', 'TRANSFER', 'CHANGE_MODALITY', 'BECAME_STAFF')),
    club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL,
    previous_club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL,
    modality_id uuid REFERENCES public.modalities(id) ON DELETE SET NULL,
    previous_modality_id uuid REFERENCES public.modalities(id) ON DELETE SET NULL,
    movement_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.movement_history ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 5. TRIGGER DE AUTOMAÇÃO DO HISTÓRICO
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_movement_history()
RETURNS trigger AS $$ DECLARE
    v_target_type text;
BEGIN
    IF TG_TABLE_NAME = 'athletes' THEN
        v_target_type := 'ATHLETE';
    ELSIF TG_TABLE_NAME = 'staff' THEN
        v_target_type := 'STAFF';
    END IF;

    IF TG_OP = 'INSERT' THEN
        IF NEW.club_id IS NOT NULL THEN
            INSERT INTO public.movement_history (target_id, target_type, movement_type, club_id, movement_date)
            VALUES (NEW.id, v_target_type, 'JOIN', NEW.club_id, NEW.created_at);
        END IF;
    
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.club_id IS NOT NULL AND NEW.club_id IS NULL THEN
            INSERT INTO public.movement_history (target_id, target_type, movement_type, previous_club_id, movement_date)
            VALUES (NEW.id, v_target_type, 'LEAVE', OLD.club_id, NEW.updated_at);
        
        ELSIF OLD.club_id IS NOT NULL AND NEW.club_id IS NOT NULL AND OLD.club_id IS DISTINCT FROM NEW.club_id THEN
            INSERT INTO public.movement_history (target_id, target_type, movement_type, club_id, previous_club_id, movement_date)
            VALUES (NEW.id, v_target_type, 'TRANSFER', NEW.club_id, OLD.club_id, NEW.updated_at);
        END IF;
    END IF;

    RETURN NEW;
END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_movement_change ON public.athletes;
CREATE TRIGGER on_movement_change
    AFTER INSERT OR UPDATE ON public.athletes
    FOR EACH ROW EXECUTE FUNCTION public.handle_movement_history();

DROP TRIGGER IF EXISTS on_movement_change ON public.staff;
CREATE TRIGGER on_movement_change
    AFTER INSERT OR UPDATE ON public.staff
    FOR EACH ROW EXECUTE FUNCTION public.handle_movement_history();


-- ---------------------------------------------------------
-- 6. POLÍTICAS DE SEGURANÇA (RLS)
-- ---------------------------------------------------------
-- 6.1. Staff Roles
CREATE POLICY "Only SYSADMIN can see staff_roles" ON public.staff_roles FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can insert staff_roles" ON public.staff_roles FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Only SYSADMIN can update staff_roles" ON public.staff_roles FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SYSADMIN');
CREATE POLICY "Anyone can read staff_roles" ON public.staff_roles FOR SELECT USING (true);

-- 6.2. Atletas
CREATE POLICY "Federation can see own athletes" ON public.athletes FOR SELECT
    USING (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Federation can insert own athletes" ON public.athletes FOR INSERT
    WITH CHECK (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Federation can update own athletes" ON public.athletes FOR UPDATE
    USING (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "Club can read own athletes" ON public.athletes FOR SELECT
    USING (club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Club can insert own athletes" ON public.athletes FOR INSERT
    WITH CHECK (club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Club can update own athletes" ON public.athletes FOR UPDATE
    USING (club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));

-- 6.3. Staff
CREATE POLICY "Federation can see own staff" ON public.staff FOR SELECT
    USING (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Federation can insert own staff" ON public.staff FOR INSERT
    WITH CHECK (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Federation can update own staff" ON public.staff FOR UPDATE
    USING (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "Club can read own staff" ON public.staff FOR SELECT
    USING (club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Club can insert own staff" ON public.staff FOR INSERT
    WITH CHECK (club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Club can update own staff" ON public.staff FOR UPDATE
    USING (club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));

-- 6.4. Modalidades
CREATE POLICY "Club can manage own athlete_modalities" ON public.athlete_modalities FOR ALL
    USING (athlete_id IN (SELECT id FROM public.athletes WHERE club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Club can manage own staff_modalities" ON public.staff_modalities FOR ALL
    USING (staff_id IN (SELECT id FROM public.staff WHERE club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid())));

-- 6.5. Histórico
CREATE POLICY "Federation can see own movements" ON public.movement_history FOR SELECT
    USING (club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())) 
        OR previous_club_id IN (SELECT id FROM public.clubs WHERE federation_id = (SELECT federation_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Club can see own movements" ON public.movement_history FOR SELECT
    USING (club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()) 
        OR previous_club_id = (SELECT club_id FROM public.profiles WHERE id = auth.uid()));


-- ---------------------------------------------------------
-- 7. DADOS INICIAIS (SEEDS IDEMPOTENTES)
-- ---------------------------------------------------------
INSERT INTO public.staff_roles (name, slug) VALUES
    ('Treinador Principal', 'treinador-principal'),
    ('Auxiliar Técnico', 'auxiliar-tecnico'),
    ('Preparador Físico', 'preparador-fisico'),
    ('Coreógrafo', 'coreografo'),
    ('Fisioterapeuta', 'fisioterapeuta'),
    ('Psicólogo', 'psicologo'),
    ('Nutricionista', 'nutricionista'),
    ('Médico', 'medico'),
    ('Assistente de Treino', 'assistente-treino')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------
-- 8. RPC: TRANSFORMAR ATLETA EM STAFF
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.convert_athlete_to_staff(
    p_athlete_id uuid,
    p_staff_role_id uuid,
    p_modalities jsonb -- Array de UUIDs das modalidades que ele vai atuar como staff
) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER AS $$ DECLARE
    v_athlete record;
    v_new_staff_id uuid;
    v_club_id uuid;
BEGIN
    -- 1. Buscar dados do atleta e verificar se existe
    SELECT * INTO v_athlete FROM public.athletes WHERE id = p_athlete_id;
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Atleta não encontrado')::json;
    END IF;
    
    -- 2. Segurança: Garante que o clube logado é dono desse atleta
    IF v_athlete.club_id IS NULL OR v_athlete.club_id != (SELECT club_id FROM public.profiles WHERE id = auth.uid()) THEN
        RETURN json_build_object('error', 'Ação não autorizada')::json;
    END IF;

    v_club_id := v_athlete.club_id;

    -- 3. Criar o registro de Staff copiando dados básicos para não ter que redigitar
    INSERT INTO public.staff (
        club_id, 
        staff_role_id, 
        previous_athlete_id, 
        name, 
        cpf, 
        phone, 
        gender, 
        profile_picture_url, 
        instagram_url
    ) 
    VALUES (
        v_club_id, 
        p_staff_role_id, 
        p_athlete_id, 
        v_athlete.name, 
        v_athlete.cpf, 
        v_athlete.phone, 
        v_athlete.gender, 
        v_athlete.profile_picture_url, 
        v_athlete.instagram_url
    )
    RETURNING id INTO v_new_staff_id;

    -- NOTA: A Trigger que criamos antes VAI DISPARAR AQUI AUTOMATICAMENTE 
    -- e criar o registro de 'JOIN' no movement_history para esse novo Staff.

    -- 4. Aposentar o atleta e remover do clube (Free Agent / Retired)
    UPDATE public.athletes 
    SET status = 'RETIRED', 
        club_id = NULL 
    WHERE id = p_athlete_id;

    -- NOTA: A Trigger VAI DISPARAR AQUI AUTOMATICAMENTE 
    -- e criar o registro de 'LEAVE' no movement_history para esse Atleta.

    -- 5. Vincular as modalidades ao novo Staff (N pra N)
    IF p_modalities IS NOT NULL THEN
        INSERT INTO public.staff_modalities (staff_id, modality_id)
        SELECT v_new_staff_id, mod_id::uuid
        FROM unnest(ARRAY(SELECT jsonb_array_elements_text(p_modalities))) AS mod_id;
    END IF;

    -- 6. Retornar sucesso e o ID do novo membro do staff
    RETURN json_build_object('success', true, 'staff_id', v_new_staff_id)::json;
END;
 $$;