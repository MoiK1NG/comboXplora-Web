-- =============================================================
-- ComboXplora — Supabase Schema v2
-- Ejecuta este script completo en el SQL Editor de Supabase.
-- Incluye: tablas, relaciones, RLS, Storage, triggers.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. TABLAS EXISTENTES: agregar campos faltantes + ajustes
-- ─────────────────────────────────────────────────────────────

-- Asegurar que la columna updated_at exista en tablas existentes
ALTER TABLE experiencias ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE hacedores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE mapa_cultural ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ─────────────────────────────────────────────────────────────
-- 2. NUEVAS TABLAS
-- ─────────────────────────────────────────────────────────────

-- 2a. RELATOS (historias escritas, de audio o video)
CREATE TABLE IF NOT EXISTS relatos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  author      TEXT,
  narrator    TEXT,
  categories  TEXT[] DEFAULT '{}',
  neighborhood TEXT,
  coordinates JSONB DEFAULT '{"lat": 10.9878, "lng": -74.7889}',
  cover_image TEXT,
  gallery     TEXT[] DEFAULT '{}',
  audio_url   TEXT,
  video_url   TEXT,
  type        TEXT CHECK (type IN ('escrito', 'audio', 'video')) DEFAULT 'escrito',
  tags        TEXT[] DEFAULT '{}',
  linked_hacedor_id TEXT REFERENCES hacedores(id) ON DELETE SET NULL,
  show_on_map BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2b. EMPRESAS INTERESADAS
