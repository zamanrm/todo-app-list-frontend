// ========================================
// DOM ELEMENTS
// ========================================

// Main elements
const addTaskForm = document.getElementById("addTaskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskNotes = document.getElementById("taskNotes");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

// Filter buttons
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

// Delete modal
const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// Edit modal
const editModal = document.getElementById("editModal");
const editTaskForm = document.getElementById("editTaskForm");
const editTaskInput = document.getElementById("editTaskInput");
const editTaskDate = document.getElementById("editTaskDate");
const editTaskNotes = document.getElementById("editTaskNotes");
const cancelEditBtn = document.getElementById("cancelEditBtn");

// Exit / reload modal
const reloadBtn = document.getElementById("reloadBtn");
const exitModal = document.getElementById("exitModal");
const cancelExitBtn = document.getElementById("cancelExitBtn");
const confirmExitBtn = document.getElementById("confirmExitBtn");

// Export buttons
const exportValidationMsg = document.getElementById("exportValidationMsg");
const selectionCountBadge = document.getElementById("selectionCountBadge");
const selectionCountNumber = document.getElementById("selectionCountNumber");
const selectionCountLabel = document.getElementById("selectionCountLabel");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const selectAllBtn = document.getElementById("selectAllBtn");
const clearSelectionBtn = document.getElementById("clearSelectionBtn");

// Theme toggle
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIconSun = document.getElementById("themeIconSun");
const themeIconMoon = document.getElementById("themeIconMoon");

// Logo
const logoBtn = document.getElementById("logoBtn");


// ========================================
// APPLICATION STATE
// ========================================

// Tasks are kept in memory only for this session.
// Reloading or closing the tab intentionally clears them
// (see the beforeunload warning below).
let tasks = [];

// Current filter
let currentFilter = "all";

// Task waiting to be deleted
let taskToDelete = null;

// Task currently being edited
let taskToEdit = null;


// ========================================
// SAVE TASKS
// ========================================

// Tasks are intentionally session-only (not persisted to
// localStorage), so this is kept only so the rest of the code
// doesn't need to change if persistence is ever reintroduced.
function saveTasks() {

    // No-op: tasks live in memory only for this session.

}


// ========================================
// ADD TASK
// ========================================

function addTask() {

    const taskText = taskInput.value.trim();


    // Prevent empty task
    if (taskText === "") {

        taskInput.focus();

        return;

    }


    // Date is required — the HTML `required` attribute alone
    // won't block this, since the form's submit handler calls
    // preventDefault() and bypasses native validation.
    if (taskDate.value === "") {

        taskDate.focus();

        // reportValidity() surfaces the browser's own native
        // "please fill out this field" bubble, matching the
        // feedback style already used for HTML5-validated fields.
        if (typeof taskDate.reportValidity === "function") {

            taskDate.reportValidity();

        }

        return;

    }


    // Create task object with date, notes, and selected tracking
    const newTask = {

        id: Date.now(),

        text: taskText,

        date: taskDate.value,

        notes: taskNotes.value.trim() || "",

        completed: false,

        selected: false

    };


    // Add task
    tasks.push(newTask);


    // Save
    saveTasks();


    // Clear all inputs
    taskInput.value = "";

    taskDate.value = "";

    taskNotes.value = "";


    // Refresh UI
    renderTasks();

    updateExportButtonState();


    // Focus input for next task
    taskInput.focus();

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    // Clear task list
    taskList.innerHTML = "";


    // Filter tasks
    let filteredTasks = tasks;


    if (currentFilter === "active") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    // Empty state
    if (filteredTasks.length === 0) {

        emptyMessage.classList.remove("hidden");

    } else {

        emptyMessage.classList.add("hidden");

    }


    // Create task elements
    filteredTasks.forEach(task => {

        // ========================================
        // TASK CONTAINER
        // ========================================

        const li = document.createElement("li");

        li.className =
            "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-start gap-3 transition-colors duration-300";


        // ========================================
        // EXPORT-SELECT TOGGLE (distinct from completion checkbox)
        // ========================================

        const isSelected = Boolean(task.selected);

        const selectToggle = document.createElement("button");

        selectToggle.type = "button";

        selectToggle.setAttribute("aria-pressed", isSelected ? "true" : "false");

        selectToggle.setAttribute(
            "aria-label",
            isSelected
                ? `Remove from export selection: ${task.text}`
                : `Select for export: ${task.text}`
        );

        selectToggle.title = isSelected ? "Selected for export" : "Select for export";

        // Deliberately a different shape/icon (a bookmark rather
        // than a checkbox) so it can't be mistaken for the
        // completion checkbox right next to it in the row.
        selectToggle.className = isSelected
            ? "inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition"
            : "inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition";

        selectToggle.innerHTML = isSelected
            ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';


        selectToggle.addEventListener("click", () => {

            toggleTaskSelection(task.id);

        });


        // ========================================
        // LEFT SECTION (completion checkbox + text/details)
        // ========================================

        const leftSection = document.createElement("div");

        leftSection.className =
            "flex items-start gap-3 flex-1 min-w-0";


        // ========================================
        // COMPLETION CHECKBOX
        // ========================================

        const checkboxId = `task-checkbox-${task.id}`;

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.id = checkboxId;

        checkbox.checked = task.completed;

        checkbox.className =
            "mt-1 h-5 w-5 shrink-0 cursor-pointer accent-blue-600";


        checkbox.addEventListener("change", () => {

            toggleTask(task.id);

        });


        // ========================================
        // TASK DETAILS (text, date, notes)
        // ========================================

        const detailsWrapper = document.createElement("div");

        detailsWrapper.className = "min-w-0 flex-1";


        // Task text (as a label tied to the completion checkbox)
        const span = document.createElement("label");

        span.htmlFor = checkboxId;

        span.textContent = task.text;

        span.className =
            "block text-gray-800 dark:text-gray-100 break-words leading-6 cursor-pointer";


        // Completed styling
        if (task.completed) {

            span.classList.add(
                "line-through",
                "text-gray-400",
                "dark:text-gray-500"
            );

        }


        detailsWrapper.appendChild(span);


        // Date badge (only if set)
        if (task.date) {

            const dateBadge = document.createElement("span");

            dateBadge.className =
                "mt-1 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400";

            dateBadge.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<rect x="3" y="4" width="18" height="18" rx="2"></rect>' +
                '<line x1="16" y1="2" x2="16" y2="6"></line>' +
                '<line x1="8" y1="2" x2="8" y2="6"></line>' +
                '<line x1="3" y1="10" x2="21" y2="10"></line>' +
                '</svg>';

            const dateText = document.createElement("span");

            dateText.textContent = formatDateForDisplay(task.date);

            dateBadge.appendChild(dateText);

            detailsWrapper.appendChild(dateBadge);

        }


        // Notes (only if set)
        if (task.notes) {

            const notesEl = document.createElement("p");

            notesEl.className =
                "mt-1 text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap";

            notesEl.textContent = task.notes;

            detailsWrapper.appendChild(notesEl);

        }


        // Add completion checkbox + details
        leftSection.appendChild(checkbox);

        leftSection.appendChild(detailsWrapper);


        // ========================================
        // ACTION SECTION
        // ========================================

        const actionSection = document.createElement("div");

        actionSection.className =
            "flex shrink-0 gap-2";


        // ========================================
        // EDIT BUTTON (icon)
        // ========================================

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.setAttribute(
            "aria-label",
            `Edit task: ${task.text}`
        );

        editButton.title = "Edit";

        editButton.className =
            "inline-flex items-center justify-center h-9 w-9 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/60 active:bg-yellow-300 dark:active:bg-yellow-900 transition";

        editButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>' +
            '<path d="M15 5l4 4"></path>' +
            '</svg>';


        editButton.addEventListener("click", () => {

            openEditModal(task.id);

        });


        // ========================================
        // DELETE BUTTON (icon)
        // ========================================

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.setAttribute(
            "aria-label",
            `Delete task: ${task.text}`
        );

        deleteButton.title = "Delete";

        deleteButton.className =
            "inline-flex items-center justify-center h-9 w-9 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 active:bg-red-300 dark:active:bg-red-900 transition";

        deleteButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<polyline points="3 6 5 6 21 6"></polyline>' +
            '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>' +
            '<path d="M10 11v6"></path>' +
            '<path d="M14 11v6"></path>' +
            '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>' +
            '</svg>';


        deleteButton.addEventListener("click", () => {

            openDeleteModal(task.id);

        });


        // Add buttons: select-for-export, then edit, then delete
        actionSection.appendChild(selectToggle);

        actionSection.appendChild(editButton);

        actionSection.appendChild(deleteButton);


        // Add sections: main content, then actions
        li.appendChild(leftSection);

        li.appendChild(actionSection);


        // Add task
        taskList.appendChild(li);

    });


    // Update counter
    updateTaskCount();

    updateExportButtonState();

}


// Formats an ISO date string (yyyy-mm-dd, from a <input type="date">)
// into a friendlier display form, e.g. "Sep 20, 2026". Falls back
// to the raw value if parsing fails for any reason.
function formatDateForDisplay(isoDateString) {

    try {

        const [year, month, day] = isoDateString.split("-").map(Number);

        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString(undefined, {

            year: "numeric",

            month: "short",

            day: "numeric"

        });

    } catch (error) {

        return isoDateString;

    }

}


// ========================================
// TOGGLE TASK
// ========================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ========================================
// TOGGLE TASK SELECTION (for export)
// ========================================

function toggleTaskSelection(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                selected: !task.selected
            };

        }

        return task;

    });


    saveTasks();


    // Unlike a native checkbox (which visually updates itself),
    // this is a button whose fill/icon must be redrawn manually
    // to reflect the new selected state.
    renderTasks();

}


