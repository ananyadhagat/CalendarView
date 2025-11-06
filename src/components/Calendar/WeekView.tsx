import { useMemo, useRef, useState } from 'react';
import { isSameDay } from '../../utils/date.utils';
import type { CalendarEvent } from './CalendarView.types';

type Props = {
  weekAnchor: Date;                  // any date within the week
  events: CalendarEvent[];
  intervalMinutes: 30 | 60;
  onSlotCreate: (start: Date, end: Date) => void;
  onEventClick: (e: CalendarEvent) => void;
};

function startOfWeek(d: Date) {
  const c = new Date(d);
  c.setDate(c.getDate() - c.getDay());
  c.setHours(0, 0, 0, 0);
  return c;
}
function addMinutes(d: Date, mins: number) {
  const c = new Date(d);
  c.setMinutes(c.getMinutes() + mins);
  return c;
}
const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);

export default function WeekView({ weekAnchor, events, intervalMinutes, onSlotCreate, onEventClick }: Props) {
  const start = startOfWeek(weekAnchor);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i, 0, 0, 0, 0));

  // simple drag create
  const [drag, setDrag] = useState<{ dayIdx: number; startSlot: number; endSlot: number } | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const slotsPerDay = (24 * 60) / intervalMinutes;

  const dayEvents = useMemo(() => {
    return days.map(d =>
      (events ?? []).filter(e => isSameDay((e.start ?? e.startDate) as Date, d))
    );
  }, [events, days]);

  const onMouseDown = (e: React.MouseEvent, dayIdx: number) => {
    const target = gridRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const row = Math.max(0, Math.min(Math.floor((y / rect.height) * slotsPerDay), slotsPerDay - 1));
    setDrag({ dayIdx, startSlot: row, endSlot: row });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const row = Math.max(0, Math.min(Math.floor((y / rect.height) * slotsPerDay), slotsPerDay - 1));
    setDrag({ ...drag, endSlot: row });
  };
  const onMouseUp = () => {
    if (!drag) return;
    const day = days[drag.dayIdx];
    const startDate = addMinutes(new Date(day), drag.startSlot * intervalMinutes);
    const endDate = addMinutes(new Date(day), (Math.max(drag.startSlot, drag.endSlot) + 1) * intervalMinutes);
    setDrag(null);
    onSlotCreate(startDate, endDate);
  };

  return (
    <div className="border rounded overflow-hidden">
      {/* header row */}
      <div className="grid" style={{ gridTemplateColumns: '80px repeat(7, minmax(0, 1fr))' }}>
        <div className="bg-neutral-100 border-b p-2 text-xs font-semibold">Time</div>
        {days.map((d, i) => (
          <div key={i} className="bg-neutral-100 border-b p-2 text-xs font-semibold">
            {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        ))}
      </div>

      {/* time grid */}
      <div
        className="grid"
        style={{ gridTemplateColumns: '80px repeat(7, minmax(0, 1fr))' }}
        ref={gridRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* left hour labels */}
        <div className="border-r bg-white">
          {HOURS.map(h => (
            <div key={h} className="h-12 text-[11px] text-right pr-2 border-b flex items-start justify-end">
              {h}
            </div>
          ))}
        </div>

        {/* day columns */}
        {days.map((d, dayIdx) => (
          <div
            key={dayIdx}
            className="bg-white border-r last:border-r-0 relative cursor-crosshair select-none"
            onMouseDown={(e) => onMouseDown(e, dayIdx)}
          >
            {/* slots */}
            {Array.from({ length: slotsPerDay }).map((_, s) => (
              <div key={s} className="h-12 border-b border-neutral-200/70" />
            ))}

            {/* events */}
            {dayEvents[dayIdx].map((ev) => {
              const startDate = (ev.start ?? ev.startDate) as Date;
              const endDate = (ev.end ?? ev.endDate) as Date;
              const top = ((startDate.getHours() * 60 + startDate.getMinutes()) / (24 * 60)) * slotsPerDay * 48; // 48px per slot
              const height = Math.max(22, ((endDate.getTime() - startDate.getTime()) / (intervalMinutes * 60_000)) * 48);
              return (
                <button
                  key={(ev as any).id}
                  onClick={() => onEventClick(ev)}
                  className="absolute left-1 right-1 rounded text-white text-xs px-2 py-1 overflow-hidden"
                  style={{ top, height, background: ev.color ?? '#3B82F6' }}
                  title={(ev as any).title}
                >
                  {(ev as any).title}
                </button>
              );
            })}

            {/* drag preview */}
            {drag && drag.dayIdx === dayIdx && (
              <div
                className="absolute left-1 right-1 bg-indigo-500/30 border border-indigo-500 rounded pointer-events-none"
                style={{
                  top: Math.min(drag.startSlot, drag.endSlot) * 48,
                  height: (Math.abs(drag.endSlot - drag.startSlot) + 1) * 48
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
