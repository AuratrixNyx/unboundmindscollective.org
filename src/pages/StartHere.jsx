import { Link } from "react-router";
import usePageMeta from '../hooks/usePageMeta.js';
import Users from "icon:users";
import BookOpen from "icon:book-open";
import CalendarDays from "icon:calendar-days";
import Sparkles from "icon:sparkles";
import Heart from "icon:heart";
import ShieldCheck from "icon:shield-check";
import MessageSquare from "icon:message-square";
import AlertCircle from "icon:alert-circle";
import ArrowRight from "icon:arrow-right";
import UserCircle from "icon:user-circle";
import Compass from "icon:compass";
import Layers from "icon:layers";

const whereToBegin = [
  {
    icon: Users,
    title: "Community",
    description:
      "Jump into conversations, share what's on your mind, or just read along. The forum is organized by topic so you can find threads that feel relevant to you right now.",
    href: "/community",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BookOpen,
    title: "Resources",
    description:
      "Looking for an affirming therapist, a kink-aware practitioner, or ENM-friendly support? Our directory is curated by and for people who actually get it.",
    href: "/resources",
    color: "text-sage",
    bg: "bg-sage/10",
  },
  {
    icon: CalendarDays,
    title: "Sessions",
    description:
      "We hold live peer conversations on topics that matter to our communities. Browse upcoming events, catch up on past ones, and send in questions beforehand.",
    href: "/sessions",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Sparkles,
    title: "Reflection Guide",
    description:
      "Not ready to talk yet? The AI Guide offers gentle, self-paced prompts for exploring your thoughts privately — no account required, nothing stored.",
    href: "/ai-guide",
    color: "text-sage",
    bg: "bg-sage/10",
  },
];

const howItWorks = [
  {
    icon: Heart,
    title: "Peer-led, not clinical",
    body: "This is not a therapy platform. There are no clinicians here in a professional capacity. What you'll find are people with lived experience — generous, thoughtful, human. We learn from each other.",
  },
  {
    icon: ShieldCheck,
    title: "Moderated with care",
    body: "Our moderators are community members who've taken on responsibility for holding this space. They act with both firmness and compassion — protecting the collective without playing gatekeeper to genuine voices.",
  },
  {
    icon: MessageSquare,
    title: "Community-informed",
    body: "The topics we explore, the resources we add, the direction we grow — all of it is shaped by the people here. Your voice matters. The suggestion box is always open.",
  },
];

const thingsToKnow = [
  "Content warnings are used throughout the community forum. You'll see a gentle prompt before anything that might be heavy — you choose whether and when to open it.",
  "Crisis resources are always one click away. The crisis page is linked in the footer and never hidden behind a login.",
  "You can submit suggestions completely anonymously. No account, no trace — just your idea.",
  "Invite codes unlock additional roles. If you've been invited as a moderator or facilitator, your code carries that trust with it when you sign up.",
  "Your profile is yours to shape. Your display name, bio, and identity interests are entirely optional — fill in what feels right, leave blank what doesn't.",
];

const firstSteps = [
  {
    number: "01",
    title: "Set up your profile",
    body: "Add a display name and, if you like, a short bio and the identity areas that feel most relevant to you. Nothing is required — this is just how others in the space can get a sense of who you are.",
    href: "/profile",
    label: "Go to your profile",
  },
  {
    number: "02",
    title: "Browse the community",
    body: "Have a look around the forum before you post anything. Get a feel for the tone, the topics, the kind of conversations that happen here. There's no pressure to jump in right away.",
    href: "/community",
    label: "Explore the forum",
  },
  {
    number: "03",
    title: "Find what's useful to you",
    body: "Whether it's the resource directory, an upcoming session, or a quiet reflection with the guide — start wherever your curiosity pulls you. There's no single right path in.",
    href: "/resources",
    label: "Browse resources",
  },
];

