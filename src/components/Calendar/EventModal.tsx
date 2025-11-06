import { useEffect, useMemo, useState } from 'react';
import type { CalendarEvent } from './CalendarView.types';

type Props = {
  open: boolean;
  categories: string[];
  initial: Partial<CalendarEvent> & { startDate: Date; endDate: Date };
  onClose: () => void;
  onSave: (e: CalendarEvent) => void;
  onDelete?: () => void;
};

const COLORS = [
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Green', value: '#10B981' },
  { label: 'Orange', value: '#F59E0B' },
  { label: 'Red', value: '#EF4444' }
];

export default function EventModal({ open, categories, initial, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(initial.title ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [start, setStart] = useState<Date>(initial.startDate);
  const [end, setEnd] = useState<Date>(initial.endDate);
  const [color, setColor] = useState<string>(initial.color ?? COLORS[0].value);
  const [category, setCategory] = useState<string>(initial.category ?? '');

  useEffect(() => {
    if (!open) return;
    setTitle(initial.title ?? '');
    setDescription(initial.description ?? '');
    setStart(initial.startDate);
    setEnd(initial.endDate);
    setColor(initial.color ?? COLORS[0].value);
    setCategory(initial.category ?? '');
  }, [open, initial]);

  const disabled = useMemo(
    () => !title.trim() || !start || !end || end < start,
    [title, start, end]
  );

  if (!open) return null;

  const toLocalInput = (d: Date) => {
    // yyyy-MM-ddTHH:mm (no seconds)
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fromLocalInput = (s: string) => {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return new Date();
    return d;
  };

  const save = () => {
    const payload: CalendarEvent = {
      id: (initial as any).id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      startDate: start,
      endDate: end,
      color,
      category: category || undefined
    };
    onSave(payload);
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* modal */}
      <div className="relative bg-white w-[min(720px,92vw)] rounded-2xl shadow-xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{(initial as any).id ? 'Edit Event' : 'Create Event'}</h3>
          <button aria-label="Close" className="p-1 rounded hover:bg-gray-100" onClick={onClose}>×</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Client call"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description (optional)"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[72px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date & Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={toLocalInput(start)}
                onChange={(e) => setStart(fromLocalInput(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date & Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={toLocalInput(end)}
                onChange={(e) => setEnd(fromLocalInput(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {COLORS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">No Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="mr-auto text-red-600 hover:underline"
            >
              Delete
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Cancel</button>
          <button
            disabled={disabled}
            onClick={save}
            className={`px-4 py-2 rounded-lg ${disabled ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
          >
            {(initial as any).id ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
