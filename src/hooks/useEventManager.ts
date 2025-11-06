import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CalendarEvent } from '../components/Calendar/CalendarView.types';

/** ---------- helpers ---------- */
const getStart = (e: CalendarEvent) => (e.start as Date) ?? (e.startDate as Date);
const getEnd   = (e: CalendarEvent) => (e.end as Date)   ?? (e.endDate as Date);

/** convert any incoming shape to our canonical shape (with startDate/endDate) */
function toCanonical(e: CalendarEvent): CalendarEvent {
  const start = getStart(e);
  const end = getEnd(e);
  return {
    ...e,
    startDate: start ? new Date(start) : undefined,
    endDate: end ? new Date(end) : undefined,
    start: undefined,
    end: undefined,
  };
}

function assertValid(e: CalendarEvent) {
  const title = (e.title ?? '').trim();
  if (!title) throw new Error('Title is required');
  if (title.length > 100) throw new Error('Title too long (max 100)');
  if (e.description && e.description.length > 500) throw new Error('Description too long (max 500)');

  const s = getStart(e);
  const en = getEnd(e);
  if (!(s instanceof Date) || Number.isNaN(s.getTime())) throw new Error('Invalid start date');
  if (!(en instanceof Date) || Number.isNaN(en.getTime())) throw new Error('Invalid end date');
  if (en <= s) throw new Error('End must be after start');
}

/** ---------- hook ---------- */
export function useEventManager(initial: CalendarEvent[] = [], storageKey?: string) {
  // load from storage (optional)
  const boot = useMemo<CalendarEvent[]>(() => {
    if (!storageKey) return initial.map(toCanonical);
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return initial.map(toCanonical);
      const parsed = JSON.parse(raw) as any[];
      return (parsed ?? []).map((p) => toCanonical({
        ...p,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
      }));
    } catch {
      return initial.map(toCanonical);
    }
  }, [initial, storageKey]);

  const [events, setEvents] = useState<CalendarEvent[]>(boot);

  // persist to storage (optional)
  useEffect(() => {
    if (!storageKey) return;
    try {
      const serial = JSON.stringify(events);
      localStorage.setItem(storageKey, serial);
    } catch {
      /* ignore quota errors */
    }
  }, [events, storageKey]);

  /** add a new event (validates & normalizes) */
  const onEventAdd = useCallback((e: CalendarEvent) => {
    const payload = toCanonical({
      ...e,
      id: (e as any).id ?? (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
    });
    assertValid(payload);
    setEvents((prev) => [...prev, payload]);
  }, []);

  /** replace an existing event by id (validates & normalizes) */
  const onEventUpdate = useCallback((id: string, next: CalendarEvent) => {
    const payload = toCanonical({ ...next, id });
    assertValid(payload);
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...payload } : ev)));
  }, []);

  /** remove by id */
  const onEventDelete = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  /** sometimes handy if you still want partial updates */
  const updatePartial = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== id) return ev;
        const merged: CalendarEvent = toCanonical({ ...ev, ...updates, id });
        assertValid(merged);
        return merged;
      })
    );
  }, []);

  return {
    events,
    onEventAdd,
    onEventUpdate,
    onEventDelete,
    updatePartial, // optional utility
  };
}

export default useEventManager;
