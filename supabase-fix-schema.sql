-- ================================================================
-- ComboXplora — FIX: Columnas is_active + Políticas RLS
-- ================================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
--
-- Este script corrige:
--  1. Agrega columnas is_active / is_featured si no existen
--  2. Configura políticas RLS para que el admin pueda ocultar/mostrar
-- ================================================================

-- ── 1. Columnas is_active en cada tabla ──────────────────────────

ALTER TABLE experiencias
  ADD COLUMN IF NOT EXISTS is_active  BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE hacedores
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE mapa_cultural
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Marcar todos los registros existentes como activos
UPDATE experiencias  SET is_active = true WHERE is_active IS NULL;
UPDATE hacedores     SET is_active = true WHERE is_active IS NULL;
UPDATE mapa_cultural SET is_active = true WHERE is_active IS NULL;

-- ── 2. Habilitar RLS ──────────────────────────────────────────────

ALTER TABLE experiencias  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacedores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapa_cultural ENABLE ROW LEVEL SECURITY;

-- ── 3. Políticas para experiencias ──────────────────────────────

-- El público puede leer solo activos
DROP POLICY IF EXISTS "Público: leer activas" ON experiencias;
CREATE POLICY "Público: leer activas" ON experiencias
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR auth.role() = 'authenticated');

-- El admin (autenticado) puede insertar, actualizar y eliminar
DROP POLICY IF EXISTS "Admin: todo" ON experiencias;
CREATE POLICY "Admin: todo" ON experiencias
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── 4. Políticas para hacedores ──────────────────────────────────

DROP POLICY IF EXISTS "Público: leer activos" ON hacedores;
CREATE POLICY "Público: leer activos" ON hacedores
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin: todo" ON hacedores;
CREATE POLICY "Admin: todo" ON hacedores
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── 5. Políticas para mapa_cultural ──────────────────────────────

DROP POLICY IF EXISTS "Público: leer activos" ON mapa_cultural;
CREATE POLICY "Público: leer activos" ON mapa_cultural
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin: todo" ON mapa_cultural;
CREATE POLICY "Admin: todo" ON mapa_cultural
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── 6. Verificación ──────────────────────────────────────────────
SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name IN ('experiencias', 'hacedores', 'mapa_cultural')
  AND column_name IN ('is_active', 'is_featured')
ORDER BY table_name, column_name;
