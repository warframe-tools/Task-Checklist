// --- sources/js/app.js ---
console.log(`vite mode: ${import.meta.env.MODE}`);

import {
    modulo,
    newChecklistData,
    iconURL,
    makeTaskIcon,
    makeCycleIcon,
    formatTimestamp,
    getMostRecentMondayMidnightUTC,
    getNextDailyMidnightUTC,
    getUTCDateString,
    getUTCDayOfYear,
    formatCountdown,
    parseDuration,
    calcCycleNumber,
    makeInfoLineItem,
    calcTaskTimes,
    makeSectionStats,
} from "./functions.js";

import * as C from "./constants.js";

import * as svgIcons from "./icons.js";

// --- Configuration ---
// Array of background div IDs (must match IDs in sources/index.html)
const dailyBackgroundImageIds = [
    'bg-image-0',
    'bg-image-1',
    'bg-image-2',
    'bg-image-3',
    'bg-image-4',
    // Add more IDs if you add more background image divs in HTML
];
const APP_VERSION = "5.3";
const GIT_COMMIT_HASH_LONG = import.meta.env.VITE_GIT_COMMIT_HASH;
const GIT_COMMIT_HASH = GIT_COMMIT_HASH_LONG.slice(0,7);
const WARFRAME_VERSION = "43.0.8";
const THEME_STORAGE_KEY = 'warframeChecklistTheme';

// only update DATA_STORAGE_KEY when the data storage format changes
// in a backwards-incompatible way (this should be *very* rare)
const DATA_STORAGE_KEY = "warframeChecklistData_format1";

// --- Task Data ---
import tasks from "./tasks.json" with {type: "json"};
import cycles from "./cycles.json" with {type: "json"};
import moreInfo from "./moreInfo.js";

// --- DOM Elements (defined after DOMContentLoaded) ---
let bodyElement, themeToggleButton, hamburgerButton, optionsMenu, resetDailyButton, resetWeeklyButton, resetButton,
    unhideTasksButton, lastSavedTimestampElement, saveStatusElement, sectionToggles, dailyResetTimeElement,
    weeklyResetTimeElement, errorDisplayElement, errorMessageElement, errorCloseButton, errorCopyButton,
    appVersionElement, gitHashElement, wfVersionElement, scheduleDialog, moreInfoDialog, hiddenTasksDialog,
    backgroundDivs, hideCompletedToggle = [];


// --- State Variables ---
const confirmState = {
    all: { timeout: null, isConfirming: false },
    daily: { timeout: null, isConfirming: false },
    weekly: { timeout: null, isConfirming: false },
    unhide: { timeout: null, isConfirming: false }
};

let checklistData = newChecklistData();

let currentTheme = "dark";
let saveStatusTimeout;
let countdownInterval;

// --- Function Definitions ---

function initializeDOMElements() {
    bodyElement = document.body;
    themeToggleButton = document.getElementById("theme-toggle-button");
    hamburgerButton = document.getElementById("hamburger-button");
    optionsMenu = document.getElementById("options-menu");
    resetDailyButton = document.getElementById("reset-daily-button");
    resetWeeklyButton = document.getElementById("reset-weekly-button");
    resetButton = document.getElementById("reset-button");
    unhideTasksButton = document.getElementById("unhide-tasks-button");
    lastSavedTimestampElement = document.getElementById("last-saved-timestamp");
    saveStatusElement = document.getElementById("save-status");
    sectionToggles = document.querySelectorAll(".section-toggle");
    dailyResetTimeElement = document.getElementById("daily-reset-local-time");
    weeklyResetTimeElement = document.getElementById("weekly-reset-local-time");
    errorDisplayElement = document.getElementById("error-display");
    errorMessageElement = document.getElementById("error-message");
    errorCloseButton = document.getElementById("error-close-button");
    errorCopyButton = document.getElementById("error-copy-button");
    appVersionElement = document.querySelector(".version-text");
    gitHashElement = document.querySelector(".git-hash-text");
    wfVersionElement = document.querySelector(".warframe-version-text");
    scheduleDialog = document.getElementById("cycle-schedule");
    moreInfoDialog = document.getElementById("more-info");
    hiddenTasksDialog = document.getElementById("hidden-tasklist");
    hideCompletedToggle = document.getElementById("hide-completed");

    backgroundDivs = [];
    dailyBackgroundImageIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            backgroundDivs.push(el);
        } else {
            console.warn(`Background image container with ID '${id}' not found.`);
        }
    });
}

/**
 * For each task in the task tree, in the order they are defined, call the given
 * `callback` function with the task definition object as a parameter.
 */
function forEachTask(callback) {
    let stack = [];
    for (const section in tasks) {
        for (let i = 0; i < tasks[section].length; i++) {
            // top-level tasks are not pushed in reverse order because they're immediately popped
            stack.push(tasks[section][i]);
            while (stack.length) {
                const t = stack.pop();
                callback(t); // do the thing
                if (t.subtasks) {
                    for (let i = t.subtasks.length - 1; i >= 0 ; i--) {
                        // subtasks are pushed in reverse order so that they're popped in the correct order
                        stack.push(t.subtasks[i]);
                    }
                }
            }
        }
    }
}

export function getTaskById(id) {
    let task = undefined;
    forEachTask((t) => {
        if (t.id === id) {
            task = t;
        }
    });
    return task;
}

function prepTasks() {
    forEachTask((task) => {
        task.section = task.id.split("_")[0];

        if (["daily", "weekly"].includes(task.section)) {
            if (task.ref) { // alternate ref tasks need a period for countdown and reset to work correctly
                task.period = (task.section === "daily") ? "1d" : "7d";
            }
        }

        if (task.id in moreInfo) {
            task.moreInfo = moreInfo[task.id];
        }

        if (task.subtasks) {
            for (const subtask of task.subtasks) {
                subtask.parentId = task.id;
            }
        }
    });
}
prepTasks();

function displayError(message) {
    if (!errorDisplayElement || !errorMessageElement) { return; }
    console.error("Displaying Error:", message);
    errorMessageElement.textContent = message;
    errorDisplayElement.classList.add("visible");
    if (errorCopyButton) { errorCopyButton.textContent = "Copy"; }
}

function hideError() {
    if (!errorDisplayElement) { return; }
    errorDisplayElement.classList.remove("visible");
    errorMessageElement.textContent = '';
    if (errorCopyButton) { errorCopyButton.textContent = "Copy"; }
}

