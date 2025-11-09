interface SidebarTriggerProps {
  open: boolean;
  onToggle: (value: boolean) => void;
}

export function SidebarTrigger({ open, onToggle }: SidebarTriggerProps) {
  return (
    <button className="btn" onClick={() => onToggle(!open)}>
      {open ? '⟨' : '☰'}
    </button>
  );
}
