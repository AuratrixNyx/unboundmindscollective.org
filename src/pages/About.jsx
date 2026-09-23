import { Link } from "react-router";
import usePageMeta from '../hooks/usePageMeta.js';
import Heart from "icon:heart";
import Shield from "icon:shield";
import Users from "icon:users";
import HandHeart from "icon:hand-heart";
import Sparkles from "icon:sparkles";
import GraduationCap from "icon:graduation-cap";
import Quote from "icon:quote";

const values = [
  {
    icon: Heart,
    title: "Non-Pathologizing",
    body: "We reject the idea that LGBTQ+, kink, or non-monogamous identities are disorders or problems to fix. You are not broken. You never were.",
  },
  {
    icon: Shield,
    title: "Anti-Stigma",
    body: "We actively push back against shame, stigma, and conversion frameworks — in language, in resources, and in every space we hold.",
  },
  {
    icon: Users,
    title: "Community-Centered",
    body: "Decisions are informed by the people this space serves. The communities we support shape who we are and how we grow.",
  },
  {
    icon: HandHeart,
    title: "Consent Culture",
    body: "Consent isn't just about kink. It's foundational to how we treat each other here — in conversation, in advocacy, in everything.",
  },
  {
    icon: Sparkles,
    title: "Radical Acceptance",
    body: "Every identity, relationship structure, and lived experience is welcome. There is no hierarchy of validity here.",
  },
  {
    icon: GraduationCap,
    title: "Professional Collaboration",
    body: "We work with licensed educators and credentialed professionals as partners, not authorities. Community wisdom leads; expertise supports.",
  },
];

