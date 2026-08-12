import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://classicmetal.vercel.app";
  const routes = [
    "",
    "/calc/window",
    "/calc/kitchen",
    "/quotes",
    "/settings",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
