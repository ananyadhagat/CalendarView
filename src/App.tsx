import React, { useState } from 'react';
import CalendarView from './components/Calendar/CalendarView';
import type { CalendarEvent } from './components/Calendar/CalendarView.types';

const now = new Date();
const Y = now.getFullYear(), M = now.getMonth(), D = now.getDate();
const at = (y:number,m:number,d:number,h=0,min=0)=> new Date(y,m,d,h,min,0,0);
const addMin = (d:Date, m:number)=> new Date(d.getTime()+m*60000);

const initialEvents: CalendarEvent[] = [
  { id:'evt-1', title:'Team Standup', startDate: at(Y,M,D,10,0), endDate: addMin(at(Y,M,D,10,0),30), color:'#3b82f6', category:'Meeting' },
  { id:'evt-2', title:'Design Review', startDate: at(Y,M,D+1,14,0), endDate: at(Y,M,D+1,15,0), color:'#10b981', category:'Design' },
  { id:'evt-3', title:'Client Call', startDate: at(Y,M,D+3,11,30), endDate: at(Y,M,D+3,12,0), color:'#f59e0b', category:'Meeting' },
];

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  // src/App.tsx  (only the wrapper changed)
return (
  <div className="min-h-screen bg-neutral-50 p-4">
    <div className="mx-auto w-full max-w-7xl">
      {/* sm: stacked, md: 2-col, lg: multi-column, xl: wide container */}
      <div className="grid gap-4
                      sm:grid-cols-1
                      md:grid-cols-[1fr]
                      lg:grid-cols-[3fr_2fr]
                      xl:grid-cols-[4fr_2fr]">
        <div className="order-1">
          <CalendarView
            events={events}
            onEventAdd={(e)=> setEvents(prev=>[...prev,e])}
            onEventUpdate={(id, updates)=> setEvents(prev=> prev.map(ev=> ev.id===id ? { ...ev, ...updates } : ev))}
            onEventDelete={(id)=> setEvents(prev=> prev.filter(ev=> ev.id!==id))}
            initialView="month"
            initialDate={now}
          />
        </div>

        {/* Side panel (hidden < lg). Good for details/filters later */}
        <aside className="hidden lg:block order-2">
          <div className="bg-white rounded-xl shadow-card p-4 sticky top-4">
            <h3 className="font-semibold mb-2">Filters / Details</h3>
            <p className="text-sm text-neutral-600">
              On large screens, keep filters or selected event details here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
);

}
