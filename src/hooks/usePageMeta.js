import { useEffect } from 'react';

export default function usePageMeta(title, description) {
  useEffect(() => {
    const siteName = 'The Unbound Minds Collective';
    document.title = title ? `${title} | ${siteName}` : siteName;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    if (description) metaDesc.setAttribute('content', description);

    return () => {
      document.title = `${siteName} | Peer Advocacy for All the Ways We Live`;
    };
  }, [title, description]);
}
