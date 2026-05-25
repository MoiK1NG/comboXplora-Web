import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (proyecto ComboXplora)
      {
        protocol: "https",
        hostname: "pjmmidxdolzfvafzfvnh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Imágenes externas comunes
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Mejor manejo de errores TypeScript en producción
  typescript: {
    ignoreBuildErrors: false,
  },

  // Desactivar indicador de desarrollo
  devIndicators: false,
};

export default nextConfig;
