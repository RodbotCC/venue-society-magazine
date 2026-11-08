"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { venues } from "@/data/venues";
import { cn } from "@/lib/cn";
import { useLocale } from "@/i18n/LanguageProvider";
import {
  STAGES, TRAPS, OUTCOMES, CARD_FIELDS, AGENT_ENDPOINT,
  scoreCall, summaryText, levelFor, modulesFor,
  type Mode, type Tick, type CardField,
} from "@/lib/venue-quest";

type Card = Partial<Record<CardField, string>>;
type Call = {
  id: string; venue: string; mode: Mode; startedAt: number; endedAt?: number;
  ticks: Tick[]; traps: string[]; notes: Record<string, string>; card: Card; outcome: string; points?: number; grade?: string; sent?: boolean;
};

const T = {
  en: { agent: "Agent", area: "Team area. Enter the PIN.", enter: "Enter", title: "The right call, with the right questions.", intro: "Pick the venue and the conversation mode, then follow the questions. Answers become the venue card and go to Slack", intro2: "when you finish.",
    ended: "Call ended", grade: "grade", pts: "pts", sentSlack: "Sent to Slack #venue_society.", archivedOnly: "Archived in the Command Center. Slack is not configured on the server yet (token).", sendFail: "Could not reach the server. The call is saved on this device; use Copy summary.", archiving: "Archiving…", copy: "Copy summary", reopen: "Reopen and resend", newCall: "New call",
    prepare: "Prepare", venue: "Venue", venuePh: "Venue name", featured: "already featured", mode: "Conversation mode", partner: "🍖 Comeketo partner", partnerD: "Feature + Comeketo as preferred caterer", editorial: "📰 Pure editorial", editorialD: "The magazine feature only", start: "Start call", level: "Level", toNext: "to", called: "We've called this venue before", noOutcome: "no outcome",
    history: "History", noHistory: "No calls on this device yet.", onCall: "On the call", partnerShort: "Comeketo partner", editorialShort: "editorial", showPt: "EN · show PT", hidePt: "PT · hide PT", card: "Venue card", traps: "Traps", outcome: "Outcome", missed: "Missed:", finish: "Finish & send to Slack", sending: "Sending…", discard: "Discard", discardQ: "Discard this call?", previous: "Previous calls", notePh: "Note (optional)", answerPh: "Answer → card: ", back: "Back to Venue Society" },
  pt: { agent: "Agente", area: "Área da equipe. Digite o PIN.", enter: "Entrar", title: "A ligação certa, com as perguntas certas.", intro: "Escolha o espaço e o modo da conversa, e siga as perguntas. As respostas viram a ficha do espaço e vão para o Slack", intro2: "ao terminar.",
    ended: "Ligação encerrada", grade: "nota", pts: "pts", sentSlack: "Enviado para o Slack #venue_society.", archivedOnly: "Arquivado no Command Center. O Slack ainda não está configurado no servidor (token).", sendFail: "Não consegui enviar ao servidor. A ligação ficou salva neste aparelho; use Copiar resumo.", archiving: "Arquivando…", copy: "Copiar resumo", reopen: "Reabrir e reenviar", newCall: "Nova ligação",
    prepare: "Preparar", venue: "Espaço (venue)", venuePh: "Nome do espaço", featured: "já destacado", mode: "Modo da conversa", partner: "🍖 Parceiro Comeketo", partnerD: "Matéria + Comeketo como buffet preferido", editorial: "📰 Editorial puro", editorialD: "Só a matéria na revista", start: "Começar ligação", level: "Nível", toNext: "para", called: "Já ligamos pra este espaço", noOutcome: "sem desfecho",
    history: "Histórico", noHistory: "Nenhuma ligação ainda neste aparelho.", onCall: "Em ligação", partnerShort: "parceiro Comeketo", editorialShort: "editorial", showPt: "EN · ver PT", hidePt: "PT · esconder", card: "Ficha do espaço", traps: "Armadilhas", outcome: "Desfecho", missed: "Faltou:", finish: "Encerrar e enviar ao Slack", sending: "Enviando…", discard: "Descartar", discardQ: "Descartar esta ligação?", previous: "Ligações anteriores", notePh: "Nota (opcional)", answerPh: "Resposta → ficha: ", back: "Voltar à Venue Society" },
};
const PIN = process.env.NEXT_PUBLIC_AGENT_PIN || "2026";
const LS = { pin: "vs-agent-ok", hist: "vs-agent-history", draft: "vs-agent-draft" };
const uid = () => "vq_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const load = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };

