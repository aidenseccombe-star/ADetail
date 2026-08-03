import type { MetadataRoute } from "next";

import { servicesCatalog } from "@/lib/site-config";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/consultation", priority: 0.7, changeFrequency: "monthly" },
    { path: "/fleet", priority: 0.7, changeFrequency: "monthly" },
    { path: "/sign-in", priority: 0.3, changeFrequency: "monthly" },
    { path: "/sign-up", priority: 0.3, changeFrequency: "monthly" },
    ...servicesCatalog.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
