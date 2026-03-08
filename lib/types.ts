export type Experience = {
    id: string;
    title: string;
    slug: string;
    type: "experience";
    category: string;
    shortDescription: string;
    neighborhood: string;
    duration: string;
    lat: number;
    lng: number;
    coverImage: string;
};

export type AudioPoint = {
    id: string;
    title: string;
    slug: string;
    type: "audio";
    category: string;
    shortDescription: string;
    narrator: string;
    lat: number;
    lng: number;
    coverImage: string;
    audioUrl: string;
};

export type MapItem = Experience | AudioPoint;