// Selects every task currently visible under the active filter
// (not every task regardless of filter) — this matches what the
// user can actually see on screen, so "Select all" behaves
// predictably whether they're viewing All, Active, or Completed.
function selectAllTasks() {

    tasks = tasks.map(task => {

        const isVisibleUnderCurrentFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);


        if (isVisibleUnderCurrentFilter) {

            return { ...task, selected: true };

        }


        return task;

    });


    saveTasks();

    renderTasks();

}


// Clears every task's selection, regardless of the active filter
// — a full reset, so the user always knows exactly where they
// stand after clicking it rather than wondering if some
// selections from a different filter view are still active.
function clearTaskSelection() {

    tasks = tasks.map(task => ({ ...task, selected: false }));

    saveTasks();

    renderTasks();

}


// ========================================
// EDIT TASK
// ========================================

// Open edit modal
function openEditModal(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) {

        return;

    }


    // Store task ID
    taskToEdit = id;


    // Put current values into inputs
    editTaskInput.value = task.text;

    editTaskDate.value = task.date || "";

    editTaskNotes.value = task.notes || "";


    // Show modal (native dialog)
    editModal.classList.remove("hidden");

    if (typeof editModal.showModal === "function") {

        editModal.showModal();

    }


    // Focus input
    setTimeout(() => {

        editTaskInput.focus();

        editTaskInput.select();

    }, 50);

}