function copyErrorToClipboard() {
    const errorMessage = errorMessageElement.textContent;
    if (!errorMessage || !navigator.clipboard) {
        console.warn("Clipboard API not available or no error message to copy.");
        if (errorCopyButton) { errorCopyButton.textContent = "Failed"; }
        setTimeout(() => {
            if (errorCopyButton) { errorCopyButton.textContent = "Copy"; }
        }, 2000);
        return;
    }
    navigator.clipboard.writeText(errorMessage).then(() => {
        console.log("Error message copied to clipboard.");
        if (errorCopyButton) { errorCopyButton.textContent = "Copied!"; }
        setTimeout(() => {
            if (errorCopyButton) { errorCopyButton.textContent = "Copy"; }
        }, 2000);
    }).catch((err) => {
        console.error("Failed to copy error message: ", err);
        if (errorCopyButton) { errorCopyButton.textContent = "Failed"; }
        setTimeout(() => {
            if (errorCopyButton) { errorCopyButton.textContent = "Copy"; }
        }, 2000);
    });
}

function applyTheme(theme) {
    if (!bodyElement || !themeToggleButton) { return; }

    if (theme === 'light') {
        bodyElement.classList.add('light-mode');
    } else {
        bodyElement.classList.remove('light-mode');
    }
    currentTheme = theme;
}

function handleThemeToggle() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
        console.error("Could not save theme preference:", e);
        displayError("Could not save theme preference.");
    }
}

function loadThemePreference() {
    if (!bodyElement || !themeToggleButton) {
        console.warn("loadThemePreference: bodyElement or themeToggleButton not ready yet.");
        return;
    }

    if (bodyElement.classList.contains('light-mode')) {
        currentTheme = 'light';
    } else {
        currentTheme = 'dark';
    }
    try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme !== currentTheme) {
            localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
        }
    } catch (e) {
        console.warn("Could not sync theme with localStorage on load:", e);
    }
}

function updateLastSavedDisplay(timestamp) {
    if (lastSavedTimestampElement) {
        lastSavedTimestampElement.textContent = `Last saved: ${formatTimestamp(timestamp)}`;
    } else {
        console.error("lastSavedTimestampElement not found");
    }
}

function showSaveStatus() {
    if (!saveStatusElement) { return; }
    clearTimeout(saveStatusTimeout);
    saveStatusElement.style.opacity = '1';
    saveStatusTimeout = setTimeout(() => { saveStatusElement.style.opacity = '0'; }, 1500);
}

function setDailyBackground() {
    if (!bodyElement || backgroundDivs.length === 0) { // Check backgroundDivs instead of bodyElement.style
        console.warn("Body element or background divs not ready for setDailyBackground.");
        return;
    }

    const now = new Date();
    const dayOfYear = getUTCDayOfYear(now);
    const imageIndex = dayOfYear % backgroundDivs.length;

    console.log(`Setting daily background to show div: ${backgroundDivs[imageIndex] ? backgroundDivs[imageIndex].id : 'N/A'} (Index: ${imageIndex})`);

    backgroundDivs.forEach((div, index) => {
        if (div) { // Ensure div exists
            if (index === imageIndex) {
                div.style.display = 'block';
            } else {
                div.style.display = 'none';
            }
        }
    });
}

function handleResets() {
    runAutoResets();
    displayLocalResetTimes();
}

function displayLocalResetTimes() {
    try {
        const now = new Date().getTime();

        // Daily
        const nextDailyResetTimestamp = getNextDailyMidnightUTC();
        const dailyDiff = nextDailyResetTimestamp - now;
        if (dailyResetTimeElement) {
            dailyResetTimeElement.innerHTML = `(Resets in <span class="tooltip" title="${new Date(nextDailyResetTimestamp).toString()}">${formatCountdown(dailyDiff)}</span>)`;
        }

        // Weekly
        let nextWeeklyResetTimestamp = getMostRecentMondayMidnightUTC();
        if (now >= nextWeeklyResetTimestamp) {
            nextWeeklyResetTimestamp += 7 * C.MILLISECONDS_PER_DAY;
        }
        const weeklyDiff = nextWeeklyResetTimestamp - now;
        if (weeklyResetTimeElement) {
            weeklyResetTimeElement.innerHTML = `(Resets in <span class="tooltip" title="${new Date(nextWeeklyResetTimestamp).toString()}">${formatCountdown(weeklyDiff)}</span>)`;
        }

        // Other
        tasks.daily.forEach((task) => displayOtherTaskCountdown(task));
        tasks.weekly.forEach((task) => displayOtherTaskCountdown(task));
        tasks.other.forEach((task) => displayOtherTaskCountdown(task));
    } catch (e) {
        console.error("Error calculating or displaying local reset times:", e);
        if (dailyResetTimeElement) { dailyResetTimeElement.innerHTML = `(Resets 00:00 UTC)`; }
        if (weeklyResetTimeElement) { weeklyResetTimeElement.innerHTML = `(Resets Mon 00:00 UTC)`; }
    }
}

export function displayOtherTaskCountdown(task) {
    const resetTimer = document.querySelector(`#${task.id} ~ .task-description .other-countdown`);
    if (!resetTimer) { return; }

    const now = new Date();
    const taskTimes = calcTaskTimes(task, now);

    if (task.duration) { // intermittently available task (e.g., Baro)
        const leaveNotifId = `${task.id}/departure`;

        if (taskTimes.isAvailable) {
            const diff = taskTimes.thisCycleLeaveTimestamp - now.getTime();
            resetTimer.innerHTML = `(Available for <span class="tooltip" title="${new Date(taskTimes.thisCycleLeaveTimestamp).toString()}">${formatCountdown(diff)}</span>)`;

            // Leaving soon notification (Arrival notification is handled in runAutoResets, the same as always available tasks)
            if (diff < C.MILLISECONDS_PER_HOUR && checklistData.notificationPreferences[task.id] && checklistData.notificationsSent[leaveNotifId] !== cycleNumber) {
                showNotification(`${task.title} Leaving Soon!`, `Approximately ${Math.round(diff / C.MILLISECONDS_PER_MINUTE)} minutes remaining.`);
                checklistData.notificationsSent[leaveNotifId] = cycleNumber;
                saveData(false);
            }
        } else { // task not available
            resetTimer.innerHTML = `(Available in <span class="tooltip" title="${new Date(taskTimes.nextResetTimestamp).toString()}">${formatCountdown(taskTimes.nextResetTimestamp - now.getTime())}</span>)`;
            if (checklistData.notificationsSent[leaveNotifId]) {delete checklistData.notificationsSent[leaveNotifId];}
        }
    } else { // always available task
        resetTimer.innerHTML = `(Resets in <span class="tooltip" title="${new Date(taskTimes.nextResetTimestamp).toString()}">${formatCountdown(taskTimes.nextResetTimestamp - now.getTime())}</span>)`;
    }
}