export function VenueQuest() {
  const { locale } = useLocale();
  const t = locale === "pt" ? T.pt : T.en;
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState("");
  const [hist, setHist] = useState<Call[]>([]);
  const [call, setCall] = useState<Call | null>(null);
  const [showPt, setShowPt] = useState(false);
  const [venueInput, setVenueInput] = useState("");
  const [mode, setMode] = useState<Mode>("partner");
  const [stageIdx, setStageIdx] = useState(0);
  const [sending, setSending] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [slackOk, setSlackOk] = useState<boolean | null>(null);
  const tickRef = useRef<HTMLDivElement>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  useEffect(() => { if (!focusId) return; const el = document.getElementById("note-" + focusId) as HTMLInputElement | null; el?.focus({ preventScroll: true }); setFocusId(null); }, [focusId]);

  useEffect(() => { setShowPt(locale === "pt"); }, [locale]);
  useEffect(() => {
    setOk(load(LS.pin, false));
    setHist(load<Call[]>(LS.hist, []));
    const d = load<Call | null>(LS.draft, null); if (d) { setCall(d); setMode(d.mode); }
  }, []);
  useEffect(() => { if (call) save(LS.draft, call); else try { localStorage.removeItem(LS.draft); } catch {} }, [call]);

  const score = useMemo(() => (call ? scoreCall(call, call.mode) : null), [call]);
  const total = useMemo(() => hist.reduce((a, c) => a + (c.points || 0), 0), [hist]);
  const level = levelFor(total);
  const prevCalls = useMemo(() => (call ? hist.filter((h) => h.venue.toLowerCase() === call.venue.toLowerCase()) : []), [hist, call]);

  if (!ok) {
    return (
      <div className="mx-auto max-w-sm px-6 py-32 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold">{t.agent}</p>
        <h1 className="font-display mt-3 text-4xl font-light text-ink">Venue Quest</h1>
        <p className="mt-3 text-ink-soft">{t.area}</p>
        <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (pin === PIN) { save(LS.pin, true); setOk(true); } else setPin(""); }}>
          <input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" autoFocus className="w-full rounded-[2px] border border-line bg-white px-4 py-3 text-center text-lg tracking-[0.5em]" placeholder="••••" />
          <button className="rounded-[2px] bg-ink px-6 text-[0.72rem] uppercase tracking-[0.26em] text-ivory">{t.enter}</button>
        </form>
      </div>
    );
  }

  function start() {
    const v = venueInput.trim(); if (!v) return;
    setCall({ id: uid(), venue: v, mode, startedAt: Date.now(), ticks: [], traps: [], notes: {}, card: {}, outcome: "" });
    setStageIdx(0); setSending("idle"); setSlackOk(null);
  }
  function tick(qid: string, field?: CardField) {
    if (!call) return;
    const has = call.ticks.some((t) => t.id === qid);
    setCall({ ...call, ticks: has ? call.ticks.filter((t) => t.id !== qid) : [...call.ticks, { id: qid, at: Date.now() }] });
    if (!has && field) setFocusId(qid);
  }
  function note(qid: string, text: string, field?: CardField) {
    if (!call) return;
    const card = { ...call.card }; if (field && text.trim()) card[field] = text.trim();
    setCall({ ...call, notes: { ...call.notes, [qid]: text }, card });
  }
  function trap(id: string) { if (!call) return; setCall({ ...call, traps: call.traps.includes(id) ? call.traps.filter((t) => t !== id) : [...call.traps, id] }); }
  function setCardField(k: CardField, v: string) { if (!call) return; setCall({ ...call, card: { ...call.card, [k]: v } }); }

  async function finish() {
    if (!call || !score) return;
    setSending("sending");
    const modules = modulesFor(call.mode);
    const notes = modules.flatMap((m) => m.qs.filter((q) => (call.notes[q.id] || "").trim()).map((q) => ({ q: q.en, a: call.notes[q.id] })));
    const done: Call = { ...call, endedAt: Date.now(), points: score.points, grade: score.grade };
    const payload = { id: call.id, venue: call.venue, mode: call.mode, outcome: call.outcome, card: call.card, score: { grade: score.grade, coverage: score.coverage, points: score.points, missed: score.missed }, traps: call.traps, notes, summary: summaryText(call.venue, call.mode, call.card, call.outcome, score) };
    try {
      const r = await fetch(AGENT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error();
      done.sent = true; setSlackOk(!!j.slack); setSending("sent");
    } catch { setSending("error"); }
    const h = [done, ...hist].slice(0, 200); setHist(h); save(LS.hist, h); setCall({ ...done });
  }
  function copySummary() { if (!call || !score) return; navigator.clipboard?.writeText(summaryText(call.venue, call.mode, call.card, call.outcome, score)); }
  function exportCsv() {
    const rows = [["data", "venue", "modo", "desfecho", "nota", "cobertura", "pontos", ...CARD_FIELDS.map((f) => f.key)], ...hist.map((h) => [new Date(h.startedAt).toISOString(), h.venue, h.mode, h.outcome, h.grade || "", String(scoreCall(h, h.mode).coverage), String(h.points || 0), ...CARD_FIELDS.map((f) => h.card[f.key] || "")])];
    const csv = rows.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" })); a.download = "venue-quest.csv"; a.click();
  }

  /* ---------- PREP (no active call) ---------- */
  if (!call || call.endedAt) {
    const last = call && call.endedAt ? call : null;
    return (
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-28 lg:px-10">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold">{t.agent} · Venue Quest</p>
        <h1 className="font-display mt-2 text-[clamp(2.2rem,4.6vw,3.6rem)] font-light leading-[1.04] text-ink">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">{t.intro} <strong>#venue_society</strong> {t.intro2}</p>

        {last && (
          <div className="mt-8 rounded-[2px] border border-gold/40 bg-white p-6">
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold">{t.ended}</p>
            <h2 className="font-display mt-1 text-2xl text-ink">{last.venue} · {t.grade} {last.grade} · {last.points} {t.pts}</h2>
            <p className="mt-2 text-sm text-ink-soft">{sending === "sent" ? (slackOk ? t.sentSlack : t.archivedOnly) : sending === "error" ? t.sendFail : t.archiving}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={copySummary} className="rounded-[2px] border border-ink/35 px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] text-ink hover:border-gold hover:text-gold">{t.copy}</button>
              {sending === "error" && <button onClick={() => { setCall({ ...last, endedAt: undefined }); }} className="rounded-[2px] border border-ink/35 px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em]">{t.reopen}</button>}
              <button onClick={() => setCall(null)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] text-ivory">{t.newCall}</button>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[2px] border border-line bg-white p-6">
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold">{t.prepare}</p>
            <label className="mt-4 block text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft">{t.venue}</label>
            <input list="venues" value={venueInput} onChange={(e) => setVenueInput(e.target.value)} placeholder={t.venuePh} className="mt-1 w-full rounded-[2px] border border-line bg-ivory px-4 py-3" />
            <datalist id="venues">{venues.map((v) => <option key={v.slug} value={v.name}>{v.town}, {v.state}</option>)}</datalist>
            {(() => { const v = venues.find((x) => x.name.toLowerCase() === venueInput.trim().toLowerCase()); return v ? (
              <div className="mt-3 rounded-[2px] bg-cream p-4 text-sm text-ink-soft">
                <strong className="text-ink">{v.name}</strong> · {v.town}, {v.state} · {v.capacity} · {t.featured} ({v.month}, {v.issue}).{v.contact?.phone ? " · " + v.contact.phone : ""}{v.contact?.website ? " · " + v.contact.website.replace(/^https?:\/\//, "") : ""}
              </div>) : null; })()}
            <p className="mt-5 text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft">{t.mode}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {([["partner", t.partner, t.partnerD], ["editorial", t.editorial, t.editorialD]] as const).map(([m, lbl, d]) => (
                <button key={m} onClick={() => setMode(m)} className={cn("rounded-[2px] border p-4 text-left transition", mode === m ? "border-gold bg-blush-soft" : "border-line bg-ivory hover:border-gold/60")}>
                  <span className="block font-medium text-ink">{lbl}</span><span className="text-sm text-ink-soft">{d}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={start} disabled={!venueInput.trim()} className="rounded-[2px] bg-ink px-7 py-3.5 text-[0.74rem] uppercase tracking-[0.26em] text-ivory disabled:opacity-40">{t.start}</button>
              <span className="text-sm text-ink-soft">{t.level} <strong className="text-ink">{level.name}</strong> · {total} {t.pts}{level.next ? ` · ${level.toNext} ${t.toNext} ${level.next}` : ""}</span>
            </div>
            {prevCallsFor(hist, venueInput).length > 0 && (
              <div className="mt-5 border-t border-line pt-4 text-sm">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gold">{t.called}</p>
                {prevCallsFor(hist, venueInput).slice(0, 3).map((h) => <p key={h.id} className="mt-1 text-ink-soft">{new Date(h.startedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")} · {h.outcome || t.noOutcome} · {t.grade} {h.grade}{h.card.nextStep ? " · " + h.card.nextStep : ""}</p>)}
              </div>
            )}
          </div>
          <div className="rounded-[2px] border border-line bg-white p-6">
            <div className="flex items-center justify-between"><p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold">{t.history}</p>{hist.length > 0 && <button onClick={exportCsv} className="text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft hover:text-gold">CSV</button>}</div>
            {hist.length === 0 ? <p className="mt-3 text-sm text-ink-soft">{t.noHistory}</p> : (
              <ul className="mt-3 divide-y divide-line text-sm">
                {hist.slice(0, 12).map((h) => <li key={h.id} className="flex items-start justify-between gap-3 py-2"><span><strong className="text-ink">{h.venue}</strong><br /><span className="text-ink-soft">{new Date(h.startedAt).toLocaleString(locale === "pt" ? "pt-BR" : "en-US", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} · {h.outcome || "—"}</span></span><span className="whitespace-nowrap text-gold">{h.grade} · {h.points}</span></li>)}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- LIVE CALL ---------- */
  const stage = STAGES[stageIdx];
  const mods = stage.modules.filter((m) => !m.modes || m.modes.includes(call.mode));
  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-24 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold">{t.onCall} · {call.mode === "editorial" ? t.editorialShort : t.partnerShort}</p><h1 className="font-display text-3xl font-light text-ink">{call.venue}</h1></div>
        <div className="flex items-center gap-3 text-sm">
          <button onClick={() => setShowPt(!showPt)} className="rounded-[2px] border border-line px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em]">{showPt ? t.hidePt : t.showPt}</button>
          {score && <span className="rounded-[2px] bg-ink px-3 py-1.5 text-ivory">{score.grade} · {score.coverage}% · {score.points} pts</span>}
        </div>
      </div>

      <div className="mt-5 flex gap-1 overflow-x-auto" ref={tickRef}>
        {STAGES.map((s, i) => { const st = score?.stages[i]; return (
          <button key={s.id} onClick={() => setStageIdx(i)} className={cn("flex-1 whitespace-nowrap rounded-[2px] border px-3 py-2 text-left text-[0.68rem] uppercase tracking-[0.18em]", i === stageIdx ? "border-gold bg-blush-soft text-ink" : "border-line text-ink-soft", st?.cleared && "border-gold")}>
            {s.icon} {s.name} <span className="text-gold">{st ? `${st.hit}/${st.total}` : ""}</span>
          </button>); })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {mods.map((m) => (
            <div key={m.id} className="rounded-[2px] border border-line bg-white p-5">
              <div className="flex items-baseline justify-between gap-3"><h2 className="font-display text-xl text-ink">{m.n}. {m.name}</h2><span className="text-xs text-ink-soft">{m.tip}</span></div>
              <ul className="mt-3 space-y-3">
                {m.qs.map((q) => { const on = call.ticks.some((t) => t.id === q.id); return (
                  <li key={q.id} className={cn("rounded-[2px] border p-3 transition", on ? "border-gold bg-blush-soft/60" : "border-line")}>
                    <button onClick={() => tick(q.id, q.field)} className="flex w-full items-start gap-3 text-left">
                      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs", on ? "border-gold bg-gold text-ivory" : "border-ink/40")}>{on ? "✓" : ""}</span>
                      <span className="text-[0.98rem] leading-snug text-ink">{q.en}</span>
                    </button>
                    {showPt && <p className="ml-8 mt-1 text-xs italic text-ink-soft">{q.pt}</p>}
                    <input id={"note-" + q.id} value={call.notes[q.id] || ""} onChange={(e) => note(q.id, e.target.value, q.field)} placeholder={q.field ? t.answerPh + (CARD_FIELDS.find((f) => f.key === q.field)?.label || "") : t.notePh} className="ml-8 mt-2 w-[calc(100%-2rem)] rounded-[2px] border border-line bg-ivory px-3 py-2 text-sm" />
                  </li>); })}
              </ul>
            </div>
          ))}
          <div className="flex justify-between">
            <button disabled={stageIdx === 0} onClick={() => setStageIdx(stageIdx - 1)} className="rounded-[2px] border border-ink/35 px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] disabled:opacity-30">← {STAGES[stageIdx - 1]?.name || ""}</button>
            {stageIdx < STAGES.length - 1 ? <button onClick={() => setStageIdx(stageIdx + 1)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] text-ivory">{STAGES[stageIdx + 1].name} →</button> : null}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2px] border border-gold/40 bg-white p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold">{t.card}</p>
            <div className="mt-3 grid gap-2">
              {CARD_FIELDS.map((f) => (
                <label key={f.key} className="grid gap-0.5 text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">{f.label}
                  <input value={call.card[f.key] || ""} onChange={(e) => setCardField(f.key, e.target.value)} className="rounded-[2px] border border-line bg-ivory px-2.5 py-1.5 text-sm normal-case tracking-normal text-ink" />
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-[2px] border border-line bg-white p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold">{t.traps}</p>
            <div className="mt-2 flex flex-wrap gap-2">{TRAPS.map((t) => <button key={t.id} onClick={() => trap(t.id)} className={cn("rounded-[2px] border px-3 py-1.5 text-xs", call.traps.includes(t.id) ? "border-red-400 bg-red-50 text-red-700" : "border-line text-ink-soft")}>{t.label}</button>)}</div>
          </div>
          <div className="rounded-[2px] border border-line bg-white p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold">{t.outcome}</p>
            <div className="mt-2 flex flex-wrap gap-2">{OUTCOMES.map((o) => <button key={o} onClick={() => setCall({ ...call, outcome: o })} className={cn("rounded-[2px] border px-3 py-1.5 text-xs", call.outcome === o ? "border-gold bg-blush-soft text-ink" : "border-line text-ink-soft")}>{o}</button>)}</div>
            {score && score.missed.length > 0 && <p className="mt-3 text-xs text-ink-soft">{t.missed} {score.missed.slice(0, 6).map((m) => m.name).join(", ")}</p>}
            <button onClick={finish} disabled={sending === "sending"} className="mt-4 w-full rounded-[2px] bg-ink px-5 py-3 text-[0.72rem] uppercase tracking-[0.26em] text-ivory disabled:opacity-50">{sending === "sending" ? t.sending : t.finish}</button>
            <button onClick={() => { if (confirm(t.discardQ)) setCall(null); }} className="mt-2 w-full text-xs text-ink-soft hover:text-red-600">{t.discard}</button>
          </div>
          {prevCalls.length > 0 && <div className="rounded-[2px] border border-line bg-white p-5 text-sm"><p className="text-[0.7rem] uppercase tracking-[0.26em] text-gold">{t.previous}</p>{prevCalls.slice(0, 3).map((h) => <p key={h.id} className="mt-1 text-ink-soft">{new Date(h.startedAt).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")} · {h.outcome || "—"}{h.card.nextStep ? " · " + h.card.nextStep : ""}</p>)}</div>}
        </aside>
      </div>
      <p className="mt-8 text-center text-xs text-ink-soft"><Link href="/" className="hover:text-gold">← {t.back}</Link></p>
    </div>
  );
}
function prevCallsFor(hist: Call[], venue: string) { const v = venue.trim().toLowerCase(); return v ? hist.filter((h) => h.venue.toLowerCase() === v) : []; }
