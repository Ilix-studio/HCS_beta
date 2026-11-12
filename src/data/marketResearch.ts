export interface Source { label: string; url: string }

export const sources = {
  ken: { label: 'Ken Research — India e-pharmacy market', url: 'https://www.kenresearch.com/industry-reports/india-e-pharmacy-market' },
  imarc: { label: 'IMARC — India online pharmacy market', url: 'https://www.imarcgroup.com/india-online-pharmacy-market' },
  techsci: { label: 'TechSci Research — India e-pharmacy market', url: 'https://www.techsciresearch.com/report/india-e-pharmacy-market/7375.html' },
  mobility: { label: 'Mobility Foresights — India online pharmacy market', url: 'https://mobilityforesights.com/product/india-online-pharmacy-market' },
  techmagnate: { label: 'Techmagnate — Online pharmacy industry in India (FY24)', url: 'https://www.techmagnate.com/blog/india-online-pharmacy-trends/' },
  sigosoft: { label: 'Sigosoft — Best medicine delivery apps in India (2026)', url: 'https://sigosoft.com/blog/best-medicine-delivery-apps-india-2026/' },
  tata25: { label: 'Entrackr — Tata 1mg FY25 revenue', url: 'https://entrackr.com/fintrackr/tata-1mg-revenue-nears-rs-2400-cr-in-fy25-trims-losses-9534620' },
  tata26: { label: 'D2C Insider — Tata 1mg FY26 revenue', url: 'https://pulse.d2cinsider.com/tata-1mg-revenue-climbs-23-to-%e2%82%b92936-crore-in-fy26-continues-path-towards-profitability/' },
  pharmeasy: { label: 'Inc42 — PharmEasy\'s uneasy state', url: 'https://inc42.com/features/pharmeasy-uneasy-state' },
  cbinsights: { label: 'CB Insights — PharmEasy financials', url: 'https://www.cbinsights.com/company/pharmeasy/financials' },
  inc42list: { label: 'Inc42 — Top healthtech startups by funding', url: 'https://inc42.com/lists/top-30-healthtech-startups-in-india-2026-by-funding/' },
  zepto: { label: 'Indian Startup News — Zepto Pharmacy launch', url: 'https://indianstartupnews.com/news/zepto-launches-zepto-pharmacy-to-deliver-medicines-in-just-10-minutes-9639459' },
  quickpharma: { label: 'Inc42 — The quick pharma race', url: 'https://inc42.com/buzz/the-quick-pharma-race-whats-next-for-rmg-founders-more' },
  scc: { label: 'SCC Online — Regulation of online pharmacies in India (2023)', url: 'https://www.scconline.com/blog/post/2023/11/02/regulation-of-online-pharmacies-in-india/' },
  madras: { label: 'Verdictum — Madras HC on online drug sale policy (2024)', url: 'https://verdictum.in/court-updates/high-courts/madras-high-court-2024-mhc-2491-practo-technologies-v-tamil-nadu-chemists-druggists-association-union-expedite-finalise-online-drug-sale-trade-policy-1542872' },
  draft: { label: 'Mondaq — Draft e-pharmacy rules (2018)', url: 'https://mondaq.com/india/food-and-drugs-law/747792/centre-proposes-draft-e-pharmacy-rules-to-regulate-online-sale-of-drugs' },
  codingclave: { label: 'Codingclave — Pharmacy software cost India 2026', url: 'https://codingclave.com/guides/pharmacy-management-software-cost-india-2026' },
  raftlabs: { label: 'RaftLabs — Cost to build a health super-app (ABDM)', url: 'https://www.raftlabs.com/blog/cost-to-build-app-like-ekacare' },
  techgropse: { label: 'TechGropse — Medicine delivery app cost in India', url: 'https://www.techgropse.com/blog/?p=10587' },
  zenesys: { label: 'Zenesys — Cost of an app like Tata 1mg', url: 'https://zenesys.com/how-much-does-it-cost-to-build-an-app-like-tata-1mg-in-2025' },
} satisfies Record<string, Source>

export interface MarketEstimate { publisher: string; base: string; forecast: string; cagr: string; note?: string; source: Source }

export const marketEstimates: MarketEstimate[] = [
  { publisher: 'Ken Research', base: '≈ US$3.5B (2025)', forecast: '≈ US$8.6B (2031)', cagr: '16.18%', source: sources.ken },
  { publisher: 'IMARC Group', base: 'US$3.18B (2024)', forecast: 'US$12.71B (2033)', cagr: '16.65%', source: sources.imarc },
  { publisher: 'TechSci Research', base: 'US$394M (2024)', forecast: 'US$801M (2030)', cagr: '12.62%', note: 'Much narrower definition than the others', source: sources.techsci },
  { publisher: 'Mobility Foresights', base: 'US$65B (2025)', forecast: 'US$185B (2031)', cagr: '18.6%', note: 'Outlier — treat with caution', source: sources.mobility },
]

/** Share of top-6 online pharmacy app downloads, FY2023-24 (Techmagnate). Downloads, not revenue. */
export const downloadShare = [
  { app: 'Apollo 24|7', share: 28.2 }, { app: 'Flipkart Health+', share: 17.69 }, { app: 'Tata 1mg', share: 14.83 },
  { app: 'Truemeds', share: 10.62 }, { app: 'PharmEasy', share: 10.08 }, { app: 'Netmeds', share: 6.95 },
]

