// ─── Venue Quest — the venue-outreach call, as a live scorecard ───────────────
// Same skeleton as the Command Center's Call Quest (17 NEPQ-style modules in 5
// stages: Connection · Discovery · Transition · Presentation · Commitment), with
// the questions written for VENUE owners/managers. Two modes:
//   partner   → the feature AND Comeketo as preferred caterer
//   editorial → the feature only (pure editorial pitch)
// Scoring: +10 question · +20 module hit · +30 stage cleared · +50 discovery
// first (5+ Discovery ticks before the first Presentation tick) · −20 per trap.

export type Mode = "partner" | "editorial";
export type Q = { id: string; en: string; pt: string; field?: CardField };
export type Module = { n: number; id: string; name: string; tip: string; qs: Q[]; modes?: Mode[] };
export type Stage = { id: string; name: string; icon: string; modules: Module[] };
export type CardField =
  | "contact" | "role" | "phone" | "email" | "capacity" | "eventsPerMonth" | "seasons"
  | "vendorPolicy" | "leadSources" | "pains" | "tried" | "interest" | "nextStep" | "nextDate";

const Q = (id: string, en: string, pt: string, field?: CardField): Q => ({ id, en, pt, field });

export const STAGES: Stage[] = [
  { id: "connection", name: "Connection", icon: "🤝", modules: [
    { n: 1, id: "connection", name: "Connection", tip: "Low pressure. Say who we are in one breath, ask permission, let them talk first.", qs: [
      Q("c1", "Hi, this is ___ with Venue Society Magazine, the editorial annual that profiles one New England venue a month. Do you have two minutes, or is there a better time?",
              "Oi, aqui é ___ da Venue Society Magazine, a revista anual que apresenta um espaço de eventos da Nova Inglaterra por mês. Tem dois minutos, ou prefere outro horário?"),
      Q("c2", "Before I tell you anything about the magazine, can I ask a few quick questions to see if your venue is even a fit for an issue? Fair?",
              "Antes de falar da revista, posso te fazer umas perguntas rápidas pra ver se o seu espaço faz sentido pra uma edição? Pode ser?"),
      Q("c3", "Who's the right person for how the venue gets booked and promoted, is that you?",
              "Quem cuida de como o espaço é reservado e divulgado, é você?", "role"),
      Q("c4", "How did you end up running a venue? What's the story of the place?",
              "Como você foi parar à frente de um espaço de eventos? Qual é a história do lugar?"),
    ] },
  ] },
  { id: "discovery", name: "Discovery", icon: "🔎", modules: [
    { n: 2, id: "situation", name: "Situation", tip: "Map the business before offering anything. Numbers go on the card.", qs: [
      Q("s1", "Roughly how many events do you host a month, and what kind: weddings, corporate, parties?",
              "Mais ou menos quantos eventos vocês recebem por mês, e de que tipo: casamentos, corporativos, festas?", "eventsPerMonth"),
      Q("s2", "What's your capacity, seated and standing?", "Qual é a capacidade, sentados e em pé?", "capacity"),
      Q("s3", "Which months are packed and which ones are quiet for you?", "Quais meses lotam e quais ficam parados?", "seasons"),
      Q("s4", "How do you handle food: in-house kitchen, a preferred caterer list, or open to any vendor?",
              "Como funciona a comida: cozinha própria, lista de buffets preferidos, ou aberto a qualquer fornecedor?", "vendorPolicy"),
      Q("s5", "Where do most of your bookings come from today: referrals, The Knot, Instagram, walk-ins?",
              "De onde vem a maior parte das reservas hoje: indicação, The Knot, Instagram, quem passa na porta?", "leadSources"),
    ] },
    { n: 3, id: "problem", name: "Problem Awareness", tip: "Let THEM name what is hard. Don't supply it.", qs: [
      Q("p1", "What's the hardest part of keeping the calendar full right now?", "Qual é a parte mais difícil de manter a agenda cheia hoje?", "pains"),
      Q("p2", "When a date sits empty, what usually happened: not enough inquiries, the wrong kind, or they didn't convert?",
              "Quando uma data fica vazia, o que costuma ter acontecido: poucos contatos, o tipo errado, ou não fecharam?", "pains"),
      Q("p3", "What do you see go wrong with vendors on event day that you'd love to never deal with again?",
              "O que você vê dar errado com fornecedores no dia do evento que gostaria de nunca mais lidar?", "pains"),
    ] },
    { n: 4, id: "solution", name: "Solution Awareness", tip: "Prior attempts → ideal future → what it means to them.", qs: [
      Q("v1", "What have you tried to get more of the right bookings, and what was missing?",
              "O que você já tentou pra ter mais reservas do tipo certo, e o que faltou?", "tried"),
      Q("v2", "If next year's calendar looked exactly the way you want, what would it look like?",
              "Se a agenda do ano que vem fosse exatamente como você quer, como seria?"),
      Q("v3", "What would a full off-season mean for the business, and for you?",
              "O que uma baixa temporada cheia significaria pro negócio, e pra você?"),
    ] },
    { n: 5, id: "consequence", name: "Consequence", tip: "Cost of doing nothing. Calm tone, their numbers.", qs: [
      Q("q1", "If the quiet months stay quiet next year, what does that cost you, roughly?",
              "Se os meses parados continuarem parados ano que vem, quanto isso custa, mais ou menos?"),
      Q("q2", "What happens to the venue's reputation when a vendor shows up unprepared on a client's big day?",
              "O que acontece com a reputação do espaço quando um fornecedor aparece despreparado no grande dia do cliente?"),
    ] },
    { n: 6, id: "probing", name: "Clarifying Probing", tip: "One layer deeper on whatever they just said.", qs: [
      Q("d1", "When you say ___, what do you mean by that?", "Quando você fala ___, o que você quer dizer?"),
      Q("d2", "Why is that important to you?", "Por que isso é importante pra você?"),
      Q("d3", "How does that affect you personally, as the person running this?", "E como isso te afeta pessoalmente, como quem toca isso?"),
    ] },
  ] },
  { id: "transition", name: "Transition", icon: "🌉", modules: [
    { n: 7, id: "transition", name: "Transition", tip: "Summary in their words → want → permission. Earn the pitch.", qs: [
      Q("t1", "So you host about ___ events a month, ___ is your slow stretch, and what matters most is ___. Did I get that right?",
              "Então são uns ___ eventos por mês, ___ é a época parada, e o mais importante é ___. Entendi certo?"),
      Q("t2", "Is that the kind of thing you'd want more of: the right couples and companies finding you before the date is gone?",
              "É isso que você gostaria de ter mais: os casais e empresas certos te achando antes da data sumir?"),
      Q("t3", "Would it help if I walked you through how a feature in the magazine works, built around that?",
              "Ajudaria se eu te mostrasse como funciona a matéria na revista, pensando nisso?"),
    ] },
  ] },
  { id: "presentation", name: "Presentation", icon: "📰", modules: [
    { n: 8, id: "structure", name: "Structure Clarity", tip: "Roadmap first: what the feature is, what we need, what happens after.", qs: [
      Q("r1", "Three parts: what the feature is, what I'd need from you, and what happens after it runs. Sound good?",
              "Três partes: o que é a matéria, o que eu precisaria de você, e o que acontece depois que ela sai. Pode ser?"),
    ] },
    { n: 9, id: "mapper", name: "Solution Mapper", tip: "Problem → feature → benefit, in THEIR words.", qs: [
      Q("m1", "You said ___ months are quiet. The feature is a full editorial profile of the venue, with photography and your story, in a printed annual placed in the hands of people actively planning, plus the venue page and Odette, our concierge, routing them to you online.",
              "Você falou que ___ fica parado. A matéria é um perfil editorial completo do espaço, com fotos e a história de vocês, numa revista anual entregue na mão de quem está planejando, mais a página do espaço e a Odette, nossa concierge, direcionando pra você online."),
      Q("m2", "From you I'd need a 30-minute visit for photos and the interview, and one contact for the couples we send.",
              "De você eu precisaria de uma visita de 30 minutos pra fotos e entrevista, e um contato pra quem a gente enviar."),
    ] },
    { n: 10, id: "partner", name: "Preferred Caterer", tip: "Partner mode only. Offer, don't push. Comeketo is the magazine's catering partner.", modes: ["partner"], qs: [
      Q("k1", "One more thing, only if it fits: Comeketo Catering is the magazine's catering partner, Brazilian BBQ and full-service. Venues on our preferred list get our couples sent with catering already solved. How do you usually add a caterer to your list?",
              "Mais uma coisa, só se fizer sentido: a Comeketo Catering é o buffet parceiro da revista, churrasco brasileiro e serviço completo. Espaços na nossa lista preferida recebem nossos casais já com o buffet resolvido. Como vocês costumam incluir um buffet na lista?", "vendorPolicy"),
      Q("k2", "Would a tasting for your team be the right way to evaluate that, no strings?",
              "Uma degustação pra sua equipe seria o jeito certo de avaliar isso, sem compromisso?"),
    ] },
    { n: 11, id: "detachment", name: "Detachment Pressure", tip: "Options, not a hard sell. Nothing is mandatory.", qs: [
      Q("e1", "These are just options. Anything that doesn't fit, we leave out.", "Isso são só opções. O que não encaixar, a gente deixa de fora."),
    ] },
    { n: 12, id: "buyin", name: "Buy-in Checks", tip: "Pause every 3-4 sentences for a reaction.", qs: [
      Q("b1", "How does that land so far?", "Como isso soa até aqui?"),
      Q("b2", "What would you want the feature to say about the place?", "O que você gostaria que a matéria dissesse sobre o lugar?"),
    ] },
  ] },
  { id: "commitment", name: "Commitment", icon: "🏁", modules: [
    { n: 13, id: "ask", name: "Ask Next Step", tip: "Two options, conditional. Always a date.", qs: [
      Q("a1", "If it makes sense, the next step is either booking the 30-minute visit, or I send the media kit and we talk on a set day. Which works better?",
              "Se fizer sentido, o próximo passo é marcar a visita de 30 minutos, ou eu mando o material e a gente conversa num dia marcado. Qual funciona melhor?", "nextStep"),
    ] },
    { n: 14, id: "objection", name: "Objection Handling", tip: "Acknowledge → isolate → root cause. Then resolve.", qs: [
      Q("o1", "That makes sense. What specifically would you want to compare or check?", "Faz sentido. O que exatamente você quer comparar ou checar?"),
      Q("o2", "Besides ___, is there anything else that would hold you back?", "Tirando ___, tem mais alguma coisa que te seguraria?"),
    ] },
    { n: 15, id: "decision", name: "Decision Process", tip: "Who, how, by when. Then summarize it back.", qs: [
      Q("g1", "Who else weighs in on something like this, and how do you usually decide?", "Quem mais opina numa coisa dessas, e como vocês costumam decidir?", "role"),
    ] },
    { n: 16, id: "stall", name: "Stall Prevention", tip: "\"Let me think\" → find out WHAT before you accept it.", qs: [
      Q("l1", "Of course. What exactly do you want to think through?", "Claro. O que exatamente você quer pensar melhor?"),
    ] },
    { n: 17, id: "reask", name: "Re-Ask Closing", tip: "Exact day + time + purpose. Close the loop.", qs: [
      Q("z1", "So: I send ___, you look it over, and we talk ___ at ___ to decide. Deal?",
              "Então: eu te mando ___, você dá uma olhada, e a gente se fala ___ às ___ pra decidir. Combinado?", "nextDate"),
    ] },
  ] },
];

