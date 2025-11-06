import { useMemo } from 'react';
import type { CalendarEvent } from './CalendarView.types';

type Props = {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  categories: string[];
  category: string;
  search: string;
  onSearchChange: (s: string) => void;
  onCategoryChange: (c: string) => void;
  onEventClick: (e: CalendarEvent) => void;
};

export default function Sidebar({
  events,
  filteredEvents,
  categories,
  category,
  search,
  onSearchChange,
  onCategoryChange,
  onEventClick
}: Props) {
  const counts = useMemo(() => {
    const byCat = new Map<string, number>();
    events.forEach(e => {
      const c = (e.category ?? 'Uncategorized');
      byCat.set(c, (byCat.get(c) ?? 0) + 1);
    });
    return byCat;
  }, [events]);

  return (
    <aside className="bg-white rounded-xl border p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Search</label>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title/description"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="text-sm">
        <div className="font-semibold mb-1">Stats</div>
        <div className="space-y-1">
          {[...counts.entries()].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-600">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-1 mt-1">
            <span>Total (filtered)</span>
            <span className="font-medium">{filteredEvents.length}</span>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <div className="font-semibold mb-1">Quick list</div>
        <div className="space-y-1 max-h-60 overflow-auto pr-1">
          {filteredEvents.map(e => (
            <button
              key={(e as any).id}
              onClick={() => onEventClick(e)}
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-50"
              title={(e as any).title}
            >
              <div className="truncate">{(e as any).title}</div>
              <div className="text-xs text-gray-500 truncate">
                {e.startDate?.toLocaleString?.()}

              </div>
            </button>
          ))}
          {filteredEvents.length === 0 && <div className="text-gray-400">No events</div>}
        </div>
      </div>
    </aside>
  );
}
