import { Link } from 'react-router';
import ArrowLeft from 'icon:arrow-left';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <img src="/static/logo.png" alt="The Unbound Minds Collective" className="h-24 w-auto mx-auto mb-6 opacity-60" />
        <p className="font-display text-8xl font-bold text-accent/30 mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-3">
          This page doesn't exist — but you belong here.
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you were looking for couldn't be found, but the community is just a click away.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors">
          <ArrowLeft size={16} /> Return Home
        </Link>
      </div>
    </div>
  );
}
