import { useState } from 'react';
import { Link } from 'react-router';
import usePageMeta from '../hooks/usePageMeta.js';
import AlertTriangle from 'icon:alert-triangle';
import ArrowLeft from 'icon:arrow-left';
import BookOpen from 'icon:book-open';

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'self-harm', 'hurt myself',
  'cutting', 'overdose', 'die', 'dying', 'hopeless', "don't want to live", "dont want to live",
  "no reason to live", "want to die",
];

const topics = [
  {
    id: 'identity',
    label: 'Navigating Identity',
    prompts: [
      'What parts of your identity feel most alive right now — and what parts are you still exploring?',
      'When do you feel most fully yourself? What conditions or people make that possible?',
      'Is there any part of your identity that you\'ve been hiding or minimizing? What would it feel like to let it breathe more freely?',
    ],
    selfcare: 'Try writing a letter to a younger version of yourself — one who didn\'t yet know what you now know about who you are. What would you want them to hear?',
  },
  {
    id: 'connection',
    label: 'Community Connection',
    prompts: [
      'What does belonging feel like in your body? When have you felt that sense of genuine community?',
      'Are there ways your community shows up for you that you sometimes overlook or take for granted?',
      'What kind of connection are you most hungry for right now — and what\'s one small step toward it?',
    ],
    selfcare: 'Reach out to one person in your life today — not to problem-solve, just to say you\'re thinking of them. Connection doesn\'t require an occasion.',
  },
  {
    id: 'relationships',
    label: 'Relationship Dynamics',
    prompts: [
      'In your most important relationships, do you feel seen for who you actually are — or for who you\'re performing?',
      'What do you need most from your partners or close connections right now that you haven\'t fully voiced?',
      'When relationships feel hard, what do you tend to do first — pull away, push harder, or something else entirely?',
    ],
    selfcare: 'Choose one relationship and write down three things you genuinely appreciate about that person. Notice how it feels to hold that appreciation consciously.',
  },
  {
    id: 'stigma',
    label: 'Managing Stigma',
    prompts: [
      'Whose voices have you internalized that make you question whether your identity is valid or your relationships are real?',
      'How do you typically respond when someone misunderstands or dismisses who you are? What do you wish you could say?',
      'What helps you stay grounded in your own truth when the outside world is loud with judgment?',
    ],
    selfcare: 'Write a brief "counter-narrative" — a few sentences that affirm the truth of your identity and choices, in your own words. Return to it when external voices get too loud.',
  },
  {
    id: 'selfcompassion',
    label: 'Self-Compassion Practices',
    prompts: [
      'How do you speak to yourself when you make a mistake or feel like you\'ve let yourself down? Would you speak that way to someone you love?',
      'What\'s something you\'re carrying right now that deserves acknowledgment — even if nobody else has offered it?',
      'Where in your body do you feel the weight of self-criticism? What might it feel like to set it down, even briefly?',
    ],
    selfcare: 'Place a hand on your chest and say to yourself: "This is hard. I\'m doing the best I can. I\'m allowed to be imperfect." Repeat it until it lands.',
  },
  {
    id: 'minority-stress',
    label: 'Processing Minority Stress',
    prompts: [
      'What aspects of navigating the world as who you are take the most energy? Which ones have you stopped naming because they\'ve become so routine?',
      'How does the accumulated weight of everyday discrimination or misunderstanding show up in your body, mood, or relationships?',
      'What restoration looks like for you — what actually replenishes you, versus what you default to when you\'re depleted?',
    ],
    selfcare: 'Make a list of five things that genuinely restore you — not what you think "should" restore you. Honor the actual list.',
  },
  {
    id: 'boundaries',
    label: 'Setting Boundaries',
    prompts: [
      'Where in your life do you feel resentment, depletion, or a quiet sense of "I shouldn\'t have to"? Those are often signs a boundary is needed.',
      'When you imagine saying "no" or "not right now" to someone, what does the internal resistance feel like?',
      'What would it mean to trust yourself enough to hold a limit — even if it disappoints someone you care about?',
    ],
    selfcare: 'Identify one small boundary you\'ve been avoiding and practice the exact words out loud. Say them to yourself in the mirror. The words matter less than the practice of using your voice.',
  },
  {
    id: 'finding-care',
    label: 'Finding Care',
    prompts: [
      'What does "good care" look like for you? Have you ever experienced it fully — and if not, what gets in the way?',
      'What barriers have made it hard to access the kind of support you deserve — practical, financial, cultural, or otherwise?',
      'What would you tell a close friend who needed the kind of support you\'re currently looking for?',
    ],
    selfcare: 'Check out our Resources page for affirming directories of providers who understand your community. You don\'t have to educate your therapist — you deserve one who already gets it.',
  },
];

function hasCrisisKeyword(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
}

const CrisisBanner = () => (
  <div className="bg-danger/10 border border-danger/30 rounded-sm p-4 flex items-start gap-3">
    <AlertTriangle className="text-danger shrink-0 mt-0.5" size={18} />
    <div>
      <p className="text-danger font-medium text-sm mb-1">If you're in crisis, please reach out now.</p>
      <p className="text-text-secondary text-xs leading-relaxed">
        This guide is not a crisis service. If you're experiencing thoughts of suicide or self-harm, please contact{' '}
        <strong>988</strong> (call or text), text <strong>HOME to 741741</strong>, or visit our{' '}
        <Link to="/crisis" className="underline text-danger/80 hover:text-danger">Crisis Resources page</Link>.
      </p>
    </div>
  </div>
);

