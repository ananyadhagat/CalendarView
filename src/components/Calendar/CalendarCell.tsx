import React from 'react';
import type { CalendarEvent } from './CalendarView.types';

type Props = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick?: (e: CalendarEvent) => void;
};

export default function CalendarCell({ date, inCurrentMonth, isToday, events, onDayClick, onEventClick }: Props) {
  return (
    <button
      onClick={() => onDayClick(date)}
      className={[
        'w-full h-32 p-2 text-left border transition-colors',
        inCurrentMonth ? 'bg-white' : 'bg-neutral-50 text-neutral-400',
        'hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600',
      ].join(' ')}
      role="button"
      tabIndex={0}
      aria-label={`${date.toDateString()}. ${events.length} events.`}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-medium">{date.getDate()}</span>
        {isToday && <span className="w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center">{date.getDate()}</span>}
      </div>

      <div className="space-y-1 overflow-hidden">
        {events.slice(0, 3).map(ev => (
          <div
            key={ev.id}
            onClick={e => { e.stopPropagation(); onEventClick?.(ev); }}
            className="text-xs px-2 py-1 rounded truncate"
            style={{ background: ev.color ?? '#0ea5e9' }}
          >
            {ev.title}
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-xs text-primary-600">+{events.length - 3} more</div>
        )}
      </div>
    </button>
  );
}
