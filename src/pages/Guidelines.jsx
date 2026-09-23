import { Link } from 'react-router';
import Heart from 'icon:heart';
import Shield from 'icon:shield';
import CheckCircle from 'icon:check-circle';
import XCircle from 'icon:x-circle';
import AlertTriangle from 'icon:alert-triangle';
import Eye from 'icon:eye';
import Gavel from 'icon:gavel';
import Info from 'icon:info';
import Users from 'icon:users';

const commitments = [
  {
    title: 'Your safety comes first',
    body: 'We take harm seriously. Moderators are here, paying attention, and on your side.',
  },
  {
    title: 'We will never pathologize you',
    body: "Your identity — in all its complexity — is not a disorder, a phase, or a problem to be solved. You belong here exactly as you are.",
  },
  {
    title: 'Your privacy matters',
    body: "What you share here stays here. We will never encourage anyone to share more than they're comfortable with.",
  },
  {
    title: 'No stigma, ever',
    body: 'Consensual adult relationships, gender identities, sexual orientations, and kink practices are not shameful. We will actively protect this space from language that treats them otherwise.',
  },
  {
    title: 'We will not moralize',
    body: "We're not here to judge your choices. You'll find curiosity here, not lectures.",
  },
  {
    title: 'You can always get help',
    body: "If you're ever in crisis, we'll point you to real support. See our crisis resources page — it's always one click away.",
  },
];

const welcomed = [
  {
    label: 'Affirming, open-minded discussion',
    detail: 'Conversations that hold space for different experiences and perspectives, especially those that are underrepresented in mainstream mental health spaces.',
  },
  {
    label: 'Lived experience sharing',
    detail: "Your story has value. Sharing what you've been through — the hard parts and the joyful ones — is one of the most powerful things you can offer a community.",
  },
  {
    label: 'Curious questions',
    detail: "There are no stupid questions here, as long as they come from a place of genuine curiosity rather than challenge or judgment.",
  },
  {
    label: 'Peer support and witnessing',
    detail: 'Sometimes people need to be heard, not fixed. Offering presence, validation, and "me too" is deeply valuable.',
  },
  {
    label: 'Advocacy and education',
    detail: 'Sharing resources, writing about your community, and helping others understand — all of this makes us stronger.',
  },
  {
    label: 'Professional and academic perspectives',
    detail: 'Clinicians, researchers, and educators are welcome here as peers — sharing knowledge in accessible, non-clinical ways.',
  },
];

const notAllowed = [
  {
    n: '1',
    label: 'Conversion therapy language or frameworks',
    detail: "Any language, approach, or implication that LGBTQ+ identities, kink, or non-monogamy are disorders to be cured or changed.",
  },
  {
    n: '2',
    label: 'Stigmatizing, pathologizing, or moralizing language',
    detail: "Treating someone's consensual identity or relationship structure as deviant, broken, or morally inferior.",
  },
  {
    n: '3',
    label: 'Outing or sharing private information without consent',
    detail: "Sharing identifying information about another person that they have not chosen to make public — in any context.",
  },
  {
    n: '4',
    label: 'Harassment, threats, or targeted abuse',
    detail: 'Any sustained negative attention toward an individual, including in private messages reported to moderators.',
  },
  {
    n: '5',
    label: 'Unsolicited advice on identity, relationships, or practices',
    detail: "Unless someone has specifically asked for input on their relationship structure, identity, or kink practices, keep opinions to yourself.",
  },
  {
    n: '6',
    label: 'Explicit sexual content',
    detail: 'This is a mental health advocacy space, not an adult content platform. Discussion of sexuality and kink is welcome; explicit descriptions or imagery are not.',
  },
  {
    n: '7',
    label: 'Spam or unsolicited self-promotion',
    detail: 'Promoting services, products, or other platforms outside of spaces designated for that purpose.',
  },
  {
    n: '8',
    label: 'Impersonation',
    detail: 'Pretending to be another person, a community figure, or a moderator.',
  },
];

