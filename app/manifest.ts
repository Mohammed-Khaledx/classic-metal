import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Classic Metal — تسعير فوري للألوميتال",
    short_name: "Classic Metal",
    description: "تسعير فوري للمطابخ والشبابيك بالمتر المربع — Classic Metal للألوميتال",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050c14",
    theme_color: "#050c14",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
