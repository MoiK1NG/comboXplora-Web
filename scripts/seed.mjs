import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pjmmidxdolzfvafzfvnh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbW1pZHhkb2x6ZnZhZnpmdm5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTY2MDA5OSwiZXhwIjoyMDk1MjM2MDk5fQ.DCVb5yu17_DSn1BW8fcwGLelkxHVkelAzkgoZuRo5EA'
);

// ─── EXPERIENCIAS ───────────────────────────────────────────
const experiencias = [
  {
    id: 'exp-1',
    title: 'Legado de Matronas - Dulces tradicionales',
    slug: 'dulces',
    categories: ['Gastronomía', 'Comunidad'],
    short_description: 'Aprende el arte de los dulces típicos con las matronas de la región.',
    full_description: 'Sumérgete en el corazón de Barrio Abajo y descubre los secretos custodiados por generaciones de matronas. En esta experiencia sensorial, aprenderás la alquimia de transformar frutas locales en joyas dulces, mientras escuchas relatos sobre la resiliencia y alegría de nuestra gente.',
    duration: '2 horas',
    neighborhood: 'Barrio Abajo',
    location: 'Casa de las Matronas',
    meeting_point: 'Plaza de la Aduana (10 min caminando)',
    coordinates: { lat: 10.9850, lng: -74.7820 },
    image: '/images/authentic/portada_dulces.jpg',
    gallery: ['/images/experiencias/dulces/gallery/1.jpg', '/images/experiencias/dulces/gallery/2.jpg'],
    includes: ['Degustación de dulces típicos', 'Materiales para el taller', 'Recetario digital', 'Souvenir artesanal'],
    what_to_expect: ['Taller práctico guiado por una matrona local', 'Historia del dulce tradicional en Barranquilla'],
    recommendations: ['Ropa cómoda', 'Protección solar si vienes temprano'],
    is_featured: true,
    is_active: true,
  },
  {
    id: 'exp-2',
    title: 'Taller creativo de máscaras del Carnaval',
    slug: 'mascaras',
    categories: ['Arte'],
    short_description: 'Crea tu propia máscara tradicional del Carnaval de Barranquilla.',
    full_description: 'El Carnaval no es solo baile, es un legado visual. En el histórico barrio de San Roque, artesanos maestros te enseñarán a moldear y pintar las icónicas máscaras de Galapa y el Congo.',
    duration: '3 horas',
    neighborhood: 'San Roque',
    location: 'Taller del Maestro Artesano',
    meeting_point: 'Iglesia de San Roque',
    coordinates: { lat: 10.9750, lng: -74.7800 },
    image: '/images/authentic/portada_mascaras.jpg',
    gallery: ['/images/experiencias/mascaras/gallery/1.jpg'],
    includes: ['Moldes de barro y papel maché', 'Pinturas y pinceles', 'Certificado de participación', 'Snack tradicional'],
    what_to_expect: ['Explicación sobre el significado de cada personaje', 'Técnicas de modelado tradicional'],
    recommendations: ['Delantal o ropa que se pueda manchar', 'Puntualidad para aprovechar el secado'],
    is_featured: true,
    is_active: true,
  },
  {
    id: 'exp-3',
    title: 'Taller de turbantes afrocaribeños',
    slug: 'turbantes',
    categories: ['Moda y Tradición', 'Arte', 'Comunidad'],
    short_description: 'Descubre el significado y la técnica detrás de los turbantes afro.',
    full_description: 'El turbante es corona, identidad y resistencia. En este taller aprenderás no solo los complejos amarres que realzan la belleza caribeña, sino también la historia de comunicación y empoderamiento que estas telas guardan.',
    duration: '2 horas',
    neighborhood: 'El Bosque',
    location: 'Centro Comunitario Afro',
    meeting_point: 'Parque Metropolitano',
    coordinates: { lat: 10.9500, lng: -74.8050 },
    image: '/images/authentic/portada_turbantes.jpg',
    gallery: ['/images/experiencias/turbantes/gallery/1.jpg'],
    includes: ['Tela de alta calidad para el taller', 'Modelado de amarres', 'Historia de la estética afrocaribeña', 'Refrigerio'],
    what_to_expect: ['Demostración de diferentes estilos de amarre', 'Práctica personalizada frente al espejo'],
    recommendations: ['Espejo personal pequeño (opcional)', 'Interés por la historia sociocultural'],
    is_featured: true,
    is_active: true,
  },
  {
    id: 'exp-4',
    title: 'Macondo en Barranquilla - recorrido literario',
    slug: 'macondo',
    categories: ['Cultura', 'Literatura'],
    short_description: 'Sigue los pasos de Gabriel García Márquez por la ciudad.',
    full_description: 'Barranquilla fue el laboratorio creativo de Gabo. Recorre los lugares que inspiraron pasajes de Cien años de soledad y El amor en los tiempos del cólera.',
    duration: '4 horas',
    neighborhood: 'Centro',
    location: 'Recorrido a pie',
    meeting_point: 'Edificio de la Antigua Aduana',
    coordinates: { lat: 10.9785, lng: -74.7813 },
    image: '/images/authentic/portada_macondo.jpg',
    gallery: ['/images/experiencias/macondo/gallery/1.jpg'],
    includes: ['Guía especializado en literatura', 'Mapa del recorrido Gabo en BQ', 'Entrada a sitios históricos', 'Café en un lugar icónico'],
    what_to_expect: ['Caminata por el centro histórico', 'Lectura de fragmentos literarios en sitios clave'],
    recommendations: ['Calzado cómodo para caminar', 'Hidratación constante', 'Sombrero o gorra'],
    is_featured: true,
    is_active: true,
  },
  {
    id: 'exp-5',
    title: 'Cultura Picotera - experiencia musical',
    slug: 'picotera',
    categories: ['Música', 'Comunidad'],
    short_description: 'Siente el bajo y los ritmos de los picós tradicionales.',
    full_description: 'El Picó es el centro de gravedad del barrio barranquillero. Entiende esta imponente máquina de sonido desde su arte gráfico hasta su ingeniería sonora.',
    duration: '3 horas',
    neighborhood: 'Rebolo',
    location: 'Patio Picotero',
    meeting_point: 'Estadio Moderno Julio Torres',
    coordinates: { lat: 10.9650, lng: -74.7750 },
    image: '/images/authentic/portada_picos.jpg',
    gallery: ['/images/experiencias/picotera/gallery/1.jpg'],
    includes: ['Visita a un taller de decoración de picós', 'Demostración de sonido potente', 'Clase básica de baile de champeta', 'Una bebida fría típica'],
    what_to_expect: ['Vibración sonora real (alto volumen)', 'Encuentro con artistas del pincel picotero'],
    recommendations: ['Disposición para bailar', 'Oídos listos para la potencia', 'Ropa ligera'],
    is_featured: true,
    is_active: true,
  },
];

