// src/utils/event.utils.ts
import type { CalendarEvent } from "../components/Calendar/CalendarView.types";

/**
 * Creates a new CalendarEvent object.
 */
export function createEvent(
  title: string,
  start: Date,
  end?: Date,
  color: string = "#4F46E5"
): CalendarEvent {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    start,
    end: end ?? start,
    color,
  };
}

/**
 * Filters events that fall within a given date range.
 */
export function getEventsInRange(
  events: CalendarEvent[],
  start: Date,
  end: Date
): CalendarEvent[] {
  return events.filter((e) => {
    const s = new Date(e.start).getTime();
    const ed = new Date(e.end ?? e.start).getTime();
    return s <= end.getTime() && ed >= start.getTime();
  });
}

/**
 * Finds events for a specific day.
 */
export function getEventsForDay(
  events: CalendarEvent[],
  date: Date
): CalendarEvent[] {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  return getEventsInRange(events, dayStart, dayEnd);
}

/**
 * Sorts events chronologically by start time.
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
}

/**
 * Checks if two events overlap in time.
 */
export function eventsOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
  const aStart = new Date(a.start).getTime();
  const aEnd = new Date(a.end ?? a.start).getTime();
  const bStart = new Date(b.start).getTime();
  const bEnd = new Date(b.end ?? b.start).getTime();
  return aStart < bEnd && bStart < aEnd;
}
