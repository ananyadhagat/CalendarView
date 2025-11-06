export type CalendarEvent = {
  id: string;
  title: string;
  // allow both shapes; CalendarView normalizes internally
  start?: Date;
  end?: Date;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  color?: string;
  category?: string;
};

export type CalendarViewProps = {
  events: CalendarEvent[];
  onEventAdd: (e: CalendarEvent) => void;
  onEventUpdate: (id: string, e: CalendarEvent) => void;
  onEventDelete: (id: string) => void;
  initialView?: 'month' | 'week';
  initialDate?: Date;
};
