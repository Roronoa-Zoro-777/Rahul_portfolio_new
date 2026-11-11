"use client";

import { useState, type FormEvent } from "react";

type SubmissionState =
  | { status: "idle"; message: string }
  | { status: "sending"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const formEndpoint = "https://formspree.io/f/moedaljw";

export function ContactForm() {
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    setSubmission({ status: "sending", message: "Sending your message..." });

    try {
      const response = await fetch(
        formEndpoint,
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        },
      );

      if (!response.ok) {
        setSubmission({
          status: "error",
          message: "Your message could not be sent. Please try again or email me directly.",
        });
        return;
      }

      form.reset();
      setSubmission({
        status: "success",
        message: "Thanks — your message has been sent.",
      });
    } catch {
      setSubmission({
        status: "error",
        message: "A network error prevented delivery. Please email me directly.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="contact-glass grid gap-5 rounded-3xl p-6 md:grid-cols-2 md:p-8"
      aria-describedby="contact-form-status"
    >
      <label className="grid gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white/80">
        Name
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 font-sans text-base font-normal normal-case tracking-normal text-white outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <label className="grid gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white/80">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 font-sans text-base font-normal normal-case tracking-normal text-white outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <label className="grid gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white/80 md:col-span-2">
        Message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className="resize-y rounded-xl border border-white/20 bg-black/30 px-4 py-3 font-sans text-base font-normal normal-case tracking-normal text-white outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <div className="flex flex-col items-start gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={submission.status === "sending"}
          className="rounded-full border border-accent/40 bg-accent/15 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submission.status === "sending" ? "Sending..." : "Send message"}
        </button>
        <p
          id="contact-form-status"
          role={submission.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className="text-sm text-zinc-300"
        >
          {submission.message}
        </p>
      </div>
    </form>
  );
}