CREATE TABLE IF NOT EXISTS empresas_interesadas (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name  TEXT NOT NULL,
  contact_name  TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  website       TEXT,
  interest_type TEXT CHECK (interest_type IN ('sponsorship', 'partnership', 'booking_group', 'csr', 'other')),
  message       TEXT,
  num_people    INTEGER,
  preferred_date TEXT,
  budget_range  TEXT,
  status        TEXT CHECK (status IN ('nuevo', 'revisado', 'contactado', 'cerrado', 'descartado')) DEFAULT 'nuevo',
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2c. FORMULARIOS DE CONTACTO
CREATE TABLE IF NOT EXISTS formularios_contacto (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  source      TEXT DEFAULT 'website',
  status      TEXT CHECK (status IN ('nuevo', 'leido', 'respondido')) DEFAULT 'nuevo',
  admin_notes TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2d. POSTULACIONES DE HACEDORES
CREATE TABLE IF NOT EXISTS postulaciones (
  id                     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                   TEXT NOT NULL,
  email                  TEXT NOT NULL,
  phone                  TEXT,
  neighborhood           TEXT,
  experience_type        TEXT CHECK (experience_type IN ('gastronomia', 'musica', 'artesanias', 'storytelling', 'danza', 'otro')),
  experience_title       TEXT,
  experience_description TEXT,
  why_join               TEXT,
  social_links           TEXT,
  status                 TEXT CHECK (status IN ('nueva', 'revisada', 'aprobada', 'rechazada')) DEFAULT 'nueva',
  admin_notes            TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 3. TRIGGERS (updated_at automático)
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_experiencias_updated_at') THEN
    CREATE TRIGGER trg_experiencias_updated_at
      BEFORE UPDATE ON experiencias FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_hacedores_updated_at') THEN
    CREATE TRIGGER trg_hacedores_updated_at
      BEFORE UPDATE ON hacedores FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_relatos_updated_at') THEN
    CREATE TRIGGER trg_relatos_updated_at
      BEFORE UPDATE ON relatos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────

ALTER TABLE experiencias          ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacedores             ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapa_cultural         ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas_interesadas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE formularios_contacto  ENABLE ROW LEVEL SECURITY;
ALTER TABLE postulaciones         ENABLE ROW LEVEL SECURITY;

-- DROP existing policies before recreating
DROP POLICY IF EXISTS "Public select experiencias"        ON experiencias;
DROP POLICY IF EXISTS "Admin all experiencias"            ON experiencias;
DROP POLICY IF EXISTS "Public select hacedores"           ON hacedores;
DROP POLICY IF EXISTS "Admin all hacedores"               ON hacedores;
DROP POLICY IF EXISTS "Public select mapa_cultural"       ON mapa_cultural;
DROP POLICY IF EXISTS "Admin all mapa_cultural"           ON mapa_cultural;
DROP POLICY IF EXISTS "Public select relatos"             ON relatos;
DROP POLICY IF EXISTS "Admin all relatos"                 ON relatos;
DROP POLICY IF EXISTS "Admin all empresas"                ON empresas_interesadas;
DROP POLICY IF EXISTS "Public insert empresas"            ON empresas_interesadas;
DROP POLICY IF EXISTS "Admin all contacto"                ON formularios_contacto;
DROP POLICY IF EXISTS "Public insert contacto"            ON formularios_contacto;
DROP POLICY IF EXISTS "Admin all postulaciones"           ON postulaciones;
DROP POLICY IF EXISTS "Public insert postulaciones"       ON postulaciones;

-- EXPERIENCIAS: lectura pública de activas, escritura solo autenticados
CREATE POLICY "Public select experiencias"
  ON experiencias FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all experiencias"
  ON experiencias FOR ALL USING (auth.role() = 'authenticated');

-- HACEDORES: lectura pública de activos, escritura solo autenticados
CREATE POLICY "Public select hacedores"
  ON hacedores FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all hacedores"
  ON hacedores FOR ALL USING (auth.role() = 'authenticated');

-- MAPA CULTURAL: lectura pública de activos, escritura solo autenticados
CREATE POLICY "Public select mapa_cultural"
  ON mapa_cultural FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all mapa_cultural"
  ON mapa_cultural FOR ALL USING (auth.role() = 'authenticated');

-- RELATOS: lectura pública de activos, escritura solo autenticados
CREATE POLICY "Public select relatos"
  ON relatos FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all relatos"
  ON relatos FOR ALL USING (auth.role() = 'authenticated');

-- EMPRESAS: inserción pública, lectura/edición solo autenticados
CREATE POLICY "Public insert empresas"
  ON empresas_interesadas FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all empresas"
  ON empresas_interesadas FOR ALL USING (auth.role() = 'authenticated');

-- CONTACTO: inserción pública, lectura/edición solo autenticados
CREATE POLICY "Public insert contacto"
  ON formularios_contacto FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all contacto"
  ON formularios_contacto FOR ALL USING (auth.role() = 'authenticated');

-- POSTULACIONES: inserción pública, lectura/edición solo autenticados
CREATE POLICY "Public insert postulaciones"
  ON postulaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all postulaciones"
  ON postulaciones FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- 5. STORAGE BUCKET (ejecutar por separado si da error)
-- ─────────────────────────────────────────────────────────────

-- Crear bucket público para media
INSERT INTO storage.buckets (id, name, public)
VALUES ('comboxplora-media', 'comboxplora-media', true)
ON CONFLICT (id) DO NOTHING;

-- Política: cualquiera puede leer archivos
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'comboxplora-media');

-- Política: solo autenticados pueden subir/editar/borrar
DROP POLICY IF EXISTS "Authenticated upload media" ON storage.objects;
CREATE POLICY "Authenticated upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'comboxplora-media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update media" ON storage.objects;
CREATE POLICY "Authenticated update media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'comboxplora-media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete media" ON storage.objects;
CREATE POLICY "Authenticated delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'comboxplora-media' AND auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- 6. ÍNDICES para rendimiento
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_experiencias_slug       ON experiencias(slug);
CREATE INDEX IF NOT EXISTS idx_experiencias_active     ON experiencias(is_active);
CREATE INDEX IF NOT EXISTS idx_hacedores_slug          ON hacedores(slug);
CREATE INDEX IF NOT EXISTS idx_hacedores_active        ON hacedores(is_active);
CREATE INDEX IF NOT EXISTS idx_mapa_cultural_active    ON mapa_cultural(is_active);
CREATE INDEX IF NOT EXISTS idx_relatos_slug            ON relatos(slug);
CREATE INDEX IF NOT EXISTS idx_relatos_active          ON relatos(is_active);
CREATE INDEX IF NOT EXISTS idx_empresas_status         ON empresas_interesadas(status);
CREATE INDEX IF NOT EXISTS idx_contacto_status         ON formularios_contacto(status);
CREATE INDEX IF NOT EXISTS idx_postulaciones_status    ON postulaciones(status);

-- ─────────────────────────────────────────────────────────────
-- 7. SEED DE RELATOS DE EJEMPLO
-- ─────────────────────────────────────────────────────────────

INSERT INTO relatos (title, slug, excerpt, content, author, type, categories, neighborhood, cover_image, is_featured, is_active)
VALUES (
  'La historia del Picó en Barranquilla',
  'historia-pico-barranquilla',
  'El picó es más que un aparato de sonido: es la voz del barrio, la memoria colectiva de Barranquilla.',
  'En los callejones del sur de Barranquilla, donde el asfalto cede a la tierra, el picó manda. Desde los años 60, estas imponentes torres de sonido han sido testigos de bodas, velorios y fiestas de quince. Son los guardianes sonoros de la identidad costeña.',
  'Equipo ComboXplora',
  'escrito',
  ARRAY['Música', 'Cultura'],
  'Barrio Abajo',
  '/images/authentic/exp_picotera_new.jpg',
  true,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO relatos (title, slug, excerpt, content, author, type, categories, neighborhood, cover_image, is_active)
VALUES (
  'Las Matronas del Carnaval',
  'matronas-carnaval',
  'Guardianas de la danza, la memoria y la tradición. Las matronas son el corazón del Carnaval de Barranquilla.',
  'Cada año, cuando el Carnaval llega, ellas ya están preparadas. Las matronas llevan décadas salvaguardando bailes que sus abuelas les enseñaron. Sus manos tejen disfraces, sus voces cantan letanías, sus pies recuerdan cada paso.',
  'María Fernanda Solano',
  'escrito',
  ARRAY['Tradición', 'Comunidad'],
  'Centro Histórico',
  '/images/authentic/exp_matronas_new.jpg',
  true
) ON CONFLICT (slug) DO NOTHING;