export const TRAPS = [
  { id: "early_pitch", label: "Pitched the magazine before discovery" },
  { id: "monologue", label: "Talked 4+ sentences without a check-in" },
  { id: "comeketo_early", label: "Brought up Comeketo before the feature landed" },
  { id: "send_email", label: "Accepted \"just send me an email\" without a date" },
  { id: "stall_ok", label: "Accepted \"let me think\" without asking what" },
];

export const OUTCOMES = ["Visita marcada", "Material enviado + data", "Quer pensar (data marcada)", "Sem interesse", "Ligar de volta", "Caixa postal"];

export const CARD_FIELDS: { key: CardField; label: string }[] = [
  { key: "contact", label: "Contato" }, { key: "role", label: "Cargo / decide" }, { key: "phone", label: "Telefone" }, { key: "email", label: "E-mail" },
  { key: "capacity", label: "Capacidade" }, { key: "eventsPerMonth", label: "Eventos / mês" }, { key: "seasons", label: "Temporadas" },
  { key: "vendorPolicy", label: "Fornecedores" }, { key: "leadSources", label: "De onde vêm reservas" }, { key: "pains", label: "Dores (palavras deles)" },
  { key: "tried", label: "Já tentou" }, { key: "interest", label: "Interesse" }, { key: "nextStep", label: "Próximo passo" }, { key: "nextDate", label: "Quando" },
];