function runAutoResets() {
    const now = new Date();
    const nowUTCTimestamp = now.getTime();
    const todayUTCString = getUTCDateString(now);

    const lastDailyResetDate = checklistData.lastDailyReset ? new Date(checklistData.lastDailyReset) : null;
    let lastDailyResetUTCString = lastDailyResetDate ? getUTCDateString(lastDailyResetDate) : null;
    if (!lastDailyResetUTCString || lastDailyResetUTCString !== todayUTCString) {
        console.log(`Performing daily auto-reset (UTC). Today: ${todayUTCString}, Last Reset: ${lastDailyResetUTCString}`);
        resetSection("daily", false);
    }

    const lastWeeklyResetTimestamp = checklistData.lastWeeklyReset ? new Date(checklistData.lastWeeklyReset).getTime() : null;
    const mostRecentMondayUTCTimestamp = getMostRecentMondayMidnightUTC();
    if (!lastWeeklyResetTimestamp || lastWeeklyResetTimestamp < mostRecentMondayUTCTimestamp) {
        if (nowUTCTimestamp >= mostRecentMondayUTCTimestamp) {
            console.log(`Performing weekly auto-reset (UTC). Current Time: ${nowUTCTimestamp}, Last Reset: ${lastWeeklyResetTimestamp}, Target Monday: ${mostRecentMondayUTCTimestamp}`);
            resetSection("weekly", false);
        }
    }

    if (!checklistData.lastTaskResetTimes) { checklistData.lastTaskResetTimes = {}; }
    if (!checklistData.notificationsSent) { checklistData.notificationsSent = {}; }

    for (const section of ["daily", "weekly", "other"]) {
        const didReset = tasks[section].map(otherTaskReset).some((r) => r);
        if (didReset) {
            saveData();
            populateSection(section);
        }
    }
}

function otherTaskReset(task) {
    if (["daily", "weekly"].includes(task.section) && !task.ref) { // daily and weekly tasks with an alternate ref are handled as "other" tasks
        return false;
    } else if (!task.period) {
        console.error(`[${task.id}] other_* tasks MUST specify a "period"`);
        return false;
    }
    if (!task.ref) {
        console.warn(`[${task.id}] other_* tasks SHOULD specify a "ref". The default ref of 0 ("1970-01-01T00:00:00Z") will be used otherwise.`)
    }

    let didReset = false;

    const now = new Date();
    const cycleNumber = calcCycleNumber(task, now);
    const lastResetTime = checklistData.lastTaskResetTimes[task.id] || 0;
    const lastResetCycleNumber = calcCycleNumber(task, lastResetTime);

    if (checklistData.progress[task.id] && !calcTaskTimes(task, now).isAvailable) {
        // Uncheck unavailable task
        checklistData.progress[task.id] = false;
        didReset = true;
    }

    if (cycleNumber > lastResetCycleNumber) {
        // Reset task
        if (checklistData.progress[task.id] || checklistData.skippedTasks[task.id]) {
            checklistData.progress[task.id] = false;
            checklistData.skippedTasks[task.id] = false;
            console.log(`Resetting task: ${task.id}`);
            didReset = true;
        }
        checklistData.lastTaskResetTimes[task.id] = now.getTime();

        // Delete old notification record
        const notifSent = checklistData.notificationsSent[task.id];
        if (notifSent && notifSent !== cycleNumber) {
            delete checklistData.notificationsSent[task.id];
        }

        // Send and record new notification
        if (checklistData.notificationPreferences[task.id] && checklistData.notificationsSent[task.id] !== cycleNumber) {
            showNotification(`${task.title} has reset!`, "Vendor stock may have updated.");
            checklistData.notificationsSent[task.id] = cycleNumber;
            saveData(false);
        }
    }

    return didReset;
}

async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        alert("This browser does not support desktop notifications.");
        return false;
    }
    if (Notification.permission === "granted") {
        return true;
    }
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            return true;
        } else {
            alert("Notification permission was denied. You can enable it in your browser settings.");
            return false;
        }
    } else {
        alert("Notification permission has been denied. Please enable it in your browser settings if you wish to receive notifications.");
        return false;
    }
}

function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: body, silent: true });
    }
}

