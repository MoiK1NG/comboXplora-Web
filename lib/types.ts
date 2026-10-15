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

export type MapItemType = 'experience' | 'evento' | 'audio' | 'relato';

export type EventAmenities = {
  wifi?: string;
  accesible?: string;
  parqueadero?: string;
  banos?: string;
};

export type MapItem = {
  id: string;
  title: string;
  slug: string;
  type: MapItemType;
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
  // Solo eventos de la comunidad
  eventDate?: string;      // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  eventKind?: string;      // tipo_evento del formulario
  venueName?: string;
  address?: string;
  mapsUrl?: string;
  amenities?: EventAmenities;
};

// ─────────────────────────────────────────────
// EVENTOS (Google Form → Apps Script → Supabase)
// ─────────────────────────────────────────────

export type EventoStatus = 'nuevo' | 'aprobado' | 'rechazado';

export type EventoRow = {
  id: string;
  email_respondente: string | null;
  nombre_evento: string | null;
  tipo_evento: string | null;
  descripcion: string | null;
  fecha_evento: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  direccion: string | null;
  link_maps: string | null;
  nombre_responsable: string | null;
  email_contacto: string | null;
  telefono: string | null;
  tipo_espacio: string | null;
  nombre_lugar: string | null;
  wifi: string | null;
  accesible: string | null;
  parqueadero: string | null;
  banos: string | null;
  detalles_adicionales: string | null;
  acepta_promocion: string | null;
  status: EventoStatus | string;
  admin_notes: string | null;
  created_at: string;
  lat: number | null;
  lng: number | null;
  fecha: string | null;
  categorias: string[] | null;
  imagen: string | null;
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
