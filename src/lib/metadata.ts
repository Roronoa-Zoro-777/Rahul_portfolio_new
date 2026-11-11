import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const pageTitle = `${title} | Rahul B`;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description,
      url: new URL(path, SITE_URL).toString(),
      siteName: "Rahul B Portfolio",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}