export interface Competitor { name: string; type: string; facts: string[]; edge: string; source: Source }

export const competitors: Competitor[] = [
  { name: 'Tata 1mg', type: 'Online pharmacy + diagnostics', edge: 'Tata Digital backing, strong search visibility, own retail pharmacies', source: sources.tata25,
    facts: ['Consolidated revenue ≈ ₹2,392 cr in FY25 (+22%); ≈ ₹2,936 cr reported for FY26', '280+ physical pharmacies (planning ~500), per Sigosoft', '≈ 14.8% of top-6 app downloads (FY24)'] },
  { name: 'Apollo 24|7', type: 'Hospital-backed pharmacy + consultations', edge: 'Apollo Hospitals brand and a very large offline pharmacy network', source: sources.techmagnate,
    facts: ['Highest share of top-6 app downloads: 28.2% (FY24)', '7,000+ Apollo Pharmacy stores per Sigosoft chart'] },
  { name: 'PharmEasy', type: 'Online pharmacy + diagnostics marketplace', edge: 'Largest funding raised; Swiggy Instamart partnership', source: sources.pharmeasy,
    facts: ['≈ US$1.96–1.98B raised over ~18 rounds (Inc42 / CB Insights)', 'Leadership change in Aug 2025; Inc42 says it has struggled to regain momentum since 2022', '≈ 10.1% of top-6 app downloads (FY24)'] },
  { name: 'Netmeds (Reliance)', type: 'Online pharmacy', edge: 'Reliance / Jio ecosystem', source: sources.techmagnate,
    facts: ['≈ 7% of top-6 app downloads (FY24)', 'Reported to be losing search visibility to Tata 1mg and Apollo'] },
  { name: 'Truemeds', type: 'Discount-led generic substitution', edge: 'Price positioning', source: sources.inc42list,
    facts: ['≈ US$176.5M funding (Inc42)', '≈ 10.6% of top-6 app downloads (FY24)'] },
  { name: 'Flipkart Health+', type: 'Marketplace pharmacy', edge: 'Flipkart traffic and logistics', source: sources.techmagnate,
    facts: ['≈ 17.7% of top-6 app downloads (FY24)'] },
  { name: 'MedPlus', type: 'Offline chain + online', edge: 'Dense physical network', source: sources.sigosoft,
    facts: ['≈ 5,476 stores per Sigosoft chart; no app-share figure found'] },
  { name: 'Quick commerce (Zepto, Blinkit, Instamart)', type: '10-minute delivery entrants', edge: 'Speed and existing rider fleets', source: sources.zepto,
    facts: ['Zepto Pharmacy launched Aug 2025 in parts of Mumbai, Delhi-NCR, Bengaluru, Hyderabad', 'Blinkit piloting prescription delivery in Bengaluru; Instamart partnering with PharmEasy', 'Chemist associations (AIOCD) have pushed back on 10-minute medicine delivery'] },
]

export const regulatory = [
  { title: 'E-pharmacy rules were still only a draft in the sources found', text: 'The Draft E-Pharmacy Rules, 2018 (new Part VI-B) proposed central registration, a prescription requirement and records, a ban on narcotics/psychotropics, no advertising of drugs and India-only data storage. A 2023 article says they were not notified in the Official Gazette.', source: sources.draft },
  { title: 'Courts have left online sale in limbo', text: 'The Delhi High Court restrained e-pharmacy sales in 2018 and revisited the matter in 2023; in 2024 the Madras High Court told the Centre to finalise policy and ordered status quo meanwhile. I found no source confirming the 2025–26 position — verify with counsel before launch.', source: sources.madras },
  { title: 'Enforcement is real', text: 'CDSCO issued show-cause notices to online sellers in Feb 2023 and asked state regulators to act against non-compliance.', source: sources.scc },
]

export const recommendations: { title: string; text: string }[] = [
  { title: 'Fulfil through licensed pharmacies', text: 'Given the regulatory uncertainty, start as a technology layer over licensed retail pharmacies (with a registered pharmacist verifying every prescription) rather than holding stock yourself. Get a legal opinion first.' },
  { title: 'Differentiate on chronic-care refills', text: 'Competitors compete on discounts and speed. Your prototype already has verified-prescription subscriptions with reminders and validity checks — position around "never run out of chronic medicines".' },
  { title: 'Pilot in one city', text: 'Launch in a single city (the demo uses Pune) with a small set of pharmacies and manufacturers, measure repeat orders and prescription-verification time, then expand.' },
  { title: 'Compliance checklist before launch', text: 'Drug licences for fulfilling pharmacies, pharmacist verification, no Schedule X / narcotics online, drug-advertising limits, India-based data storage, and India\'s DPDP Act obligations for health data.' },
  { title: 'Plan the integrations', text: 'Payment gateway, GST invoicing, logistics partner, SMS/WhatsApp, and optionally ABDM (RaftLabs notes sandbox registration and NHA approval take roughly 6–10 weeks, so start early).' },
  { title: 'Trust and safety features', text: 'Verified-manufacturer badges, batch/expiry display, cold-chain handling, return and recall flows, and clear "AI is simulated / pharmacist verifies" messaging.' },
  { title: 'Before building more', text: 'Interview 15–20 chronic-medication patients and 5–10 pharmacists, then validate unit economics (margin per order, delivery cost, refill retention). Get 3+ agency quotes against a fixed MVP scope.' },
]
