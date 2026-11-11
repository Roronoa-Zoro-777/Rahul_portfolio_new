import {
  ArrowUpRight,
  Envelope,
  GithubLogo,
  LinkedinLogo,
  MapPin,
  Phone,
} from "@phosphor-icons/react/dist/ssr";
import { Navbar } from "@/components/ui/Navbar";
import { ContactForm } from "@/components/ui/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="skills-section flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10">
          <div className="text-center">
            <h1 className="font-sans text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Get in <span className="text-accent">Touch</span>
            </h1>
            <p className="mt-3 font-sans text-base text-zinc-400 md:text-lg">
              Feel free to reach out for collaborations or opportunities.
            </p>
          </div>

          <ContactForm />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="mailto:rahulbavigadda2004@gmail.com"
              aria-label="Send an email to Rahul"
              className="contact-glass group flex flex-col items-start gap-2 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.04] hover:bg-white/[0.12] hover:border-white/40 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.8)]"
            >
              <span className="flex items-center gap-2 font-sans text-sm font-bold text-white transition-colors group-hover:text-accent">
                <Envelope size={20} weight="duotone" className="text-[#EA4335]" />
                Email
                <ArrowUpRight size={12} weight="bold" className="ml-1 inline-block align-baseline" />
              </span>
              <span className="break-all text-left font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                rahulbavigadda2004@gmail.com
              </span>
            </a>

            <a
              href="tel:+917975455934"
              aria-label="Call Rahul"
              className="contact-glass group flex flex-col items-start gap-2 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.04] hover:bg-white/[0.12] hover:border-white/40 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.8)]"
            >
              <span className="flex items-center gap-2 font-sans text-sm font-bold text-white transition-colors group-hover:text-accent">
                <Phone size={20} weight="duotone" className="text-[#22C55E]" />
                Phone
                <ArrowUpRight size={12} weight="bold" className="ml-1 inline-block align-baseline" />
              </span>
              <span className="text-left font-mono text-xs font-bold tracking-[0.08em] text-zinc-300">
                +91 7975455934
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/rahul-b-5780ba354/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Rahul's LinkedIn Profile"
              className="contact-glass group flex flex-col items-start gap-2 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.04] hover:bg-white/[0.12] hover:border-white/40 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.8)]"
            >
              <span className="flex items-center gap-2 font-sans text-sm font-bold text-white transition-colors group-hover:text-accent">
                <LinkedinLogo size={20} weight="duotone" className="text-[#0A66C2]" />
                LinkedIn
                <ArrowUpRight size={12} weight="bold" className="ml-1 inline-block align-baseline" />
              </span>
              <span className="break-all text-left font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                rahul-b-5780ba354
              </span>
            </a>

            <a
              href="https://github.com/Roronoa-Zoro-777"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Rahul's GitHub Profile"
              className="contact-glass group flex flex-col items-start gap-2 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.04] hover:bg-white/[0.12] hover:border-white/40 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.8)]"
            >
              <span className="flex items-center gap-2 font-sans text-sm font-bold text-white transition-colors group-hover:text-accent">
                <GithubLogo size={20} weight="duotone" className="text-[#F5F5F5]" />
                GitHub
                <ArrowUpRight size={12} weight="bold" className="ml-1 inline-block align-baseline" />
              </span>
              <span className="break-all text-left font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                Roronoa-Zoro-777
              </span>
            </a>

            <div className="contact-glass flex flex-col items-start gap-2 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.04] hover:bg-white/[0.12] hover:border-white/40 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.8)]">
              <span className="flex items-center gap-2 font-sans text-sm font-bold text-white">
                <MapPin size={20} weight="duotone" className="text-[#EF4444]" />
                Location
              </span>
              <span className="text-left font-mono text-xs font-bold uppercase tracking-[0.12em] text-zinc-300">
                Bangalore | Karnataka | India
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
