import { Navbar } from "@/components/ui/Navbar";
import { SystemsNominal } from "@/components/sections/SystemsNominal";

export default function SkillsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-background">
        <SystemsNominal />
      </main>
    </>
  );
}
