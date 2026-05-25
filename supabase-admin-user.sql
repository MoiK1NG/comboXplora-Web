-- ================================================================
-- ComboXplora — Crear / Resetear usuario administrador
-- ================================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
--
-- Este script:
--   1. Verifica si el usuario ya existe
--   2. Si existe → actualiza contraseña y confirma el email
--   3. Si no existe → crea el usuario completo con email confirmado
--
-- CONTRASEÑA RESULTANTE: Admin.Combo2024!
-- (Cámbiala inmediatamente después de entrar al panel)
-- ================================================================

DO $$
DECLARE
  v_uid  UUID;
  v_email TEXT := 'admin@comboxplora.com';
  v_pass  TEXT := 'Admin.Combo2024!';
BEGIN

  -- ── 1. Buscar si el usuario ya existe ─────────────────────────
  SELECT id INTO v_uid
  FROM auth.users
  WHERE email = v_email;

  -- ── 2a. Usuario YA existe → actualizar contraseña y confirmar email
  IF v_uid IS NOT NULL THEN

    UPDATE auth.users SET
      encrypted_password  = crypt(v_pass, gen_salt('bf')),
      email_confirmed_at  = COALESCE(email_confirmed_at, NOW()),
      updated_at          = NOW()
    WHERE id = v_uid;

    RAISE NOTICE '✅ Usuario ACTUALIZADO: % (id: %)', v_email, v_uid;
    RAISE NOTICE '🔑 Contraseña reseteada a: %', v_pass;

  -- ── 2b. Usuario NO existe → crear desde cero ──────────────────
  ELSE

    v_uid := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      v_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_pass, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      false,
      NOW(),
      NOW(),
      '', '', '', ''
    );

    -- Crear identity (necesario para que Supabase reconozca el provider)
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_uid,
      jsonb_build_object('sub', v_uid::text, 'email', v_email),
      'email',
      v_email,
      NOW(),
      NOW(),
      NOW()
    );

    RAISE NOTICE '✅ Usuario CREADO: % (id: %)', v_email, v_uid;
    RAISE NOTICE '🔑 Contraseña: %', v_pass;

  END IF;

END $$;

-- ================================================================
-- VERIFICACIÓN — debe mostrar el usuario con email_confirmed_at
-- ================================================================
SELECT
  id,
  email,
  CASE
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ SIN confirmar'
  END AS estado_email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'admin@comboxplora.com';