// ========================================
// SAVE EDIT
// ========================================

function saveEdit() {

    if (taskToEdit === null) {

        return;

    }


    const updatedText =
        editTaskInput.value.trim();


    // Prevent empty task
    if (updatedText === "") {

        editTaskInput.focus();

        return;

    }


    // Date is required, same as the add-task form.
    if (editTaskDate.value === "") {

        editTaskDate.focus();

        if (typeof editTaskDate.reportValidity === "function") {

            editTaskDate.reportValidity();

        }

        return;

    }


    // Find task
    const task = tasks.find(
        task => task.id === taskToEdit
    );


    if (!task) {

        closeEditModal();

        return;

    }


    // Update text, date, and notes
    task.text = updatedText;

    task.date = editTaskDate.value;

    task.notes = editTaskNotes.value.trim() || "";


    // Save
    saveTasks();


    // Refresh UI
    renderTasks();


    // Close modal
    closeEditModal();

}


// ========================================
// CLOSE EDIT MODAL
// ========================================

function closeEditModal() {

    editModal.classList.add("hidden");

    if (typeof editModal.close === "function" && editModal.open) {

        editModal.close();

    }


    taskToEdit = null;

    editTaskInput.value = "";

    editTaskDate.value = "";

    editTaskNotes.value = "";

}


// ========================================
// DELETE TASK
// ========================================

// Open delete modal
function openDeleteModal(id) {

    taskToDelete = id;

    deleteModal.classList.remove("hidden");

    if (typeof deleteModal.showModal === "function") {

        deleteModal.showModal();

    }


    // Focus the safer default action
    setTimeout(() => {

        cancelDeleteBtn.focus();

    }, 50);

}


// ========================================
// CONFIRM DELETE
// ========================================