function createChecklistItem(task, isChecked, isSubtask = false) {
    const isAvailable = calcTaskTimes(task, new Date()).isAvailable;

    const listItem = document.createElement("li");
    listItem.classList.add("task-expander");

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    if (checklistData.hiddenTasks[task.id] || checklistData.skippedTasks[task.id]) {
        taskItem.classList.add("hidden-task");
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = task.id;
    checkbox.checked = isChecked;
    if (!isAvailable) {
        checkbox.indeterminate = true;
    }
    if (isSubtask) {
        checkbox.dataset.parentId = task.parentId;
    }

    // Lock unavailable task
    checkbox.addEventListener("click", (event) => {
        // onchange happens *after* the checkbox state has changed. onclick happens *before*.
        if (!isAvailable) {
            event.preventDefault(); // changing the state of the checkbox and then firing onchange is the default action. Don't do it.
        }
    });

    // Task Icon
    const icon = makeTaskIcon(task);

    // Task Description
    const taskDescription = document.createElement(task.subtasks ? "div" : "label");
    taskDescription.classList.add("task-description");
    if (!tasks.subtasks) { taskDescription.htmlFor = task.id; }
    if (isChecked) { taskDescription.classList.add("checked"); }
    if (!isAvailable) { taskDescription.classList.add("unavailable"); }

    // Task Text
    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.innerHTML = task.title;
    taskDescription.appendChild(taskTitle);
    if (task.text) {
        taskTitle.innerHTML += ": ";
        const taskText = document.createElement("span");
        taskText.innerHTML = task.text;
        taskText.classList.add("task-text");
        taskDescription.appendChild(taskText);
    }

    // Reset Timer
    if (task.period) {
        const resetTimer = document.createElement("span");
        resetTimer.classList.add("other-countdown");
        resetTimer.textContent = "(Loading...)";
        taskDescription.appendChild(resetTimer);
    }

    // Info Line & Cycle Schedule
    makeInfoLine(task, taskDescription);

    // Hide/Notif Controls
    const controlsContainer = document.createElement('div');

    // Notif Button
    if (task.id.startsWith("other_")) {
        const notificationButton = document.createElement("button");
        notificationButton.classList.add("notification-toggle-btn", "task-ctrl-btn");
        notificationButton.setAttribute("aria-label", `Toggle notifications for ${task.title}`);
        notificationButton.title = `Toggle notifications for ${task.title}`;

        notificationButton.innerHTML = svgIcons.bellIcon;
        if (checklistData.notificationPreferences[task.id]) { notificationButton.classList.add("active"); }

        notificationButton.addEventListener("click", async (e) => {
            e.stopPropagation();
            const permissionGranted = await requestNotificationPermission();
            if (permissionGranted) {
                checklistData.notificationPreferences[task.id] = !checklistData.notificationPreferences[task.id];
                notificationButton.classList.toggle("active", checklistData.notificationPreferences[task.id]);
                saveData(false);
                console.log(`Notifications for ${task.id} ${checklistData.notificationPreferences[task.id] ? "enabled" : "disabled"}`);
            }
        });
        controlsContainer.appendChild(notificationButton);
    }

    // Skip Button
    const skipButton = document.createElement("button");
    skipButton.classList.add("task-ctrl-btn");
    let skipTooltip;
    if (isAvailable) {
        let when = "this cycle";
        if (task.id.startsWith("daily_")) { when = "today"; }
        else if (task.id.startsWith("weekly_")) { when = "this week"; }
        skipTooltip = `Skip task ${when}: ${task.title}`;
    } else {
        skipTooltip = `Hide task until it becomes available: ${task.title}`;
    }
    skipButton.title = skipButton.ariaLabel = skipTooltip;
    skipButton.innerHTML = svgIcons.skipIcon;
    skipButton.addEventListener("click", hideOrSkipTaskAction(task, true));
    controlsContainer.appendChild(skipButton);

    // Hide Button
    const hideButton = document.createElement("button");
    hideButton.classList.add("task-ctrl-btn");
    hideButton.setAttribute("aria-label", `Hide task: ${task.title}`);
    hideButton.title = `Hide task: ${task.title}`;
    hideButton.innerHTML = svgIcons.hideIcon;
    hideButton.addEventListener("click", hideOrSkipTaskAction(task, false));
    controlsContainer.appendChild(hideButton);

    if (task.subtasks) {
        taskItem.classList.add("parent-task-container");

        const parentHeaderDiv = document.createElement("div");
        parentHeaderDiv.classList.add("parent-task-header");
        parentHeaderDiv.ariaExpanded = !(checklistData.collapsedParentTasks[task.id] || false);
        parentHeaderDiv.setAttribute("aria-controls", `${task.id}-subtasks`);

        parentHeaderDiv.appendChild(checkbox);
        if (task.icon) { parentHeaderDiv.appendChild(icon); }
        parentHeaderDiv.appendChild(taskDescription);

        // Collapse Button
        const collapseButton = document.createElement("button");
        collapseButton.type = "button";
        collapseButton.classList.add("collapse-btn");
        collapseButton.innerHTML = svgIcons.collapseIcon;
        collapseButton.innerHTML += '<div class="incomplete-count"><div>X</div></div>';

        parentHeaderDiv.appendChild(controlsContainer);
        parentHeaderDiv.appendChild(collapseButton);
        taskItem.appendChild(parentHeaderDiv);

        // Subtasks
        const subtaskCollapsible = document.createElement("div");
        subtaskCollapsible.classList.add("subtask-collapsible");
        if (checklistData.collapsedParentTasks[task.id]) { subtaskCollapsible.classList.add("collapsed"); }
        const subtaskList = document.createElement("ul");
        subtaskList.id = `${task.id}-subtasks`;
        subtaskList.classList.add("subtask-list");

        task.subtasks.forEach((subtask) => {
            const subtaskIsChecked = checklistData.progress[subtask.id] || false;
            const subtaskItem = createChecklistItem(subtask, subtaskIsChecked, true);
            subtaskList.appendChild(subtaskItem);
        });
        subtaskList.appendChild(makeSectionStats(task.id));
        calcSectionStats(task.id, subtaskList);

        subtaskCollapsible.appendChild(subtaskList)
        taskItem.appendChild(subtaskCollapsible);

        updateIncompleteSubtaskCount(task, taskItem);

        // On Click -> Collapse/Expand
        parentHeaderDiv.addEventListener("click", (e) => {
            if (e.target !== checkbox && !checkbox.contains(e.target) && !controlsContainer.contains(e.target) && !collapseButton.contains(e.target) ) {
                toggleCollapseSubtasks(task);
            }
        });
        collapseButton.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleCollapseSubtasks(task);
        });

        // Checkbox Changed -> Change Subtasks Checkboxes
        checkbox.addEventListener("change", checkboxChangeAction(task));

    } else { //no subtasks
        taskItem.appendChild(checkbox);
        if (task.icon) { taskItem.appendChild(icon); }
        taskItem.appendChild(taskDescription);
        taskItem.appendChild(controlsContainer);

        // Checkbox Changed
        checkbox.addEventListener("change", checkboxChangeAction(task));
    }
    listItem.appendChild(taskItem);
    return listItem;
}

function checkboxChangeAction(task) {
    return (event) => {
        let currentlyChecked;
        if ("detail" in event) {
            currentlyChecked = event.detail;
        } else {
            currentlyChecked = event.target.checked;
        }

        event.target.checked = currentlyChecked;
        checklistData.progress[task.id] = currentlyChecked;
        event.target.parentNode.querySelector(".task-description").classList.toggle("checked", currentlyChecked);

        if (task.subtasks) {
            task.subtasks.forEach((subtask) => {
                if (checklistData.skippedTasks[subtask.id] || checklistData.hiddenTasks[subtask.id]) { return; }

                const subCheckbox = document.getElementById(subtask.id);

                // this is kind of a stupid hack: We can recursively fire events with dispatchEvent, but those events
                // don't know about the checkbox status of the originating event. So we attach that status to the
                // `detail` of a CustomEvent, which takes priority over the local status. (Recursive firings like this
                // allow for nested subtasks of arbitrary depth)
                subCheckbox.dispatchEvent(new CustomEvent("change", {detail: currentlyChecked}));
            });
            updateIncompleteSubtaskCount(task);
        } else {
            // Update parent task checkboxes and stats
            updateParentCheckboxes(task);
        }

        calcSectionStats(task.section);
        saveData();
    }
}

function hideOrSkipTaskAction(task, skip) {
    return (event) => {
        event.stopPropagation();
        if (skip) { checklistData.skippedTasks[task.id] = true; }
        else { checklistData.hiddenTasks[task.id] = true; }
        const taskItem = event.target.closest(".task-item");
        taskItem.classList.add("hidden-task");
        updateParentCheckboxes(task);
        updateSectionControls(taskItem.closest("section").id);
        saveData(false);
    }
}

