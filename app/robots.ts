import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings", "/quotes"],
    },
    sitemap: "https://classicmetal.vercel.app/sitemap.xml",
  };
}
