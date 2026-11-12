import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Baby,
  Bandage,
  BriefcaseMedical,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  Cloud,
  Droplets,
  FlaskConical,
  HeartPulse,
  Pill,
  Repeat,
  Scale,
  Search,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Sun,
  Syringe,
  Thermometer,
  Truck,
  Upload,
  Wind,
  Zap,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { setRole, useAppDispatch } from "../store";
import { categories } from "../data/categories";
import { homeByRole, roleLabel } from "../components/layout/nav";
import { useManufacturers, useProducts } from "../lib/hooks";
import { productImage } from "../lib/utils";
import { ProductCard } from "../components/ProductCard";
import { NearbyDoctors } from "../components/NearbyDoctors";
import { Button } from "../components/ui";
import { ThemeToggle } from "../theme/ThemeToggle";
import type { UserRole } from "../types";

const catIcons: Record<string, LucideIcon> = {
  tablets: Pill,
  capsules: Pill,
  syrups: Droplets,
  antibiotics: Syringe,
  pain: Zap,
  vitamins: Sun,
  diabetes: Activity,
  cardio: HeartPulse,
  derma: Sparkles,
  "firstaid-med": ShieldPlus,
  "firstaid-kits": BriefcaseMedical,
  plasters: Bandage,
  cotton: Cloud,
  masks: ShieldCheck,
  stethoscopes: Stethoscope,
  oxygen: Wind,
  thermometers: Thermometer,
  bp: Activity,
  scales: Scale,
  bandages: Bandage,
  pregnancy: Baby,
  resus: HeartPulse,
};

const portals: { role: UserRole; icon: LucideIcon; text: string }[] = [
  {
    role: "patient",
    icon: HeartPulse,
    text: "Order medicines, manage prescriptions, subscriptions and reports.",
  },
  {
    role: "doctor",
    icon: Stethoscope,
    text: "Create digital prescriptions from the full medicine catalog.",
  },
  {
    role: "manufacturer",
    icon: Building2,
    text: "Publish a company profile and manage product listings.",
  },
  {
    role: "fulfillment",
    icon: Truck,
    text: "Verify prescriptions, pack and dispatch orders, upload lab reports.",
  },
  {
    role: "admin",
    icon: ClipboardList,
    text: "Platform metrics, analytics and listing approvals.",
  },
];

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className='mb-2 text-xs font-semibold tracking-widest text-teal-600 uppercase'>
    {children}
  </p>
);

