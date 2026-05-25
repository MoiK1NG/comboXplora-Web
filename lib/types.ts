// ─────────────────────────────────────────────
// ENTIDADES PÚBLICAS
// ─────────────────────────────────────────────

export type Experience = {
  id: string;
  title: string;
  slug: string;
  type: 'experience';
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
  isFeatured?: boolean;
  isActive?: boolean;
};

export type AudioPoint = {
  id: string;
  title: string;
  slug: string;
  type: 'audio';
  categories: string[];
  shortDescription: string;
  narrator: string;
  lat: number;
  lng: number;
  coverImage: string;
  audioUrl: string;
};

export type MapItem = {
  id: string;
  title: string;
  slug: string;
  type: 'experience' | 'audio' | 'relato';
  categories: string[];
  shortDescription: string;
  neighborhood: string;
  locationLabel?: string;
  meetingPoint?: string;
  duration?: string;
  lat: number;
  lng: number;
  coverImage: string;
  tags?: string[];
  narrator?: string;
  audioUrl?: string;
  isActive?: boolean;
};

// ─────────────────────────────────────────────
// RELATOS
// ─────────────────────────────────────────────

export type RelatoType = 'escrito' | 'audio' | 'video';

export type Relato = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  narrator?: string;
  categories: string[];
  neighborhood?: string;
  lat?: number;
  lng?: number;
  coverImage?: string;
  gallery?: string[];
  audioUrl?: string;
  videoUrl?: string;
  type: RelatoType;
  tags?: string[];
  linkedHacedorId?: string;
  showOnMap?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
};

// ─────────────────────────────────────────────
// FORMULARIOS (vistas admin)
// ─────────────────────────────────────────────

export type ContactoStatus = 'nuevo' | 'leido' | 'respondido';

export type FormularioContacto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: string;
  status: ContactoStatus;
  adminNotes?: string;
  createdAt: string;
};

export type PostulacionStatus = 'nueva' | 'revisada' | 'aprobada' | 'rechazada';

export type Postulacion = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  neighborhood?: string;
  experienceType?: string;
  experienceTitle?: string;
  experienceDescription?: string;
  whyJoin?: string;
  socialLinks?: string;
  status: PostulacionStatus;
  adminNotes?: string;
  createdAt: string;
};

export type EmpresaStatus = 'nuevo' | 'revisado' | 'contactado' | 'cerrado' | 'descartado';

export type EmpresaInteresada = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  interestType?: string;
  message?: string;
  numPeople?: number;
  preferredDate?: string;
  budgetRange?: string;
  status: EmpresaStatus;
  adminNotes?: string;
  createdAt: string;
};

// ─────────────────────────────────────────────
// PAYLOADS API
// ─────────────────────────────────────────────

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type PostulacionPayload = {
  name: string;
  email: string;
  phone?: string;
  neighborhood?: string;
  experience_type?: string;
  experience_title?: string;
  experience_description?: string;
  why_join?: string;
  social_links?: string;
};

export type EmpresaPayload = {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  interest_type?: string;
  message?: string;
  num_people?: number;
  preferred_date?: string;
  budget_range?: string;
};