function confirmDelete() {

    if (taskToDelete === null) {

        return;

    }


    // Remove task
    tasks = tasks.filter(
        task => task.id !== taskToDelete
    );


    // Save
    saveTasks();


    // Refresh UI
    renderTasks();


    // Close modal
    closeDeleteModal();

}


// ========================================
// CLOSE DELETE MODAL
// ========================================

function closeDeleteModal() {

    deleteModal.classList.add("hidden");

    if (typeof deleteModal.close === "function" && deleteModal.open) {

        deleteModal.close();

    }


    taskToDelete = null;

}


// ========================================
// UPDATE TASK COUNT
// ========================================

function updateTaskCount() {

    const remainingTasks = tasks.filter(
        task => !task.completed
    ).length;


    if (remainingTasks === 0) {

        taskCount.textContent =
            "No tasks remaining";

    }

    else if (remainingTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    }

    else {

        taskCount.textContent =
            `${remainingTasks} tasks remaining`;

    }

}


// ========================================
// FILTER TASKS
// ========================================

function setFilter(filter) {

    currentFilter = filter;

    updateFilterButtons();

    renderTasks();

}


// ========================================
// UPDATE FILTER BUTTONS
// ========================================

function updateFilterButtons() {

    const filterButtons = [allBtn, activeBtn, completedBtn];


    filterButtons.forEach(button => {

        // Reuse each button's own brand color (set via data-color
        // in the HTML), so All/Active/Completed each keep their
        // distinct identity whether selected or not.
        const color = button.dataset.color;

        const isActive = button.id === (
            currentFilter === "all" ? "allBtn" :
            currentFilter === "active" ? "activeBtn" :
            "completedBtn"
        );


        button.setAttribute("aria-pressed", isActive ? "true" : "false");


        if (isActive) {

            // Selected: solid color fill, white text/icon.
            button.style.backgroundColor = color;

            button.style.borderColor = color;

            button.style.color = "#ffffff";

        } else {

            // Unselected: soft tinted background using the same
            // color at low opacity, so it still reads as "this
            // button belongs to that category" at a glance.
            button.style.backgroundColor = `${color}1a`; // ~10% opacity

            button.style.borderColor = `${color}55`; // ~33% opacity

            button.style.color = color;

        }

    });

}


// ========================================
// EVENT LISTENERS
// ========================================


// Add task (form submit covers both button click and Enter key)
addTaskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        addTask();

    }
);


// ========================================
// FILTER EVENTS
// ========================================

allBtn.addEventListener(
    "click",
    () => {

        setFilter("all");

    }
);


activeBtn.addEventListener(
    "click",
    () => {

        setFilter("active");

    }
);


completedBtn.addEventListener(
    "click",
    () => {

        setFilter("completed");

    }
);


// ========================================
// EDIT MODAL EVENTS
// ========================================

// Save edit (form submit covers both button click and Enter key)
editTaskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        saveEdit();

    }
);


// Cancel edit
cancelEditBtn.addEventListener(
    "click",
    closeEditModal
);


// Click outside edit modal (native <dialog> click-on-backdrop)
editModal.addEventListener(
    "click",
    (event) => {

        if (event.target === editModal) {

            closeEditModal();

        }

    }
);


// Native dialog close (e.g. Escape key handled by the browser)
editModal.addEventListener(
    "close",
    () => {

        editModal.classList.add("hidden");

        taskToEdit = null;

        editTaskInput.value = "";

        editTaskDate.value = "";

        editTaskNotes.value = "";

    }
);


// ========================================
// DELETE MODAL EVENTS
// ========================================

// Confirm delete
confirmDeleteBtn.addEventListener(
    "click",
    confirmDelete
);


// Cancel delete
cancelDeleteBtn.addEventListener(
    "click",
    closeDeleteModal
);


// Click outside delete modal (native <dialog> click-on-backdrop)
deleteModal.addEventListener(
    "click",
    (event) => {

        if (event.target === deleteModal) {

            closeDeleteModal();

        }

    }
);


// Native dialog close (e.g. Escape key handled by the browser)
deleteModal.addEventListener(
    "close",
    () => {

        deleteModal.classList.add("hidden");

        taskToDelete = null;

    }
);


// ========================================
// EXIT / RELOAD CONFIRMATION (custom modal)
// ========================================

