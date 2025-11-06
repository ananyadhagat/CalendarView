import type { Meta, StoryObj } from "@storybook/react";
import  CalendarView  from "./CalendarView";
import type { CalendarEvent } from "./CalendarView.types";

const meta: Meta<typeof CalendarView> = {
  title: "Calendar/CalendarView",
  component: CalendarView,
  parameters: { layout: "fullscreen" },
  args: { onEventAdd: () => {}, onEventUpdate: () => {}, onEventDelete: () => {} },
};
export default meta;

type Story = StoryObj<typeof CalendarView>;

const today = new Date();
const d = (days = 0, h = 10, m = 0) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, h, m);

const sample: CalendarEvent[] = [
  { id: "1", title: "Standup", startDate: d(0,10), endDate: d(0,10,30), color: "#3b82f6" },
  { id: "2", title: "Design", startDate: d(1,14), endDate: d(1,15), color: "#10b981" },
];

export const Default: Story = {
  args: { events: sample, initialView: "month", initialDate: today },
};
