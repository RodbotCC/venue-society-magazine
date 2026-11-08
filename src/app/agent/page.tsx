import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { VenueQuest } from "@/components/agent/VenueQuest";

export const metadata: Metadata = {
  title: "Agent · Venue Quest — Venue Society",
  description: "Roteiro de ligação para a equipe Venue Society.",
  robots: { index: false, follow: false },
};

export default function AgentPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory">
        <VenueQuest />
      </main>
      <Footer />
    </>
  );
}