// ─── HACEDORES ───────────────────────────────────────────────
const hacedores = [
  {
    id: 'hac-1',
    name: 'Doña Lidia',
    slug: 'dona-lidia',
    category: 'Cocina tradicional',
    profile_image: '/images/authentic/avatar_2.jpg',
    cover_image: '/images/authentic/portada_dulces.jpg',
    short_description: 'Matrona y guardiana de la dulcería tradicional afrocolombiana.',
    full_story: 'Nacida y criada en el emblemático Barrio Abajo, Doña Lidia heredó el arte del fuego y el azúcar de su abuela. Desde hace más de 40 años, transforma frutas locales como la guayaba, el coco y el ñame en manjares que cuentan historias de resistencia y alegría.',
    gallery: ['/images/experiencias/dulces/gallery/1.jpg', '/images/experiencias/dulces/gallery/2.jpg'],
    neighborhood: 'Barrio Abajo',
    instagram: 'https://instagram.com/comboxplora',
    whatsapp: '573122475789',
    specialties: ['Dulces de coco y ñame', 'Enyucado tradicional', 'Técnicas de cocción lenta en leña', 'Narración de relatos ancestrales'],
    experiences: ['exp-1'],
    is_active: true,
  },
  {
    id: 'hac-2',
    name: 'Maestro Alfonso',
    slug: 'maestro-alfonso',
    category: 'Artesanía',
    profile_image: '/images/authentic/avatar_1.jpg',
    cover_image: '/images/authentic/portada_mascaras.jpg',
    short_description: 'Maestro artesano del Carnaval y tallador experto de madera.',
    full_story: 'El Maestro Alfonso es una leyenda viviente en el barrio San Roque. Con una habilidad prodigiosa, moldea la historia del Carnaval de Barranquilla en madera de ceiba y papel maché.',
    gallery: ['/images/experiencias/mascaras/gallery/1.jpg', '/images/experiencias/mascaras/gallery/2.jpg'],
    neighborhood: 'San Roque',
    instagram: 'https://instagram.com/comboxplora',
    whatsapp: '573122475789',
    specialties: ['Tallado en madera de ceiba', 'Moldeado en papel maché', 'Pintura con simbología folclórica', 'Diseño de personajes de Carnaval'],
    experiences: ['exp-2'],
    is_active: true,
  },
  {
    id: 'hac-3',
    name: 'Nayibe',
    slug: 'nayibe',
    category: 'Patrimonio',
    profile_image: '/images/authentic/avatar_1.jpg',
    cover_image: '/images/authentic/portada_turbantes.jpg',
    short_description: 'Diseñadora de identidad y tejedora de memorias afrocaribeñas.',
    full_story: 'Nayibe ha convertido el turbante en un lienzo de dignidad y resistencia cultural. Su labor en el Centro Comunitario Afro del barrio El Bosque ha transformado la vida de decenas de mujeres.',
    gallery: ['/images/experiencias/turbantes/gallery/1.jpg'],
    neighborhood: 'El Bosque',
    instagram: 'https://instagram.com/comboxplora',
    whatsapp: '573122475789',
    specialties: ['Estilos de amarre de turbante', 'Historia de la estética afrocaribeña', 'Simbología de estampados africanos'],
    experiences: ['exp-3'],
    is_active: true,
  },
  {
    id: 'hac-4',
    name: 'Profesor Gabriel',
    slug: 'profesor-gabriel',
    category: 'Narración',
    profile_image: '/images/authentic/avatar_2.jpg',
    cover_image: '/images/authentic/portada_macondo.jpg',
    short_description: 'Historiador y apasionado de la literatura del realismo mágico.',
    full_story: 'El Profesor Gabriel conoce cada rincón del centro de Barranquilla como la palma de su mano. Se ha dedicado a investigar la vida del nobel Gabriel García Márquez durante su estancia en la Arenosa.',
    gallery: ['/images/experiencias/macondo/gallery/1.jpg'],
    neighborhood: 'Centro',
    instagram: 'https://instagram.com/comboxplora',
    whatsapp: '573122475789',
    specialties: ['Historia del Grupo de Barranquilla', 'Geografía literaria de García Márquez', 'Guiado urbano histórico'],
    experiences: ['exp-4'],
    is_active: true,
  },
  {
    id: 'hac-5',
    name: 'Dj El Gran Freddy',
    slug: 'dj-el-gran-freddy',
    category: 'Música',
    profile_image: '/images/authentic/avatar_1.jpg',
    cover_image: '/images/authentic/portada_picos.jpg',
    short_description: 'Pinchadiscos legendario y artesano gráfico de la cultura picotera.',
    full_story: 'En las vibrantes calles de Rebolo, Dj El Gran Freddy ha comandado el sonido de los picós tradicionales más grandes de la costa.',
    gallery: ['/images/experiencias/picotera/gallery/1.jpg'],
    neighborhood: 'Rebolo',
    instagram: 'https://instagram.com/comboxplora',
    whatsapp: '573122475789',
    specialties: ['Curaduría de vinilos de salsa y música africana', 'Ingeniería acústica de picós tradicionales', 'Pintura e ilustración de gráfica popular'],
    experiences: ['exp-5'],
    is_active: true,
  },
];

