"use client";

import ContactForm from "@/components/portfolio/contact-form";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="px-4 sm:px-8 md:px-10 pt-16 pb-12 md:pb-32 -mt-[40vh] sm:-mt-[25vh]"
    >
      <div className="relative flex flex-col items-center rounded-md bg-portfolio-contact-gradient border border-white/10 shadow-lg overflow-hidden px-4 pt-7 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-portfolio-contact-radial"
        />

        <h2 className="max-w-[15ch] text-center text-balance text-[clamp(64px,9vw,144px)] font-semibold uppercase leading-[0.9] tracking-tighter text-portfolio-surface-foreground">
          Let’s Make It Happen
        </h2>

        <div className="w-full sm:max-w-[36rem] mx-auto my-5 sm:my-10 px-4 sm:px-10 py-6 md:py-12 xl:px-14 rounded-2xl backdrop-blur-sm border surface-portfolio-contact-form">
          <p className="text-center text-xl sm:text-2xl lg:text-3xl font-medium mb-8 text-stone-200 tracking-tight">
            Have a project in mind?
          </p>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
