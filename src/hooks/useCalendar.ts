import { useCallback, useState } from "react";

type View = 'month' | 'week';

export function useCalendar(initialDate = new Date(), initialView: View = 'month') {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(initialDate));
  const [view, setView] = useState<View>(initialView);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToNext = useCallback(() => {
    setCurrentDate(prev =>
      view === 'month'
        ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
        : new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7)
    );
  }, [view]);

  const goToPrev = useCallback(() => {
    setCurrentDate(prev =>
      view === 'month'
        ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
        : new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7)
    );
  }, [view]);

  const goToToday = useCallback(() => setCurrentDate(new Date()), []);
  const toggleView = useCallback(() => setView(v => (v === 'month' ? 'week' : 'month')), []);

  return { currentDate, setCurrentDate, view, setView, selectedDate, setSelectedDate, goToNext, goToPrev, goToToday, toggleView };
}
