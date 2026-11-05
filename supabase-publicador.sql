-- ================================================================
-- ComboXplora — Publicador automático de Instagram (Vercel)
-- ================================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- Es idempotente: se puede correr más de una vez sin romper nada.
--
-- publicador_ajustes: una sola fila con el modo del publicador.
--   APAGADO   → no hace nada.
--   ENSAYO    → avisa qué habría publicado, sin publicar.
--   ENCENDIDO → publica en @comboxplora lo aprobado con fecha de hoy.
-- publicador_registro: una fila por corrida.
-- ================================================================

CREATE TABLE IF NOT EXISTS publicador_ajustes (
  id              INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  modo            TEXT NOT NULL DEFAULT 'ENSAYO'
                  CHECK (modo IN ('APAGADO', 'ENSAYO', 'ENCENDIDO')),
  actualizado_por TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Arranca en ENSAYO: el publicador de la computadora sigue siendo el que publica
-- hasta que se pase este a ENCENDIDO y se apague la tarea local.
INSERT INTO publicador_ajustes (id, modo, actualizado_por)
VALUES (1, 'ENSAYO', 'supabase-publicador.sql')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS publicador_registro (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  modo        TEXT NOT NULL,
  resumen     TEXT NOT NULL,
  detalle     JSONB
);

CREATE INDEX IF NOT EXISTS idx_publicador_registro_fecha ON publicador_registro(created_at DESC);

-- RLS: el admin autenticado lee y cambia; la función del servidor usa la service role.
ALTER TABLE publicador_ajustes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicador_registro ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin all publicador_ajustes" ON publicador_ajustes;
CREATE POLICY "Admin all publicador_ajustes" ON publicador_ajustes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read publicador_registro" ON publicador_registro;
CREATE POLICY "Admin read publicador_registro" ON publicador_registro
  FOR SELECT TO authenticated USING (true);

-- Verificación
SELECT * FROM publicador_ajustes;
