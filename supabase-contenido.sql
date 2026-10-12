-- ================================================================
-- ComboXplora — Parrilla de contenido (máquina de contenido Instagram)
-- ================================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- Es idempotente: se puede correr más de una vez sin romper nada.
--
-- Una fila = una pieza, desde la idea hasta la publicación medida.
-- Dos puntos de aprobación humana:
--   1. tema_propuesto  → producir   (aprueba el tema)
--   2. pieza_propuesta → aprobada   (aprueba la publicación)
-- Nada se publica en Instagram si no está en "aprobada".
-- ================================================================

CREATE TABLE IF NOT EXISTS contenido_piezas (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Qué es
  titulo             TEXT NOT NULL,
  pilar              TEXT NOT NULL
                     CHECK (pilar IN ('xplorers', 'hacedores', 'empresas', 'notoriedad')),
  formato            TEXT
                     CHECK (formato IN ('carrusel', 'reel', 'imagen', 'historia')),
  estado             TEXT NOT NULL DEFAULT 'idea'
                     CHECK (estado IN (
                       'idea',             -- en la lista (radar o carga manual)
                       'tema_propuesto',   -- el selector lo propone: espera aprobación 1
                       'producir',         -- tema aprobado
                       'borrador',         -- el productor escribió la pieza
                       'auditado',         -- el editor jefe no encontró bloqueantes
                       'pieza_propuesta',  -- caption y visual listos: espera aprobación 2
                       'aprobada',         -- lista para publicar
                       'publicada',
                       'descartada'
                     )),
  origen             TEXT NOT NULL DEFAULT 'manual'
                     CHECK (origen IN ('manual', 'radar', 'selector')),

  -- Relación con el contenido del sitio (opcional)
  hacedor_id         TEXT REFERENCES hacedores(id)    ON DELETE SET NULL,
  experiencia_id     TEXT REFERENCES experiencias(id) ON DELETE SET NULL,

  -- Radar: de dónde salió la idea
  fuente_url         TEXT,
  fuente_fecha       DATE,
  hueco              TEXT,

  -- Selector: por qué esta y no otra
  nota               NUMERIC(3,1) CHECK (nota >= 0 AND nota <= 10),
  motivo             TEXT,

  -- Producción
  fecha_programada   DATE,
  borrador           TEXT,
  auditoria          TEXT,
  gancho             TEXT,
  caption            TEXT,
  assets             TEXT[] DEFAULT '{}',

  -- Aprobaciones
  tema_aprobado_at   TIMESTAMPTZ,
  pieza_aprobada_at  TIMESTAMPTZ,
  aprobado_por       TEXT,

  -- Publicación y medición
  ig_media_id        TEXT,
  ig_permalink       TEXT,
  publicada_at       TIMESTAMPTZ,
  metricas           JSONB,
  metricas_at        TIMESTAMPTZ,

  notas_admin        TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contenido_estado ON contenido_piezas(estado);
CREATE INDEX IF NOT EXISTS idx_contenido_pilar  ON contenido_piezas(pilar);
CREATE INDEX IF NOT EXISTS idx_contenido_fecha  ON contenido_piezas(fecha_programada);

-- updated_at automático
CREATE OR REPLACE FUNCTION contenido_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contenido_updated_at ON contenido_piezas;
CREATE TRIGGER trg_contenido_updated_at
  BEFORE UPDATE ON contenido_piezas
  FOR EACH ROW EXECUTE FUNCTION contenido_touch_updated_at();

-- RLS: solo el admin autenticado. El público no lee nada de esta tabla.
ALTER TABLE contenido_piezas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin all contenido_piezas" ON contenido_piezas;
CREATE POLICY "Admin all contenido_piezas" ON contenido_piezas
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verificación
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'contenido_piezas'
ORDER BY ordinal_position;