function updateParentCheckboxes(task) {
    let t = task;
    while (t.parentId) {  // walk up the task tree
        calcSectionStats(t.parentId);

        let parentTaskDefinition = getTaskById(t.parentId);

        if (parentTaskDefinition && parentTaskDefinition.subtasks) {
            const allSubtasksDone = parentTaskDefinition.subtasks.every((st) => (checklistData.progress[st.id] || checklistData.hiddenTasks[st.id] || checklistData.skippedTasks[st.id]));
            checklistData.progress[parentTaskDefinition.id] = allSubtasksDone;

            const parentCheckbox = document.getElementById(parentTaskDefinition.id);
            const parentContainer = parentCheckbox ? parentCheckbox.closest(".parent-task-container") : null;
            const parentDescription = parentContainer ? parentContainer.querySelector(".parent-task-header .task-description") : null;

            if (parentCheckbox) { parentCheckbox.checked = allSubtasksDone; }
            if (parentDescription) { parentDescription.classList.toggle("checked", allSubtasksDone); }
        }

        t = parentTaskDefinition;  // move up a level
    }
    calcSectionStats(task.section);
    saveData();
}

function toggleCollapseSubtasks(task) {
    const parentHeaderDiv = document.getElementById(task.id).closest(".parent-task-header");
    const startedCollapsed = (parentHeaderDiv.ariaExpanded !== "true"); // whether the section was collapsed before `toggleCollapseSubtasks` was called
    parentHeaderDiv.ariaExpanded = startedCollapsed; // if it was collapsed before, it should now be expanded
    parentHeaderDiv.parentNode.querySelector(".subtask-collapsible").classList.toggle("collapsed", !startedCollapsed);
    checklistData.collapsedParentTasks[task.id] = !startedCollapsed;
    saveData();
    updateIncompleteSubtaskCount(task);
}

function updateIncompleteSubtaskCount(task, queryFrom=document) {
    if (task.subtasks) {
        const element = queryFrom.querySelector(`#${task.id} ~ .collapse-btn .incomplete-count > div`);
        const unchecked = queryFrom.querySelectorAll(`input[data-parent-id="${task.id}"]:not(:checked, :indeterminate, .hidden-task *)`)
        element.innerText = unchecked.length;
        element.parentElement.title = `${unchecked.length} incomplete subtasks of ${task.title}`;
    }
}

function taskDialogHeaderSetup(task, dialog) {
    dialog.querySelector(":scope header .task-title").innerHTML = task?.title || "";

    let taskIcon = dialog.querySelector(":scope .menu-title img.task-icon");
    taskIcon.className = "task-icon"; // remove possible `icon-filter` from previous opening
    taskIcon.src = "";
    if (task?.icon) {
        taskIcon.src = iconURL(`tasks/${task.icon}`);
        if (!task.noIconFilter) {
            taskIcon.classList.add("icon-filter");
        }
    }
}

function showScheduleAction(task, period, cycleIndex, isAvailable) {
    const cycleCount = cycles[task.id].columns[0].order.length;

    return () => {
        taskDialogHeaderSetup(task, scheduleDialog);

        const thead = scheduleDialog.querySelector(":scope thead");
        const tbody = scheduleDialog.querySelector(":scope tbody");
        thead.innerHTML = "";
        tbody.innerHTML = "";

        let header = `<tr><th>Date</th>`;
        for (const column of cycles[task.id].columns) {
            header += `<th>${column.name}</th>`;
        }
        header += "</tr>";
        thead.innerHTML += header;

        const now = new Date();
        const ref = new Date(cycles[task.id].ref);
        const cyclesSinceRef = Math.floor((now.getTime() - ref.getTime()) / period) + (isAvailable ? 0 : 1); // add 1 if unavailable to skip the current cycle for unavailable intermittent tasks
        const currentCycleStartTime = ref.getTime() + (period * cyclesSinceRef);

        for (let i = 0; i <= cycleCount; i++) {
            let date = "Now";
            if (i !== 0 || !isAvailable) {
                const rowCycleStartDate = new Date(currentCycleStartTime + (period * i));
                date = rowCycleStartDate.toISOString().split("T")[0]; // toISOString is always in UTC, which is what we want. The part before "T" is the date
            }

            let repeat = "";
            if (i === cycleCount) {
                repeat = `<tr><td colspan="${cycles[task.id].columns.length + 1}" class="cycle-repeats">(Cycle Repeats)</td></tr>`;
            }

            let row = `${repeat}<tr><td>${date}</td>`; // intermediate `row` variable is needed because manipulating `tbody.innerHTML` automatically adds `</tr>` tag

            for (const column of cycles[task.id].columns) {
                const cellData = column.order[modulo(cycleIndex + i, cycleCount)];
                const align = column.align ? ` style="text-align: ${column.align}"` : "";
                row += `<td${align}>${makeCycleIcon(cellData)}${cellData.text}</td>`;
            }

            row += "</tr>";
            tbody.innerHTML += row;
        }
        scheduleDialog.showModal();
    }
}

function showMoreInfoAction(task) {
    return () => {
        taskDialogHeaderSetup(task, moreInfoDialog);
        document.getElementById("more-info-content").innerHTML = task.moreInfo;
        moreInfoDialog.showModal();
    }
}

