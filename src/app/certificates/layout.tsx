import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Certificates",
  "View Rahul B's data analytics and technology certificates.",
  "/certificates",
);

export default function CertificatesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
