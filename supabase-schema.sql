-- ComboXplora Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up tables and seed content!

-- ----------------------------------------------------
-- 1. DROP EXISTING TABLES (Optional, for clean resets)
-- ----------------------------------------------------
-- DROP TABLE IF EXISTS mapa_cultural;
-- DROP TABLE IF EXISTS hacedores;
-- DROP TABLE IF EXISTS experiencias;

-- ----------------------------------------------------
-- 2. CREATE DATABASE TABLES
-- ----------------------------------------------------

-- CREATE TABLE: experiencias
CREATE TABLE IF NOT EXISTS experiencias (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categories TEXT[] DEFAULT '{}',
  short_description TEXT,
  full_description TEXT,
  duration TEXT,
  neighborhood TEXT,
  location TEXT,
  meeting_point TEXT,
  coordinates JSONB NOT NULL DEFAULT '{"lat": 10.9850, "lng": -74.7820}',
  image TEXT,
  gallery TEXT[] DEFAULT '{}',
  includes TEXT[] DEFAULT '{}',
  what_to_expect TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- CREATE TABLE: hacedores
CREATE TABLE IF NOT EXISTS hacedores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  profile_image TEXT,
  cover_image TEXT,
  short_description TEXT,
  full_story TEXT,
  gallery TEXT[] DEFAULT '{}',
  neighborhood TEXT,
  instagram TEXT,
  whatsapp TEXT,
  specialties TEXT[] DEFAULT '{}',
  experiences TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- CREATE TABLE: mapa_cultural
CREATE TABLE IF NOT EXISTS mapa_cultural (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  type TEXT DEFAULT 'experience' CHECK (type IN ('experience', 'audio')),
  categories TEXT[] DEFAULT '{}',
  description TEXT,
  coordinates JSONB NOT NULL DEFAULT '{"lat": 10.9850, "lng": -74.7820}',
  image TEXT,
  neighborhood TEXT,
  tags TEXT[] DEFAULT '{}',
  linked_experience_slug TEXT,
  audio_url TEXT,
  narrator TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
-- To keep this simple and beginner-friendly, we can add read-only policies for public access, 
-- and full permission policies for authenticated users / anon access for MVP tests.
ALTER TABLE experiencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapa_cultural ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow anonymous public reads (SELECT)
CREATE POLICY "Allow public read access on experiencias" ON experiencias FOR SELECT USING (true);
CREATE POLICY "Allow public read access on hacedores" ON hacedores FOR SELECT USING (true);
CREATE POLICY "Allow public read access on mapa_cultural" ON mapa_cultural FOR SELECT USING (true);

-- Create Policies to allow full anon/authenticated modifications for MVP Admin (INSERT, UPDATE, DELETE)
-- WARNING: In production, secure this by checking authentication.
CREATE POLICY "Allow anon modifications on experiencias" ON experiencias ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon modifications on hacedores" ON hacedores ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon modifications on mapa_cultural" ON mapa_cultural ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------
-- 3. SEED INITIAL CONTENT
-- ----------------------------------------------------

-- Seed: experiencias
INSERT INTO experiencias (id, title, slug, categories, short_description, full_description, duration, neighborhood, location, meeting_point, coordinates, image, gallery, includes, what_to_expect, recommendations, is_featured, is_active)
VALUES 
(
  'exp-1',
  'Legado de Matronas – Dulces tradicionales',
  'dulces',
  '{"Gastronomía", "Comunidad"}',
  'Aprende el arte de los dulces típicos con las matronas de la región.',
  'Sumérgete en el corazón de Barrio Abajo y descubre los secretos custodiados por generaciones de matronas. En esta experiencia sensorial, aprenderás la alquimia de transformar frutas locales en joyas dulces, mientras escuchas relatos sobre la resiliencia y alegría de nuestra gente.',
  '2 horas',
  'Barrio Abajo',
  'Casa de las Matronas',
  'Plaza de la Aduana (10 min caminando)',
  '{"lat": 10.9850, "lng": -74.7820}',
  '/images/authentic/portada_dulces.jpg',
  '{"/images/experiencias/dulces/gallery/1.jpg", "/images/experiencias/dulces/gallery/2.jpg", "/images/experiencias/dulces/gallery/3.jpg", "/images/experiencias/dulces/gallery/4.jpg"}',
  '{"Degustación de dulces típicos", "Materiales para el taller", "Recetario digital", "Souvenir artesanal"}',
  '{"Taller práctico guiado por una matrona local", "Historia del dulce tradicional en Barranquilla", "Ambiente familiar y acogedor", "Música folclórica de fondo"}',
  '{"Ropa cómoda", "Protección solar si vienes temprano", "Cámara para fotos increíbles", "Mucha disposición de aprender"}',
  true,
  true
),
(
  'exp-2',
  'Taller creativo de máscaras del Carnaval',
  'mascaras',
  '{"Arte"}',
  'Crea tu propia máscara tradicional del Carnaval de Barranquilla.',
  'El Carnaval no es solo baile, es un legado visual. En el histórico barrio de San Roque, artesanos maestros te enseñarán a moldear y pintar las icónicas máscaras de Galapa y el Congo. Una oportunidad única para conectar con la simbología de nuestra fiesta más grande.',
  '3 horas',
  'San Roque',
  'Taller del Maestro Artesano',
  'Iglesia de San Roque',
  '{"lat": 10.9750, "lng": -74.7800}',
  '/images/authentic/portada_mascaras.jpg',
  '{"/images/experiencias/mascaras/gallery/1.jpg", "/images/experiencias/mascaras/gallery/2.jpg", "/images/experiencias/mascaras/gallery/3.jpg", "/images/experiencias/mascaras/gallery/4.jpg"}',
  '{"Moldes de barro y papel maché", "Pinturas y pinceles", "Certificado de participación", "Snack tradicional"}',
  '{"Explicación sobre el significado de cada personaje", "Técnicas de modelado tradicional", "Espacio creativo compartido con otros exploradores", "Charla con el maestro artesano"}',
  '{"Delantal o ropa que se pueda manchar", "Puntualidad para aprovechar el secado", "Creatividad al máximo"}',
  true,
  true
),
(
  'exp-3',
  'Taller de turbantes afrocaribeños',
  'turbantes',
  '{"Moda y Tradición", "Arte", "Comunidad"}',
  'Descubre el significado y la técnica detrás de los turbantes afro.',
  'El turbante es corona, identidad y resistencia. En este taller aprenderás no solo los complejos amarres que realzan la belleza caribeña, sino también la historia de comunicación y empoderamiento que estas telas guardan. Una experiencia de reafirmación cultural.',
  '2 horas',
  'El Bosque',
  'Centro Comunitario Afro',
  'Parque Metropolitano',
  '{"lat": 10.9500, "lng": -74.8050}',
  '/images/authentic/portada_turbantes.jpg',
  '{"/images/experiencias/turbantes/gallery/1.jpg", "/images/experiencias/turbantes/gallery/2.jpg", "/images/experiencias/turbantes/gallery/3.jpg", "/images/experiencias/turbantes/gallery/4.jpg"}',
  '{"Tela de alta calidad para el taller", "Modelado de amarres", "Historia de la estética afrocaribeña", "Refrigerio"}',
  '{"Demostración de diferentes estilos de amarre", "Práctica personalizada frente al espejo", "Conversatorio sobre la herencia africana en el Caribe", "Sesión de fotos con tu turbante"}',
  '{"Espejo personal pequeño (opcional)", "Interés por la historia sociocultural"}',
  true,
  true
),
(
  'exp-4',
  'Macondo en Barranquilla – recorrido literario',
  'macondo',
  '{"Cultura", "Literatura"}',
  'Sigue los pasos de Gabriel García Márquez por la ciudad.',
  'Barranquilla fue el laboratorio creativo de Gabo. Recorre los lugares que inspiraron pasajes de ''Cien años de soledad'' y ''El amor en los tiempos del cólera''. Desde la antigua redacción del Heraldo hasta la Cueva, revive la atmósfera que dio vida al Realismo Mágico.',
  '4 horas',
  'Centro',
  'Recorrido a pie',
  'Edificio de la Antigua Aduana',
  '{"lat": 10.9785, "lng": -74.7813}',
  '/images/authentic/portada_macondo.jpg',
  '{"/images/experiencias/macondo/gallery/1.jpg", "/images/experiencias/macondo/gallery/2.jpg", "/images/experiencias/macondo/gallery/3.jpg", "/images/experiencias/macondo/gallery/4.jpg"}',
  '{"Guía especializado en literatura", "Mapa del recorrido ''Gabo en BQ''", "Entrada a sitios históricos", "Café en un lugar icónico"}',
  '{"Caminata por el centro histórico", "Lectura de fragmentos literarios en sitios clave", "Anecdotario del Grupo de Barranquilla", "Conexión entre la realidad y la ficción"}',
  '{"Calzado cómodo para caminar", "Hidratación constante", "Sombrero o gorra", "Haber leído algo de Gabo es un plus!"}',
  true,
  true
),
(
  'exp-5',
  'Cultura Picotera – experiencia musical',
  'picotera',
  '{"Música", "Comunidad"}',
  'Siente el bajo y los ritmos de los picós tradicionales.',
  'El Picó es el centro de gravedad del barrio barranquillero. Entiende esta imponente máquina de sonido desde su arte gráfico hasta su ingeniería sonora. Conoce a los pinchadiscos emblemáticos y déjate llevar por la champeta, la salsa y los ritmos africanos que solo suenan aquí.',
  '3 horas',
  'Rebolo',
  'Patio Picotero',
  'Estadio Moderno Julio Torres',
  '{"lat": 10.9650, "lng": -74.7750}',
  '/images/authentic/portada_picos.jpg',
  '{"/images/experiencias/picotera/gallery/1.jpg", "/images/experiencias/picotera/gallery/2.jpg", "/images/experiencias/picotera/gallery/3.jpg", "/images/experiencias/picotera/gallery/4.jpg"}',
  '{"Visita a un taller de decoración de picós", "Demostración de sonido potente", "Clase básica de baile de champeta", "Una bebida fría típica"}',
  '{"Vibración sonora real (alto volumen)", "Encuentro con artistas del ''pincel picotero''", "Historia de la música africana en el Caribe", "Mucha alegría y ritmo"}',
  '{"Disposición para bailar", "Oídos listos para la potencia", "Ropa ligera"}',
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  categories = EXCLUDED.categories,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  duration = EXCLUDED.duration,
  neighborhood = EXCLUDED.neighborhood,
  location = EXCLUDED.location,
  meeting_point = EXCLUDED.meeting_point,
  coordinates = EXCLUDED.coordinates,
  image = EXCLUDED.image,
  gallery = EXCLUDED.gallery,
  includes = EXCLUDED.includes,
  what_to_expect = EXCLUDED.what_to_expect,
  recommendations = EXCLUDED.recommendations,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;

-- Seed: hacedores
INSERT INTO hacedores (id, name, slug, category, profile_image, cover_image, short_description, full_story, gallery, neighborhood, instagram, whatsapp, specialties, experiences, is_active)
VALUES
(
  'hac-1',
  'Doña Lidia',
  'dona-lidia',
  'Cocina tradicional',
  '/images/authentic/avatar_2.jpg',
  '/images/authentic/portada_dulces.jpg',
  'Matrona y guardiana de la dulcería tradicional afrocolombiana.',
  'Nacida y criada en el emblemático Barrio Abajo, Doña Lidia heredó el arte del fuego y el azúcar de su abuela. Desde hace más de 40 años, transforma frutas locales como la guayaba, el coco y el ñame en manjares que cuentan historias de resistencia y alegría. Para ella, cocinar dulces no es solo un oficio, sino un ritual sagrado de conexión familiar y preservación del patrimonio inmaterial del Caribe colombiano.',
  '{"/images/experiencias/dulces/gallery/1.jpg", "/images/experiencias/dulces/gallery/2.jpg", "/images/experiencias/dulces/gallery/3.jpg", "/images/experiencias/dulces/gallery/4.jpg"}',
  'Barrio Abajo',
  'https://instagram.com/comboxplora',
  '573122475789',
  '{"Dulces de coco y ñame", "Enyucado tradicional", "Técnicas de cocción lenta en leña", "Narración de relatos ancestrales"}',
  '{"exp-1"}',
  true
),
(
  'hac-2',
  'Maestro Alfonso',
  'maestro-alfonso',
  'Artesanía',
  '/images/authentic/avatar_1.jpg',
  '/images/authentic/portada_mascaras.jpg',
  'Maestro artesano del Carnaval y tallador experto de madera.',
  'El Maestro Alfonso es una leyenda viviente en el barrio San Roque. Con una habilidad prodigiosa, moldea la historia del Carnaval de Barranquilla en madera de ceiba y papel maché. Sus máscaras de toros, tigres y congos han recorrido el mundo, pero su mayor orgullo es enseñar a las nuevas generaciones el significado místico detrás de cada color y forma que da vida a las carnestolendas.',
  '{"/images/experiencias/mascaras/gallery/1.jpg", "/images/experiencias/mascaras/gallery/2.jpg", "/images/experiencias/mascaras/gallery/3.jpg", "/images/experiencias/mascaras/gallery/4.jpg"}',
  'San Roque',
  'https://instagram.com/comboxplora',
  '573122475789',
  '{"Tallado en madera de ceiba", "Moldeado en papel maché", "Pintura con simbología folclórica", "Diseño de personajes de Carnaval"}',
  '{"exp-2"}',
  true
),
(
  'hac-3',
  'Nayibe',
  'nayibe',
  'Patrimonio',
  '/images/authentic/avatar_1.jpg',
  '/images/authentic/portada_turbantes.jpg',
  'Diseñadora de identidad y tejedora de memorias afrocaribeñas.',
  'Nayibe ha convertido el turbante en un lienzo de dignidad y resistencia cultural. Su labor en el Centro Comunitario Afro del barrio El Bosque ha transformado la vida de decenas de mujeres. Con cada doblez, cada color y cada nudo, Nayibe enseña que el turbante no es solo estética, sino un código de comunicación ancestral y una corona que resalta la belleza e historia de la herencia africana en nuestro Caribe.',
  '{"/images/experiencias/turbantes/gallery/1.jpg", "/images/experiencias/turbantes/gallery/2.jpg", "/images/experiencias/turbantes/gallery/3.jpg", "/images/experiencias/turbantes/gallery/4.jpg"}',
  'El Bosque',
  'https://instagram.com/comboxplora',
  '573122475789',
  '{"Estilos de amarre de turbante", "Historia de la estética afrocaribeña", "Simbología de estampados africanos", "Tejido y empoderamiento comunitario"}',
  '{"exp-3"}',
  true
),
(
  'hac-4',
  'Profesor Gabriel',
  'profesor-gabriel',
  'Narración',
  '/images/authentic/avatar_2.jpg',
  '/images/authentic/portada_macondo.jpg',
  'Historiador y apasionado de la literatura del realismo mágico.',
  'El Profesor Gabriel conoce cada rincón del centro de Barranquilla como la palma de su mano. Se ha dedicado a investigar la vida del nobel Gabriel García Márquez durante su estancia en la Arenosa, cuando formó parte del mítico Grupo de Barranquilla. Su voz cálida y erudita transporta a los exploradores a un viaje en el tiempo donde el realismo mágico cobra vida en las esquinas de la ciudad.',
  '{"/images/experiencias/macondo/gallery/1.jpg", "/images/experiencias/macondo/gallery/2.jpg", "/images/experiencias/macondo/gallery/3.jpg", "/images/experiencias/macondo/gallery/4.jpg"}',
  'Centro',
  'https://instagram.com/comboxplora',
  '573122475789',
  '{"Historia del Grupo de Barranquilla", "Geografía literaria de Gabriel García Márquez", "Análisis de literatura hispanoamericana", "Guiado urbano histórico"}',
  '{"exp-4"}',
  true
),
(
  'hac-5',
  'Dj El Gran Freddy',
  'dj-el-gran-freddy',
  'Música',
  '/images/authentic/avatar_1.jpg',
  '/images/authentic/portada_picos.jpg',
  'Pinchadiscos legendario y artesano gráfico de la cultura picotera.',
  'En las vibrantes calles de Rebolo, Dj El Gran Freddy ha comandado el sonido de los picós tradicionales más grandes de la costa. Con su inmensa colección de vinilos y su profundo conocimiento de los ritmos africanos, Freddy mantiene viva la tradición picotera como manifestación artística y social. Su patio es un templo del ritmo, donde la gráfica popular caribeña y la potencia sonora se unen para hacer bailar el alma.',
  '{"/images/experiencias/picotera/gallery/1.jpg", "/images/experiencias/picotera/gallery/2.jpg", "/images/experiencias/picotera/gallery/3.jpg", "/images/experiencias/picotera/gallery/4.jpg"}',
  'Rebolo',
  'https://instagram.com/comboxplora',
  '573122475789',
  '{"Curaduría de vinilos de salsa y música africana", "Ingeniería acústica de picós tradicionales", "Pintura e ilustración de gráfica popular", "Técnicas de mezcla analógica"}',
  '{"exp-5"}',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  profile_image = EXCLUDED.profile_image,
  cover_image = EXCLUDED.cover_image,
  short_description = EXCLUDED.short_description,
  full_story = EXCLUDED.full_story,
  gallery = EXCLUDED.gallery,
  neighborhood = EXCLUDED.neighborhood,
  instagram = EXCLUDED.instagram,
  whatsapp = EXCLUDED.whatsapp,
  specialties = EXCLUDED.specialties,
  experiences = EXCLUDED.experiences,
  is_active = EXCLUDED.is_active;

-- Seed: mapa_cultural
INSERT INTO mapa_cultural (id, title, slug, type, categories, description, coordinates, image, neighborhood, tags, linked_experience_slug, audio_url, narrator, is_active)
VALUES
(
  'exp-1',
  'Legado de Matronas – Dulces tradicionales',
  'dulces',
  'experience',
  '{"Gastronomía", "Comunidad"}',
  'Aprende el arte de los dulces típicos con las matronas de la región.',
  '{"lat": 10.9850, "lng": -74.7820}',
  '/images/authentic/portada_dulces.jpg',
  'Barrio Abajo',
  '{"dulces", "matronas", "barrio abajo", "cocina tradicional"}',
  'dulces',
  NULL,
  NULL,
  true
),
(
  'exp-2',
  'Taller creativo de máscaras del Carnaval',
  'mascaras',
  'experience',
  '{"Arte"}',
  'Crea tu propia máscara tradicional del Carnaval de Barranquilla.',
  '{"lat": 10.9750, "lng": -74.7800}',
  '/images/authentic/portada_mascaras.jpg',
  'San Roque',
  '{"carnaval", "mascaras", "artesania", "san roque"}',
  'mascaras',
  NULL,
  NULL,
  true
),
(
  'exp-3',
  'Taller de turbantes afrocaribeños',
  'turbantes',
  'experience',
  '{"Tradición", "Arte", "Comunidad"}',
  'Descubre el significado y la técnica detrás de los turbantes afro.',
  '{"lat": 10.9500, "lng": -74.8050}',
  '/images/authentic/portada_turbantes.jpg',
  'El Bosque',
  '{"turbantes", "afro", "el bosque", "identidad"}',
  'turbantes',
  NULL,
  NULL,
  true
),
(
  'exp-4',
  'Macondo en Barranquilla – recorrido literario',
  'macondo',
  'experience',
  '{"Tradición", "Arte"}',
  'Sigue los pasos de Gabriel García Márquez por la ciudad.',
  '{"lat": 10.9785, "lng": -74.7813}',
  '/images/authentic/portada_macondo.jpg',
  'Centro',
  '{"macondo", "literatura", "gabo", "recorrido"}',
  'macondo',
  NULL,
  NULL,
  true
),
(
  'exp-5',
  'Cultura Picotera – experiencia musical',
  'picotera',
  'experience',
  '{"Música", "Comunidad"}',
  'Siente el bajo y los ritmos de los picós tradicionales.',
  '{"lat": 10.9650, "lng": -74.7750}',
  '/images/authentic/portada_picos.jpg',
  'Rebolo',
  '{"musica", "pico", "champeta", "rebolo"}',
  'picotera',
  NULL,
  NULL,
  true
),
(
  'ap-1',
  'Historia de Barrio Abajo',
  'historia-barrio-abajo',
  'audio',
  '{"Tradición", "Comunidad"}',
  'Conoce el corazón cultural y cuna del Carnaval.',
  '{"lat": 10.9860, "lng": -74.7830}',
  '/images/authentic/section_community_main.jpg',
  'Barrio Abajo',
  '{"historia", "carnaval", "barrio abajo"}',
  NULL,
  '/audios/barrio-abajo.mp3',
  'Juan B. Fernández',
  true
),
(
  'ap-2',
  'Memoria del Picó',
  'memoria-del-pico',
  'audio',
  '{"Música", "Comunidad"}',
  'La revolución del sonido en las calles barranquilleras.',
  '{"lat": 10.9660, "lng": -74.7760}',
  '/images/authentic/portada_picos.jpg',
  'Rebolo',
  '{"musica", "pico", "champeta", "sonido"}',
  NULL,
  '/audios/pico.mp3',
  'Dj El Gran Freddy',
  true
),
(
  'ap-3',
  'Relatos de las Matronas',
  'relatos-matronas',
  'audio',
  '{"Gastronomía", "Tradición"}',
  'Historias de vida y sabor a través de generaciones.',
  '{"lat": 10.9840, "lng": -74.7810}',
  '/images/authentic/portada_dulces.jpg',
  'Barrio Abajo',
  '{"gastronomia", "matronas", "dulces"}',
  NULL,
  '/audios/matronas.mp3',
  'Doña Lidia',
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  categories = EXCLUDED.categories,
  description = EXCLUDED.description,
  coordinates = EXCLUDED.coordinates,
  image = EXCLUDED.image,
  neighborhood = EXCLUDED.neighborhood,
  tags = EXCLUDED.tags,
  linked_experience_slug = EXCLUDED.linked_experience_slug,
  audio_url = EXCLUDED.audio_url,
  narrator = EXCLUDED.narrator,
  is_active = EXCLUDED.is_active;