export default function AIGuide() {
  usePageMeta('Self-Care Guide', 'A gentle, guided self-reflection tool from The Unbound Minds Collective — explore your feelings, find grounding prompts, and access crisis support when you need it most.');
  const [step, setStep] = useState('select'); // 'select' | 'reflect' | 'crisis'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [journal, setJournal] = useState('');

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setStep('reflect');
    setJournal('');
  };

  const handleJournalChange = (e) => {
    const val = e.target.value;
    setJournal(val);
    if (hasCrisisKeyword(val)) {
      setStep('crisis');
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedTopic(null);
    setJournal('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-3">Peer Self-Care Guide</h1>
        <p className="text-text-secondary leading-relaxed">
          A space for gentle reflection and affirming self-exploration. Choose a topic and work through some prompts at your own pace.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-surface border border-border rounded-sm p-4 mb-6 text-sm text-text-secondary leading-relaxed">
        <span className="text-accent font-medium">About this guide: </span>
        This guide offers peer-style self-care prompts and affirming reflection questions. It is not a therapist, counselor, or crisis service. If you are in distress, please reach out to a professional or crisis line.
      </div>

      {step === 'select' && (
        <>
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-4">What would you like to explore?</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {topics.map(topic => (
              <button key={topic.id} onClick={() => handleTopicSelect(topic)}
                className="text-left p-4 bg-surface border border-border rounded-sm hover:border-accent/50 hover:bg-raised transition-colors group">
                <span className="text-text-primary text-sm font-medium group-hover:text-accent transition-colors">{topic.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'reflect' && selectedTopic && (
        <div className="space-y-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-text-muted text-sm hover:text-text-secondary transition-colors">
            <ArrowLeft size={14} /> Choose a different topic
          </button>

          <div className="bg-surface border border-border rounded-sm p-6">
            <h2 className="font-display text-2xl font-semibold text-accent mb-5">{selectedTopic.label}</h2>

            <div className="space-y-4 mb-6">
              {selectedTopic.prompts.map((prompt, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-accent text-sm font-display font-semibold shrink-0 w-5">{i + 1}.</span>
                  <p className="text-text-primary leading-relaxed">{prompt}</p>
                </div>
              ))}
            </div>

            <div className="bg-raised border border-border rounded-sm p-4">
              <div className="flex items-center gap-2 text-sage text-sm font-medium mb-2">
                <BookOpen size={14} />
                Self-care suggestion
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{selectedTopic.selfcare}</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-sm p-6">
            <label htmlFor="journal" className="block font-display text-xl font-semibold text-text-primary mb-2">
              Journal Space
            </label>
            <p className="text-text-muted text-xs mb-3">This space is for you alone — nothing you write here is saved or sent anywhere.</p>
            <textarea id="journal" rows={8} value={journal} onChange={handleJournalChange}
              className="w-full bg-raised border border-border rounded-sm px-4 py-3 text-text-primary text-sm leading-relaxed focus:border-accent outline-hidden resize-none"
              placeholder="Write freely. This is your space…" />
          </div>
        </div>
      )}

      {step === 'crisis' && (
        <div className="space-y-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-text-muted text-sm hover:text-text-secondary transition-colors">
            <ArrowLeft size={14} /> Return to guide
          </button>
          <div className="bg-danger/10 border-2 border-danger/40 rounded-sm p-8 text-center">
            <AlertTriangle className="mx-auto text-danger mb-4" size={36} />
            <h2 className="font-display text-2xl font-bold text-danger mb-3">It sounds like you might be struggling right now.</h2>
            <p className="text-text-secondary leading-relaxed mb-6 max-w-md mx-auto">
              We care about you. This guide isn't equipped to offer crisis support, but real help is available right now. Please reach out to one of these services.
            </p>
            <div className="space-y-3 max-w-sm mx-auto text-left">
              <div className="bg-surface border border-border rounded-sm p-4">
                <p className="text-text-primary font-medium text-sm">988 Suicide & Crisis Lifeline</p>
                <p className="text-text-secondary text-sm">Call or text <strong>988</strong></p>
              </div>
              <div className="bg-surface border border-border rounded-sm p-4">
                <p className="text-text-primary font-medium text-sm">Crisis Text Line</p>
                <p className="text-text-secondary text-sm">Text <strong>HOME to 741741</strong></p>
              </div>
              <div className="bg-surface border border-border rounded-sm p-4">
                <p className="text-text-primary font-medium text-sm">The Trevor Project (LGBTQ+)</p>
                <p className="text-text-secondary text-sm">Call <strong>1-866-488-7386</strong></p>
              </div>
            </div>
            <Link to="/crisis"
              className="mt-6 inline-block px-6 py-3 bg-danger text-white font-medium rounded-sm hover:bg-danger/80 transition-colors">
              See all Crisis Resources
            </Link>
          </div>
        </div>
      )}

      {/* Crisis banner always visible */}
      <div className="mt-8">
        <CrisisBanner />
      </div>
    </div>
  );
}
