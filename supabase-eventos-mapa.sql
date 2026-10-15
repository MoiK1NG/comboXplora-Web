-- ═══════════════════════════════════════════════════════════════
-- Eventos de la comunidad en el Mapa Cultural
-- Correr una vez en Supabase → SQL Editor. Es idempotente.
-- ═══════════════════════════════════════════════════════════════

-- 1. Columnas que completa el admin al aprobar
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS lat        double precision;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS lng        double precision;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS fecha      date;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS categorias text[] NOT NULL DEFAULT '{}';
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS imagen     text;

-- 2. Seguridad: la política anterior "FOR ALL USING (true)" dejaba a
--    cualquiera con la anon key leer, editar y borrar eventos con
--    datos personales. Se reemplaza por acceso solo para el admin.
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on eventos"   ON eventos;
DROP POLICY IF EXISTS "Service role full access eventos"      ON eventos;
DROP POLICY IF EXISTS "Admin read eventos"                    ON eventos;
DROP POLICY IF EXISTS "Admin update eventos"                  ON eventos;
DROP POLICY IF EXISTS "Admin delete eventos"                  ON eventos;

-- Apps Script (service role) inserta; bypasea RLS igual, la dejamos explícita
CREATE POLICY "Service role full access eventos"
  ON eventos FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Admin logueado
CREATE POLICY "Admin read eventos"
  ON eventos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin update eventos"
  ON eventos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete eventos"
  ON eventos FOR DELETE TO authenticated USING (true);

-- Sin política para anon: el público no lee la tabla directamente.

-- 3. Vista pública: solo eventos aprobados y solo columnas sin datos
--    personales (sin email, teléfono ni nombre del responsable).
CREATE OR REPLACE VIEW eventos_publicos AS
SELECT
  id,
  nombre_evento,
  tipo_evento,
  descripcion,
  fecha,
  hora_inicio,
  hora_fin,
  direccion,
  link_maps,
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