// ─── MAPA CULTURAL ───────────────────────────────────────────
const mapa = [
  { id: 'exp-1', title: 'Legado de Matronas - Dulces', slug: 'dulces', type: 'experience', categories: ['Gastronomía', 'Comunidad'], description: 'Aprende el arte de los dulces típicos.', coordinates: { lat: 10.9850, lng: -74.7820 }, image: '/images/authentic/portada_dulces.jpg', neighborhood: 'Barrio Abajo', tags: ['dulces', 'matronas', 'barrio abajo'], linked_experience_slug: 'dulces', is_active: true },
  { id: 'exp-2', title: 'Taller de máscaras del Carnaval', slug: 'mascaras', type: 'experience', categories: ['Arte'], description: 'Crea tu propia máscara del Carnaval.', coordinates: { lat: 10.9750, lng: -74.7800 }, image: '/images/authentic/portada_mascaras.jpg', neighborhood: 'San Roque', tags: ['carnaval', 'mascaras', 'artesania'], linked_experience_slug: 'mascaras', is_active: true },
  { id: 'exp-3', title: 'Taller de turbantes afrocaribeños', slug: 'turbantes', type: 'experience', categories: ['Tradición', 'Arte'], description: 'Descubre el significado de los turbantes afro.', coordinates: { lat: 10.9500, lng: -74.8050 }, image: '/images/authentic/portada_turbantes.jpg', neighborhood: 'El Bosque', tags: ['turbantes', 'afro', 'identidad'], linked_experience_slug: 'turbantes', is_active: true },
  { id: 'exp-4', title: 'Macondo en Barranquilla', slug: 'macondo', type: 'experience', categories: ['Tradición', 'Arte'], description: 'Sigue los pasos de García Márquez.', coordinates: { lat: 10.9785, lng: -74.7813 }, image: '/images/authentic/portada_macondo.jpg', neighborhood: 'Centro', tags: ['macondo', 'literatura', 'gabo', 'recorrido'], linked_experience_slug: 'macondo', is_active: true },
  { id: 'exp-5', title: 'Cultura Picotera', slug: 'picotera', type: 'experience', categories: ['Música', 'Comunidad'], description: 'Siente los ritmos de los picós.', coordinates: { lat: 10.9650, lng: -74.7750 }, image: '/images/authentic/portada_picos.jpg', neighborhood: 'Rebolo', tags: ['musica', 'pico', 'champeta'], linked_experience_slug: 'picotera', is_active: true },
  { id: 'ap-1', title: 'Historia de Barrio Abajo', slug: 'historia-barrio-abajo', type: 'audio', categories: ['Tradición', 'Comunidad'], description: 'Conoce el corazón cultural y cuna del Carnaval.', coordinates: { lat: 10.9860, lng: -74.7830 }, image: '/images/authentic/section_community_main.jpg', neighborhood: 'Barrio Abajo', tags: ['historia', 'carnaval', 'barrio abajo'], audio_url: '/audios/barrio-abajo.mp3', narrator: 'Juan B. Fernández', is_active: true },
  { id: 'ap-2', title: 'Memoria del Picó', slug: 'memoria-del-pico', type: 'audio', categories: ['Música', 'Comunidad'], description: 'La revolución del sonido en las calles barranquilleras.', coordinates: { lat: 10.9660, lng: -74.7760 }, image: '/images/authentic/portada_picos.jpg', neighborhood: 'Rebolo', tags: ['musica', 'pico', 'champeta', 'sonido'], audio_url: '/audios/pico.mp3', narrator: 'Dj El Gran Freddy', is_active: true },
  { id: 'ap-3', title: 'Relatos de las Matronas', slug: 'relatos-matronas', type: 'audio', categories: ['Gastronomía', 'Tradición'], description: 'Historias de vida y sabor a través de generaciones.', coordinates: { lat: 10.9840, lng: -74.7810 }, image: '/images/authentic/portada_dulces.jpg', neighborhood: 'Barrio Abajo', tags: ['gastronomia', 'matronas', 'dulces'], audio_url: '/audios/matronas.mp3', narrator: 'Doña Lidia', is_active: true },
];

