import React, { Suspense, useCallback, useMemo, useState } from 'react';
import type { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { getCalendarGrid, isSameDay } from '../../utils/date.utils';
import MonthView from './MonthView';
import WeekView from './WeekView';
import MobileListView from './MobileListView';
import Sidebar from './Sidebar';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

// Lazy-load modal for bundle size
const EventModal = React.lazy(() => import('./EventModal'));

// --- helpers: tolerate start/end or startDate/endDate shapes ---
function getStart(e: CalendarEvent): Date {
  return (e.start as Date) ?? (e.startDate as Date);
}
function getEnd(e: CalendarEvent): Date {
  return (e.end as Date) ?? (e.endDate as Date);
}
function getColor(e: CalendarEvent) {
  return e.color ?? '#3B82F6';
}
function getCategory(e: CalendarEvent) {
  return e.category ?? undefined;
}

export default function CalendarView({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate = new Date(),
  categories = ['Meeting', 'Design', 'Personal', 'Travel'],
}: CalendarViewProps & { categories?: string[] }) {
  // ---- view state ----
  const [currentDate, setCurrentDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 12)
  );
  const [view, setView] = useState<'month' | 'week'>(initialView);
  const [intervalMinutes, setIntervalMinutes] = useState<30 | 60>(30);

  // ---- modal state ----
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [selection, setSelection] = useState<{ start: Date; end: Date } | null>(null);

  // ---- filters/search (debounced) ----
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const debouncedSearch = useDebouncedValue(search, 150);
  const debouncedCategory = useDebouncedValue(category, 150);

  // ---- memoized data ----
  const grid = useMemo(() => getCalendarGrid(currentDate), [currentDate]);
  const monthIndex = currentDate.getMonth();

  const filteredEvents = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const cat = debouncedCategory;
    return (events ?? []).filter((e) => {
      if (cat !== 'all' && getCategory(e) !== cat) return false;
      if (!q) return true;
      const title = (e as any).title?.toLowerCase?.() ?? '';
      const desc = ((e as any).description ?? '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [events, debouncedSearch, debouncedCategory]);

  // ---- navigation ----
  const goToNext = useCallback(() => {
    setCurrentDate((d) =>
      view === 'month'
        ? new Date(d.getFullYear(), d.getMonth() + 1, 1, 12)
        : new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7, 12)
    );
  }, [view]);

  const goToPrevious = useCallback(() => {
    setCurrentDate((d) =>
      view === 'month'
        ? new Date(d.getFullYear(), d.getMonth() - 1, 1, 12)
        : new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7, 12)
    );
  }, [view]);

  const goToToday = useCallback(() => {
    const n = new Date();
    setCurrentDate(new Date(n.getFullYear(), n.getMonth(), 1, 12));
  }, []);

  const setMonth = useCallback((m: number) => {
    setCurrentDate((d) => new Date(d.getFullYear(), m, 1, 12));
  }, []);

  const setYear = useCallback((y: number) => {
    setCurrentDate((d) => new Date(y, d.getMonth(), 1, 12));
  }, []);

  // ---- open modals ----
  const openEdit = useCallback((e: CalendarEvent) => {
    setEditing(e);
    setSelection(null);
    setModalOpen(true);
  }, []);

  const openCreateFromMonth = useCallback((date: Date, range?: { start: Date; end: Date }) => {
    if (range) {
      setSelection({ start: new Date(range.start), end: new Date(range.end) });
    } else {
      const start = new Date(date); start.setHours(9, 0, 0, 0);
      const end = new Date(date);   end.setHours(10, 0, 0, 0);
      setSelection({ start, end });
    }
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openCreateFromWeek = useCallback((start: Date, end: Date) => {
    setSelection({ start, end });
    setEditing(null);
    setModalOpen(true);
  }, []);

  // ---- header label ----
  const headerLabel = useMemo(() => {
    if (view === 'month') {
      return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const sameMonth = start.getMonth() === end.getMonth();
    const monthPart = sameMonth
      ? start.toLocaleString('default', { month: 'long' })
      : `${start.toLocaleString('default', { month: 'short' })}–${end.toLocaleString('default', {
          month: 'short',
        })}`;
    return `${monthPart} ${
      start.getFullYear() === end.getFullYear()
        ? start.getFullYear()
        : `${start.getFullYear()}–${end.getFullYear()}`
    }`;
  }, [currentDate, view]);

  // ---- mobile day list anchor ----
  const [mobileAnchor, setMobileAnchor] = useState<Date>(() => new Date(currentDate));
  const prevDay = useCallback(
    () => setMobileAnchor((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)),
    []
  );
  const nextDay = useCallback(
    () => setMobileAnchor((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)),
    []
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="px-2 py-1 bg-neutral-200 rounded hover:bg-neutral-300"
            aria-label={view === 'month' ? 'Previous month' : 'Previous week'}
          >
            Prev
          </button>
        </div>

        <h2 className="text-lg font-semibold text-center">{headerLabel}</h2>

        <div className="flex items-center gap-2 justify-end">
          <button onClick={goToToday} className="px-2 py-1 bg-neutral-200 rounded hover:bg-neutral-300">
            Today
          </button>
          <button
            onClick={goToNext}
            className="px-2 py-1 bg-neutral-200 rounded hover:bg-neutral-300"
            aria-label={view === 'month' ? 'Next month' : 'Next week'}
          >
            Next
          </button>

          {/* Month/Year pickers */}
          <select
            className="px-2 py-1 border rounded"
            value={currentDate.getMonth()}
            onChange={(e) => setMonth(Number(e.target.value))}
            aria-label="Select month"
          >
            {Array.from({ length: 12 }, (_, m) => (
              <option key={m} value={m}>
                {new Date(2000, m, 1).toLocaleString('default', { month: 'short' })}
              </option>
            ))}
          </select>
          <select
            className="px-2 py-1 border rounded"
            value={currentDate.getFullYear()}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label="Select year"
          >
            {Array.from({ length: 11 }, (_, i) => currentDate.getFullYear() - 5 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* View + interval toggle */}
          <button
            onClick={() => setView('month')}
            className={`px-2 py-1 rounded ${view === 'month' ? 'bg-indigo-600 text-white' : 'bg-neutral-200 hover:bg-neutral-300'}`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-2 py-1 rounded ${view === 'week' ? 'bg-indigo-600 text-white' : 'bg-neutral-200 hover:bg-neutral-300'}`}
          >
            Week
          </button>
          {view === 'week' && (
            <select
              className="px-2 py-1 border rounded"
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value) as 30 | 60)}
              aria-label="Time grid interval"
            >
              <option value={60}>60 min</option>
              <option value={30}>30 min</option>
            </select>
          )}
        </div>
      </div>

      {/* Layout: calendar + sidebar */}
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div>
          {/* Mobile list view */}
          <MobileListView
            anchorDate={mobileAnchor}
            events={filteredEvents}
            onPrevDay={prevDay}
            onNextDay={nextDay}
            onEventClick={openEdit}
            onCreate={(start, end) => openCreateFromWeek(start, end)}
          />

          {/* Desktop/Tablet views */}
          <div className="hidden sm:block">
            {view === 'month' ? (
              <MonthView
                currentDate={currentDate}
                events={filteredEvents}
                onDayClick={(d) => openCreateFromMonth(d)}
              >
                {/* header row inside MonthView */}
              </MonthView>
            ) : (
              <WeekView
                weekAnchor={currentDate}
                events={filteredEvents}
                intervalMinutes={intervalMinutes}
                onSlotCreate={(start, end) => openCreateFromWeek(start, end)}
                onEventClick={openEdit}
              />
            )}
          </div>
        </div>

        <Sidebar
          events={events}
          filteredEvents={filteredEvents}
          categories={categories}
          category={category}
          search={search}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onEventClick={openEdit}
        />
      </div>

      {/* Modal */}
      <Suspense fallback={null}>
        <EventModal
          open={modalOpen}
          categories={categories}
          initial={
            editing
              ? {
                  ...(editing as any),
                  startDate: getStart(editing as CalendarEvent),
                  endDate: getEnd(editing as CalendarEvent),
                }
              : selection
              ? { startDate: selection.start, endDate: selection.end }
              : { startDate: new Date(), endDate: new Date(Date.now() + 60 * 60 * 1000) }
          }
          onClose={() => {
            setModalOpen(false);
            setSelection(null);
            setEditing(null);
          }}
          onSave={(evt: CalendarEvent) => {
            if (editing) onEventUpdate((editing as any).id, evt);
            else onEventAdd(evt);
            setModalOpen(false);
            setSelection(null);
            setEditing(null);
          }}
          onDelete={
            editing
              ? () => {
                  onEventDelete((editing as any).id);
                  setModalOpen(false);
                  setSelection(null);
                  setEditing(null);
                }
              : undefined
          }
        />
      </Suspense>
    </div>
  );
}
