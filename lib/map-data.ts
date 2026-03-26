import { Experience, AudioPoint } from "./types";

export const experiences: Experience[] = [
    {
        id: "exp-1",
        title: "Legado de Matronas – Dulces tradicionales",
        slug: "dulces",
        type: "experience",
        categories: ["Gastronomía", "Comunidad"],
        shortDescription: "Aprende el arte de los dulces típicos con las matronas de la región.",
        neighborhood: "Barrio Abajo",
        locationLabel: "Casa de las Matronas",
        meetingPoint: "Plaza de la Aduana (10 min caminando)",
        duration: "2 horas",
        lat: 10.9850,
        lng: -74.7820,
        coverImage: "/images/authentic/portada_dulces.jpg",
        gallery: [
            "/images/experiencias/dulces/gallery/1.jpg",
            "/images/experiencias/dulces/gallery/2.jpg",
            "/images/experiencias/dulces/gallery/3.jpg",
            "/images/experiencias/dulces/gallery/4.jpg"
        ],
        fullDescription: "Sumérgete en el corazón de Barrio Abajo y descubre los secretos custodiados por generaciones de matronas. En esta experiencia sensorial, aprenderás la alquimia de transformar frutas locales en joyas dulces, mientras escuchas relatos sobre la resiliencia y alegría de nuestra gente.",
        includes: [
            "Degustación de dulces típicos",
            "Materiales para el taller",
            "Recetario digital",
            "Souvenir artesanal"
        ],
        whatToExpect: [
            "Taller práctico guiado por una matrona local",
            "Historia del dulce tradicional en Barranquilla",
            "Ambiente familiar y acogedor",
            "Música folclórica de fondo"
        ],
        recommendations: [
            "Ropa cómoda",
            "Protección solar si vienes temprano",
            "Cámara para fotos increíbles",
            "Mucha disposición de aprender"
        ]
    },
    {
        id: "exp-2",
        title: "Taller creativo de máscaras del Carnaval",
        slug: "mascaras",
        type: "experience",
        categories: ["Arte"],
        shortDescription: "Crea tu propia máscara tradicional del Carnaval de Barranquilla.",
        neighborhood: "San Roque",
        locationLabel: "Taller del Maestro Artesano",
        meetingPoint: "Iglesia de San Roque",
        duration: "3 horas",
        lat: 10.9750,
        lng: -74.7800,
        coverImage: "/images/authentic/portada_mascaras.jpg",
        gallery: [
            "/images/experiencias/mascaras/gallery/1.jpg",
            "/images/experiencias/mascaras/gallery/2.jpg",
            "/images/experiencias/mascaras/gallery/3.jpg",
            "/images/experiencias/mascaras/gallery/4.jpg"
        ],
        fullDescription: "El Carnaval no es solo baile, es un legado visual. En el histórico barrio de San Roque, artesanos maestros te enseñarán a moldear y pintar las icónicas máscaras de Galapa y el Congo. Una oportunidad única para conectar con la simbología de nuestra fiesta más grande.",
        includes: [
            "Moldes de barro y papel maché",
            "Pinturas y pinceles",
            "Certificado de participación",
            "Snack tradicional"
        ],
        whatToExpect: [
            "Explicación sobre el significado de cada personaje",
            "Técnicas de modelado tradicional",
            "Espacio creativo compartido con otros exploradores",
            "Charla con el maestro artesano"
        ],
        recommendations: [
            "Delantal o ropa que se pueda manchar",
            "Puntualidad para aprovechar el secado",
            "Creatividad al máximo"
        ]
    },
    {
        id: "exp-3",
        title: "Taller de turbantes afrocaribeños",
        slug: "turbantes",
        type: "experience",
        categories: ["Moda y Tradición", "Arte", "Comunidad"],
        shortDescription: "Descubre el significado y la técnica detrás de los turbantes afro.",
        neighborhood: "El Bosque",
        locationLabel: "Centro Comunitario Afro",
        meetingPoint: "Parque Metropolitano",
        duration: "2 horas",
        lat: 10.9500,
        lng: -74.8050,
        coverImage: "/images/authentic/portada_turbantes.jpg",
        gallery: [
            "/images/experiencias/turbantes/gallery/1.jpg",
            "/images/experiencias/turbantes/gallery/2.jpg",
            "/images/experiencias/turbantes/gallery/3.jpg",
            "/images/experiencias/turbantes/gallery/4.jpg"
        ],
        fullDescription: "El turbante es corona, identidad y resistencia. En este taller aprenderás no solo los complejos amarres que realzan la belleza caribeña, sino también la historia de comunicación y empoderamiento que estas telas guardan. Una experiencia de reafirmación cultural.",
        includes: [
            "Tela de alta calidad para el taller",
            "Modelado de amarres",
            "Historia de la estética afrocaribeña",
            "Refrigerio"
        ],
        whatToExpect: [
            "Demostración de diferentes estilos de amarre",
            "Práctica personalizada frente al espejo",
            "Conversatorio sobre la herencia africana en el Caribe",
            "Sesión de fotos con tu turbante"
        ],
        recommendations: [
            "Espejo personal pequeño (opcional)",
            "Interés por la historia sociocultural"
        ]
    },
    {
        id: "exp-4",
        title: "Macondo en Barranquilla – recorrido literario",
        slug: "macondo",
        type: "experience",
        categories: ["Cultura", "Literatura"],
        shortDescription: "Sigue los pasos de Gabriel García Márquez por la ciudad.",
        neighborhood: "Centro",
        locationLabel: "Recorrido a pie",
        meetingPoint: "Edificio de la Antigua Aduana",
        duration: "4 horas",
        lat: 10.9785,
        lng: -74.7813,
        coverImage: "/images/authentic/portada_macondo.jpg",
        gallery: [
            "/images/experiencias/macondo/gallery/1.jpg",
            "/images/experiencias/macondo/gallery/2.jpg",
            "/images/experiencias/macondo/gallery/3.jpg",
            "/images/experiencias/macondo/gallery/4.jpg"
        ],
        fullDescription: "Barranquilla fue el laboratorio creativo de Gabo. Recorre los lugares que inspiraron pasajes de 'Cien años de soledad' y 'El amor en los tiempos del cólera'. Desde la antigua redacción del Heraldo hasta la Cueva, revive la atmósfera que dio vida al Realismo Mágico.",
        includes: [
            "Guía especializado en literatura",
            "Mapa del recorrido 'Gabo en BQ'",
            "Entrada a sitios históricos",
            "Café en un lugar icónico"
        ],
        whatToExpect: [
            "Caminata por el centro histórico",
            "Lectura de fragmentos literarios en sitios clave",
            "Anecdotario del Grupo de Barranquilla",
            "Conexión entre la realidad y la ficción"
        ],
        recommendations: [
            "Calzado cómodo para caminar",
            "Hidratación constante",
            "Sombrero o gorra",
            "Haber leído algo de Gabo es un plus!"
        ]
    },
    {
        id: "exp-5",
        title: "Cultura Picotera – experiencia musical",
        slug: "picotera",
        type: "experience",
        categories: ["Música", "Comunidad"],
        shortDescription: "Siente el bajo y los ritmos de los picós tradicionales.",
        neighborhood: "Rebolo",
        locationLabel: "Patio Picotero",
        meetingPoint: "Estadio Moderno Julio Torres",
        duration: "3 horas",
        lat: 10.9650,
        lng: -74.7750,
        coverImage: "/images/authentic/portada_picos.jpg",
        gallery: [
            "/images/experiencias/picotera/gallery/1.jpg",
            "/images/experiencias/picotera/gallery/2.jpg",
            "/images/experiencias/picotera/gallery/3.jpg",
            "/images/experiencias/picotera/gallery/4.jpg"
        ],
        fullDescription: "El Picó es el centro de gravedad del barrio barranquillero. Entiende esta imponente máquina de sonido desde su arte gráfico hasta su ingeniería sonora. Conoce a los pinchadiscos emblemáticos y déjate llevar por la champeta, la salsa y los ritmos africanos que solo suenan aquí.",
        includes: [
            "Visita a un taller de decoración de picós",
            "Demostración de sonido potente",
            "Clase básica de baile de champeta",
            "Una bebida fría típica"
        ],
        whatToExpect: [
            "Vibración sonora real (alto volumen)",
            "Encuentro con artistas del 'pincel picotero'",
            "Historia de la música africana en el Caribe",
            "Mucha alegría y ritmo"
        ],
        recommendations: [
            "Disposición para bailar",
            "Oídos listos para la potencia",
            "Ropa ligera"
        ]
    }
];

export const audioPoints: AudioPoint[] = [
    {
        id: "ap-1",
        title: "Historia de Barrio Abajo",
        slug: "historia-barrio-abajo",
        type: "audio",
        categories: ["Historia", "Comunidad"],
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
        categories: ["Música", "Comunidad"],
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
        categories: ["Gastronomía", "Historia"],
        shortDescription: "Historias de vida y sabor a través de generaciones.",
        narrator: "Doña Lidia",
        lat: 10.9840,
        lng: -74.7810,
        coverImage: "/imagenes/audios/matronas.jpg",
        audioUrl: "/audios/matronas.mp3"
    }
];