export default function StartHere() {
  usePageMeta('Start Here', 'New to The Unbound Minds Collective? This is your guide to getting started — what we offer, how to join, and how to find your place in our affirming community.');
  return (
    <div className="bg-bg text-text-primary font-body">

      {/* ── Hero ── */}
      <section className="relative px-6 py-24 sm:py-32 lg:py-40 max-w-4xl mx-auto text-center">
        <p className="text-accent font-body text-sm tracking-widest uppercase mb-4 font-medium">
          You found us
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight text-text-primary mb-6">
          Welcome to the Collective
        </h1>
        <p className="font-display text-xl sm:text-2xl text-text-secondary italic mb-8 leading-relaxed max-w-2xl mx-auto">
          "A peer advocacy space — warm, human, and genuinely glad you're here."
        </p>
        <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
          This is not a therapy service or a clinical resource. It's a community of people
          with shared experiences — navigating LGBTQ+ identity, kink and BDSM, ethical
          non-monogamy, and everything in between — who've chosen to build something
          thoughtful together. Wherever you're starting from, you belong here.
        </p>
      </section>

      {/* ── Where to Begin ── */}
      <section className="px-6 py-16 sm:py-20 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
              Where to Begin
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Four doors into the space. None of them is the "right" one — start wherever feels natural.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whereToBegin.map(({ icon: Icon, title, description, href, color, bg }) => (
              <Link
                key={href}
                to={href}
                className="group block rounded-sm bg-raised p-7 border border-black/5 hover:border-accent/30 hover:shadow-sm transition-all duration-200"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-sm ${bg} mb-5`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-display text-2xl text-text-primary mb-2 group-hover:text-accent transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-text-secondary text-base leading-relaxed mb-4">
                  {description}
                </p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-body font-medium ${color}`}>
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How This Space Works ── */}
      <section className="px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
              How This Space Works
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              A few things worth knowing before you dive in.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {howItWorks.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-accent/10 mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display text-xl text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A Few Things to Know ── */}
      <section className="px-6 py-16 sm:py-20 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
              A Few Things to Know
            </h2>
            <p className="text-text-secondary text-lg">
              Small things that make a real difference once you're in the space.
            </p>
          </div>
          <ul className="space-y-4">
            {thingsToKnow.map((item, i) => (
              <li
                key={i}
                className="flex gap-4 items-start bg-raised rounded-sm px-6 py-5 border border-black/5"
              >
                <span className="mt-0.5 w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                <p className="text-text-secondary text-base leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Your First Steps ── */}
      <section className="px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
              Your First Steps
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              If you're not sure where to start, this gentle sequence works well for most people.
            </p>
          </div>
          <div className="space-y-6">
            {firstSteps.map(({ number, title, body, href, label }) => (
              <div
                key={number}
                className="flex flex-col sm:flex-row gap-6 items-start bg-surface rounded-sm px-7 py-7 border border-black/5"
              >
                <div className="flex-shrink-0">
                  <span className="font-display text-5xl text-accent/30 leading-none select-none">
                    {number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl text-text-primary mb-2">{title}</h3>
                  <p className="text-text-secondary text-base leading-relaxed mb-4">{body}</p>
                  <Link
                    to={href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    {label} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="px-6 py-16 sm:py-20 bg-raised">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary">
            Two more pages worth your time
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            The community guidelines lay out how we treat each other here — a short read, and a good grounding
            before you participate. And the crisis page is always available, no matter what.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/guidelines"
              className="inline-flex items-center gap-2 bg-accent text-white font-body font-medium px-7 py-3.5 rounded-sm hover:bg-accent/90 transition-colors duration-200 text-sm tracking-wide"
            >
              <BookOpen className="w-4 h-4" />
              Read the community guidelines
            </Link>
            <Link
              to="/crisis"
              className="inline-flex items-center gap-2 border border-sage text-sage font-body font-medium px-7 py-3.5 rounded-sm hover:bg-sage/10 transition-colors duration-200 text-sm tracking-wide"
            >
              <AlertCircle className="w-4 h-4" />
              Crisis resources
            </Link>
          </div>
          <p className="font-display text-xl text-text-muted italic">
            We're glad you're here. Take your time.
          </p>
        </div>
      </section>

    </div>
  );
}
