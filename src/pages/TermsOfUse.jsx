import { Link } from 'react-router';
import usePageMeta from '../hooks/usePageMeta.js';
import FileText from 'icon:file-text';
import Shield from 'icon:shield';
import Users from 'icon:users';
import AlertTriangle from 'icon:alert-triangle';
import Heart from 'icon:heart';
import Scale from 'icon:scale';

const sections = [
  {
    icon: Users,
    title: 'Who this is for',
    content: [
      'The Unbound Minds Collective is an online peer advocacy community open to adults (18+) who are part of or allies to LGBTQ+, kink/BDSM, and ENM/polyamory communities.',
      'By creating an account or participating in any part of this platform, you agree to these Terms of Use. If you do not agree, please do not use the platform.',
      'Membership requires an invite code during our founding period. Invite codes do not guarantee ongoing access — we reserve the right to remove any member who violates these terms.',
    ],
  },
  {
    icon: Heart,
    title: 'What we are — and are not',
    content: [
      'The Unbound Minds Collective is a peer-led community space. We are not a therapy practice, mental health clinic, crisis service, or licensed healthcare provider. Nothing shared on this platform constitutes medical, psychological, or legal advice.',
      'Our facilitators share lived experience and knowledge — they are not acting as your therapist, counselor, or doctor. Any information shared is for educational and peer support purposes only.',
      'If you are experiencing a mental health crisis, please contact a professional service immediately. Our Crisis Resources page lists services available to you.',
    ],
  },
  {
    icon: Shield,
    title: 'Your responsibilities as a member',
    content: [
      'You are responsible for everything you post, share, or submit on this platform. By participating, you agree to treat all members with dignity and respect.',
      'You will not post content that is harassing, threatening, discriminatory, or designed to harm another person. You will not share another member\'s personal information without their explicit consent.',
      'You will not use this platform to promote conversion practices, pathologize identities, or suggest that any consensual adult identity or relationship structure is disordered, harmful, or in need of fixing.',
      'You will respect content warnings and trigger notices posted by other members, and use them yourself when sharing sensitive content.',
      'You will not share, screenshot, or reproduce private posts or personal disclosures from other members outside of this platform without their explicit permission.',
    ],
  },
  {
    icon: Scale,
    title: 'Moderation and enforcement',
    content: [
      'Our moderation team has the authority to hide posts, issue warnings, apply temporary restrictions, or permanently remove any member whose conduct violates these terms or the spirit of this community.',
      'Moderation decisions are made in good faith. If you believe a decision was made in error, you may contact us directly. We will listen, but all moderation decisions are ultimately at our discretion.',
      'We reserve the right to update these terms at any time. Continued participation after an update constitutes acceptance of the revised terms.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Content and intellectual property',
    content: [
      'You retain ownership of anything you post. By posting, you grant The Unbound Minds Collective a non-exclusive licence to display your content within the platform for as long as it remains posted.',
      'You will not post content that infringes on another person\'s copyright, trademark, or other intellectual property rights.',
      'Facilitator materials, workbooks, and session content are the intellectual property of the individual facilitators who created them. Do not reproduce or distribute them without the facilitator\'s explicit permission.',
    ],
  },
  {
    icon: FileText,
    title: 'Limitation of liability',
    content: [
      'The Unbound Minds Collective, its founder, moderators, and facilitators are not liable for any harm, loss, or damage arising from your use of this platform or reliance on anything shared within it.',
      'We make no warranties about the accuracy, completeness, or fitness for any purpose of any content posted by members or facilitators.',
      'This platform is provided in good faith as a peer community space. Use it as such.',
    ],
  },
];

export default function TermsOfUse() {
  usePageMeta(
    'Terms of Use — The Unbound Minds Collective',
    'Terms of Use for The Unbound Minds Collective. A peer-led community space for LGBTQ+, kink, and ENM/polyamory communities — not a therapy or crisis service.'
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4">
          <FileText size={14} />
          <span>Legal</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-text-primary mb-4">Terms of Use</h1>
        <p className="text-text-secondary leading-relaxed">
          These terms govern your use of The Unbound Minds Collective platform. They are written in plain language because we believe you deserve to understand what you're agreeing to.
        </p>
        <p className="text-text-muted text-sm mt-3">Last updated: September 2026</p>
      </div>

      {/* Intro callout */}
      <div className="bg-accent/8 border border-accent/20 rounded-sm px-6 py-5 mb-10">
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-text-primary">The short version:</strong> This is a peer community built on mutual respect, consent culture, and radical welcome. Be kind, hold space for others, and honor the privacy of what people share here. Full details below.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map(({ icon: Icon, title, content }) => (
          <section key={title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-accent" />
              </div>
              <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
            </div>
            <div className="space-y-3 pl-11">
              {content.map((para, i) => (
                <p key={i} className="text-text-secondary text-sm leading-relaxed">{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-text-muted text-sm leading-relaxed">
          Questions about these terms? Reach out via the{' '}
          <Link to="/suggestion-box" className="text-accent hover:text-accent-hover underline">Suggestion Box</Link>{' '}
          or contact us directly at{' '}
          <a href="mailto:amber@unboundmindscollective.org" className="text-accent hover:text-accent-hover underline">
            amber@unboundmindscollective.org
          </a>.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <Link to="/privacy" className="text-sm text-text-secondary hover:text-accent transition-colors underline">Privacy Policy</Link>
          <Link to="/guidelines" className="text-sm text-text-secondary hover:text-accent transition-colors underline">Community Guidelines</Link>
          <Link to="/crisis" className="text-sm text-text-secondary hover:text-accent transition-colors underline">Crisis Resources</Link>
        </div>
      </div>
    </div>
  );
}
