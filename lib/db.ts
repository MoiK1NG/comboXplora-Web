import { supabase, isSupabaseConfigured } from './supabase';
import { Experience, AudioPoint, MapItem } from './types';
import { experiences as staticExperiences, audioPoints as staticAudioPoints } from './map-data';
import staticHacedores from '../data/hacedores.json';
import staticMapItems from '../data/mapa-cultural.json';

// Interfaces for our dynamic objects matching the application types
export interface HacedorData {
  id: string;
  name: string;
  slug: string;
  profileImage: string;
  coverImage: string;
  category: string;
  neighborhood: string;
  shortDescription: string;
  fullStory: string;
  gallery: string[];
  instagram: string;
  whatsapp: string;
  specialties: string[];
  experiences: string[];
  isActive: boolean;
}

// ----------------------------------------------------
// MAPPER UTILITIES
// ----------------------------------------------------

const mapExperienceRow = (row: any): Experience => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  type: 'experience',
  categories: Array.isArray(row.categories) ? row.categories : (row.category ? [row.category] : []),
  shortDescription: row.short_description || '',
  neighborhood: row.neighborhood || '',
  locationLabel: row.location || '',
  meetingPoint: row.meeting_point || '',
  duration: row.duration || '',
  lat: typeof row.coordinates === 'object' && row.coordinates ? Number(row.coordinates.lat) : 10.9850,
  lng: typeof row.coordinates === 'object' && row.coordinates ? Number(row.coordinates.lng) : -74.7820,
  coverImage: row.image || '',
  fullDescription: row.full_description || '',
  includes: Array.isArray(row.includes) ? row.includes : [],
  whatToExpect: Array.isArray(row.what_to_expect) ? row.what_to_expect : [],
  recommendations: Array.isArray(row.recommendations) ? row.recommendations : [],
  gallery: Array.isArray(row.gallery) ? row.gallery : [],
  isActive: row.is_active !== false,
  isFeatured: row.is_featured === true,
});

const mapHacedorRow = (row: any): HacedorData => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  profileImage: row.profile_image || '',
  coverImage: row.cover_image || '',
  category: row.category || '',
  neighborhood: row.neighborhood || '',
  shortDescription: row.short_description || '',
  fullStory: row.full_story || '',
  gallery: Array.isArray(row.gallery) ? row.gallery : [],
  instagram: row.instagram || '',
  whatsapp: row.whatsapp || '',
  specialties: Array.isArray(row.specialties) ? row.specialties : [],
  experiences: Array.isArray(row.experiences) ? row.experiences : [],
  isActive: row.is_active !== false,
});

const mapMapItemRow = (row: any): MapItem => ({
  id: row.id,
  title: row.title,
  slug: row.slug || '',
  type: (row.type as 'experience' | 'audio') || 'experience',
  categories: Array.isArray(row.categories) ? row.categories : (row.category ? [row.category] : []),
  shortDescription: row.description || '',
  neighborhood: row.neighborhood || '',
  locationLabel: row.location_label || row.location || '',
  meetingPoint: row.meeting_point || '',
  duration: row.duration || '',
  lat: typeof row.coordinates === 'object' && row.coordinates ? Number(row.coordinates.lat) : 10.9850,
  lng: typeof row.coordinates === 'object' && row.coordinates ? Number(row.coordinates.lng) : -74.7820,
  coverImage: row.image || '',
  tags: Array.isArray(row.tags) ? row.tags : [],
  narrator: row.narrator || '',
  audioUrl: row.audio_url || '',
  isActive: row.is_active !== false,
});

// ----------------------------------------------------
// READ OPERATIONS (WITH STATIC FALLBACK)
// ----------------------------------------------------

export async function fetchExperiences(opts?: { includeInactive?: boolean }): Promise<Experience[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Falling back to local static experiences.');
    return staticExperiences;
  }

  try {
    let query = supabase.from('experiencias').select('*').order('created_at', { ascending: true });
    if (!opts?.includeInactive) query = query.eq('is_active', true);

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return staticExperiences;

    return data.map(mapExperienceRow);
  } catch (err) {
    console.error('Failed to fetch experiences from Supabase. Falling back to static JSON.', err);
    return staticExperiences;
  }
}

export async function fetchExperienceBySlug(slug: string): Promise<Experience | null> {
  if (!isSupabaseConfigured()) {
    return staticExperiences.find((e) => e.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('experiencias')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    if (!data) return staticExperiences.find((e) => e.slug === slug) || null;

    return mapExperienceRow(data);
  } catch (err) {
    console.error(`Failed to fetch experience [${slug}] from Supabase. Falling back to static JSON.`, err);
    return staticExperiences.find((e) => e.slug === slug) || null;
  }
}

export async function fetchHacedores(opts?: { includeInactive?: boolean }): Promise<HacedorData[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Falling back to local static hacedores.');
    return (staticHacedores as any[]).map(h => ({ ...h, isActive: true }));
  }

  try {
    let query = supabase.from('hacedores').select('*').order('created_at', { ascending: true });
    if (!opts?.includeInactive) query = query.eq('is_active', true);

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return (staticHacedores as any[]).map(h => ({ ...h, isActive: true }));

    return data.map(mapHacedorRow);
  } catch (err) {
    console.error('Failed to fetch hacedores from Supabase. Falling back to static JSON.', err);
    return (staticHacedores as any[]).map(h => ({ ...h, isActive: true }));
  }
}

export async function fetchHacedorBySlug(slug: string): Promise<HacedorData | null> {
  if (!isSupabaseConfigured()) {
    return (staticHacedores as HacedorData[]).find((h) => h.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('hacedores')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    if (!data) return (staticHacedores as HacedorData[]).find((h) => h.slug === slug) || null;

    return mapHacedorRow(data);
  } catch (err) {
    console.error(`Failed to fetch hacedor [${slug}] from Supabase. Falling back to static JSON.`, err);
    return (staticHacedores as HacedorData[]).find((h) => h.slug === slug) || null;
  }
}

export async function fetchMapPoints(opts?: { includeInactive?: boolean }): Promise<MapItem[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Falling back to local static map items.');
    return (staticMapItems as any[]).map(i => ({ ...i, isActive: true }));
  }

  try {
    let query = supabase.from('mapa_cultural').select('*');
    if (!opts?.includeInactive) query = query.eq('is_active', true);

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return (staticMapItems as any[]).map(i => ({ ...i, isActive: true }));

    return data.map(mapMapItemRow);
  } catch (err) {
    console.error('Failed to fetch map items from Supabase. Falling back to static JSON.', err);
    return (staticMapItems as any[]).map(i => ({ ...i, isActive: true }));
  }
}

export async function fetchAudioPoints(): Promise<AudioPoint[]> {
  // Safe helper to extract and map audio items from the mapa_cultural schema
  const items = await fetchMapPoints();
  return items
    .filter((item) => item.type === 'audio')
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      type: 'audio',
      categories: item.categories,
      shortDescription: item.shortDescription,
      narrator: item.narrator || 'Narrador Local',
      lat: item.lat,
      lng: item.lng,
      coverImage: item.coverImage,
      audioUrl: item.audioUrl || '',
    }));
}