// Set to true right before a reload we already confirmed via our
// own custom modal, so the native beforeunload fallback below
// knows not to double-prompt the user.
let reloadConfirmedByUser = false;

// Open the custom, styled confirmation when the user clicks the
// in-app Reload button. This works identically across desktop
// and mobile browsers, unlike the native beforeunload dialog.
function openExitModal() {

    // Nothing to lose — just reload without bothering the user.
    if (tasks.length === 0) {

        performReload();

        return;

    }


    exitModal.classList.remove("hidden");

    if (typeof exitModal.showModal === "function") {

        exitModal.showModal();

    }


    setTimeout(() => {

        cancelExitBtn.focus();

    }, 50);

}


function closeExitModal() {

    exitModal.classList.add("hidden");

    if (typeof exitModal.close === "function" && exitModal.open) {

        exitModal.close();

    }

}


// Resets the app to a fresh state: clears all tasks, resets the
// active filter back to "All", and re-renders the UI. This is
// what actually delivers on the "reload will erase your tasks"
// promise — it doesn't depend on browser navigation succeeding,
// so it works even inside sandboxed previews that block
// reload()/navigation. A real page reload is still attempted
// afterward as a bonus, for a fully clean slate when it's
// available (fresh in-memory state, scroll position reset, etc).
function performReload() {

    reloadConfirmedByUser = true;


    // Close the dialog first.
    closeExitModal();


    // Guaranteed part: manually clear everything and redraw,
    // regardless of whether real navigation is possible here.
    tasks = [];

    currentFilter = "all";

    taskToDelete = null;

    taskToEdit = null;

    taskInput.value = "";

    updateFilterButtons();

    renderTasks();

    taskInput.focus();


    // Bonus part: also attempt a true browser reload, which
    // gives a fully clean slate (fresh script state, reset
    // scroll position, etc.) in environments that allow it.
    // If it's blocked, the manual reset above has already
    // delivered the visible result the user asked for.
    try {

        window.location.reload();

    } catch (error) {

        console.warn(
            "A real page reload wasn't available in this environment " +
            "(likely a sandboxed preview) — the task list was still " +
            "cleared manually above.",
            error
        );

    }

}


reloadBtn.addEventListener(
    "click",
    openExitModal
);


confirmExitBtn.addEventListener(
    "click",
    performReload
);


cancelExitBtn.addEventListener(
    "click",
    closeExitModal
);


exitModal.addEventListener(
    "click",
    (event) => {

        if (event.target === exitModal) {

            closeExitModal();

        }

    }
);


exitModal.addEventListener(
    "close",
    () => {

        exitModal.classList.add("hidden");

    }
);


// ========================================
// NATIVE FALLBACK FOR DIRECT BROWSER REFRESH/CLOSE
// ========================================

// This covers the browser's own refresh button, F5, closing the
// tab, etc. — actions our custom modal above can't intercept.
// Desktop Chrome/Firefox/Edge/Safari will show their own native
// wording (browsers block custom text here for security reasons),
// and most mobile browsers ignore beforeunload entirely — both
// are platform limitations no website can change. The in-app
// Reload button above is the reliable, fully custom experience.
window.addEventListener(
    "beforeunload",
    (event) => {

        // Already confirmed through our own custom modal —
        // don't let the browser show a second, native prompt.
        if (reloadConfirmedByUser) {

            return;

        }


        if (tasks.length === 0) {

            return;

        }


        event.preventDefault();

        event.returnValue = "";

    }
);


// ========================================
// EXPORT TASKS
// ========================================

// Shared helper: builds a temporary download link for the given
// text content and clicks it programmatically, then cleans up.
// This is the standard client-side way to trigger a file save
// without needing a server.
function downloadTextFile(filename, content, mimeType) {

    const blob = new Blob([content], { type: mimeType });

    const url = URL.createObjectURL(blob);


    const link = document.createElement("a");

    link.href = url;

    link.download = filename;


    // Must be attached to the DOM for some browsers (notably
    // older Firefox) to honor the click reliably.
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    // Release the object URL's memory once the download has
    // had a moment to start.
    setTimeout(() => {

        URL.revokeObjectURL(url);

    }, 1000);

}


// Escapes a single CSV field: wraps it in double quotes and
// doubles any internal quotes, per the standard CSV convention.
// This keeps task text with commas, quotes, or line breaks from
// corrupting the file's column structure.
function escapeCsvField(value) {

    const stringValue = String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;

}


