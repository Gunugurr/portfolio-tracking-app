import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // turbopack.root = proje dizini: bu sayede asset ID'leri "ü" içermeyen göreli yollarla oluşur.
  // Olmadan Turbopack, C:\Users\gunug'dan itibaren "Masaüstü" içeren path string kuruyor ve panic yapıyor.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