function makeInfoLine(task, appendTo) {
    const hasCycle = Object.hasOwn(cycles, task.id);
    const hasInfoLine = ["location", "npc", "terminal", "prereq", "info", "moreInfo"].some((prop) => task[prop]);

    if (hasCycle || hasInfoLine) {
        const taskInfoExpander = document.createElement("div");
        taskInfoExpander.classList.add("task-info-expander");
        const taskInfoExpanderContent = document.createElement("div");

        // Cycle
        if (hasCycle) {
            const currentCycle = document.createElement("div");
            currentCycle.classList.add("current-cycle");

            currentCycle.innerHTML += svgIcons.cycleIcon;

            const now = new Date();
            const ref = new Date(cycles[task.id].ref);
            const cycleCount = cycles[task.id].columns[0].order.length;

            let prefix, period, cycleIndex;
            const isAvailable = calcTaskTimes(task, now).isAvailable;
            if (task.id.startsWith("weekly_")) {
                prefix = "This&nbsp;Week";
                period = 7 * C.MILLISECONDS_PER_DAY;
                if (ref.getUTCDay() !== 1) {
                    console.warn(`${task.id} cycle ref ${cycles[task.id].ref} is not a Monday`);
                }
            }
            else if (task.id.startsWith("daily_")) {
                prefix = "Today";
                period = C.MILLISECONDS_PER_DAY;
            }
            else {
                prefix = "Current&nbsp;Cycle";
                if (!isAvailable) {prefix = "Next&nbsp;Cycle";}
                period = parseDuration(task.period);
            }

            cycleIndex = modulo(Math.floor((now.getTime() - ref.getTime()) / period), cycleCount);
            if (!isAvailable) { cycleIndex = modulo(cycleIndex + 1, cycleCount); }
            console.log(`${task.id} cycleIndex ${cycleIndex}`);
            const cycleData = cycles[task.id].columns[0].order[cycleIndex];

            const cyclePrefix = document.createElement("span");
            cyclePrefix.innerHTML = `${prefix}: `;
            currentCycle.appendChild(cyclePrefix);

            currentCycle.innerHTML += makeCycleIcon(cycleData);

            const cycleText = document.createElement("span");
            cycleText.textContent = cycleData.text;
            currentCycle.appendChild(cycleText);

            const showSchedule = document.createElement("button");
            showSchedule.type = "button";
            showSchedule.classList.add("more-info-btn");
            showSchedule.innerHTML = "Show&nbsp;Schedule";
            showSchedule.addEventListener("click", showScheduleAction(task, period, cycleIndex, isAvailable));
            currentCycle.appendChild(showSchedule);

            taskInfoExpanderContent.appendChild(currentCycle);
        }

        // Info Line
        if (hasInfoLine) {
            if (task.npc && task.terminal) {console.warn(`[${task.id}] Tasks should specify only one of [npc, terminal].`);}
            const infoLine = document.createElement('div');
            infoLine.classList.add('info-line');
            let infoLineHTML = "";
            infoLineHTML += makeInfoLineItem(task, "location", "Location", svgIcons.locationIcon);
            infoLineHTML = infoLineHTML.replace('Base of Operations', C.BASE_OF_OPERATIONS_TOOLTIP);
            infoLineHTML += makeInfoLineItem(task, "npc", "NPC", svgIcons.npcIcon);
            infoLineHTML += makeInfoLineItem(task, "terminal", "Terminal", svgIcons.terminalIcon);
            infoLineHTML += makeInfoLineItem(task, "prereq", "Requirements", svgIcons.prereqIcon);
            infoLineHTML += makeInfoLineItem(task, "info", "Info", svgIcons.infoIcon);
            infoLine.innerHTML = infoLineHTML;

            if (task.moreInfo) {
                const showMoreInfo = document.createElement("button");
                showMoreInfo.type = "button";
                showMoreInfo.classList.add("more-info-btn");
                showMoreInfo.innerHTML = "More&nbsp;Info";
                showMoreInfo.addEventListener("click", showMoreInfoAction(task));
                const span = document.createElement("span");
                span.appendChild(showMoreInfo);
                infoLine.appendChild(span);
            }

            taskInfoExpanderContent.appendChild(infoLine);
        }

        taskInfoExpander.appendChild(taskInfoExpanderContent);
        appendTo.appendChild(taskInfoExpander);
    }
}

function populateSection(section) {
    const sectionElement = document.querySelector(`#${section}-tasks-content ul`);
    const taskList = tasks[section];

    if (!sectionElement) {
        console.error("Section element not found for population:", sectionElement);
        return;
    }
    sectionElement.innerHTML = '';
    taskList.forEach((task) => {
        const isChecked = checklistData.progress[task.id] || false;
        const listItem = createChecklistItem(task, isChecked);
        sectionElement.appendChild(listItem);
    });
    sectionElement.appendChild(makeSectionStats(section));
    calcSectionStats(section);
    if (sectionElement.parentElement && sectionElement.parentElement.id) {
        updateSectionControls(sectionElement.parentElement.id);
    }
}

/**
 * Update the values of the section stats.
 *
 * @param parent - what task list to count stats on. This can be the name of a section, or the id of a task with subtasks.
 * @param queryFrom - DOM element to find the stats box in. Defaults to `document`. Override this if the element is not inserted into the document yet.
 */
function calcSectionStats(parent, queryFrom=document) {
    let taskList;
    if (parent.includes("_")) {
        taskList = getTaskById(parent).subtasks;
    } else {
        taskList = tasks[parent];
    }
    const statsBox = queryFrom.querySelector(`#stats_${parent} > div`);

    let stats = {
        completed: 0,
        skipped: 0,
        hidden: 0
    }
    for (const task of taskList) {
        if (checklistData.progress[task.id])     { stats.completed++; }
        if (checklistData.skippedTasks[task.id]) { stats.skipped++; }
        if (checklistData.hiddenTasks[task.id])  { stats.hidden++; }
    }

    statsBox.innerHTML = "";

    const statIcons = {
        completed: "✔",
        skipped: svgIcons.skipIcon,
        hidden: svgIcons.hideIcon
    }

    for (const stat in stats) {
        const statButton = document.createElement("button");
        statButton.type = "button";
        statButton.classList.add(`stats-${stat}`);
        statButton.dataset.count = stats[stat];
        statButton.innerHTML = `${statIcons[stat]} +${stats[stat]} ${C.TASKLIST_STAT_NAMES[stat]}`;
        statButton.addEventListener("click", showHiddenTasksAction(parent, taskList, stat));
        statsBox.appendChild(statButton);
    }
}

function showHiddenTasksAction(parent, taskList, stat) {
    return () => {
        // Dialog Title
        const prefix = hiddenTasksDialog.querySelector(".menu-title > span:first-of-type");
        const suffix = hiddenTasksDialog.querySelector(".menu-title > span:last-of-type");
        if (parent.includes("_")) { // subtask list
            const parentTask = getTaskById(parent);
            taskDialogHeaderSetup(parentTask, hiddenTasksDialog);
            prefix.innerText = `${C.TASKLIST_STAT_NAMES[stat]} subtasks of `;
            suffix.innerText = "";
        } else { // section list
            taskDialogHeaderSetup({ title: C.SECTION_NAMES[parent] }, hiddenTasksDialog); // use a fake task to set the task title to the section name
            prefix.innerText = `${C.TASKLIST_STAT_NAMES[stat]} `;
            suffix.innerText = " Tasks";
        }

        // Task List
        const ul = hiddenTasksDialog.querySelector("ul");
        ul.classList = stat;
        ul.innerHTML = "";
        for (const task of taskList) {
            if (checklistData[C.TASKLIST_STAT_PROPERTIES[stat]][task.id]) {
                const li = document.createElement("li");
                li.classList.add("task-expander");

                const taskItem = document.createElement("div");
                taskItem.classList.add("task-item");

                let controlButton;
                if (stat === "completed") {
                    controlButton = document.createElement("input");
                    controlButton.type = "checkbox";
                    controlButton.checked = true;
                } else {
                    controlButton = document.createElement("button");
                    controlButton.type = "button";
                }

                if (stat === "completed") {
                    controlButton.title = controlButton.ariaLabel = `Uncheck task: ${task.title}`;
                } else if (stat === "skipped") {
                    controlButton.innerHTML = svgIcons.skipIcon;
                    controlButton.title = controlButton.ariaLabel = `Unskip task: ${task.title}`;
                } else if (stat === "hidden") {
                    controlButton.innerHTML = svgIcons.unhideIcon;
                    controlButton.title = controlButton.ariaLabel = `Unhide task: ${task.title}`;
                }

                controlButton.addEventListener("click", hiddenTasksButtonAction(taskItem, task, stat));
                taskItem.appendChild(controlButton);

                const icon = makeTaskIcon(task);
                if (icon) { taskItem.appendChild(icon); }

                const title = document.createElement("div");
                title.classList.add("task-title", "task-description");
                title.innerHTML = task.title;
                taskItem.appendChild(title);

                li.appendChild(taskItem);
                ul.appendChild(li);
            }
        }

        hiddenTasksDialog.showModal();
    }
}