// Returns only the tasks the user has explicitly checked via the
// selection checkbox — every export (CSV, JSON, PDF) works off
// this same list, so behavior is consistent across formats.
function getSelectedTasks() {

    return tasks.filter(task => task.selected);

}


// Enables/disables the three export buttons based on whether any
// tasks are currently selected, and shows/hides the "please
// select a task" hint accordingly. Called after every render,
// selection change, add, or delete so the buttons never go stale.
function updateExportButtonState() {

    const selectedCount = getSelectedTasks().length;

    const hasSelection = selectedCount > 0;


    [exportCsvBtn, exportJsonBtn, exportPdfBtn].forEach(button => {

        button.disabled = !hasSelection;

    });


    exportValidationMsg.classList.toggle("hidden", hasSelection);


    // Show a live "N task(s) selected" badge whenever at least
    // one task is checked, with correct singular/plural wording.
    selectionCountBadge.style.display = hasSelection ? "inline-flex" : "none";

    selectionCountNumber.textContent = selectedCount;

    selectionCountLabel.textContent =
        selectedCount === 1 ? "task selected" : "tasks selected";

}


function exportTasksAsCsv() {

    const selectedTasks = getSelectedTasks();


    if (selectedTasks.length === 0) {

        exportValidationMsg.classList.remove("hidden");

        return;

    }


    const header = ["Task", "Date", "Notes", "Status"];

    const rows = selectedTasks.map(task => [

        escapeCsvField(task.text),

        escapeCsvField(task.date ? formatDateForDisplay(task.date) : ""),

        escapeCsvField(task.notes || ""),

        escapeCsvField(task.completed ? "Completed" : "Active")

    ].join(","));


    const csvContent = [header.join(","), ...rows].join("\r\n");


    const today = new Date().toISOString().slice(0, 10);

    downloadTextFile(
        `tasks-${today}.csv`,
        csvContent,
        "text/csv;charset=utf-8;"
    );

}


function exportTasksAsJson() {

    const selectedTasks = getSelectedTasks();


    if (selectedTasks.length === 0) {

        exportValidationMsg.classList.remove("hidden");

        return;

    }


    // Export a clean, readable shape rather than dumping internal
    // fields like id/selected, which are just implementation
    // details (a timestamp id, and export-checkbox UI state).
    const exportableTasks = selectedTasks.map(task => ({

        task: task.text,

        date: task.date || null,

        notes: task.notes || null,

        completed: task.completed

    }));


    const jsonContent = JSON.stringify(exportableTasks, null, 2);


    const today = new Date().toISOString().slice(0, 10);

    downloadTextFile(
        `tasks-${today}.json`,
        jsonContent,
        "application/json;charset=utf-8;"
    );

}


