import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/overview", "/about", "/docs", "/credits"],
        disallow: ["/settings", "/api/", "/login", "/register"],
      },
    ],
    sitemap: "https://nexusai.my.id/sitemap.xml",
  };
}
