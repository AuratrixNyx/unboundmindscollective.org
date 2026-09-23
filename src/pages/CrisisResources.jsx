import Phone from 'icon:phone';
import MessageSquare from 'icon:message-square';
import ExternalLink from 'icon:external-link';
import usePageMeta from '../hooks/usePageMeta.js';
import AlertTriangle from 'icon:alert-triangle';

const resources = [
  {
    name: '988 Suicide & Crisis Lifeline',
    serves: 'Anyone in suicidal crisis or emotional distress',
    phone: '988',
    text: 'Text 988',
    chat: 'https://988lifeline.org',
    chatLabel: '988lifeline.org',
  },
  {
    name: 'Crisis Text Line',
    serves: 'Anyone in crisis — free, confidential text support 24/7',
    text: 'Text HOME to 741741',
    chat: 'https://crisistextline.org',
    chatLabel: 'crisistextline.org',
  },
  {
    name: 'The Trevor Project',
    serves: 'LGBTQ+ young people under 25',
    phone: '1-866-488-7386',
    text: 'Text START to 678-678',
    chat: 'https://thetrevorproject.org',
    chatLabel: 'thetrevorproject.org',
  },
  {
    name: 'Trans Lifeline',
    serves: 'Trans and questioning people — staffed by trans operators',
    phone: '877-565-8860',
    chat: 'https://translifeline.org',
    chatLabel: 'translifeline.org',
  },
  {
    name: 'RAINN',
    serves: 'Survivors of sexual violence and their loved ones',
    phone: '1-800-656-4673',
    chat: 'https://rainn.org',
    chatLabel: 'rainn.org — Online chat available',
  },
  {
    name: 'NAMI Helpline',
    serves: 'People affected by mental illness and their families',
    phone: '1-800-950-6264',
    text: 'Text NAMI to 741741',
    chat: 'https://nami.org',
    chatLabel: 'nami.org',
  },
  {
    name: 'National Domestic Violence Hotline',
    serves: 'Survivors of domestic violence in all relationship structures',
    phone: '1-800-799-7233',
    text: 'Text START to 88788',
    chat: 'https://thehotline.org',
    chatLabel: 'thehotline.org — Chat available',
  },
  {
    name: 'SAMHSA National Helpline',
    serves: 'Substance use and mental health — free, confidential, 24/7',
    phone: '1-800-662-4357',
    chat: 'https://samhsa.gov',
    chatLabel: 'samhsa.gov',
  },
];

export default function CrisisResources() {
  usePageMeta('Crisis Resources', 'Immediate crisis support resources for LGBTQ+, kink, and polyamory communities — hotlines, text lines, and online chats available 24/7. You are not alone.');
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-danger shrink-0" size={28} />
          <h1 className="font-display text-4xl font-bold text-text-primary">Crisis &amp; Urgent Support</h1>
        </div>
        <div className="bg-danger/10 border border-danger/30 rounded-sm p-5">
          <p className="text-text-primary leading-relaxed font-medium mb-2">
            This platform does not provide crisis intervention.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Please contact one of the services below if you need immediate support. All of the resources listed here are free, available 24/7, and serve people from all communities and relationship structures. You deserve help — and it's available right now.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {resources.map(r => (
          <div key={r.name} className="bg-surface border border-border rounded-sm p-5">
            <h2 className="font-display text-lg font-semibold text-text-primary mb-1">{r.name}</h2>
            <p className="text-text-muted text-xs mb-4 leading-relaxed">{r.serves}</p>
            <div className="space-y-2">
              {r.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-sage shrink-0" />
                  <a href={`tel:${r.phone.replace(/[^0-9]/g, '')}`} className="text-text-primary text-sm font-medium hover:text-accent transition-colors">
                    {r.phone}
                  </a>
                </div>
              )}
              {r.text && (
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-accent shrink-0" />
                  <span className="text-text-secondary text-sm">{r.text}</span>
                </div>
              )}
              {r.chat && (
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} className="text-text-muted shrink-0" />
                  <a href={r.chat} target="_blank" rel="noopener noreferrer"
                    className="text-text-muted text-sm hover:text-accent transition-colors">
                    {r.chatLabel}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-surface border border-border rounded-sm p-5">
        <p className="text-text-muted text-sm leading-relaxed">
          <strong className="text-text-secondary">A note on our community:</strong> The Unbound Minds Collective provides peer advocacy, community connection, and psychoeducation — not crisis intervention or mental health treatment. If you're unsure whether what you're experiencing is a crisis, reach out to any of the services above — they're trained to help you figure it out.
        </p>
      </div>
    </div>
  );
}
