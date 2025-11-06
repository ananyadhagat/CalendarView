import { getCalendarGrid, isSameDay } from '../../utils/date.utils';
import type { CalendarEvent } from './CalendarView.types';

type Props = {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
};

// helpers to read event dates regardless of shape
const getStart = (e: CalendarEvent) => (e.start as Date) ?? (e.startDate as Date);
const getEnd = (e: CalendarEvent) => (e.end as Date) ?? (e.endDate as Date);

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthView({ currentDate, events, onDayClick }: Props) {
  const grid = getCalendarGrid(currentDate); // 42 cells
  const monthIndex = currentDate.getMonth();

  return (
    <div role="region" aria-label="Month view" className="border rounded overflow-hidden bg-white">
      {/* weekday header */}
      <div className="grid grid-cols-7 bg-neutral-100 text-xs font-semibold">
        {WEEKDAYS.map((d) => (
          <div key={d} role="columnheader" className="p-2 border-b">
            {d}
          </div>
        ))}
      </div>

      {/* month grid */}
      <div className="grid grid-cols-7">
        {grid.map((date, idx) => {
          const inCurrentMonth = date.getMonth() === monthIndex;
          const dayEvents = (events ?? []).filter((e) => isSameDay(getStart(e), date));
          const isToday = isSameDay(new Date(), date);

          return (
            <div key={date.toISOString() + idx} className="border-t">
              <div
                role="button"
                tabIndex={0}
                aria-label={`${date.toDateString()}. ${dayEvents.length} events.`}
                className={`h-32 p-2 cursor-pointer outline-none transition-colors hover:bg-neutral-50 ${
                  inCurrentMonth ? 'bg-white' : 'bg-neutral-50 text-neutral-400'
                }`}
                onClick={() => onDayClick(date)}
                onKeyDown={(e) => e.key === 'Enter' && onDayClick(date)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium">{date.getDate()}</span>
                  {isToday && (
                    <span className="w-6 h-6 bg-indigo-500 rounded-full text-white text-xs flex items-center justify-center">
                      {date.getDate()}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <button
                      key={(ev as any).id}
                      className="text-xs px-2 py-1 rounded truncate text-white"
                      style={{ background: ev.color ?? '#3B82F6' }}
                      title={`${(ev as any).title} (${getStart(ev).toLocaleTimeString()} - ${getEnd(ev).toLocaleTimeString()})`}
                    >
                      {(ev as any).title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-indigo-600">+{dayEvents.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