function hiddenTasksButtonAction(taskElement, task, stat) {
    return () => {
        taskElement.classList.add("hidden-task"); // unhiding the task hides it from the hidden task list

        if (stat === "completed") {
            document.getElementById(task.id).dispatchEvent(new CustomEvent("change", { detail: false }));
            populateSection(task.section);
        } else {
            checklistData[C.TASKLIST_STAT_PROPERTIES[stat]][task.id] = false;
            document.getElementById(task.id).closest(".task-item").classList.remove("hidden-task");
            updateParentCheckboxes(task);
            if (task.parentId) { calcSectionStats(task.parentId); }
            calcSectionStats(task.section);
        }

        saveData();

        // close dialog if tasklist is empty
        if (!hiddenTasksDialog.querySelector("li > :not(.hidden-task)")) {
            hiddenTasksDialog.close();
        }
    }
}

function resetSpecificButtonState(buttonElement, defaultText, stateKey) {
    if (!buttonElement || !confirmState[stateKey]) { return; }
    clearTimeout(confirmState[stateKey].timeout);
    confirmState[stateKey].timeout = null;
    confirmState[stateKey].isConfirming = false;
    buttonElement.textContent = defaultText;
    buttonElement.classList.remove('confirming');
    console.log(`Button ${buttonElement.id} state reverted.`);
}

function handleResetConfirmation(buttonElement, confirmKey, defaultText, resetAction) {
    if (!confirmState[confirmKey]) {
        console.error("Invalid confirmKey:", confirmKey);
        return;
    }

    if (!confirmState[confirmKey].isConfirming) {
        Object.keys(confirmState).forEach((key) => {
            if (key !== confirmKey && confirmState[key].isConfirming) {
                let btnElement, btnText;
                if (key === 'all') { btnElement = resetButton; btnText = 'Reset All Checks'; }
                else if (key === 'daily') { btnElement = resetDailyButton; btnText = 'Reset Daily Checks'; }
                else if (key === 'weekly') { btnElement = resetWeeklyButton; btnText = 'Reset Weekly Checks'; }
                else if (key === 'unhide') { btnElement = unhideTasksButton; btnText = 'Unhide All Tasks'; }
                if (btnElement) {
                    resetSpecificButtonState(btnElement, btnText, key);
                }
            }
        });
    }

    if (confirmState[confirmKey].isConfirming) {
        console.log(`${defaultText} confirmed by second click.`);
        resetAction();
        resetSpecificButtonState(buttonElement, defaultText, confirmKey);
    } else {
        confirmState[confirmKey].isConfirming = true;
        buttonElement.textContent = 'Are you Sure?';
        buttonElement.classList.add('confirming');
        clearTimeout(confirmState[confirmKey].timeout);

        confirmState[confirmKey].timeout = setTimeout(() => {
            if (confirmState[confirmKey].isConfirming) {
                resetSpecificButtonState(buttonElement, defaultText, confirmKey);
            }
        }, 10000);
    }
}

function resetAllAction() {
    checklistData.progress = {};
    checklistData.skippedTasks = {};
    saveData();
    ["daily", "weekly", "other"].forEach(populateSection);
    console.log("Checklist reset complete.");
}

function resetSection(section, resetAltRefTasks=false) {
    const validSections = ["daily", "weekly"];
    if (!validSections.includes(section)) {
        console.error("Section '%s' is not a valid section name: %s", section, validSections);
        return;
    }

    let didReset = 0;

    function resetTask(task) {
        if (task.ref && !resetAltRefTasks) {
            didReset += otherTaskReset(task);
        } else if (checklistData.progress[task.id] || checklistData.skippedTasks[task.id]) {
            checklistData.progress[task.id] = false;
            checklistData.skippedTasks[task.id] = false;
            didReset++;
        }
        if (task.subtasks) { task.subtasks.forEach(resetTask); }
    }
    tasks[section].forEach(resetTask);

    const now = new Date().toISOString();
    if (section === "daily") { checklistData.lastDailyReset = now; }
    else if (section === "weekly") { checklistData.lastWeeklyReset = now; }
    saveData();
    if (didReset) {
        populateSection(section);
    }
    console.log(`${section} checks reset.`);
}

function resetDailyAction() {
    resetSection("daily", true);
}

function resetWeeklyAction() {
    resetSection("weekly", true);
}

function handleSectionToggle(event) {
    const header = event.target.closest('.section-toggle');
    if (!header) { return; }

    const contentId = header.getAttribute('aria-controls');
    const contentDiv = document.getElementById(contentId);
    if (!contentDiv) { return; }

    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', !isExpanded);
    contentDiv.classList.toggle('collapsed', isExpanded);
    console.log(`Toggled section ${contentId} to ${!isExpanded ? 'expanded' : 'collapsed'}`);
}

function unhideAllAction() {
    checklistData.hiddenTasks = {};
    checklistData.skippedTasks = {};
    checklistData.manuallyHiddenSections = {};
    saveData(false);

    document.querySelectorAll("section.section-is-hidden-by-user").forEach((section) => section.classList.remove("section-is-hidden-by-user"));
    ["daily", "weekly", "other"].forEach(populateSection);

    console.log("All tasks and sections unhidden.");
    optionsMenu.close();
}

function updateSectionControls(sectionElementId) {
    const sectionElement = document.getElementById(sectionElementId);
    if (!sectionElement) { return; }

    const hideSectionButton = sectionElement.querySelector('.hide-section-button');
    if (!hideSectionButton) { return; }

    if (checklistData.manuallyHiddenSections[sectionElementId]) {
        sectionElement.classList.add('section-is-hidden-by-user');
        hideSectionButton.classList.remove('visible');
        return;
    } else {
        sectionElement.classList.remove('section-is-hidden-by-user');
    }

    const contentUl = sectionElement.querySelector('.section-content ul');
    if (!contentUl) {
        hideSectionButton.classList.remove('visible');
        return;
    }

    const allTaskItems = Array.from(contentUl.querySelectorAll('li.task-item'));
    if (allTaskItems.length === 0) {
        hideSectionButton.classList.remove('visible');
        return;
    }

    const allTasksIndividuallyHidden = allTaskItems.every((item) => item.classList.contains("hidden-task"));

    if (allTasksIndividuallyHidden) {
        hideSectionButton.classList.add('visible');
    } else {
        hideSectionButton.classList.remove('visible');
    }
}

