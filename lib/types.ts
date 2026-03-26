export type Experience = {
    id: string;
    title: string;
    slug: string;
    type: "experience";
    categories: string[];
    shortDescription: string;
    neighborhood: string;
    locationLabel?: string;
    meetingPoint?: string;
    duration: string;
    lat: number;
    lng: number;
    coverImage: string;
    fullDescription: string;
    includes: string[];
    whatToExpect: string[];
    recommendations: string[];
    gallery?: string[];
};

export type AudioPoint = {
    id: string;
    title: string;
    slug: string;
    type: "audio";
    categories: string[];
    shortDescription: string;
    narrator: string;
    lat: number;
    lng: number;
    coverImage: string;
    audioUrl: string;
};

export type MapItem = Experience | AudioPoint;
