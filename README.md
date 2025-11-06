# 📅 Calendar View Component

A simple yet elegant calendar interface built with React and TypeScript — complete with event management, responsive layouts, and Storybook documentation.

---

## 🔗 Live Storybook

[Deployed Storybook Link] https://690cd7a7c160aa46dacdbf82-oubcsxcghq.chromatic.com/


---

## ⚙️ Installation

To get started locally, clone the repository and run:

```bash
npm install
npm run storybook
```

This will install all dependencies and launch Storybook for component previews.

---

## 🧱 Architecture

The project is organized for clarity and reusability:

* **`src/components/Calendar/`** → Calendar UI components like `MonthView`, `CalendarCell`, and `CalendarView`
* **`src/hooks/`** → Custom hooks such as `useEventManager` to manage event state
* **`src/utils/`** → Helper utilities for date calculations and grid generation
* **`.storybook/`** → Storybook setup and configuration files
* **`*.stories.tsx`** → Storybook stories documenting each component

Each module is type-safe, modular, and documented for easy integration and testing.

---

## ✨ Features

* [x] **Month & Week Views** – Switch easily between monthly and weekly layouts
* [x] **Event Management** – Add, edit, and display events through a simple modal
* [x] **Responsive Design** – Works smoothly on all screen sizes
* [x] **Keyboard Accessibility** – Navigate and interact using keyboard shortcuts

---

## 📖 Storybook Stories

A few of the documented stories include:

* `CalendarView.stories.tsx` – Renders the main calendar view with events
* `CalendarCell.stories.tsx` – Demonstrates an individual cell’s interactions
* `EventModal.stories.tsx` – Showcases the event creation and editing flow
* `useEventManager.stories.tsx` – Explains how the custom event manager hook works
* `DateUtils.stories.tsx` – Displays grid generation and date logic visuals

---

## 🧰 Technologies

* ⚛️ **React + TypeScript** – Core stack for building robust components
* 🎨 **Tailwind CSS** – Lightweight and responsive styling
* 📘 **Storybook** – For isolated component testing and documentation
* ⚡ **Vite** – Super-fast development and build tool

---

## 📩 Contact

**Developed by:** [Ananya Dhagat](https://github.com/ananyadhagat)
Gmail: ananya2004d@gmail.com
**GitHub:** [https://github.com/ananyadhagat/CalendarView](https://github.com/ananyadhagat/CalendarView)