export default function About() {
  usePageMeta('About Us', 'Meet the heart behind The Unbound Minds Collective — Amber Frazier\'s story, our values, and why affirming peer advocacy matters for LGBTQ+, kink, and ENM communities.');
  return (
    <div className="bg-bg text-text-primary font-body">

      {/* ── Hero ── */}
      <section className="relative px-6 py-24 sm:py-32 lg:py-40 max-w-4xl mx-auto text-center">
        <p className="text-accent font-body text-sm tracking-widest uppercase mb-4 font-medium">
          The Unbound Minds Collective
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight text-text-primary mb-6">
          Who We Are
        </h1>
        <p className="font-display text-xl sm:text-2xl text-text-secondary italic mb-8 leading-relaxed">
          "Authentic peer advocacy for all the ways we live, love, and thrive."
        </p>
        <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
          This platform was born from a recognition that people in LGBTQ+, BDSM/kink, and ENM/polyamory
          communities often find themselves navigating a world that either misunderstands them or actively
          harms them — sometimes in the very spaces meant to help. We built The Unbound Minds Collective
          because affirming, nuanced support shouldn't be rare. It should be the baseline.
        </p>
      </section>

      {/* ── Founder Story ── */}
      <section className="bg-surface px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-accent font-body text-sm tracking-widest uppercase mb-4 font-medium">
                A Message from the Founder
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-6 leading-tight">
                Built from lived experience.
              </h2>
              <p className="text-text-secondary text-base leading-relaxed mb-4">
                My name is Amber Frazier. I am omnisexual, a switch, and polyamorous — a member of every community this platform serves. And for a long time, I struggled to find care that recognized all of who I am.
              </p>
              <p className="text-text-secondary text-base leading-relaxed mb-4">
                The bias I encountered wasn't only in mental health settings. It showed up in primary care, in the assumptions providers made, in the questions they didn't ask, and in the shame that sometimes accompanied the ones they did. Finding affirming care — truly affirming care, care that didn't require me to leave parts of myself at the door — took far longer than it should have.
              </p>
              <p className="text-text-secondary text-base leading-relaxed mb-4">
                When I finally found it, it changed things. And I knew I wanted to help others find it too.
              </p>
              <p className="text-text-secondary text-base leading-relaxed">
                The Unbound Minds Collective has been three years in the making — a vision shaped by my own journey, by conversations in community, and by the belief that no one should have to fight that hard just to feel seen by the people meant to care for them.
              </p>
            </div>

            <div className="space-y-6">
              {/* Pull quote */}
              <div className="relative bg-raised border border-border rounded-2xl p-7">
                <Quote size={28} className="text-accent/30 mb-3" />
                <p className="font-display text-xl sm:text-2xl text-text-primary leading-relaxed italic">
                  "No one should have to fight that hard just to feel seen by the people meant to care for them."
                </p>
                <p className="text-text-muted text-sm mt-4">— Amber Frazier, Founder</p>
              </div>

              {/* Credentials card */}
              <div className="bg-raised border border-border rounded-2xl p-6 space-y-4">
                <p className="text-accent text-xs font-medium uppercase tracking-widest">About Amber</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <GraduationCap size={18} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-primary text-sm font-medium">Master's Candidate, Clinical Mental Health Counseling</p>
                      <p className="text-text-muted text-xs">The Chicago School of Professional Psychology</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <GraduationCap size={18} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-primary text-sm font-medium">B.A. in Sociology</p>
                      <p className="text-text-muted text-xs">University of Arizona Global Campus</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Heart size={18} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-primary text-sm font-medium">Community Member</p>
                      <p className="text-text-muted text-xs">LGBTQ+ (Omnisexual) · BDSM/Kink (Switch) · ENM/Poly</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision timeline */}
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
                <p className="text-accent text-xs font-medium uppercase tracking-widest mb-2">Three Years in the Making</p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  This platform didn't appear overnight. It grew from years of community conversations, personal experience navigating a system not built for us, and a deepening commitment to doing something about it — for good.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-6">
            Our Mission
          </h2>
          <div className="border-l-4 border-accent pl-6 text-left">
            <p className="text-text-secondary text-lg sm:text-xl leading-relaxed">
              The Unbound Minds Collective is an AI-assisted peer advocacy hub providing affirming, nuanced
              support for LGBTQ+, BDSM/kink, and ENM/polyamory communities — through self-care guidance,
              tailored resources, and help navigating identity-specific challenges. We meet people where they
              are, without judgment, without agenda, and without the assumption that any part of who they are
              needs changing.
            </p>
          </div>
        </div>
      </section>

      {/* ── What Peer Advocacy Means ── */}
      <section className="bg-surface px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-6 leading-tight">
                What "Peer Advocacy" Actually Means
              </h2>
              <p className="text-text-secondary text-base leading-relaxed mb-4">
                Peer advocacy is grounded in something that no clinical model alone can replicate: lived
                experience. When someone in our community shares what they're going through, they're met by
                people who understand not just the theory, but the texture of that experience.
              </p>
              <p className="text-text-secondary text-base leading-relaxed">
                Concretely, that looks like validation of your lived experience without pathologizing it,
                community-informed advocacy that speaks your language, and psychoeducation that helps you
                understand yourself and your relationships on your own terms. It is not therapy. It is not
                diagnosis. It is not crisis intervention. It is something genuinely different — and for many
                people, something genuinely necessary.
              </p>
            </div>
            <div className="bg-raised rounded-2xl p-8 border border-border space-y-5">
              {[
                ["Lived Experience Validation", "Your story is heard, held, and believed — by people who know what it's like."],
                ["Community-Informed Advocacy", "Support shaped by the communities it serves, not by external frameworks."],
                ["Psychoeducation", "Resources and guidance to understand yourself, your identity, and your relationships."],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3">
                  <span className="text-accent mt-1 shrink-0">✦</span>
                  <div>
                    <p className="text-text-primary font-medium mb-1">{title}</p>
                    <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              These aren't aspirations. They're commitments — the principles that shape every interaction,
              every resource, and every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center text-accent border border-border shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-text-primary mb-2">{title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Are Not ── */}
      <section className="bg-surface px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-raised border border-border rounded-2xl p-8 sm:p-10">
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary mb-2">
              What We Are Not
            </h2>
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-6">
              Important to say plainly
            </p>
            <div className="space-y-4 text-text-secondary text-base leading-relaxed">
              <p>
                <strong className="text-text-primary">This is not therapy.</strong> We do not provide mental
                health treatment, clinical assessment, or diagnosis of any kind.
              </p>
              <p>
                <strong className="text-text-primary">We do not provide crisis intervention.</strong> If you
                are in a mental health crisis or immediate danger, please reach out to a crisis service.
              </p>
              <p>
                <strong className="text-text-primary">Facilitators here are educators, not treating clinicians.</strong>{" "}
                Even when licensed professionals join us as guest facilitators, they are acting in an
                educational capacity — not as your provider.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/crisis"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors duration-200 text-sm font-medium"
              >
                Crisis Resources →
              </Link>
              <Link
                to="/guidelines"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors duration-200 text-sm font-medium"
              >
                Community Guidelines →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Facilitators ── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-6">
            Who Facilitates Here
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-4 max-w-xl mx-auto">
            From time to time, licensed and credentialed professionals join us as guest educators — running
            time-limited sessions on topics that matter to our communities. They come as partners, not as
            the platform's permanent staff.
          </p>
          <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-xl mx-auto">
            They bring expertise. We bring community. Together, the result is something more useful than
            either could offer alone.
          </p>
          <Link
            to="/facilitators"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-surface border border-border text-text-primary hover:border-accent hover:text-accent transition-colors duration-200 font-medium"
          >
            Meet our facilitators →
          </Link>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="bg-surface px-6 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight">
            You belong here.
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you're exploring your identity, navigating relationships, looking for community, or just
            tired of spaces that don't quite get it — this was built for you. Come as you are.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-bg font-semibold text-base hover:opacity-90 transition-opacity duration-200"
          >
            Join the Collective
          </Link>
          <p className="text-text-muted text-sm mt-5">
            Free to join. No gatekeeping. No judgment.
          </p>
        </div>
      </section>

    </div>
  );
}