async function seed() {
  console.log('🚀 Iniciando seed de datos en Supabase...\n');

  const { error: e1 } = await supabase.from('experiencias').upsert(experiencias, { onConflict: 'id' });
  console.log('Experiencias:', e1 ? '❌ ' + e1.message : '✅ 5 insertadas/actualizadas');

  const { error: e2 } = await supabase.from('hacedores').upsert(hacedores, { onConflict: 'id' });
  console.log('Hacedores:   ', e2 ? '❌ ' + e2.message : '✅ 5 insertados/actualizados');

  const { error: e3 } = await supabase.from('mapa_cultural').upsert(mapa, { onConflict: 'id' });
  console.log('Mapa cultural:', e3 ? '❌ ' + e3.message : '✅ 8 puntos insertados/actualizados');

  // Verificar totales
  const [{ count: c1 }, { count: c2 }, { count: c3 }] = await Promise.all([
    supabase.from('experiencias').select('*', { count: 'exact', head: true }),
    supabase.from('hacedores').select('*', { count: 'exact', head: true }),
    supabase.from('mapa_cultural').select('*', { count: 'exact', head: true }),
  ]);

  console.log('\n📊 Estado final de la base de datos:');
  console.log('  experiencias:', c1, 'filas');
  console.log('  hacedores:   ', c2, 'filas');
  console.log('  mapa_cultural:', c3, 'filas');
  console.log('\n🎉 Seed completado exitosamente!');
}

seed().catch(console.error);