const moderationActions = [
  {
    action: 'Hiding posts',
    desc: 'A post that violates the guidelines may be hidden from public view. The author will be notified.',
  },
  {
    action: 'Warnings',
    desc: 'A first or minor violation may result in a private message explaining what happened and why.',
  },
  {
    action: 'Timeouts',
    desc: 'Repeated or more serious violations may result in a temporary pause on posting.',
  },
  {
    action: 'Bans',
    desc: 'Serious or persistent harm to the community may result in removal. This is always a last resort.',
  },
];

const notService = [
  'We are not a therapy service. Nothing here replaces working with a qualified mental health professional.',
  'We are not a crisis intervention service. If you or someone you know is in immediate danger, please use dedicated crisis resources.',
  'We are not able to diagnose, treat, or prescribe. Any information shared here is peer experience, not clinical advice.',
];

export default function Guidelines() {
  return (
    <div className="font-body text-text-primary min-h-screen">

      {/* Hero */}
      <section className="bg-surface py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-accent/10 p-4 rounded-full">
              <Heart className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-primary mb-6 leading-tight">
            Our Community Guidelines
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            This space was built on trust, respect, and radical acceptance — by people who know what it
            feels like to be unseen, misunderstood, or pushed to the margins. These guidelines are not
            rules handed down from on high. They are the shape of the care we are committed to giving
            each other, written down so everyone knows they can count on it.
          </p>
        </div>
      </section>

      {/* Our Commitments to You */}
      <section className="bg-bg py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-7 h-7 text-sage flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
              Our Commitments to You
            </h2>
          </div>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed">
            Before we ask anything of you, we want to be clear about what we promise.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {commitments.map(({ title, body }) => (
              <div key={title} className="bg-surface border border-border rounded-sm p-6">
                <h3 className="font-display text-xl font-semibold text-accent mb-2">{title}</h3>
                <p className="text-text-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Welcome */}
      <section className="bg-surface py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="w-7 h-7 text-sage flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
              What We Welcome
            </h2>
          </div>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed">
            This community is most alive when people feel free to show up authentically. Here is what
            that looks like in practice:
          </p>
          <ul className="space-y-4">
            {welcomed.map(({ label, detail }) => (
              <li key={label} className="flex gap-4 bg-bg border border-border rounded-sm p-5">
                <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-sage" />
                <div>
                  <span className="font-semibold text-text-primary">{label}</span>
                  <span className="text-text-secondary"> — {detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What We Don't Allow */}
      <section className="bg-bg py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <XCircle className="w-7 h-7 text-danger flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
              What We Do Not Allow
            </h2>
          </div>
          <p className="text-text-secondary mb-8 text-lg leading-relaxed">
            Holding this space takes real boundaries. The following are not welcome here, and posts or
            behaviour that cross these lines will be moderated:
          </p>
          <ol className="space-y-4 list-none">
            {notAllowed.map(({ n, label, detail }) => (
              <li key={n} className="flex gap-5 bg-surface border border-border rounded-sm p-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold text-sm">
                  {n}
                </span>
                <div>
                  <span className="font-semibold text-text-primary">{label}</span>
                  <p className="text-text-secondary mt-1 leading-relaxed">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Content Warnings */}
      <section className="bg-surface py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Eye className="w-7 h-7 text-accent flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
              Content Warnings
            </h2>
          </div>
          <p className="text-text-secondary mb-6 text-lg leading-relaxed">
            We encourage — but do not require — members to add a brief content warning at the top of
            posts that touch on topics that might catch someone off guard when they are not in the
            right headspace. This is a small act of care that goes a long way.
          </p>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Good candidates for a content warning include: trauma, mental health struggles, grief and
            loss, detailed descriptions of kink or BDSM practices, relationship breakdown, and accounts
            of discrimination or violence.
          </p>
          <div className="bg-bg border border-border rounded-sm p-6 mt-6">
            <p className="text-text-muted text-sm uppercase tracking-wider font-semibold mb-3">
              The format
            </p>
            <p className="font-mono text-text-primary text-base bg-raised rounded-sm px-4 py-3 inline-block border border-border">
              CW: [topic] — then your post begins here.
            </p>
            <p className="text-text-secondary mt-4 leading-relaxed text-sm">
              For example: <span className="italic">CW: mental health, dissociation</span> or{' '}
              <span className="italic">CW: relationship ending</span>. Short and honest is all it
              needs to be.
            </p>
          </div>
        </div>
      </section>

      {/* Moderation */}
      <section className="bg-bg py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Gavel className="w-7 h-7 text-sage flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
              How Moderation Works
            </h2>
          </div>
          <p className="text-text-secondary mb-6 text-lg leading-relaxed">
            Moderation is handled by community members who have taken on that role with care and
            intention. They are not here to police you — they are here to protect the space.
          </p>
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {moderationActions.map(({ action, desc }) => (
              <div key={action} className="bg-surface border border-border rounded-sm p-5">
                <h3 className="font-semibold text-text-primary mb-2">{action}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface border border-accent/30 rounded-sm p-6">
            <p className="text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">All moderation actions are logged</span>{' '}
              for accountability and transparency. If you believe a moderation action was taken in
              error, you are welcome to raise it through the{' '}
              <Link
                to="/suggestion-box"
                className="text-accent underline underline-offset-2 hover:text-accent-hover"
              >
                Suggestion Box
              </Link>
              . We take appeals seriously.
            </p>
          </div>
        </div>
      </section>

      {/* What We Are Not */}
      <section className="bg-surface py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="w-7 h-7 text-accent flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
              What We Are Not
            </h2>
          </div>
          <p className="text-text-secondary mb-6 text-lg leading-relaxed">
            We want to be crystal clear about this, because it matters:
          </p>
          <div className="space-y-4 mb-8">
            {notService.map((item) => (
              <div key={item} className="flex gap-4 items-start bg-bg border border-border rounded-sm p-5">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2" />
                <p className="text-text-secondary leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-danger/5 border border-danger/20 rounded-sm p-6">
            <p className="text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">If you are in crisis right now</span>,
              please do not wait for a community response. Our{' '}
              <Link
                to="/crisis"
                className="text-accent underline underline-offset-2 hover:text-accent-hover font-semibold"
              >
                crisis resources page
              </Link>{' '}
              has real help available immediately — including lines specifically for LGBTQ+ and kink
              community members.
            </p>
          </div>
        </div>
      </section>

      {/* Consent */}
      <section className="bg-bg py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-7 h-7 text-sage flex-shrink-0" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
              A Note on Consent
            </h2>
          </div>
          <div className="bg-surface border border-border rounded-sm p-8">
            <p className="text-text-secondary text-lg leading-relaxed mb-5">
              Many of the communities this space serves are built around a deep, thoughtful practice of
              consent — not just in physical or sexual contexts, but as an everyday ethic of how we
              treat each other.
            </p>
            <p className="text-text-secondary leading-relaxed mb-5">
              We carry that culture into this space. That means: asking before sharing someone else's
              story; checking in before offering feedback or advice; respecting when someone says
              they are not open to input right now; and understanding that silence or uncertainty is
              not consent.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Consent culture also means that <span className="italic">you</span> get to set limits on
              what you engage with here. You do not owe anyone your story, your response, or your
              emotional labor. Showing up in whatever way you can is always enough.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-surface py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <Info className="w-8 h-8 text-accent mx-auto mb-4" />
          <p className="font-display text-2xl text-text-primary mb-4 leading-snug">
            These guidelines will grow with us.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            As our community evolves, so will the way we care for it. If you have thoughts, concerns,
            or ideas about how to make this space safer or more welcoming, please share them with us.
          </p>
          <Link
            to="/suggestion-box"
            className="inline-block bg-accent text-white font-semibold px-8 py-3 rounded-sm hover:bg-accent-hover transition-colors"
          >
            Share a suggestion
          </Link>
        </div>
      </section>

    </div>
  );
}