function Split({
  eyebrow,
  title,
  text,
  points,
  cta,
  visual,
  flip,
}: {
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  cta: ReactNode;
  visual: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className='mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2'>
      <div className={flip ? "lg:order-2" : ""}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className='text-3xl font-semibold text-navy-900'>{title}</h2>
        <p className='mt-3 text-slate-600'>{text}</p>
        <ul className='mt-5 space-y-2'>
          {points.map((p) => (
            <li
              key={p}
              className='flex items-start gap-2 text-sm text-slate-700'
            >
              <span className='mt-0.5 rounded-full bg-teal-100 p-0.5 text-teal-700'>
                <Check className='h-3.5 w-3.5' />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <div className='mt-6'>{cta}</div>
      </div>
      <div className={flip ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className='relative mx-auto w-full max-w-md' aria-hidden>
      <div className='rounded-2xl bg-white p-5 text-slate-800 shadow-2xl ring-1 ring-white/20'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <div className='text-xs text-slate-500'>Order ORD-1002</div>
            <div className='font-semibold text-navy-900'>Metforin 500 × 3</div>
          </div>
          <span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800'>
            Rx verified
          </span>
        </div>
        <ol className='space-y-3 text-sm'>
          {[
            ["Order placed", true],
            ["Prescription verified", true],
            ["Packed", true],
            ["Out for delivery", false],
          ].map(([l, done]) => (
            <li key={String(l)} className='flex items-center gap-3'>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-teal-600 text-white" : "border-2 border-slate-300"}`}
              >
                {done && <Check className='h-3 w-3' />}
              </span>
              <span className={done ? "font-medium" : "text-slate-400"}>
                {String(l)}
              </span>
            </li>
          ))}
        </ol>
        <div className='mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100'>
          <div className='h-full w-3/4 rounded-full bg-teal-600' />
        </div>
      </div>
      <div className='absolute -top-10 -right-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-xl sm:-right-8'>
        <span className='rounded-lg bg-amber-100 p-1.5 text-amber-700'>
          <Bell className='h-4 w-4' />
        </span>
        <span>
          <b className='block text-slate-800'>Refill reminder</b>
          <span className='text-slate-500'>Due in 5 days</span>
        </span>
      </div>
      <div className='absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-xl sm:-left-8'>
        <span className='rounded-lg bg-navy-100 p-1.5 text-navy-700'>
          <FlaskConical className='h-4 w-4' />
        </span>
        <span>
          <b className='block text-slate-800'>CBC report ready</b>
          <span className='text-slate-500'>View or download</span>
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const products = useProducts();
  const mfrs = useManufacturers();
  const [q, setQ] = useState("");
  const active = products.filter((p) => p.status === "active");
  const featured = [...active]
    .filter((p) => p.availability !== "out_of_stock")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);
  const enter = (role: UserRole) => {
    dispatch(setRole(role));
    nav(homeByRole[role]);
  };
  const shop = () => dispatch(setRole("patient"));
  const stats: [string, string][] = [
    [`${active.length}+`, "Medicines & supplies"],
    [String(mfrs.length), "Verified manufacturers"],
    ["5", "Role-based portals"],
    ["2", "Refill cycles: weekly & monthly"],
  ];

  return (
    <div className='min-h-screen bg-white'>
      <header className='sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur'>
        <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3'>
          <Link
            to='/'
            className='flex items-center gap-2 text-lg font-semibold text-navy-800'
          >
            <span className='rounded-lg bg-navy-700 p-1.5 text-white'>
              <HeartPulse className='h-5 w-5' />
            </span>
            MediCart<span className='text-teal-600'>Health</span>
          </Link>
          <nav
            aria-label='Homepage'
            className='hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex'
          >
            {[
              ["#categories", "Categories"],
              ["#popular", "Popular"],
              ["#doctors", "Doctors"],
              ["#prescriptions", "Prescriptions"],
              ["#portals", "Portals"],
            ].map(([h, l]) => (
              <a key={h} href={h} className='hover:text-navy-800'>
                {l}
              </a>
            ))}
            <Link to='/platform' className='hover:text-navy-800'>
              Platform
            </Link>
          </nav>
          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <Link to='/catalog' onClick={shop} className='hidden sm:block'>
              <Button variant='outline' size='sm'>
                Browse catalog
              </Button>
            </Link>
            <Button size='sm' onClick={() => enter("patient")}>
              Open demo
              <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </header>

      <section className='relative overflow-hidden bg-navy-900 text-white'>
        <div className='pointer-events-none absolute -top-40 -right-32 rounded-full bg-teal-600/25 blur-3xl' />
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.07]'
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className='relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24'>
          <div>
            <p className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs'>
              <ShieldCheck className='h-3.5 w-3.5 text-teal-100' />
              Interactive prototype · mock data
            </p>
            <h1 className='text-4xl leading-[1.1] font-semibold md:text-6xl'>
              Your medicines,
              <br />
              <span className='text-teal-100'>delivered with care.</span>
            </h1>
            <p className='mt-5 max-w-xl text-lg text-navy-100'>
              Order OTC and prescription medicines, set up recurring refills,
              and receive diagnostic reports securely — all in one place.
            </p>
            <form
              role='search'
              className='mt-8 flex max-w-xl gap-2 rounded-xl bg-white p-1.5 shadow-xl'
              onSubmit={(e) => {
                e.preventDefault();
                shop();
                nav(`/catalog?q=${encodeURIComponent(q)}`);
              }}
            >
              <div className='relative flex-1'>
                <Search className='absolute top-3 left-3 h-4 w-4 text-slate-400' />
                <input
                  aria-label='Search medicines'
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder='Search medicines, brands, generics…'
                  className='w-full rounded-lg py-2.5 pr-3 pl-9 text-sm text-slate-900 focus:outline-none'
                />
              </div>
              <Button variant='secondary' type='submit'>
                Search
              </Button>
            </form>
            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs'>
              <span className='text-navy-100'>Popular:</span>
              {["Paracetamol", "Vitamin D", "Metformin", "Thermometer"].map(
                (s) => (
                  <Link
                    key={s}
                    to={`/catalog?q=${s}`}
                    onClick={shop}
                    className='rounded-full border border-white/15 px-3 py-1 hover:bg-white/10'
                  >
                    {s}
                  </Link>
                ),
              )}
            </div>
            <div className='mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-100'>
              {[
                "Prescription verification",
                "Weekly & monthly refills",
                "Secure lab reports",
              ].map((t) => (
                <span key={t} className='flex items-center gap-1.5'>
                  <CheckCircle2 className='h-4 w-4 text-teal-100' />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className='border-b border-slate-200 bg-white'>
        <dl className='mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4'>
          {stats.map(([v, l]) => (
            <div key={l} className='text-center'>
              <dt className='text-3xl font-semibold text-navy-800'>{v}</dt>
              <dd className='text-sm text-slate-500'>{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id='categories' className='bg-slate-50 py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-8 flex flex-wrap items-end justify-between gap-2'>
            <div>
              <Eyebrow>Browse</Eyebrow>
              <h2 className='text-3xl font-semibold text-navy-900'>
                Shop by category
              </h2>
            </div>
            <Link
              to='/catalog'
              onClick={shop}
              className='text-sm font-medium text-teal-700 hover:underline'
            >
              View full catalog →
            </Link>
          </div>
          {(["medicine", "supply"] as const).map((g) => (
            <div key={g} className='mb-6'>
              <h3 className='mb-3 text-sm font-semibold text-slate-500 uppercase'>
                {g === "medicine" ? "Medicines" : "Medical supplies"}
              </h3>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
                {categories
                  .filter((c) => c.group === g)
                  .map((c) => {
                    const Icon = catIcons[c.id] ?? Pill;
                    return (
                      <Link
                        key={c.id}
                        to={`/catalog?category=${c.id}`}
                        onClick={shop}
                        className='group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-600 hover:shadow-md'
                      >
                        <span
                          className={`rounded-lg p-2.5 ${g === "medicine" ? "bg-teal-50 text-teal-700" : "bg-navy-50 text-navy-700"}`}
                        >
                          <Icon className='h-5 w-5' />
                        </span>
                        <span className='text-sm font-medium text-slate-800'>
                          {c.name}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id='prescriptions'>
        <Split
          eyebrow='Prescriptions'
          title='Upload once. Review before you submit.'
          text='Snap or upload your prescription and see a simulated AI extraction. Anything uncertain is highlighted for you to correct, and a pharmacist always verifies before prescription-only medicines ship.'
          points={[
            "JPG, PNG or PDF with instant preview",
            "Low-confidence fields flagged for manual correction",
            "Status tracked from uploaded to verified",
          ]}
          cta={
            <Button
              onClick={() => {
                shop();
                nav("/prescriptions/upload");
              }}
            >
              <Upload className='h-4 w-4' />
              Try prescription upload
            </Button>
          }
          visual={
            <div
              className='rounded-2xl border border-slate-200 bg-white p-5 shadow-lg'
              aria-hidden
            >
              <div className='mb-3 flex items-center justify-between text-xs'>
                <span className='font-medium text-slate-700'>
                  Extracted details
                </span>
                <span className='rounded-full bg-amber-100 px-2 py-0.5 text-amber-800'>
                  Overall 68%
                </span>
              </div>
              {[
                ["Doctor", "Dr. M. Kap??r", "58%", true],
                ["Medicine", "Amoxiclav 625", "71%", true],
                ["Frequency", "Twice daily", "94%", false],
                ["Duration", "5 days", "92%", false],
              ].map(([k, v, c, low]) => (
                <div
                  key={String(k)}
                  className={`mb-2 flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${low ? "border-amber-300 bg-amber-50" : "border-slate-200"}`}
                >
                  <span className='text-slate-500'>{k}</span>
                  <span className='font-medium'>{v}</span>
                  <span className='text-xs text-slate-400'>{c}</span>
                </div>
              ))}
              <div className='mt-3 rounded-lg bg-navy-50 p-2 text-xs text-navy-800'>
                Simulated recognition — a pharmacist verifies before dispensing.
              </div>
            </div>
          }
        />
      </section>

      <Split
        flip
        eyebrow='Subscriptions'
        title='Never run out of what you need.'
        text='Set up weekly or monthly deliveries, get reminders before dispatch, and pause, skip or change them any time. Recurring prescription medicines are checked for a valid prescription before they ship.'
        points={[
          "Weekly or monthly delivery",
          "Dispatch, refill and payment reminders",
          "Pause, resume, skip and edit in one click",
        ]}
        cta={
          <Button
            variant='secondary'
            onClick={() => {
              shop();
              nav("/subscriptions");
            }}
          >
            <Repeat className='h-4 w-4' />
            Explore subscriptions
          </Button>
        }
        visual={
          <div
            className='rounded-2xl border border-slate-200 bg-white p-5 shadow-lg'
            aria-hidden
          >
            <div className='flex items-center gap-3'>
              <img
                src={productImage(
                  products.find((p) => p.id === "p25") ?? products[0],
                )}
                alt=''
                className='h-14 w-14 rounded-lg'
              />
              <div className='flex-1'>
                <div className='font-semibold text-navy-900'>
                  Metforin 500 × 2
                </div>
                <div className='text-xs text-slate-500'>
                  Monthly · next delivery 15 Nov 2026
                </div>
              </div>
              <span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800'>
                Active
              </span>
            </div>
            <div className='mt-4 grid grid-cols-3 gap-2 text-center text-xs'>
              {["Pause", "Skip next", "Edit"].map((b) => (
                <span
                  key={b}
                  className='rounded-lg border border-slate-200 py-2 text-slate-600'
                >
                  {b}
                </span>
              ))}
            </div>
            <div className='mt-4 flex items-center gap-2 rounded-lg bg-teal-50 p-2.5 text-xs text-teal-800'>
              <Bell className='h-4 w-4' />
              Reminder: your refill dispatches in 3 days.
            </div>
          </div>
        }
      />

      <section id='portals' className='bg-navy-900 py-16 text-white'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='text-center'>
            <p className='mb-2 text-xs font-semibold tracking-widest text-teal-100 uppercase'>
              Interactive demo
            </p>
            <h2 className='text-3xl font-semibold'>Explore the platform as…</h2>
            <p className='mx-auto mt-2 max-w-xl text-sm text-navy-100'>
              Pick a role to open its portal. You can switch roles any time from
              the top bar.
            </p>
          </div>
          <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            {portals.map((p) => (
              <button
                key={p.role}
                onClick={() => enter(p.role)}
                className='group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-100/60 hover:bg-white/10'
              >
                <p.icon className='mb-4 h-7 w-7 text-teal-100' />
                <div className='font-semibold'>{roleLabel[p.role]}</div>
                <p className='mt-1 text-sm text-navy-100'>{p.text}</p>
                <span className='mt-4 inline-flex items-center gap-1 text-xs font-medium text-teal-100'>
                  Open portal{" "}
                  <ArrowRight className='h-3.5 w-3.5 transition group-hover:translate-x-1' />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id='popular' className='mx-auto max-w-7xl px-4 py-16'>
        <div className='mb-8 flex items-end justify-between'>
          <div>
            <Eyebrow>Best sellers</Eyebrow>
            <h2 className='text-3xl font-semibold text-navy-900'>
              Popular right now
            </h2>
          </div>
          <Link
            to='/catalog'
            onClick={shop}
            className='text-sm font-medium text-teal-700 hover:underline'
          >
            View all →
          </Link>
        </div>
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id='doctors' className='bg-slate-50'>
        <div className='mx-auto max-w-7xl px-4 py-16'>
          <NearbyDoctors showFilter={false} />
        </div>
      </section>

      <footer className='bg-white px-4 py-10'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-slate-500'>
          <span className='flex items-center gap-2 font-semibold text-navy-800'>
            <HeartPulse className='h-5 w-5 text-teal-600' />
            MediCart Health
          </span>
          <nav className='flex gap-5'>
            <Link to='/catalog' onClick={shop}>
              Catalog
            </Link>
            <Link to='/doctors' onClick={shop}>
              Doctors
            </Link>
            <Link to='/manufacturers' onClick={shop}>
              Manufacturers
            </Link>
          </nav>
        </div>
        <p className='mx-auto mt-6 max-w-7xl text-xs text-slate-400'>
          © 2026 MediCart Health — demo prototype with mock data. Prescriptions
          and reports shown are not legally valid or real medical records, and
          AI recognition is simulated.
        </p>
      </footer>
    </div>
  );
}
