# My To-Do List

A simple, responsive, and interactive to-do list application built with **HTML5, JavaScript, and Tailwind CSS**.

My To-Do List demonstrates the core functionality of a task manager, including adding, editing, completing, and deleting tasks, filtering by status, selecting tasks for export, and generating CSV, JSON, and PDF exports — all with dark mode support and no backend required.

## 🚀 Features

* 📝 Add tasks with a description, required due date, and optional notes
* 📜 Automatically scrolls to newly added tasks so they're immediately visible
* ✏️ Edit existing tasks (text, date, and notes)
* ✅ Mark tasks complete/active via checkbox
* 🗑️ Delete tasks with a confirmation modal
* 🔍 Filter tasks by All / Active / Completed, each with its own color and icon
* 🔖 Select individual tasks for export via a dedicated bookmark toggle
* ☑️ Select all / clear selection shortcuts
* 🔢 Live "N tasks selected" counter
* 📤 Export selected tasks to **CSV**, **JSON**, or a designed **PDF**
* 🚫 Export buttons disabled until at least one task is selected
* 🌗 Dark mode toggle, respecting OS preference and remembering user choice
* 🎨 Custom "Site" logo and favicon in Dancing Script font
* 🔄 Logo and Reload button both trigger a full app reset
* ⚠️ Confirmation modal before clearing tasks (tasks are session-only, not saved on reload)
* 📱 Fully responsive layout
* ⚡ Fast and lightweight frontend — Tailwind CSS compiled and inlined, no runtime CDN dependency for styling

## 🛠️ Technologies Used

| Technology              | Purpose                                       |
| ------------------------ | ---------------------------------------------- |
| **HTML5**                | Page structure and content                     |
| **Tailwind CSS v4**      | Styling and responsive design                  |
| **JavaScript**           | Task logic, rendering, filtering, and export   |
| **jsPDF + AutoTable**    | PDF export generation (loaded via CDN)         |
| **Google Fonts**         | Dancing Script font for logo/favicon           |

## 📁 Project Structure

```text
todo-app/
│
├── index.html
├── script.js
├── input.css
├── output.css
├── package.json
├── scripts/
│   └── patch-css.js
└── .vscode/
    ├── settings.json
    └── tailwind.css-data.json
```

## 💻 Getting Started

### Prerequisites

You only need:

* A modern web browser such as Chrome, Edge, Firefox, or Safari
* Optional: Node.js, if you want to rebuild the CSS after making changes

No backend server or database is required.

### Installation

#### 1. Get the project files

Download or copy all project files into a single folder, keeping the structure above intact.

#### 2. Navigate to the project directory

```bash
cd todo-app
```

#### 3. Open the project

Open `index.html` directly in your preferred web browser — the app is fully self-contained (Tailwind CSS is inlined), so no build step is required to use it.

#### 4. (Optional) Rebuild the CSS

If you want to modify the styling:

```bash
npm install
npm run build:css
```

Then copy the contents of `output.css` into the `<style>` block inside `index.html`.

## 🛒 Application Functionality

### Task Display

Tasks are stored in a JavaScript array (in memory, for the current session only) containing:

* Task ID
* Task text
* Due date
* Notes
* Completed status
* Selected-for-export status

JavaScript dynamically generates the task cards and displays them in the task list.

### Add Task

When the user submits the add-task form:

1. The task text and required date are validated.
2. A new task object is created and added to the list.
3. The form inputs are cleared.
4. The task list and counter are refreshed.
5. The view automatically scrolls down to the newly added task, so it's immediately visible without manual scrolling.

### Edit Task

When the user clicks the **Edit** icon:

1. The edit modal opens, pre-filled with the task's current text, date, and notes.
2. The user updates any field and saves.
3. The task list is refreshed with the updated values.

### Delete Task

When the user clicks the **Delete** icon:

1. A confirmation modal appears.
2. On confirmation, the task is removed from the list.
3. The task list and counter are refreshed.

### Export Selection

The bookmark icon on each task (separate from the completion checkbox) toggles that task's inclusion in the next export:

* **Select all** selects every task currently visible under the active filter.
* **Clear selection** deselects all tasks.
* A live badge shows how many tasks are currently selected.
* CSV, JSON, and PDF export buttons are disabled (gray, "not-allowed" cursor) until at least one task is selected, then become colored and clickable.

## 📱 Responsive Design

The application uses Tailwind CSS responsive utility classes to provide a suitable layout across different devices.

### Supported Screens

* 📱 Mobile
* 📲 Tablet
* 💻 Laptop
* 🖥️ Desktop

The task list, filters, and export controls automatically adjust based on screen size.

## 🎨 User Interface

The interface includes:

* Header with clickable "Site" logo and dark mode toggle
* Colored filter tabs (All / Active / Completed) with icons
* Add-task form with text, date, and notes fields
* Task cards with completion checkbox, date badge, notes, and icon-based Edit/Delete/Select buttons
* Export section with Select all / Clear selection links, a live selection counter, and CSV/JSON/PDF buttons
* Custom exit/reload confirmation modal
* Dark mode support throughout

## 🔄 Application Flow

```text
User Opens Website
        ↓
Tasks Rendered (empty on first load)
        ↓
User Adds Task (text + date + notes)
        ↓
Task List Updated
        ↓
User Selects Task(s) for Export
        ↓
Export Buttons Enabled
        ↓
User Exports as CSV / JSON / PDF
        ↓
File Downloaded
```

## 🔮 Future Improvements

The project can be extended with additional features, such as:

* 💾 Persist tasks using `localStorage` or a backend database
* 🔍 Task search
* 🏷️ Task categories/tags
* 📊 Sort tasks by date or status
* 🔔 Due-date reminders/notifications
* 👤 User authentication and multi-device sync
* 📎 File attachments per task
* ↩️ Undo for delete actions

## 🧪 Testing

The following functionality should be tested:

* [x] Tasks display correctly
* [x] Add task works, including date validation
* [x] Edit task updates text, date, and notes correctly
* [x] Delete task works, with confirmation modal
* [x] Filter tabs (All/Active/Completed) work correctly
* [x] Export selection toggles correctly per task
* [x] Select all / Clear selection work correctly
* [x] Export buttons enable/disable based on selection
* [x] CSV, JSON, and PDF exports download correctly
* [x] Dark mode toggle works and persists across visits
* [x] Empty state message appears when there are no tasks
* [x] Responsive layout works on different screen sizes

## 📚 Learning Objectives

This project demonstrates practical knowledge of:

* HTML document structure and semantic elements
* Tailwind CSS utility classes and dark mode variants
* Responsive web design
* JavaScript arrays and objects
* DOM manipulation
* Event listeners and event handling
* Dynamic HTML rendering
* Array methods such as `map()`, `filter()`, `find()`, and `forEach()`
* Client-side file generation (CSV, JSON, PDF via Blob/canvas APIs)
* Basic task-manager application logic

## 📄 License

This project was created for **learning and personal-use purposes**.

## 👨‍💻 Author

https://github.com/zamanrm

⭐ If you find this project useful, feel free to adapt it for your own to-do list needs!