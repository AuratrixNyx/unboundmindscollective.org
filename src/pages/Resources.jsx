import { useState } from 'react';
import ExternalLink from 'icon:external-link';
import BookOpen from 'icon:book-open';

const tabs = ['LGBTQ+ Directories', 'Kink/BDSM Directories', 'ENM/Poly Directories', 'Education Hub'];

const resources = {
  'LGBTQ+ Directories': [
    {
      name: 'NQTTCN',
      fullName: 'National Queer and Trans Therapists of Color Network',
      desc: 'A healing justice organization committed to transforming mental healthcare for queer and trans people of color.',
      url: 'https://nqttcn.com',
    },
    {
      name: 'LGBTQ+ Healthcare Directory',
      fullName: 'LGBTQ+ Healthcare Directory',
      desc: 'A curated directory of healthcare providers who affirm and understand LGBTQ+ needs and lived experience.',
      url: 'https://lgbthealthcare.org',
    },
    {
      name: 'Inclusive Therapists',
      fullName: 'Inclusive Therapists',
      desc: 'Connecting BIPOC, LGBTQ+, and other marginalized communities with therapists who genuinely get it.',
      url: 'https://inclusivetherapists.com',
    },
    {
      name: 'Therapy for QPOC',
      fullName: 'Therapy for Queer People of Color',
      desc: 'A resource hub and directory dedicated to supporting queer people of color in accessing affirming mental health support.',
      url: 'https://therapyforqpoc.com',
    },
    {
      name: 'GLMA Provider Directory',
      fullName: 'GLMA: Health Professionals Advancing LGBTQ Equality',
      desc: 'Provider directory from GLMA, the leading association of LGBTQ+ healthcare professionals.',
      url: 'https://glma.org',
    },
    {
      name: 'WPATH Provider Search',
      fullName: 'World Professional Association for Transgender Health',
      desc: 'Find providers who follow WPATH standards of care for trans and gender-diverse people.',
      url: 'https://wpath.org',
    },
  ],
  'Kink/BDSM Directories': [
    {
      name: 'Kink Aware Professionals (KAP)',
      fullName: 'Kink Aware Professionals — NCSF',
      desc: 'A directory of mental health and medical professionals who are knowledgeable about and sensitive to diverse expressions of sexuality, including BDSM and kink.',
      url: 'https://kapprofessionals.org',
    },
    {
      name: 'Psychology Today (Kink-Allied)',
      fullName: 'Psychology Today Therapist Finder — Kink-Allied Filter',
      desc: 'Use the kink-allied filter on Psychology Today\'s directory to find local therapists who practice without pathologizing kink.',
      url: 'https://psychologytoday.com/us/therapists',
    },
    {
      name: 'AASECT Directory',
      fullName: 'American Association of Sexuality Educators, Counselors and Therapists',
      desc: 'Find AASECT-certified sex therapists and counselors who approach sexuality from an informed, non-judgmental lens.',
      url: 'https://aasect.org/referral-directory',
    },
    {
      name: 'Manhattan Alternative',
      fullName: 'Manhattan Alternative',
      desc: 'Therapy and education resources specifically serving the kink, leather, and BDSM communities.',
      url: 'https://manhattanalternative.com',
    },
  ],
  'ENM/Poly Directories': [
    {
      name: 'Polyfriendly.org',
      fullName: 'Polyfriendly Relationship Therapist Directory',
      desc: 'A directory of therapists who understand and affirm polyamorous and ethically non-monogamous relationships.',
      url: 'https://polyfriendly.org',
    },
    {
      name: 'Kink Aware Professionals',
      fullName: 'Kink Aware Professionals — also serves ENM communities',
      desc: 'Many KAP-listed professionals are also knowledgeable about ENM and polyamory — look for providers who note this.',
      url: 'https://kapprofessionals.org',
    },
    {
      name: 'TherapyDen (ENM Filter)',
      fullName: 'TherapyDen — Open Relationships & Polyamory Filter',
      desc: 'TherapyDen makes it easy to filter for therapists who work with open relationships, ENM, and polyamory.',
      url: 'https://therapyden.com',
    },
    {
      name: 'Psychology Today (Non-Monogamy)',
      fullName: 'Psychology Today — Non-Monogamy Specialty Filter',
      desc: 'Use the non-traditional relationship specialty filter to find therapists experienced with ENM and poly dynamics.',
      url: 'https://psychologytoday.com/us/therapists',
    },
  ],
  'Education Hub': [
    {
      name: 'Minority Stress & Queer Communities',
      fullName: 'Understanding Minority Stress in LGBTQ+ Lives',
      desc: 'Psychoeducation on how chronic social stress affects LGBTQ+ individuals, and what peer advocacy can do to help buffer it.',
      url: '#',
      isArticle: true,
    },
    {
      name: 'Stigma in Kink-Aware Care',
      fullName: 'Navigating Stigma When Seeking Kink-Aware Healthcare',
      desc: 'A guide to understanding why kink communities often face pathologization in healthcare, and how to advocate for yourself.',
      url: '#',
      isArticle: true,
    },
    {
      name: 'Attachment in Polyamory',
      fullName: 'Attachment Theory & Polyamorous Relationships',
      desc: 'How attachment styles show up in multi-partner relationships — and what that can teach us about communication and care.',
      url: '#',
      isArticle: true,
    },
    {
      name: 'Identity Burnout',
      fullName: 'Identity Burnout: When Advocacy Becomes Exhaustion',
      desc: 'Understanding the particular kind of fatigue that comes from constantly educating, defending, and navigating stigma as a marginalized person.',
      url: '#',
      isArticle: true,
    },
    {
      name: 'Community Advocacy Basics',
      fullName: 'What Is Peer Advocacy? A Community Introduction',
      desc: 'An overview of peer advocacy as a practice — what it is, how it differs from therapy, and why it matters for marginalized communities.',
      url: '#',
      isArticle: true,
    },
  ],
};

export default function Resources() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-3">Resource Directories</h1>
        <p className="text-text-secondary leading-relaxed max-w-2xl">
          We've gathered affirming directories and educational resources to help you find providers and information that understand your life. Always verify a provider's information directly before reaching out.
        </p>
        <div className="mt-4 p-4 bg-surface border border-border rounded-sm text-xs text-text-muted leading-relaxed">
          <strong className="text-text-secondary">A note:</strong> These are independently maintained directories. We link to them as a community service — always verify a provider's current information, qualifications, and affirming practices directly.
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-border pb-3">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-accent text-bg' : 'text-text-secondary hover:text-text-primary hover:bg-raised'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {resources[activeTab].map(r => (
          <div key={r.name} className="bg-surface border border-border rounded-sm p-5 flex flex-col">
            <div className="flex items-start gap-2 mb-1">
              {r.isArticle && <BookOpen size={16} className="text-accent shrink-0 mt-0.5" />}
              <h3 className="font-display text-lg font-semibold text-text-primary">{r.name}</h3>
            </div>
            <p className="text-text-muted text-xs mb-2">{r.fullName}</p>
            <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-4">{r.desc}</p>
            {r.url !== '#' ? (
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors font-medium self-start">
                <ExternalLink size={14} /> Visit Directory
              </a>
            ) : (
              <span className="text-xs text-text-muted italic">Coming soon — education articles in development</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
