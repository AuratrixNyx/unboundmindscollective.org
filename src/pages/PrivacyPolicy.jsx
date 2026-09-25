import { Link } from 'react-router';
import usePageMeta from '../hooks/usePageMeta.js';
import Lock from 'icon:lock';
import Eye from 'icon:eye';
import Database from 'icon:database';
import Trash from 'icon:trash-2';
import FileText from 'icon:file-text';
import Shield from 'icon:shield';

const sections = [
  {
    icon: Database,
    title: 'What information we collect',
    content: [
      'When you create an account, we collect your email address, the display name you choose, and the invite code you used. You may optionally add a bio and identity interests to your profile — these are entirely your choice.',
      'When you post in the community forum, submit a session question, or fill out a suggestion, that content is stored so it can be displayed to other members as intended.',
      'When you sign up for the monthly digest, we store your email address and any interests you share for that purpose only.',
      'We do not collect payment information, government-issued identification, or any sensitive personal data.',
    ],
  },
  {
    icon: Eye,
    title: 'What we do not collect',
    content: [
      'Workbook answers filled in during sessions are never saved, submitted, or seen by anyone — they exist only in your browser and disappear when you close the page.',
      'We do not use advertising trackers, third-party analytics, or any tools that sell your data or behavior to outside parties.',
      'We do not collect your location, device fingerprint, or any information beyond what you actively provide.',
    ],
  },
  {
    icon: Shield,
    title: 'How your information is used',
    content: [
      'Your email address is used to log you in and, if you opt in, to send community digests. It is never shared with facilitators, other members, or any third party.',
      'Your display name and any profile information you choose to make public is shown within the community as you configure it.',
      'Posts and session questions you submit are stored and displayed to other members within the platform. Moderators and administrators can see all content for safety and moderation purposes.',
      'We may use anonymised, aggregated information (e.g. "most active category this month") to understand how the community is growing — never in a way that identifies you.',
    ],
  },
  {
    icon: Lock,
    title: 'How your information is protected',
    content: [
      'Your account password is encrypted and cannot be read by anyone, including administrators. If you forget it, it must be reset — it cannot be recovered.',
      'Access to member data is restricted to administrators and moderators, who are bound by the same Community Guidelines and expectations of confidentiality as all members.',
      'We take reasonable technical precautions to protect your data, though no online platform can guarantee absolute security.',
    ],
  },
  {
    icon: Trash,
    title: 'Your rights and choices',
    content: [
      'You may update or remove your profile information at any time from your Profile page.',
      'You may request that your account and all associated data be permanently deleted by contacting us. We will process deletion requests within 30 days.',
      'Posts you have made in the community forum may remain visible after account deletion unless you delete them yourself before requesting account removal.',
      'You may opt out of the monthly digest at any time by contacting us or updating your notification preferences in your profile.',
    ],
  },
  {
    icon: FileText,
    title: 'Changes to this policy',
    content: [
      'We may update this Privacy Policy from time to time. When we do, the "Last updated" date at the top of this page will change.',
      'Continued use of the platform after an update constitutes acceptance of the revised policy. If a change is significant, we will make a note of it in the community.',
      'Questions or concerns about how your data is handled? Reach out — we are a small, community-run space and we take this seriously.',
    ],
  },
];

export default function PrivacyPolicy() {
  usePageMeta(
    'Privacy Policy — The Unbound Minds Collective',
    'Privacy Policy for The Unbound Minds Collective. We collect only what you give us, never sell your data, and keep your workbook answers entirely private to you.'
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4">
          <Lock size={14} />
          <span>Legal</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
        <p className="text-text-secondary leading-relaxed">
          Your privacy matters here. This policy explains what we collect, why we collect it, and what we never do with it. Written plainly, because you deserve to understand it.
        </p>
        <p className="text-text-muted text-sm mt-3">Last updated: September 2026</p>
      </div>

      {/* Intro callout */}
      <div className="bg-sage/8 border border-sage/20 rounded-sm px-6 py-5 mb-10">
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-text-primary">The short version:</strong> We collect only what you give us. We never sell it. Your workbook answers are never saved anywhere. You can ask us to delete everything at any time.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map(({ icon: Icon, title, content }) => (
          <section key={title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-sm bg-sage/10 border border-sage/20 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-sage" />
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
          Questions about your privacy or this policy? Contact us at{' '}
          <a href="mailto:amber@unboundmindscollective.org" className="text-accent hover:text-accent-hover underline">
            amber@unboundmindscollective.org
          </a>{' '}
          or reach out via the{' '}
          <Link to="/suggestion-box" className="text-accent hover:text-accent-hover underline">Suggestion Box</Link>.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <Link to="/terms" className="text-sm text-text-secondary hover:text-accent transition-colors underline">Terms of Use</Link>
          <Link to="/guidelines" className="text-sm text-text-secondary hover:text-accent transition-colors underline">Community Guidelines</Link>
          <Link to="/crisis" className="text-sm text-text-secondary hover:text-accent transition-colors underline">Crisis Resources</Link>
        </div>
      </div>
    </div>
  );
}