export function stopCountdown() {
    if (countdownInterval) { clearInterval(countdownInterval); }
}

export function startCountdown() {
    stopCountdown();
    countdownInterval = setInterval(handleResets, 1000);
}

function saveData(showStatus = true) {
    hideError();
    checklistData.lastSaved = new Date().toISOString();
    try {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(checklistData));
        updateLastSavedDisplay(checklistData.lastSaved);
        if (showStatus) { showSaveStatus(); }
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
        let userMessage = "Could not save progress.";
        if (e.name === 'QuotaExceededError' || (e.code && (e.code === 22 || e.code === 1014))) {
            userMessage = "Could not save progress. Browser storage might be full.";
        }
        displayError(userMessage);
    }
}

function loadData() {
    const savedData = localStorage.getItem(DATA_STORAGE_KEY);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            if (parsedData && typeof parsedData === "object") {
                for (const key of Object.keys(checklistData)) {
                    if (key in parsedData) {
                        checklistData[key] = parsedData[key];
                    }
                }
            } else { console.warn("Invalid data format found in localStorage. Starting fresh."); }
        } catch (e) {
            console.error("Error parsing saved data:", e);
            displayError("Failed to load saved progress. Data might be corrupted.");
            checklistData = newChecklistData();
        }
    }
}

export function loadAndInitializeApp() {
    initializeDOMElements();
    hideError();
    loadThemePreference();
    loadData();
    setDailyBackground();

    handleResets();

    ["daily", "weekly", "other"].forEach(populateSection);
    updateLastSavedDisplay(checklistData.lastSaved);

    // Setup event listeners
    if (appVersionElement) { appVersionElement.textContent = APP_VERSION; }
    else { console.error("App version element not found!"); }

    if (gitHashElement) {
        gitHashElement.textContent = GIT_COMMIT_HASH;
        gitHashElement.href = `https://github.com/warframe-tools/Task-Checklist/tree/${GIT_COMMIT_HASH_LONG}`;
    } else { console.error("git hash element not found!"); }

    if (wfVersionElement) { wfVersionElement.textContent = `Warframe Version ${WARFRAME_VERSION}`; }
    else { console.error("Warframe version element not found!"); }

    if (hideCompletedToggle) {
        hideCompletedToggle.addEventListener("change", (event) => {
            bodyElement.classList.toggle("hide-completed-tasks", event.target.checked);
            checklistData.hideCompletedTasks = event.target.checked;
            saveData();
        });
        hideCompletedToggle.checked = checklistData.hideCompletedTasks;
        bodyElement.classList.toggle("hide-completed-tasks", checklistData.hideCompletedTasks);
    }
    else { console.error("Hide Completed Toggle not found!"); }

    if (resetDailyButton) { resetDailyButton.addEventListener('click', () => handleResetConfirmation(resetDailyButton, 'daily', 'Reset Daily Checks', resetDailyAction)); }
    else { console.error("Reset Daily button element not found!"); }

    if (resetWeeklyButton) { resetWeeklyButton.addEventListener('click', () => handleResetConfirmation(resetWeeklyButton, 'weekly', 'Reset Weekly Checks', resetWeeklyAction)); }
    else { console.error("Reset Weekly button element not found!"); }

    if (resetButton) { resetButton.addEventListener('click', () => handleResetConfirmation(resetButton, 'all', 'Reset All Checks', resetAllAction)); }
    else { console.error("Reset All button element not found!"); }

    if (unhideTasksButton) { unhideTasksButton.addEventListener('click', () => handleResetConfirmation(unhideTasksButton, 'unhide', 'Unhide All Tasks', unhideAllAction)); }
    else { console.error("Unhide Tasks button not found!");}


    if (themeToggleButton) { themeToggleButton.addEventListener('click', handleThemeToggle); }
    else { console.error("Theme toggle button not found!"); }

    if (hamburgerButton) { hamburgerButton.addEventListener('click', () => {optionsMenu.showModal();}); }
    else { console.error("Hamburger button not found!"); }

    sectionToggles.forEach((toggle) => {
        toggle.addEventListener("click", handleSectionToggle);
    });

    try {
        document.getElementById('checklist-container').addEventListener('click', function(event) {
            if (event.target.classList.contains('hide-section-button')) {
                const sectionId = event.target.dataset.sectionId;
                if (sectionId) {
                    const sectionElement = document.getElementById(sectionId);
                    if (sectionElement) {
                        checklistData.manuallyHiddenSections[sectionId] = true;
                        sectionElement.classList.add('section-is-hidden-by-user');
                        event.target.classList.remove('visible');
                        saveData(false);
                        console.log(`Section ${sectionId} manually hidden.`);
                    }
                }
            }
        });
    } catch (e) {
        console.error("Checklist container not found!");
    }


    if (errorCloseButton) {
        errorCloseButton.addEventListener('click', hideError);
    } else { console.error("Error close button not found!"); }

    if (errorCopyButton) {
        errorCopyButton.addEventListener('click', copyErrorToClipboard);
    } else { console.error("Error copy button not found!"); }

    for (const dialog of document.getElementsByTagName("dialog")) {
        // clicking inside the dialog's top-level div does nothing
        dialog.querySelector(":scope > div").addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // clicking the close button...
        dialog.querySelector(":scope .menu-close-button").addEventListener("click", () => {
            dialog.close();
        });

        // clicking anywhere else on the dialog (i.e., the anywhere else the page (the ::backdrop)) will close it
        dialog.addEventListener("click", () => {
            dialog.close();
        });
    }

    console.log(`Warframe Checklist App Initialized (v${APP_VERSION} (${GIT_COMMIT_HASH})) from app.js.`);
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    try {
        loadAndInitializeApp();
        startCountdown();
    } catch(error) {
        console.error("Critical Error during app.js initialization:", error);
        const errDisp = document.getElementById("error-display");
        const errMsg = document.getElementById("error-message");
        if (errDisp && errMsg) {
            errMsg.textContent = "A critical error occurred during application startup. Please check the console.";
            errDisp.classList.add("visible");
        } else {
            alert("A critical error occurred during application startup. Please check the console.");
        }
    }
});
