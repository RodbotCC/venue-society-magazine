"use client";

import { Reveal } from "@/components/Reveal";
import { Overline } from "@/components/Overline";
import { ShaderField } from "@/components/ui/shader-field";
import { useUI } from "@/i18n/ui";
import { Monogram } from "@/components/brand/Monogram";
import Image from "next/image";

export function Podcast() {
  const ui = useUI();
  return (
    <section id="podcast" className="relative overflow-hidden bg-cream py-20 lg:py-24">
      <ShaderField
        className="absolute inset-0"
        uniforms={{ seed: 15, scale: 1.7, intensity: 0.38, drift: 0.008 }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(244,236,224,0.82), rgba(244,236,224,0.62))",
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10">
        <div className="flex flex-col items-center gap-10 rounded-[3px] border border-line bg-ivory p-10 text-center lg:flex-row lg:gap-16 lg:p-14 lg:text-left">
          <Reveal className="shrink-0">
            <div className="relative h-44 w-44 lg:h-52 lg:w-52">
              <div className="shadow-editorial relative h-full w-full overflow-hidden rounded-full ring-1 ring-gold-soft ring-offset-4 ring-offset-ivory">
                <Image
                  src="/editorial/microphone.jpg"
                  alt="A gilt studio microphone among garden roses"
                  fill
                  sizes="208px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-1 -bottom-1 flex h-14 w-14 items-center justify-center rounded-full bg-ivory shadow-editorial ring-1 ring-gold-soft">
                <Monogram height={30} tone="gold" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <Overline numeral="VI">{ui.podcast.eyebrow}</Overline>
              <h2 className="font-display mt-4 text-[clamp(2rem,3.8vw,3rem)] font-light leading-[1.05] text-ink">
                {ui.podcast.title}
              </h2>
              <p className="mt-4 max-w-xl text-ink-soft">{ui.podcast.body}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.28em] text-gold">
                {ui.podcast.coming}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
