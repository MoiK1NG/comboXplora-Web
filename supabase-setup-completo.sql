-- ================================================================
-- ComboXplora — Setup Completo (Ejecutar en Supabase SQL Editor)
-- ================================================================
-- Pasos: Supabase Dashboard → SQL Editor → New query → pegar esto → Run

-- ─────────────────────────────────────────────────────────────
-- 1. CREAR TABLAS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS experiencias (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  categories   TEXT[] DEFAULT '{}',
  short_description TEXT,
  full_description  TEXT,
  duration     TEXT,
  neighborhood TEXT,
  location     TEXT,
  meeting_point TEXT,
  coordinates  JSONB NOT NULL DEFAULT '{"lat": 10.9850, "lng": -74.7820}',
  image        TEXT,
  gallery      TEXT[] DEFAULT '{}',
  includes     TEXT[] DEFAULT '{}',
  what_to_expect TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  is_featured  BOOLEAN DEFAULT false,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hacedores (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  category         TEXT,
  profile_image    TEXT,
  cover_image      TEXT,
  short_description TEXT,
  full_story       TEXT,
  gallery          TEXT[] DEFAULT '{}',
  neighborhood     TEXT,
  instagram        TEXT,
  whatsapp         TEXT,
  specialties      TEXT[] DEFAULT '{}',
  experiences      TEXT[] DEFAULT '{}',
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mapa_cultural (
  id                    TEXT PRIMARY KEY,
  title                 TEXT NOT NULL,
  slug                  TEXT,
  type                  TEXT CHECK (type IN ('experience', 'audio')),
  categories            TEXT[] DEFAULT '{}',
  description           TEXT,
  coordinates           JSONB DEFAULT '{"lat": 10.9878, "lng": -74.7889}',
  image                 TEXT,
  neighborhood          TEXT,
  tags                  TEXT[] DEFAULT '{}',
  linked_experience_slug TEXT,
  audio_url             TEXT,
  narrator              TEXT,
  is_active             BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relatos (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  excerpt           TEXT,
  content           TEXT,
  author            TEXT,
  narrator          TEXT,
  categories        TEXT[] DEFAULT '{}',
  neighborhood      TEXT,
  coordinates       JSONB DEFAULT '{"lat": 10.9878, "lng": -74.7889}',
  cover_image       TEXT,
  gallery           TEXT[] DEFAULT '{}',
  audio_url         TEXT,
  video_url         TEXT,
  type              TEXT CHECK (type IN ('escrito', 'audio', 'video')) DEFAULT 'escrito',
  tags              TEXT[] DEFAULT '{}',
  linked_hacedor_id TEXT REFERENCES hacedores(id) ON DELETE SET NULL,
  show_on_map       BOOLEAN DEFAULT false,
  is_featured       BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

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
-- 2. ÍNDICES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_experiencias_slug    ON experiencias(slug);
CREATE INDEX IF NOT EXISTS idx_experiencias_active  ON experiencias(is_active);
CREATE INDEX IF NOT EXISTS idx_hacedores_slug       ON hacedores(slug);
CREATE INDEX IF NOT EXISTS idx_hacedores_active     ON hacedores(is_active);
CREATE INDEX IF NOT EXISTS idx_mapa_active          ON mapa_cultural(is_active);
CREATE INDEX IF NOT EXISTS idx_relatos_slug         ON relatos(slug);
CREATE INDEX IF NOT EXISTS idx_relatos_active       ON relatos(is_active);
CREATE INDEX IF NOT EXISTS idx_empresas_status      ON empresas_interesadas(status);
CREATE INDEX IF NOT EXISTS idx_contacto_status      ON formularios_contacto(status);
CREATE INDEX IF NOT EXISTS idx_postulaciones_status ON postulaciones(status);

-- ─────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE experiencias          ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacedores             ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapa_cultural         ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas_interesadas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE formularios_contacto  ENABLE ROW LEVEL SECURITY;
ALTER TABLE postulaciones         ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar duplicados
DROP POLICY IF EXISTS "Public select experiencias"   ON experiencias;
DROP POLICY IF EXISTS "Admin all experiencias"       ON experiencias;
DROP POLICY IF EXISTS "Public select hacedores"      ON hacedores;
DROP POLICY IF EXISTS "Admin all hacedores"          ON hacedores;
DROP POLICY IF EXISTS "Public select mapa_cultural"  ON mapa_cultural;
DROP POLICY IF EXISTS "Admin all mapa_cultural"      ON mapa_cultural;
DROP POLICY IF EXISTS "Public select relatos"        ON relatos;
DROP POLICY IF EXISTS "Admin all relatos"            ON relatos;
DROP POLICY IF EXISTS "Admin all empresas"           ON empresas_interesadas;
DROP POLICY IF EXISTS "Public insert empresas"       ON empresas_interesadas;
DROP POLICY IF EXISTS "Admin all contacto"           ON formularios_contacto;
DROP POLICY IF EXISTS "Public insert contacto"       ON formularios_contacto;
DROP POLICY IF EXISTS "Admin all postulaciones"      ON postulaciones;
DROP POLICY IF EXISTS "Public insert postulaciones"  ON postulaciones;

-- Lectura pública para registros activos
CREATE POLICY "Public select experiencias"  ON experiencias  FOR SELECT USING (is_active = true);
CREATE POLICY "Public select hacedores"     ON hacedores     FOR SELECT USING (is_active = true);
CREATE POLICY "Public select mapa_cultural" ON mapa_cultural FOR SELECT USING (is_active = true);
CREATE POLICY "Public select relatos"       ON relatos       FOR SELECT USING (is_active = true);

-- Acceso completo para usuarios autenticados (admin)
CREATE POLICY "Admin all experiencias"  ON experiencias          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all hacedores"     ON hacedores             FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all mapa_cultural" ON mapa_cultural         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all relatos"       ON relatos               FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all empresas"      ON empresas_interesadas  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all contacto"      ON formularios_contacto  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all postulaciones" ON postulaciones         FOR ALL USING (auth.role() = 'authenticated');

-- Inserción pública para formularios
CREATE POLICY "Public insert empresas"      ON empresas_interesadas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contacto"      ON formularios_contacto FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert postulaciones" ON postulaciones        FOR INSERT WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 4. STORAGE BUCKET
-- ─────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('comboxplora-media', 'comboxplora-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read media"         ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete media" ON storage.objects;

CREATE POLICY "Public read media"         ON storage.objects FOR SELECT USING (bucket_id = 'comboxplora-media');
CREATE POLICY "Authenticated upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'comboxplora-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated update media" ON storage.objects FOR UPDATE USING (bucket_id = 'comboxplora-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete media" ON storage.objects FOR DELETE USING (bucket_id = 'comboxplora-media' AND auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- 5. SEED — EXPERIENCIAS
-- ─────────────────────────────────────────────────────────────
INSERT INTO experiencias (id, title, slug, categories, short_description, full_description, duration, neighborhood, location, meeting_point, coordinates, image, gallery, includes, what_to_expect, recommendations, is_featured, is_active)
VALUES
('exp-1','Legado de Matronas – Dulces tradicionales','dulces','{"Gastronomía","Comunidad"}','Aprende el arte de los dulces típicos con las matronas de la región.','Sumérgete en el corazón de Barrio Abajo y descubre los secretos custodiados por generaciones de matronas. En esta experiencia sensorial aprenderás la alquimia de transformar frutas locales en joyas dulces.','2 horas','Barrio Abajo','Casa de las Matronas','Plaza de la Aduana (10 min caminando)','{"lat":10.9850,"lng":-74.7820}','/images/authentic/portada_dulces.jpg','{}','{"Degustación de dulces típicos","Materiales para el taller","Recetario digital","Souvenir artesanal"}','{"Taller práctico guiado por una matrona local","Historia del dulce tradicional en Barranquilla"}','{"Ropa cómoda","Protección solar si vienes temprano"}',true,true),
('exp-2','Taller creativo de máscaras del Carnaval','mascaras','{"Arte"}','Crea tu propia máscara tradicional del Carnaval de Barranquilla.','El Carnaval no es solo baile, es un legado visual. En el histórico barrio de San Roque, artesanos maestros te enseñarán a moldear y pintar las icónicas máscaras de Galapa y el Congo.','3 horas','San Roque','Taller del Maestro Artesano','Iglesia de San Roque','{"lat":10.9750,"lng":-74.7800}','/images/authentic/portada_mascaras.jpg','{}','{"Moldes de barro y papel maché","Pinturas y pinceles","Certificado de participación","Snack tradicional"}','{"Explicación sobre el significado de cada personaje","Técnicas de modelado tradicional"}','{"Delantal o ropa que se pueda manchar","Puntualidad para aprovechar el secado"}',true,true),
('exp-3','Taller de turbantes afrocaribeños','turbantes','{"Moda y Tradición","Arte","Comunidad"}','Descubre el significado y la técnica detrás de los turbantes afro.','El turbante es corona, identidad y resistencia. Aprenderás los complejos amarres que realzan la belleza caribeña y la historia de comunicación y empoderamiento que estas telas guardan.','2 horas','El Bosque','Centro Comunitario Afro','Parque Metropolitano','{"lat":10.9500,"lng":-74.8050}','/images/authentic/portada_turbantes.jpg','{}','{"Tela de alta calidad para el taller","Modelado de amarres","Historia de la estética afrocaribeña","Refrigerio"}','{"Demostración de diferentes estilos de amarre","Práctica personalizada frente al espejo"}','{"Espejo personal pequeño (opcional)","Interés por la historia sociocultural"}',true,true),
('exp-4','Macondo en Barranquilla – recorrido literario','macondo','{"Cultura","Literatura"}','Sigue los pasos de Gabriel García Márquez por la ciudad.','Barranquilla fue el laboratorio creativo de Gabo. Recorre los lugares que inspiraron pasajes de Cien años de soledad y El amor en los tiempos del cólera.','4 horas','Centro','Recorrido a pie','Edificio de la Antigua Aduana','{"lat":10.9785,"lng":-74.7813}','/images/authentic/portada_macondo.jpg','{}','{"Guía especializado en literatura","Mapa del recorrido Gabo en BQ","Entrada a sitios históricos","Café en un lugar icónico"}','{"Caminata por el centro histórico","Lectura de fragmentos literarios en sitios clave"}','{"Calzado cómodo para caminar","Hidratación constante","Sombrero o gorra"}',true,true),
('exp-5','Cultura Picotera – experiencia musical','picotera','{"Música","Comunidad"}','Siente el bajo y los ritmos de los picós tradicionales.','El Picó es el centro de gravedad del barrio barranquillero. Entiende esta imponente máquina de sonido desde su arte gráfico hasta su ingeniería sonora.','3 horas','Rebolo','Patio Picotero','Estadio Moderno Julio Torres','{"lat":10.9650,"lng":-74.7750}','/images/authentic/portada_picos.jpg','{}','{"Visita a un taller de decoración de picós","Demostración de sonido potente","Clase básica de baile de champeta","Una bebida fría típica"}','{"Vibración sonora real (alto volumen)","Encuentro con artistas del pincel picotero"}','{"Disposición para bailar","Oídos listos para la potencia","Ropa ligera"}',true,true)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, slug=EXCLUDED.slug, categories=EXCLUDED.categories, short_description=EXCLUDED.short_description, is_active=EXCLUDED.is_active;

-- ─────────────────────────────────────────────────────────────
-- 6. SEED — HACEDORES
-- ─────────────────────────────────────────────────────────────
INSERT INTO hacedores (id, name, slug, category, profile_image, cover_image, short_description, full_story, gallery, neighborhood, instagram, whatsapp, specialties, experiences, is_active)
VALUES
('hac-1','Doña Lidia','dona-lidia','Cocina tradicional','/images/authentic/avatar_2.jpg','/images/authentic/portada_dulces.jpg','Matrona y guardiana de la dulcería tradicional afrocolombiana.','Nacida y criada en el emblemático Barrio Abajo, Doña Lidia heredó el arte del fuego y el azúcar de su abuela. Desde hace más de 40 años transforma frutas locales como la guayaba, el coco y el ñame en manjares que cuentan historias de resistencia y alegría.','{}','Barrio Abajo','https://instagram.com/comboxplora','573122475789','{"Dulces de coco y ñame","Enyucado tradicional","Técnicas de cocción lenta en leña","Narración de relatos ancestrales"}','{"exp-1"}',true),
('hac-2','Maestro Alfonso','maestro-alfonso','Artesanía','/images/authentic/avatar_1.jpg','/images/authentic/portada_mascaras.jpg','Maestro artesano del Carnaval y tallador experto de madera.','El Maestro Alfonso es una leyenda viviente en el barrio San Roque. Con una habilidad prodigiosa, moldea la historia del Carnaval de Barranquilla en madera de ceiba y papel maché.','{}','San Roque','https://instagram.com/comboxplora','573122475789','{"Tallado en madera de ceiba","Moldeado en papel maché","Pintura con simbología folclórica","Diseño de personajes de Carnaval"}','{"exp-2"}',true),
('hac-3','Nayibe','nayibe','Patrimonio','/images/authentic/avatar_1.jpg','/images/authentic/portada_turbantes.jpg','Diseñadora de identidad y tejedora de memorias afrocaribeñas.','Nayibe ha convertido el turbante en un lienzo de dignidad y resistencia cultural. Su labor en el Centro Comunitario Afro del barrio El Bosque ha transformado la vida de decenas de mujeres.','{}','El Bosque','https://instagram.com/comboxplora','573122475789','{"Estilos de amarre de turbante","Historia de la estética afrocaribeña","Simbología de estampados africanos","Tejido y empoderamiento comunitario"}','{"exp-3"}',true),
('hac-4','Profesor Gabriel','profesor-gabriel','Narración','/images/authentic/avatar_2.jpg','/images/authentic/portada_macondo.jpg','Historiador y apasionado de la literatura del realismo mágico.','El Profesor Gabriel conoce cada rincón del centro de Barranquilla como la palma de su mano. Se ha dedicado a investigar la vida del nobel Gabriel García Márquez durante su estancia en la Arenosa.','{}','Centro','https://instagram.com/comboxplora','573122475789','{"Historia del Grupo de Barranquilla","Geografía literaria de García Márquez","Análisis de literatura hispanoamericana","Guiado urbano histórico"}','{"exp-4"}',true),
('hac-5','Dj El Gran Freddy','dj-el-gran-freddy','Música','/images/authentic/avatar_1.jpg','/images/authentic/portada_picos.jpg','Pinchadiscos legendario y artesano gráfico de la cultura picotera.','En las vibrantes calles de Rebolo, Dj El Gran Freddy ha comandado el sonido de los picós tradicionales más grandes de la costa. Con su inmensa colección de vinilos mantiene viva la tradición picotera.','{}','Rebolo','https://instagram.com/comboxplora','573122475789','{"Curaduría de vinilos de salsa y música africana","Ingeniería acústica de picós tradicionales","Pintura e ilustración de gráfica popular","Técnicas de mezcla analógica"}','{"exp-5"}',true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, slug=EXCLUDED.slug, category=EXCLUDED.category, short_description=EXCLUDED.short_description, is_active=EXCLUDED.is_active;

-- ─────────────────────────────────────────────────────────────
-- 7. SEED — MAPA CULTURAL
-- ─────────────────────────────────────────────────────────────
INSERT INTO mapa_cultural (id, title, slug, type, categories, description, coordinates, image, neighborhood, tags, linked_experience_slug, audio_url, narrator, is_active)
VALUES
('exp-1','Legado de Matronas – Dulces','dulces','experience','{"Gastronomía","Comunidad"}','Aprende el arte de los dulces típicos.','{"lat":10.9850,"lng":-74.7820}','/images/authentic/portada_dulces.jpg','Barrio Abajo','{"dulces","matronas","barrio abajo","cocina tradicional"}','dulces',NULL,NULL,true),
('exp-2','Taller de máscaras del Carnaval','mascaras','experience','{"Arte"}','Crea tu propia máscara del Carnaval.','{"lat":10.9750,"lng":-74.7800}','/images/authentic/portada_mascaras.jpg','San Roque','{"carnaval","mascaras","artesania","san roque"}','mascaras',NULL,NULL,true),
('exp-3','Taller de turbantes afrocaribeños','turbantes','experience','{"Tradición","Arte","Comunidad"}','Descubre el significado de los turbantes afro.','{"lat":10.9500,"lng":-74.8050}','/images/authentic/portada_turbantes.jpg','El Bosque','{"turbantes","afro","el bosque","identidad"}','turbantes',NULL,NULL,true),
('exp-4','Macondo en Barranquilla','macondo','experience','{"Tradición","Arte"}','Sigue los pasos de García Márquez.','{"lat":10.9785,"lng":-74.7813}','/images/authentic/portada_macondo.jpg','Centro','{"macondo","literatura","gabo","recorrido"}','macondo',NULL,NULL,true),
('exp-5','Cultura Picotera','picotera','experience','{"Música","Comunidad"}','Siente el bajo y los ritmos de los picós.','{"lat":10.9650,"lng":-74.7750}','/images/authentic/portada_picos.jpg','Rebolo','{"musica","pico","champeta","rebolo"}','picotera',NULL,NULL,true),
('ap-1','Historia de Barrio Abajo','historia-barrio-abajo','audio','{"Tradición","Comunidad"}','Conoce el corazón cultural y cuna del Carnaval.','{"lat":10.9860,"lng":-74.7830}','/images/authentic/section_community_main.jpg','Barrio Abajo','{"historia","carnaval","barrio abajo"}',NULL,'/audios/barrio-abajo.mp3','Juan B. Fernández',true),
('ap-2','Memoria del Picó','memoria-del-pico','audio','{"Música","Comunidad"}','La revolución del sonido en las calles barranquilleras.','{"lat":10.9660,"lng":-74.7760}','/images/authentic/portada_picos.jpg','Rebolo','{"musica","pico","champeta","sonido"}',NULL,'/audios/pico.mp3','Dj El Gran Freddy',true),
('ap-3','Relatos de las Matronas','relatos-matronas','audio','{"Gastronomía","Tradición"}','Historias de vida y sabor a través de generaciones.','{"lat":10.9840,"lng":-74.7810}','/images/authentic/portada_dulces.jpg','Barrio Abajo','{"gastronomia","matronas","dulces"}',NULL,'/audios/matronas.mp3','Doña Lidia',true)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, slug=EXCLUDED.slug, type=EXCLUDED.type, categories=EXCLUDED.categories, description=EXCLUDED.description, coordinates=EXCLUDED.coordinates, is_active=EXCLUDED.is_active;

-- ─────────────────────────────────────────────────────────────
-- 8. SEED — RELATOS DE EJEMPLO
-- ─────────────────────────────────────────────────────────────
INSERT INTO relatos (title, slug, excerpt, content, author, type, categories, neighborhood, cover_image, is_featured, is_active)
VALUES
('La historia del Picó en Barranquilla', 'historia-pico-barranquilla', 'El picó es más que un aparato de sonido: es la voz del barrio, la memoria colectiva de Barranquilla.', 'En los callejones del sur de Barranquilla, donde el asfalto cede a la tierra, el picó manda. Desde los años 60, estas imponentes torres de sonido han sido testigos de bodas, velorios y fiestas de quince. Son los guardianes sonoros de la identidad costeña.', 'Equipo ComboXplora', 'escrito', '{"Música","Cultura"}', 'Barrio Abajo', '/images/authentic/exp_picotera_new.jpg', true, true),
('Las Matronas del Carnaval', 'matronas-carnaval', 'Guardianas de la danza, la memoria y la tradición. Las matronas son el corazón del Carnaval de Barranquilla.', 'Cada año, cuando el Carnaval llega, ellas ya están preparadas. Las matronas llevan décadas salvaguardando bailes que sus abuelas les enseñaron. Sus manos tejen disfraces, sus voces cantan letanías, sus pies recuerdan cada paso.', 'María Fernanda Solano', 'escrito', '{"Tradición","Comunidad"}', 'Centro Histórico', '/images/authentic/exp_matronas_new.jpg', false, true)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- LISTO! Verifica los datos:
-- ─────────────────────────────────────────────────────────────
SELECT 'experiencias' as tabla, COUNT(*) as filas FROM experiencias
UNION ALL SELECT 'hacedores', COUNT(*) FROM hacedores
UNION ALL SELECT 'mapa_cultural', COUNT(*) FROM mapa_cultural
UNION ALL SELECT 'relatos', COUNT(*) FROM relatos
UNION ALL SELECT 'empresas_interesadas', COUNT(*) FROM empresas_interesadas
UNION ALL SELECT 'formularios_contacto', COUNT(*) FROM formularios_contacto
UNION ALL SELECT 'postulaciones', COUNT(*) FROM postulaciones;
