-- ═══════════════════════════════════════════════════════════════
-- Página propia por evento, inscripción (Luma u otro) y aviso al
-- organizador al aprobar. Correr una vez en Supabase → SQL Editor.
-- Requiere haber corrido antes supabase-eventos-mapa.sql.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE eventos ADD COLUMN IF NOT EXISTS slug                        text;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS link_inscripcion            text;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS aviso_aprobacion_enviado_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS eventos_slug_unique ON eventos (slug) WHERE slug IS NOT NULL;

-- Los eventos que ya estaban aprobados reciben su slug (nombre + 4 caracteres del id),
-- igual al que genera el admin. Los nuevos lo reciben al aprobarse.
UPDATE eventos
SET slug = trim(both '-' from regexp_replace(
             translate(lower(coalesce(nombre_evento, 'evento')),
                       'áéíóúüñàèìòùâêîôûç', 'aeiouunaeiouaeiouc'),
             '[^a-z0-9]+', '-', 'g'))
           || '-' || left(replace(id::text, '-', ''), 4)
WHERE status = 'aprobado' AND slug IS NULL;

-- La vista pública suma el slug y el enlace de inscripción.
-- Sigue sin exponer email, teléfono ni nombre del responsable.
CREATE OR REPLACE VIEW eventos_publicos AS
SELECT
  id,
  slug,
  nombre_evento,
  tipo_evento,
  descripcion,
  fecha,
  hora_inicio,
  hora_fin,
  direccion,
  link_maps,
  link_inscripcion,
  tipo_espacio,
  nombre_lugar,
  wifi,
  accesible,
  parqueadero,
  banos,
  categorias,
  imagen,
  lat,
  lng
FROM eventos
WHERE status = 'aprobado'
  AND lat IS NOT NULL
  AND lng IS NOT NULL
  AND fecha IS NOT NULL;

GRANT SELECT ON eventos_publicos TO anon, authenticated;
