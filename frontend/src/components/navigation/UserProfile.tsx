type UserProfileProps = {
  collapsed?: boolean;
};

export function UserProfile({ collapsed = false }: UserProfileProps) {
  return (
    <div className="glass-panel-subtle flex items-center gap-3 p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-primary text-sm font-bold" aria-hidden="true">
        AV
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-caption font-semibold text-[color:var(--color-text)]">Arjun Verma</p>
          <p className="truncate text-[0.7rem] text-muted">Admin</p>
        </div>
      )}
    </div>
  );
}
