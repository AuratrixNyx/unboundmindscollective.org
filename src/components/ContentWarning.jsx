import { useState } from 'react';
import Eye from 'icon:eye';
import EyeOff from 'icon:eye-off';

/**
 * ContentWarning — wraps post body behind a click-to-reveal if a CW is present.
 * Usage: <ContentWarning warning="trauma, grief">{content}</ContentWarning>
 * If warning is falsy, renders children directly.
 */
export default function ContentWarning({ warning, children }) {
  const [revealed, setRevealed] = useState(false);

  if (!warning) return <>{children}</>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">CW:</span>
        <span className="text-sm text-text-secondary">{warning}</span>
        <button
          onClick={() => setRevealed(r => !r)}
          className="ml-auto flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
          aria-expanded={revealed}
          aria-label={revealed ? 'Hide content' : 'Show content'}
        >
          {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
          {revealed ? 'Hide' : 'Show'}
        </button>
      </div>
      {revealed && <div className="mt-2">{children}</div>}
      {!revealed && (
        <p className="text-xs text-text-muted italic">
          Content hidden — click "Show" to read.
        </p>
      )}
    </div>
  );
}
