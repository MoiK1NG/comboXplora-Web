import { Experience, AudioPoint } from "./types";

export const experiences: Experience[] = [
    {
        id: "exp-1",
        title: "Legado de Matronas – Dulces tradicionales",
        slug: "legado-de-matronas",
        type: "experience",
        category: "Gastronomía",
        shortDescription: "Aprende el arte de los dulces típicos con las matronas de la región.",
        neighborhood: "Barrio Abajo",
        duration: "2 horas",
        lat: 10.9850,
        lng: -74.7820,
        coverImage: "/imagenes/experiencias/dulces.jpg"
    },
    {
        id: "exp-2",
        title: "Taller creativo de máscaras del Carnaval",
        slug: "taller-mascaras-carnaval",
        type: "experience",
        category: "Arte",
        shortDescription: "Crea tu propia máscara tradicional del Carnaval de Barranquilla.",
        neighborhood: "San Roque",
        duration: "3 horas",
        lat: 10.9750,
        lng: -74.7800,
        coverImage: "/imagenes/experiencias/mascaras.jpg"
    },
    {
        id: "exp-3",
        title: "Taller de turbantes afrocaribeños",
        slug: "taller-turbantes",
        type: "experience",
        category: "Moda y Tradición",
        shortDescription: "Descubre el significado y la técnica detrás de los turbantes afro.",
        neighborhood: "El Bosque",
        duration: "2 horas",
        lat: 10.9500,
        lng: -74.8050,
        coverImage: "/imagenes/experiencias/turbantes.jpg"
    },
    {
        id: "exp-4",
        title: "Macondo en Barranquilla – recorrido literario",
        slug: "macondo-recorrido-literario",
        type: "experience",
        category: "Cultura",
        shortDescription: "Sigue los pasos de Gabriel García Márquez por la ciudad.",
        neighborhood: "Centro",
        duration: "4 horas",
        lat: 10.9785,
        lng: -74.7813,
        coverImage: "/imagenes/experiencias/macondo.jpg"
    },
    {
        id: "exp-5",
        title: "Cultura Picotera – experiencia musical",
        slug: "cultura-picotera",
        type: "experience",
        category: "Música",
        shortDescription: "Siente el bajo y los ritmos de los picós tradicionales.",
        neighborhood: "Rebolo",
        duration: "3 horas",
        lat: 10.9650,
        lng: -74.7750,
        coverImage: "/imagenes/experiencias/picotera.jpg"
    }
];

export const audioPoints: AudioPoint[] = [
    {
        id: "ap-1",
        title: "Historia de Barrio Abajo",
        slug: "historia-barrio-abajo",
        type: "audio",
        category: "Historia",
        shortDescription: "Conoce el corazón cultural y cuna del Carnaval.",
        narrator: "Juan B. Fernández",
        lat: 10.9860,
        lng: -74.7830,
        coverImage: "/imagenes/audios/barrio-abajo.jpg",
        audioUrl: "/audios/barrio-abajo.mp3"
    },
    {
        id: "ap-2",
        title: "Memoria del Picó",
        slug: "memoria-del-pico",
        type: "audio",
        category: "Música",
        shortDescription: "La revolución del sonido en las calles barranquilleras.",
        narrator: "Dj El Gran Freddy",
        lat: 10.9660,
        lng: -74.7760,
        coverImage: "/imagenes/audios/pico.jpg",
        audioUrl: "/audios/pico.mp3"
    },
    {
        id: "ap-3",
        title: "Relatos de las Matronas",
        slug: "relatos-matronas",
        type: "audio",
        category: "Gastronomía",
        shortDescription: "Historias de vida y sabor a través de generaciones.",
        narrator: "Doña Lidia",
        lat: 10.9840,
        lng: -74.7810,
        coverImage: "/imagenes/audios/matronas.jpg",
        audioUrl: "/audios/matronas.mp3"
    }
];
