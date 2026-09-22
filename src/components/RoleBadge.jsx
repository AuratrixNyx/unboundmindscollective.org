export default function RoleBadge({ role }) {
  const styles = {
    member: 'bg-raised text-text-secondary border border-border',
    moderator: 'bg-sage/20 text-sage border border-sage/40',
    facilitator: 'bg-accent/20 text-accent border border-accent/40',
    guest_facilitator: 'bg-accent/10 text-accent-hover border border-accent/20',
    admin: 'bg-danger/20 text-danger border border-danger/40',
  };
  const labels = {
    member: 'Member',
    moderator: 'Moderator',
    facilitator: 'Facilitator',
    guest_facilitator: 'Guest Facilitator',
    admin: 'Admin',
  };
  const cls = styles[role] || styles.member;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${cls}`}>
      {labels[role] || role}
    </span>
  );
}
