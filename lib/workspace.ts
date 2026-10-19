export type EditorPosition = {
  anchor: number;
  head: number;
  top: number;
  left: number;
};
export type WorkspaceState = {
  tabs: string[];
  active: string;
  height: number;
  positions: Record<string, EditorPosition>;
};
export function restoreWorkspace(raw: unknown, ids: string[]): WorkspaceState {
  const data = raw as Partial<WorkspaceState> | undefined;
  const tabs = Array.isArray(data?.tabs)
    ? [...new Set(data.tabs.filter((id) => ids.includes(id)))]
    : ids.slice(0, 1);
  const positions: Record<string, EditorPosition> = {};
  for (const id of ids) {
    const p = data?.positions?.[id];
    if (
      p &&
      [p.anchor, p.head, p.top, p.left].every(
        (n) => Number.isFinite(n) && n >= 0,
      )
    )
      positions[id] = p;
  }
  return {
    tabs,
    active: tabs.includes(data?.active || '') ? data!.active! : tabs[0] || '',
    height: Number.isFinite(data?.height)
      ? Math.max(160, Math.min(700, data!.height!))
      : 260,
    positions,
  };
}