const PTS = { question: 10, module: 20, stage: 30, discoveryFirst: 50, trap: -20 };
const DISCOVERY_MIN = 5;
export const LEVELS = [
  { min: 0, name: "Rookie" }, { min: 500, name: "Scout" }, { min: 1500, name: "Editor" },
  { min: 3500, name: "Publisher" }, { min: 7000, name: "Society" }, { min: 12000, name: "Legend" },
];

export function modulesFor(mode: Mode) {
  return STAGES.flatMap((s) => s.modules.filter((m) => !m.modes || m.modes.includes(mode)).map((m) => ({ ...m, stage: s.id })));
}
export type Tick = { id: string; at: number };
export type Score = ReturnType<typeof scoreCall>;

export function scoreCall(call: { ticks?: Tick[]; traps?: string[] }, mode: Mode) {
  const MODULES = modulesFor(mode);
  const index: Record<string, { module: string; stage: string }> = {};
  for (const m of MODULES) for (const q of m.qs) index[q.id] = { module: m.id, stage: m.stage };
  const ticks = (call.ticks || []).filter((t) => index[t.id]);
  const traps = (call.traps || []).filter((id) => TRAPS.some((t) => t.id === id));
  const hit = new Set(ticks.map((t) => index[t.id].module));
  const stages = STAGES.map((s) => {
    const mods = s.modules.filter((m) => !m.modes || m.modes.includes(mode));
    const h = mods.filter((m) => hit.has(m.id)).length;
    return { id: s.id, name: s.name, hit: h, total: mods.length, cleared: h === mods.length };
  });
  const firstPitch = ticks.findIndex((t) => index[t.id].stage === "presentation");
  const before = firstPitch === -1 ? ticks : ticks.slice(0, firstPitch);
  const discoveryFirst = firstPitch !== -1 && before.filter((t) => index[t.id].stage === "discovery").length >= DISCOVERY_MIN;
  const breakdown = { questions: ticks.length * PTS.question, modules: hit.size * PTS.module, stages: stages.filter((s) => s.cleared).length * PTS.stage, discoveryFirst: discoveryFirst ? PTS.discoveryFirst : 0, traps: traps.length * PTS.trap };
  const points = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const coverage = Math.round((hit.size / MODULES.length) * 100);
  const missed = MODULES.filter((m) => !hit.has(m.id)).map((m) => ({ n: m.n, name: m.name }));
  return { points, breakdown, coverage, grade: grade(coverage), stages, discoveryFirst, modulesHit: hit.size, missed, traps };
}
export function grade(pct: number) {
  return pct >= 90 ? "A" : pct >= 80 ? "A-" : pct >= 70 ? "B" : pct >= 60 ? "B-" : pct >= 50 ? "C+" : pct >= 40 ? "C" : "D";
}
export function levelFor(total: number) {
  let i = 0; while (i + 1 < LEVELS.length && total >= LEVELS[i + 1].min) i++;
  const next = LEVELS[i + 1];
  return { name: LEVELS[i].name, next: next ? next.name : null, toNext: next ? next.min - total : 0 };
}
export function summaryText(venue: string, mode: Mode, card: Partial<Record<CardField, string>>, outcome: string, score: Score) {
  const f = (k: CardField) => (card[k] || "").trim();
  return [
    `${venue}${f("contact") ? " · " + f("contact") : ""}${f("role") ? " (" + f("role") + ")" : ""}`,
    f("eventsPerMonth") || f("capacity") ? `${f("eventsPerMonth") ? f("eventsPerMonth") + " eventos/mês" : ""}${f("capacity") ? " · cap. " + f("capacity") : ""}` : "",
    f("seasons") ? `Temporada: ${f("seasons")}` : "", f("vendorPolicy") ? `Fornecedores: ${f("vendorPolicy")}` : "",
    f("pains") ? `Dores: ${f("pains")}` : "", f("interest") ? `Interesse: ${f("interest")}` : "",
    `Desfecho: ${outcome || "—"}${f("nextStep") ? " · " + f("nextStep") : ""}${f("nextDate") ? " · " + f("nextDate") : ""}`,
    `Modo ${mode === "editorial" ? "editorial" : "parceiro Comeketo"} · nota ${score.grade} (${score.coverage}%)`,
  ].filter(Boolean).join("\n");
}
export const AGENT_ENDPOINT = "https://comeketo-command-center.onrender.com/public/venue-call";