// Builds a polished, well-formatted PDF of the selected tasks
// using jsPDF + its autotable plugin (loaded via CDN in
// index.html). Falls back to a clear alert if the library
// somehow isn't available, rather than failing silently.
function exportTasksAsPdf() {

    const selectedTasks = getSelectedTasks();


    if (selectedTasks.length === 0) {

        exportValidationMsg.classList.remove("hidden");

        return;

    }


    if (typeof window.jspdf === "undefined") {

        alert(
            "The PDF export library didn't load (this can happen " +
            "without an internet connection). Please check your " +
            "connection and try again."
        );

        return;

    }


    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({ unit: "pt", format: "a4" });


    const pageWidth = doc.internal.pageSize.getWidth();

    const brandIndigo = [79, 70, 229];    // matches the app's indigo accent
    const brandGray = [107, 114, 128];
    const brandDark = [31, 41, 55];


    // ---- Header band ----
    doc.setFillColor(...brandIndigo);

    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(22);

    doc.text("My To-Do List", 40, 45);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    const generatedOn = new Date().toLocaleDateString(undefined, {

        year: "numeric",
        month: "long",
        day: "numeric"

    });

    doc.text(`Exported on ${generatedOn}`, 40, 64);


    // ---- Summary line ----
    doc.setTextColor(...brandDark);

    doc.setFontSize(11);

    const completedCount = selectedTasks.filter(t => t.completed).length;

    doc.text(
        `${selectedTasks.length} task${selectedTasks.length === 1 ? "" : "s"} selected — ` +
        `${completedCount} completed, ${selectedTasks.length - completedCount} active`,
        40,
        105
    );


    // ---- Table of tasks ----
    const tableRows = selectedTasks.map(task => [

        task.text,

        task.date ? formatDateForDisplay(task.date) : "—",

        task.notes || "—",

        task.completed ? "Completed" : "Active"

    ]);


    doc.autoTable({

        startY: 120,

        head: [["Task", "Date", "Notes", "Status"]],

        body: tableRows,

        theme: "striped",

        headStyles: {

            fillColor: brandIndigo,

            textColor: [255, 255, 255],

            fontStyle: "bold"

        },

        alternateRowStyles: {

            fillColor: [245, 247, 255]

        },

        styles: {

            fontSize: 10,

            cellPadding: 8,

            valign: "top",

            textColor: brandDark

        },

        columnStyles: {

            0: { cellWidth: 140 },
            1: { cellWidth: 80 },
            2: { cellWidth: "auto" },
            3: { cellWidth: 70 }

        },

        margin: { left: 40, right: 40 },

        didParseCell: (data) => {

            // Color the Status column's text to match the app's
            // own completed/active color language.
            if (data.section === "body" && data.column.index === 3) {

                data.cell.styles.textColor =
                    data.cell.raw === "Completed"
                        ? [22, 163, 74]   // green
                        : [217, 119, 6];  // amber

                data.cell.styles.fontStyle = "bold";

            }

        },

        didDrawPage: (data) => {

            // Footer with page number, on every page.
            const pageCount = doc.internal.getNumberOfPages();

            doc.setFontSize(9);

            doc.setTextColor(...brandGray);

            doc.text(
                `Page ${data.pageNumber} of ${pageCount}`,
                pageWidth - 40,
                doc.internal.pageSize.getHeight() - 20,
                { align: "right" }
            );

        }

    });


    const today = new Date().toISOString().slice(0, 10);

    doc.save(`tasks-${today}.pdf`);

}


exportCsvBtn.addEventListener(
    "click",
    exportTasksAsCsv
);


exportJsonBtn.addEventListener(
    "click",
    exportTasksAsJson
);


exportPdfBtn.addEventListener(
    "click",
    exportTasksAsPdf
);


// ========================================
// DARK MODE TOGGLE
// ========================================

const THEME_STORAGE_KEY = "theme";


// Apply a theme ("light" or "dark") to the page: toggles the
// .dark class Tailwind's dark: variant relies on, swaps which
// icon is visible, and keeps aria-pressed/aria-label accurate
// for screen reader users.
function applyTheme(theme) {

    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    themeIconSun.classList.toggle("hidden", !isDark);

    themeIconMoon.classList.toggle("hidden", isDark);

    themeToggleBtn.setAttribute("aria-pressed", isDark ? "true" : "false");

    themeToggleBtn.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

}


// Decide the starting theme: a previously saved choice wins;
// otherwise fall back to the user's OS-level preference so first
// impressions match what they already expect from other apps.
function getInitialTheme() {

    const saved = localStorage.getItem(THEME_STORAGE_KEY);

    if (saved === "light" || saved === "dark") {

        return saved;

    }


    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;


    return prefersDark ? "dark" : "light";

}


themeToggleBtn.addEventListener(
    "click",
    () => {

        const isCurrentlyDark =
            document.documentElement.classList.contains("dark");

        const newTheme = isCurrentlyDark ? "light" : "dark";

        applyTheme(newTheme);

        // Persisting the theme choice (unlike tasks) is
        // intentional — it's a display preference, not app
        // data, so remembering it across visits is expected
        // and doesn't conflict with the session-only task list.
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    }
);


// ========================================
// LOGO (acts as a "home" / hard-reload action)
// ========================================

logoBtn.addEventListener(
    "click",
    () => {

        // Clicking the logo behaves like a browser hard reload:
        // immediately reset everything and reload, with no
        // confirmation step — matching the instant, no-questions
        // -asked feel of clicking a browser's own reload button.
        performReload();

    }
);


// ========================================
// SELECT ALL / CLEAR SELECTION
// ========================================

selectAllBtn.addEventListener(
    "click",
    selectAllTasks
);


clearSelectionBtn.addEventListener(
    "click",
    clearTaskSelection
);


// ========================================
// INITIALIZE APP
// ========================================

applyTheme(getInitialTheme());

updateFilterButtons();

renderTasks();
