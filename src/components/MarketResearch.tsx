import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, ExternalLink, Lightbulb } from 'lucide-react'
import { competitors, downloadShare, marketEstimates, recommendations, regulatory, sources, type Source } from '../data/marketResearch'
import { Card } from './ui'

const SourceLink = ({ source }: { source: Source }) => (
  <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-teal-700 hover:underline" title={source.label}>Source<ExternalLink className="h-3 w-3" /></a>
)

const Section = ({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) => (
  <section className="mt-14">
    <p className="mb-1 text-xs font-semibold tracking-widest text-teal-600 uppercase">{eyebrow}</p>
    <h2 className="text-2xl font-semibold text-navy-900">{title}</h2>
    {intro && <p className="mt-2 max-w-3xl text-sm text-slate-600">{intro}</p>}
    <div className="mt-5">{children}</div>
  </section>
)

export function MarketResearch() {
  return (
    <>
      <Section eyebrow="Market research · India" title="How big is the Indian e-pharmacy market?" intro="Published estimates disagree widely because they define the market differently (OTC, supplements, marketplace sales). Forecast growth clusters around 12–19% a year. Most of these are paid vendor reports — treat them as directional, not as facts.">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50 text-xs text-slate-600 uppercase"><tr><th className="px-4 py-3">Publisher</th><th className="px-4 py-3">Base year</th><th className="px-4 py-3">Forecast</th><th className="px-4 py-3">CAGR</th><th className="px-4 py-3">Note</th><th className="px-4 py-3" /></tr></thead>
            <tbody className="divide-y divide-slate-100">{marketEstimates.map((m) => <tr key={m.publisher}><td className="px-4 py-3 font-medium">{m.publisher}</td><td className="px-4 py-3">{m.base}</td><td className="px-4 py-3">{m.forecast}</td><td className="px-4 py-3">{m.cagr}</td><td className="px-4 py-3 text-slate-500">{m.note ?? '—'}</td><td className="px-4 py-3"><SourceLink source={m.source} /></td></tr>)}</tbody>
          </table>
        </div>
        <Card className="mt-5">
          <div className="mb-1 flex items-start justify-between gap-3"><h3 className="font-semibold text-navy-900">Share of app downloads, top 6 online pharmacy apps (FY2023-24)</h3><SourceLink source={sources.techmagnate} /></div>
          <p className="mb-3 text-xs text-slate-500">Measures downloads, not revenue, and is about two years old. Newer share data was not found.</p>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={downloadShare} layout="vertical" margin={{ left: 24 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" /><XAxis type="number" unit="%" /><YAxis type="category" dataKey="app" width={110} /><Tooltip formatter={(v) => `${v}%`} /><Bar dataKey="share" radius={[0, 4, 4, 0]}>{downloadShare.map((d) => <Cell key={d.app} fill="var(--chart-bar)" />)}</Bar></BarChart></ResponsiveContainer></div>
        </Card>
      </Section>

      <Section eyebrow="National competitors" title="Who you would compete with in India" intro="Figures come from news and vendor sources found by web search and have different dates and bases — verify against company filings before using them in a pitch.">
        <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50 text-xs text-slate-600 uppercase"><tr><th className="px-4 py-3">Competitor</th><th className="px-4 py-3">What they are</th><th className="px-4 py-3">Reported facts</th><th className="px-4 py-3">Their edge</th><th className="px-4 py-3" /></tr></thead>
            <tbody className="divide-y divide-slate-100">{competitors.map((c) => (
              <tr key={c.name} className="align-top"><td className="px-4 py-4 font-semibold text-navy-900">{c.name}</td><td className="px-4 py-4 text-slate-600">{c.type}</td>
                <td className="px-4 py-4"><ul className="list-disc space-y-1 pl-4 text-slate-600">{c.facts.map((f) => <li key={f}>{f}</li>)}</ul></td><td className="px-4 py-4 text-slate-600">{c.edge}</td><td className="px-4 py-4"><SourceLink source={c.source} /></td></tr>))}</tbody>
          </table>
        </div>
        <div className="grid gap-3 md:hidden">{competitors.map((c) => (
          <Card key={c.name}><div className="flex items-start justify-between gap-2"><h3 className="font-semibold text-navy-900">{c.name}</h3><SourceLink source={c.source} /></div><p className="text-xs text-slate-500">{c.type}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">{c.facts.map((f) => <li key={f}>{f}</li>)}</ul><p className="mt-2 text-sm"><b>Edge:</b> {c.edge}</p></Card>))}</div>
        <p className="mt-3 text-xs text-slate-500">Practo (consultations / telemedicine) is an adjacent competitor for the doctors feature; I did not find reliable figures for it.</p>
      </Section>

      <Section eyebrow="Regulation" title="Rules to understand before launch" intro="This is a research summary, not legal advice.">
        <div className="grid gap-4 md:grid-cols-3">{regulatory.map((r) => (
          <Card key={r.title} className="space-y-2"><h3 className="flex items-start gap-2 font-semibold text-navy-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{r.title}</h3><p className="text-sm text-slate-600">{r.text}</p><SourceLink source={r.source} /></Card>))}</div>
      </Section>

      <Section eyebrow="Recommendations" title="What I would do next" intro="These are my suggestions based on the research above and the prototype's strengths — not findings from the sources.">
        <div className="grid gap-4 md:grid-cols-2">{recommendations.map((r, i) => (
          <Card key={r.title} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700"><Lightbulb className="h-4 w-4" /></span><div><h3 className="font-semibold text-navy-900">{i + 1}. {r.title}</h3><p className="mt-1 text-sm text-slate-600">{r.text}</p></div></Card>))}</div>
      </Section>

      <Section eyebrow="Sources" title="Where the numbers come from">
        <ul className="grid gap-1 text-sm sm:grid-cols-2">{Object.values(sources).map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-teal-700 hover:underline">{s.label}</a></li>)}</ul>
        <p className="mt-3 text-xs text-slate-500">Researched via web search in Nov 2026. Several sources are blogs or paid-report summaries; figures were not independently verified.</p>
      </Section>
    </>
  )
}
