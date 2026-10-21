"use client";

import { Reveal } from "@/components/Reveal";
import { Overline } from "@/components/Overline";
import { Button } from "@/components/Button";
import { useUI } from "@/i18n/ui";
import { Plate } from "@/components/Plate";

export function FeatureYourVenue() {
  const ui = useUI();
  return (
    <section
      id="feature-your-venue"
      className="grain relative overflow-hidden bg-espresso py-24 text-ivory lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 20%, rgba(201,174,126,0.16) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        <div>
          <Reveal>
            <Overline numeral="III">{ui.forVenues.eyebrow}</Overline>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-6 text-[clamp(2.4rem,4.5vw,3.8rem)] font-light leading-[1.04]">
              {ui.forVenues.titlePre}
              <span className="foil-light italic">
                {ui.forVenues.titleEmph}
              </span>
              {ui.forVenues.titlePost}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/75">
              {ui.forVenues.lead}
            </p>
          </Reveal>
          <Reveal delay={0.25} y={24}>
            <ul className="mt-10 max-w-md divide-y divide-ivory/15 border-y border-ivory/15">
              {ui.forVenues.includes.map((item) => (
                <li key={item} className="flex items-start gap-4 py-5">
                  <span className="font-display mt-0.5 text-xl leading-none text-gold-soft">
                    ✦
                  </span>
                  <span className="text-ivory/90">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10">
              <Button href="#contact" variant="light">
                {ui.forVenues.cta}
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={40}>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* gilt offset frame behind the portrait */}
            <div className="pointer-events-none absolute -inset-4 translate-x-4 translate-y-4 border border-gold-soft/40" />
            <Plate
              src="/editorial/bride.jpg"
              alt="A bride beneath a candlelit chandelier in a historic hall"
              ratio="4 / 5"
              sizes="(max-width: 1024px) 90vw, 560px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
