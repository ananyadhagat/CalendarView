import { isSameDay } from '../../utils/date.utils';
import type { CalendarEvent } from './CalendarView.types';

type Props = {
  anchorDate: Date;
  events: CalendarEvent[];
  onPrevDay: () => void;
  onNextDay: () => void;
  onCreate: (start: Date, end: Date) => void;
  onEventClick: (e: CalendarEvent) => void;
};

export default function MobileListView({ anchorDate, events, onPrevDay, onNextDay, onCreate, onEventClick }: Props) {
  const dayEvents = (events ?? []).filter(e => isSameDay((e.start ?? e.startDate) as Date, anchorDate));

  return (
    <div className="sm:hidden bg-white rounded-xl border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={onPrevDay} className="px-3 py-1 rounded bg-gray-100">◀</button>
        <div className="font-medium">
          {anchorDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <button onClick={onNextDay} className="px-3 py-1 rounded bg-gray-100">▶</button>
      </div>

      <div className="space-y-2">
        {dayEvents.map((e) => (
          <button
            key={(e as any).id}
            onClick={() => onEventClick(e)}
            className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50"
          >
            <div className="text-sm font-medium">{(e as any).title}</div>
            <div className="text-xs text-gray-500">
              {((e.start ?? e.startDate) as Date).toLocaleTimeString()} – {((e.end ?? e.endDate) as Date).toLocaleTimeString()}
            </div>
          </button>
        ))}
        {dayEvents.length === 0 && <div className="text-gray-500 text-sm">No events for this day.</div>}
      </div>

      <button
        onClick={() => onCreate(new Date(anchorDate.setHours(9,0,0,0)), new Date(anchorDate.setHours(10,0,0,0)))}
        className="w-full rounded bg-indigo-600 text-white py-2"
      >
        Create Event
      </button>
    </div>
  );
}
