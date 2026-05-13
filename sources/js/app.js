// --- sources/js/app.js ---
console.log(`vite mode: ${import.meta.env.MODE}`);

import * as svgIcons from "./icons.js";

// --- Configuration ---
// Array of background div IDs (must match IDs in sources/index.html)
const dailyBackgroundImageIds = [
    'bg-image-0',
    'bg-image-1',
    'bg-image-2'
    // Add more IDs if you add more background image divs in HTML
];
const APP_VERSION = "4.0";
const GIT_COMMIT_HASH_LONG = import.meta.env.VITE_GIT_COMMIT_HASH;
const GIT_COMMIT_HASH = GIT_COMMIT_HASH_LONG.slice(0,7);
const WARFRAME_VERSION = "42.0.7.1";
const THEME_STORAGE_KEY = 'warframeChecklistTheme';

// only update DATA_STORAGE_KEY when the data storage format changes
// in a backwards-uncompatible way (this should be *very* rare)
const DATA_STORAGE_KEY = "warframeChecklistData_format1";

const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

const SERVER_TIMEZONE = "America/Toronto";  // used for determining Daylight Saving Time

// --- Task Data ---
import tasks from "./tasks.json" with {type: "json"};
import cycles from "./cycles.json" with {type: "json"};

const taskIcons = import.meta.glob("../img/icons/**/*.png", {eager: true, query: '?url', import: 'default'});
function iconURL(iconName) {
    return taskIcons["../img/icons/" + iconName];
}

// --- DOM Elements (defined after DOMContentLoaded) ---
let bodyElement, contentElement, themeToggleButton, hamburgerButton, slideoutMenuOverlay, menuContentBox, optionsCloseButton,
    dailyList, weeklyList, otherList, resetDailyButton, resetWeeklyButton, resetButton, unhideTasksButton,
    lastSavedTimestampElement, saveStatusElement, sectionToggles, dailyResetTimeElement, weeklyResetTimeElement,
    errorDisplayElement, errorMessageElement, errorCloseButton, errorCopyButton, appVersionElement, gitHashElement,
    wfVersionElement, scheduleDialog,
    backgroundDivs = [];


// --- State Variables ---
const confirmState = {
    all: { timeout: null, isConfirming: false },
    daily: { timeout: null, isConfirming: false },
    weekly: { timeout: null, isConfirming: false },
    unhide: { timeout: null, isConfirming: false }
};

let checklistData = {
    progress: {},
    lastSaved: null,
    lastDailyReset: null,
    lastWeeklyReset: null,
    hiddenTasks: {},
    manuallyHiddenSections: {},
    lastTaskResetTimes: {},
    notificationPreferences: {},
    notificationsSent: {}
};

let currentTheme = 'dark';
let saveStatusTimeout;
let countdownInterval;

// --- Function Definitions ---

function modulo(n, d) {
    return ((n % d) + d) % d;
}

function initializeDOMElements() {
    bodyElement = document.body;
    contentElement = document.querySelector('.checklist-content');
    themeToggleButton = document.getElementById('theme-toggle-button');
    hamburgerButton = document.getElementById('hamburger-button');
    slideoutMenuOverlay = document.getElementById('slideout-menu-overlay');
    menuContentBox = document.getElementById('menu-content-box');
    optionsCloseButton = document.querySelector('#menu-content-box .menu-close-button');
    dailyList = document.querySelector('#daily-tasks-content ul');
    weeklyList = document.querySelector('#weekly-tasks-content ul');
    otherList = document.querySelector('#other-tasks-content ul');
    resetDailyButton = document.getElementById('reset-daily-button');
    resetWeeklyButton = document.getElementById('reset-weekly-button');
    resetButton = document.getElementById('reset-button');
    unhideTasksButton = document.getElementById('unhide-tasks-button');
    lastSavedTimestampElement = document.getElementById('last-saved-timestamp');
    saveStatusElement = document.getElementById('save-status');
    sectionToggles = document.querySelectorAll('.section-toggle');
    dailyResetTimeElement = document.getElementById('daily-reset-local-time');
    weeklyResetTimeElement = document.getElementById('weekly-reset-local-time');
    errorDisplayElement = document.getElementById('error-display');
    errorMessageElement = document.getElementById('error-message');
    errorCloseButton = document.getElementById('error-close-button');
    errorCopyButton = document.getElementById('error-copy-button');
    appVersionElement = document.querySelector('.version-text');
    gitHashElement = document.querySelector('.git-hash-text');
    wfVersionElement = document.querySelector('.warframe-version-text');
    scheduleDialog = document.getElementById("cycle-schedule");

    backgroundDivs = [];
    dailyBackgroundImageIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            backgroundDivs.push(el);
        } else {
            console.warn(`Background image container with ID '${id}' not found.`);
        }
    });
}

function displayError(message) {
    if (!errorDisplayElement || !errorMessageElement) return;
    console.error("Displaying Error:", message);
    errorMessageElement.textContent = message;
    errorDisplayElement.classList.add('visible');
    if (errorCopyButton) errorCopyButton.textContent = 'Copy';
}

function hideError() {
    if (!errorDisplayElement) return;
    errorDisplayElement.classList.remove('visible');
    errorMessageElement.textContent = '';
    if (errorCopyButton) errorCopyButton.textContent = 'Copy';
}

function copyErrorToClipboard() {
    const errorMessage = errorMessageElement.textContent;
    if (!errorMessage || !navigator.clipboard) {
        console.warn("Clipboard API not available or no error message to copy.");
        if (errorCopyButton) errorCopyButton.textContent = 'Failed';
        setTimeout(() => { if (errorCopyButton) errorCopyButton.textContent = 'Copy'; }, 2000);
        return;
    }
    navigator.clipboard.writeText(errorMessage).then(() => {
        console.log("Error message copied to clipboard.");
        if (errorCopyButton) errorCopyButton.textContent = 'Copied!';
        setTimeout(() => { if (errorCopyButton) errorCopyButton.textContent = 'Copy'; }, 2000);
    }).catch(err => {
        console.error('Failed to copy error message: ', err);
        if (errorCopyButton) errorCopyButton.textContent = 'Failed';
        setTimeout(() => { if (errorCopyButton) errorCopyButton.textContent = 'Copy'; }, 2000);
    });
}

function applyTheme(theme) {
    if (!bodyElement || !themeToggleButton) return;

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


function formatTimestamp(timestamp) {
    if (!timestamp) return 'Never';
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) { console.error("Error formatting timestamp:", e); return 'Error'; }
}

function updateLastSavedDisplay(timestamp) {
    if (lastSavedTimestampElement) {
        lastSavedTimestampElement.textContent = `Last saved: ${formatTimestamp(timestamp)}`;
    } else {
        console.error("lastSavedTimestampElement not found");
    }
}

function showSaveStatus() {
    if (!saveStatusElement) return;
    clearTimeout(saveStatusTimeout);
    saveStatusElement.style.opacity = '1';
    saveStatusTimeout = setTimeout(() => { saveStatusElement.style.opacity = '0'; }, 1500);
}

function getMostRecentMondayMidnightUTC() {
    const now = new Date();
    const currentUTCDay = now.getUTCDay();
    const daysSinceMondayUTC = (currentUTCDay === 0) ? 6 : currentUTCDay - 1;

    const mondayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    mondayUTC.setUTCDate(mondayUTC.getUTCDate() - daysSinceMondayUTC);
    mondayUTC.setUTCHours(0, 0, 0, 0);
    return mondayUTC.getTime();
}

function getNextDailyMidnightUTC() {
    const now = new Date();
    const tomorrowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    tomorrowUTC.setUTCHours(0, 0, 0, 0);
    return tomorrowUTC.getTime();
}

function getUTCDateString(dateObj) {
    const year = dateObj.getUTCFullYear();
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getUTCDayOfYear(date) {
    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear;
    return Math.floor(diff / MILLISECONDS_PER_DAY);
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

function formatCountdown(ms) {
    if (ms < 0) return "00:00:00";

    let totalSeconds = Math.floor(ms / 1000);
    let days = Math.floor(totalSeconds / (24 * 60 * 60));
    totalSeconds %= (24 * 60 * 60);
    let hours = Math.floor(totalSeconds / (60 * 60));
    totalSeconds %= (60 * 60);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    if (days > 0) {
        return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function parseDuration(str) {
    // Returns the duration in milliseconds of the given "duration string".
    // Duration strings look like "14d 5h 20m 15s", for number of days, hours
    // minutes, and seconds. All parts are optional. Spaces are optional.
    // Case insensitive. Integers only.
    if (!str || typeof str !== "string") {return undefined;}

    const map = {
        "d": MILLISECONDS_PER_DAY,
        "h": MILLISECONDS_PER_HOUR,
        "m": MILLISECONDS_PER_MINUTE,
        "s": MILLISECONDS_PER_SECOND
    };
    return str.toLowerCase().matchAll(/((\d+)([a-z]))/g).toArray().reduce((acc, curr) => {
        const n = parseInt(curr[2]);
        let mult;
        if (Object.hasOwn(map, curr[3])) {
            mult = map[curr[3]];
        } else {
            console.warn(`unknown time multiplier '${curr[3]}'. Skipping "${curr[1]}" in "${str}"`);
            mult = 0;
        }
        return acc + (n * mult);
    }, 0);
}

export function isDst(date, timezone) {
    // returns whether the given date is in Daylight Saving Time in the named timezone
    if (typeof date === "number" || typeof date === "string") {date = new Date(date);}

    const dateFormat = Intl.DateTimeFormat("en-CA", {timeZone: timezone, timeZoneName: "shortOffset"});

    function wholeHourOffset(d) {
        // returns the whole hour part of the UTC offset as an integer.
        // note the existence of fractional timezones (India, Central Australia, Newfoundland, etc.)
        const timeZoneName = dateFormat.formatToParts(d).find((p) => p.type === "timeZoneName").value;
        return parseInt(timeZoneName.replace("GMT", "").split(":")[0], 10);
    }

    const janOffset = wholeHourOffset(new Date("2026-01-01T00:00:00Z"));
    const julOffset = wholeHourOffset(new Date("2026-07-01T00:00:00Z"));
    if (janOffset === julOffset) {return false;}
    const currentOffset = wholeHourOffset(date);
    const dstOffset = Math.max(janOffset, julOffset);
    return currentOffset === dstOffset;
}

function calcCycleNumber(task, time) {
    // calculates the cycleNumber (number of resets since the reference time) of the given task at the given time (a Date object or timestamp)
    if (typeof time === "number") {time = new Date(time);}
    const ref = new Date(task.ref || 0);
    const period = parseDuration(task.period);
    let diff = time.getTime() - ref.getTime();
    if (task.observesDst && isDst(time, SERVER_TIMEZONE)) {
        diff += MILLISECONDS_PER_HOUR;
    }
    return Math.floor(diff / period);
}

function displayOtherTaskCountdown(task) {
    const resetTimer = document.querySelector(`label[for=${task.id}] .other-countdown`);
    if (!resetTimer) return;

    const now = new Date();
    const ref = new Date(task.ref || 0);
    const period = parseDuration(task.period);
    const cycleNumber = calcCycleNumber(task, now);
    const prevResetTimestamp = ref.getTime() + (cycleNumber * period);
    let nextResetTimestamp = prevResetTimestamp + period;
    let thisCycleLeaveTimestamp = prevResetTimestamp + parseDuration(task.duration);

    if (task.observesDst) {
        if (isDst(nextResetTimestamp))      {nextResetTimestamp      -= MILLISECONDS_PER_HOUR;}
        if (isDst(thisCycleLeaveTimestamp)) {thisCycleLeaveTimestamp -= MILLISECONDS_PER_HOUR;}
    }

    if (task.duration) { // intermittently available task (e.g., Baro)
        const leaveNotifiId = `${task.id}/departure`;

        if (now.getTime() < thisCycleLeaveTimestamp) { // task available
            const diff = thisCycleLeaveTimestamp - now.getTime();
            resetTimer.innerHTML = `(Available for <span class="tooltip" title="${new Date(thisCycleLeaveTimestamp).toString()}">${formatCountdown(diff)}</span>)`;

            // Leaving soon notification (Arrival notification is handled in runAutoResets, the same as always available tasks)
            if (diff < MILLISECONDS_PER_HOUR && checklistData.notificationPreferences[task.id] && checklistData.notificationsSent[leaveNotifiId] !== cycleNumber) {
                showNotification(`${task.text.split(":")[0]} Leaving Soon!`, `Approximately ${Math.round(diff / MILLISECONDS_PER_MINUTE)} minutes remaining.`);
                checklistData.notificationsSent[leaveNotifiId] = cycleNumber;
                saveData(false);
            }
        } else { // task not available
            resetTimer.innerHTML = `(Available in <span class="tooltip" title="${new Date(nextResetTimestamp).toString()}">${formatCountdown(nextResetTimestamp - now.getTime())}</span>)`;
            if (checklistData.notificationsSent[leaveNotifiId]) {delete checklistData.notificationsSent[leaveNotifiId];}
        }
    } else { // always availalbe task
        resetTimer.innerHTML = `(Resets in <span class="tooltip" title="${new Date(nextResetTimestamp).toString()}">${formatCountdown(nextResetTimestamp - now.getTime())}</span>)`;
    }
}

function handleResets() {
    displayLocalResetTimes();
    runAutoResets();
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
            nextWeeklyResetTimestamp += 7 * MILLISECONDS_PER_DAY;
        }
        const weeklyDiff = nextWeeklyResetTimestamp - now;
        if (weeklyResetTimeElement) {
            weeklyResetTimeElement.innerHTML = `(Resets in <span class="tooltip" title="${new Date(nextWeeklyResetTimestamp).toString()}">${formatCountdown(weeklyDiff)}</span>)`;
        }

        // Other
        tasks.other.forEach((task) => displayOtherTaskCountdown(task));
    } catch (e) {
        console.error("Error calculating or displaying local reset times:", e);
        if (dailyResetTimeElement) dailyResetTimeElement.innerHTML = `(Resets 00:00 UTC)`;
        if (weeklyResetTimeElement) weeklyResetTimeElement.innerHTML = `(Resets Mon 00:00 UTC)`;
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
        resetSection("daily");
    }

    const lastWeeklyResetTimestamp = checklistData.lastWeeklyReset ? new Date(checklistData.lastWeeklyReset).getTime() : null;
    const mostRecentMondayUTCTimestamp = getMostRecentMondayMidnightUTC();
    if (!lastWeeklyResetTimestamp || lastWeeklyResetTimestamp < mostRecentMondayUTCTimestamp) {
        if (nowUTCTimestamp >= mostRecentMondayUTCTimestamp) {
            console.log(`Performing weekly auto-reset (UTC). Current Time: ${nowUTCTimestamp}, Last Reset: ${lastWeeklyResetTimestamp}, Target Monday: ${mostRecentMondayUTCTimestamp}`);
            resetSection("weekly");
        }
    }

    let didResetOther = false;
    if (!checklistData.lastTaskResetTimes) checklistData.lastTaskResetTimes = {};
    if (!checklistData.notificationsSent) checklistData.notificationsSent = {};

    tasks.other.forEach((task) => {
        if (!task.period) {
            console.error(`[${task.id}] other_* tasks MUST specify a "period"`);
            return;
        }
        if (!task.ref) {
            console.warn(`[${task.id}] other_* tasks SHOULD specify a "ref". The default ref of 0 ("1970-01-01T00:00:00Z") will be used otherwise.`)
        }

        const cycleNumber = calcCycleNumber(task, now);
        const lastResetTime = checklistData.lastTaskResetTimes[task.id] || 0;
        const lastResetCycleNumber = calcCycleNumber(task, new Date(lastResetTime));
        if (cycleNumber > lastResetCycleNumber) {
            // Reset task
            if (checklistData.progress[task.id] && !checklistData.hiddenTasks[task.id]) {
                checklistData.progress[task.id] = false;
                console.log(`Resetting task: ${task.id}`);
                didResetOther = true;
            }
            checklistData.lastTaskResetTimes[task.id] = now.getTime();

            // Delete old notification record
            const notifSent = checklistData.notificationsSent[task.id];
            if (notifSent && notifSent !== cycleNumber) {
                delete checklistData.notificationsSent[task.id];
            }

            // Send and record new notification
            if (checklistData.notificationPreferences[task.id] && checklistData.notificationsSent[task.id] !== cycleNumber) {
                showNotification(`${task.text.split(":")[0]} has reset!`, "Vendor stock may have updated.");
                checklistData.notificationsSent[task.id] = cycleNumber;
            }
        }
    });
    if (didResetOther) {
        saveData();
        populateSection(otherList, tasks.other, checklistData.progress);
        updateSectionControls('other-tasks-section')
    }
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
    const listItem = document.createElement('li');
    listItem.classList.add('task-item');
    if (checklistData.hiddenTasks[task.id]) {
        listItem.classList.add('hidden-task');
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = task.id;
    checkbox.checked = isChecked;
    checkbox.classList.add('position-relative');
    if (isSubtask) {
        checkbox.dataset.parentId = task.parentId;
    }

    // Task Icon
    const icon = document.createElement('img');
    if (task.icon) {
        icon.src = iconURL(`tasks/${task.icon}`);
        icon.classList.add("task-icon");
        if (!task.noIconFilter) {
            icon.classList.add('icon-filter')
        }
    }

    // Hide/Notif Controls
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('ml-auto');

    // Notif Button
    if (task.id.startsWith('other_')) {
        const notificationButton = document.createElement('button');
        notificationButton.classList.add('notification-toggle-btn');
        notificationButton.setAttribute('aria-label', `Toggle notifications for ${task.text.split(':')[0]}`);
        notificationButton.title = `Toggle notifications for ${task.text.split(':')[0]}`;

        notificationButton.innerHTML = svgIcons.bellIcon;
        if(checklistData.notificationPreferences[task.id]) notificationButton.classList.add('active');

        notificationButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            const permissionGranted = await requestNotificationPermission();
            if (permissionGranted) {
                checklistData.notificationPreferences[task.id] = !checklistData.notificationPreferences[task.id];
                notificationButton.classList.toggle('active', checklistData.notificationPreferences[task.id]);
                saveData(false);
                console.log(`Notifications for ${task.id} ${checklistData.notificationPreferences[task.id] ? 'enabled' : 'disabled'}`);
            }
        });
        controlsContainer.appendChild(notificationButton);
    }

    // Hide Button
    const hideButton = document.createElement('button');
    hideButton.classList.add('hide-task-btn');
    hideButton.setAttribute('aria-label', `Hide task: ${task.text.split(':')[0]}`);
    hideButton.title = `Hide task: ${task.text.split(':')[0]}`;
    hideButton.innerHTML = svgIcons.hideIcon;
    hideButton.addEventListener('click', (e) => {
        e.stopPropagation();
        checklistData.hiddenTasks[task.id] = true;
        listItem.classList.add('hidden-task');
        updateSectionControls(listItem.closest('section').id);
        saveData(false);
    });
    controlsContainer.appendChild(hideButton);

    if (task.subtasks) {
        listItem.classList.add('parent-task-container');

        const parentHeaderDiv = document.createElement('div');
        parentHeaderDiv.classList.add('parent-task-header', 'mb-1', 'w-full');
        parentHeaderDiv.setAttribute('aria-expanded', 'true');
        parentHeaderDiv.setAttribute('aria-controls', `${task.id}-subtasks`);

        parentHeaderDiv.appendChild(checkbox);
        if (task.icon) { parentHeaderDiv.appendChild(icon); }

        // Task Text & Info Line
        const taskDescription = document.createElement("div");
        taskDescription.classList.add("task-description");
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.classList.add("task-text");
        if (isChecked) taskDescription.classList.add('checked');
        taskDescription.appendChild(taskText);
        makeInfoLine(task, taskDescription);
        parentHeaderDiv.appendChild(taskDescription);

        // Collapse Button
        const collapseIcon = document.createElement("div");
        collapseIcon.setAttribute('class', 'collapse-icon');
        collapseIcon.innerHTML = svgIcons.collapseIcon;

        parentHeaderDiv.appendChild(controlsContainer);
        parentHeaderDiv.appendChild(collapseIcon);
        listItem.appendChild(parentHeaderDiv);

        // Subtasks
        const subtaskCollapsible = document.createElement("div");
        subtaskCollapsible.classList.add("subtask-collapsible");
        const subtaskList = document.createElement('ul');
        subtaskList.id = `${task.id}-subtasks`;
        subtaskList.classList.add('list-none', 'pl-0', 'mt-1', 'subtask-list');
        if (task.subtasks && Array.isArray(task.subtasks)) {
            task.subtasks.forEach(subtask => {
                subtask.parentId = task.id;
                const subtaskIsChecked = checklistData.progress[subtask.id] || false;
                const subtaskItem = createChecklistItem(subtask, subtaskIsChecked, true);
                subtaskList.appendChild(subtaskItem);
            });
        }
        subtaskCollapsible.appendChild(subtaskList)
        listItem.appendChild(subtaskCollapsible);

        // On Click -> Collapse/Expand
        parentHeaderDiv.addEventListener('click', (e) => {
            if (e.target !== checkbox && !checkbox.contains(e.target) && !controlsContainer.contains(e.target) && !collapseIcon.contains(e.target) ) {
                const isExpanded = parentHeaderDiv.getAttribute('aria-expanded') === 'true';
                parentHeaderDiv.setAttribute('aria-expanded', !isExpanded);
                subtaskCollapsible.classList.toggle('collapsed', isExpanded);
            }
        });
        collapseIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = parentHeaderDiv.getAttribute('aria-expanded') === 'true';
            parentHeaderDiv.setAttribute('aria-expanded', !isExpanded);
            subtaskCollapsible.classList.toggle('collapsed', isExpanded);
        });

        // Checkbox Changed -> Change Subtasks Checkboxes
        checkbox.addEventListener('change', (event) => {
            let currentlyChecked;
            if ("detail" in event) {
                currentlyChecked = event.detail;
            } else {
                currentlyChecked = event.target.checked;
            }

            event.target.checked = currentlyChecked;
            checklistData.progress[task.id] = currentlyChecked;
            taskText.classList.toggle('checked', currentlyChecked);

            task.subtasks.forEach(subtask => {
                const subCheckbox = document.getElementById(subtask.id);

                // this is kind of a stupid hack: We can recursively fire events with dispatchEvent, but those events
                // don't know about the checkbox status of the originating event. So we attach that status to the
                // `detail` of a CustomEvent, which takes priority over the local status. (Recursive firings like this
                // allow for nested subtasks of arbitrary depth)
                subCheckbox.dispatchEvent(new CustomEvent("change", {detail: currentlyChecked}));
            });
            saveData();
        });

    } else {
        const label = document.createElement('label');
        label.htmlFor = task.id;

        // Task Text
        label.innerHTML = `<span class="task-text">${task.text}</span>`;

        // Reset Timer
        if (task.period) {
            const resetTimer = document.createElement("span");
            resetTimer.classList.add("other-countdown");
            resetTimer.textContent = "(Loading...)";
            label.appendChild(resetTimer);
        }

        // Info Line & Cycle Schedule
        makeInfoLine(task, label);

        label.classList.add("task-description");
        if (isChecked) { label.classList.add('checked'); }

        listItem.appendChild(checkbox);
        if (task.icon) { listItem.appendChild(icon); }
        listItem.appendChild(label);
        listItem.appendChild(controlsContainer);

        // Checkbox Changed
        checkbox.addEventListener('change', (event) => {
            let currentlyChecked;
            if ("detail" in event) {
                currentlyChecked = event.detail;
            } else {
                currentlyChecked = event.target.checked;
            }

            event.target.checked = currentlyChecked;
            checklistData.progress[task.id] = currentlyChecked;
            label.classList.toggle('checked', currentlyChecked);

            // Update parent task checkboxes
            let t = task;
            while (t.parentId) {  // walk up the task tree
                let parentTaskDefinition = getTaskById(t.parentId)

                if (parentTaskDefinition && parentTaskDefinition.subtasks) {
                    const allSubtasksChecked = parentTaskDefinition.subtasks.every(st => checklistData.progress[st.id]);
                    checklistData.progress[parentTaskDefinition.id] = allSubtasksChecked;

                    const parentCheckbox = document.getElementById(parentTaskDefinition.id);
                    const parentContainer = parentCheckbox ? parentCheckbox.closest('.parent-task-container') : null;
                    const parentTextSpan = parentContainer ? parentContainer.querySelector('.parent-task-header .task-description') : null;

                    if (parentCheckbox) parentCheckbox.checked = allSubtasksChecked;
                    if (parentTextSpan) parentTextSpan.classList.toggle('checked', allSubtasksChecked);
                }

                t = parentTaskDefinition;  // move up a level
            }
            saveData();
        });
    }
    return listItem;
}

function makeCycleIcon(cycleData) {
    if (cycleData.icon) {
        const src = iconURL(`cycles/${cycleData.icon}`)
        let classList = "cycle-icon";
        if (cycleData.iconFilter) {
            classList += " icon-filter";
        }
        return `<img class="${classList}" src="${src}">`;
    } else {
        return "";
    }
}

function showScheduleAction(task, period, cycleIndex) {
    const cycleCount = cycles[task.id].order.length;

    return () => {
        document.getElementById("schedule-title").innerText = task.text.split(":")[0]; // take the task text up to the first ":" as the dialog title

        let taskIcon = scheduleDialog.querySelector(":scope .menu-title img.task-icon");
        taskIcon.className = "task-icon";
        taskIcon.src = "";
        if (task.icon) {
            taskIcon.src = iconURL(`tasks/${task.icon}`);
            if (!task.noIconFilter) {
                taskIcon.classList.add('icon-filter')
            }
        }

        const tbody = scheduleDialog.querySelector(":scope tbody");
        tbody.innerHTML = "";

        const now = new Date();
        const ref = new Date(cycles[task.id].ref);
        const cyclesSinceRef = Math.floor((now.getTime() - ref.getTime()) / period);
        const currentCycleStartTime = ref.getTime() + (period * cyclesSinceRef);

        for (let i = 0; i <= cycleCount; i++) {
            let date = "Now";
            if (i !== 0) {
                const rowCycleStartDate = new Date(currentCycleStartTime + (period * i));
                date = rowCycleStartDate.toISOString().split("T")[0]; // toISOString is always in UTC, which is what we want. The part before "T" is the date
            }

            let repeat = "";
            if (i === cycleCount) {
                repeat = '<tr><td colspan="2" class="cycle-repeats">(Cycle Repeats)</td></tr>';
            }

            const rowData = cycles[task.id].order[modulo(cycleIndex + i, cycleCount)];

            tbody.innerHTML +=
                `${repeat}<tr>
                    <td>${date}</td>
                    <td>${makeCycleIcon(rowData)}${rowData.text}</td>
                </tr>`;
        }
        scheduleDialog.showModal();
    }
}

function makeInfoLine(task, appendTo) {
    const hasCycle = Object.hasOwn(cycles, task.id);
    const hasInfoLine = ["location", "npc", "terminal", "prereq", "info"].some((prop) => task[prop]);

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
            const cycleCount = cycles[task.id].order.length;

            let prefix, period, cycleIndex;
            if (task.id.startsWith("weekly_")) {
                prefix = "This&nbsp;Week";
                period = 7 * MILLISECONDS_PER_DAY;
                if (ref.getUTCDay() !== 1) {
                    console.warn(`${task.id} cycle ref ${cycles[task.id].ref} is not a Monday`);
                }
            }
            else if (task.id.startsWith("daily_")) {
                prefix = "Today";
                period = MILLISECONDS_PER_DAY;
            }
            else {
                prefix = "Current&nbsp;Cycle";
                console.error(`cycles are not implemented for this task (${task.id})`);
            }
            cycleIndex = modulo(Math.floor((now.getTime() - ref.getTime()) / period), cycleCount);
            console.log(`${task.id} cycleNumber ${cycleIndex}`);
            const cycleData = cycles[task.id].order[cycleIndex];

            const cyclePrefix = document.createElement("span");
            cyclePrefix.innerHTML = `${prefix}: `;
            currentCycle.appendChild(cyclePrefix);

            currentCycle.innerHTML += makeCycleIcon(cycleData);

            const cycleText = document.createElement("span");
            cycleText.textContent = cycleData.text;
            currentCycle.appendChild(cycleText);

            const showSchedule = document.createElement("button");
            showSchedule.type = "button";
            showSchedule.classList.add("show-schedule-btn");
            showSchedule.innerHTML = "Show&nbsp;Schedule";
            showSchedule.addEventListener("click", showScheduleAction(task, period, cycleIndex));
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
            infoLineHTML = infoLineHTML.replace('Base of Operations', '<span class="tooltip" title="Orbiter, Drifter\'s Camp, or Backroom">$&</span>');
            infoLineHTML += makeInfoLineItem(task, "npc", "NPC", svgIcons.npcIcon);
            infoLineHTML += makeInfoLineItem(task, "terminal", "Terminal", svgIcons.terminalIcon);
            infoLineHTML += makeInfoLineItem(task, "prereq", "Requirements", svgIcons.prereqIcon);
            infoLineHTML += makeInfoLineItem(task, "info", "Info", svgIcons.infoIcon);
            infoLine.innerHTML = infoLineHTML;

            taskInfoExpanderContent.appendChild(infoLine);
        }

        taskInfoExpander.appendChild(taskInfoExpanderContent);
        appendTo.appendChild(taskInfoExpander);
    }
}

function makeInfoLineItem(task, prop, iconToolTip, icon) {
    if (task[prop]) {
        return `<span class="${prop}"><span title="${iconToolTip}">${icon}</span>${task[prop]}</span><wbr />`;
    } else {
        return "";
    }
}

function getTaskById(id) {
    for (const group in tasks) {
        for (const task of tasks[group]) {
            if (task.id === id) {
                return task;
            }
            const subtaskFound = _getSubtaskById(task, id);
            if (subtaskFound) {
                return subtaskFound;
            }
        }
    }
}

function _getSubtaskById(task, id) {
    if ("subtasks" in task) {
        for (const subtask of task.subtasks) {
            if (subtask.id === id) {
                return subtask;
            }
            const subtaskFound = _getSubtaskById(subtask, id);
            if (subtaskFound) {
                return subtaskFound;
            }
        }
    }
    return undefined;
}

function populateSection(sectionElement, taskList, progress) {
    if (!sectionElement) {
        console.error("Section element not found for population:", sectionElement);
        return;
    }
    sectionElement.innerHTML = '';
    taskList.forEach(task => {
        const isChecked = progress[task.id] || false;
        const listItem = createChecklistItem(task, isChecked);
        sectionElement.appendChild(listItem);
    });
    if (sectionElement.parentElement && sectionElement.parentElement.id) {
        updateSectionControls(sectionElement.parentElement.id);
    }
}

function resetSpecificButtonState(buttonElement, defaultText, stateKey) {
    if (!buttonElement || !confirmState[stateKey]) return;
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
        Object.keys(confirmState).forEach(key => {
            if (key !== confirmKey && confirmState[key].isConfirming) {
                let btnElement, btnText;
                if (key === 'all') { btnElement = resetButton; btnText = 'Reset All Checks'; }
                else if (key === 'daily') { btnElement = resetDailyButton; btnText = 'Reset Daily Checks'; }
                else if (key === 'weekly') { btnElement = resetWeeklyButton; btnText = 'Reset Weekly Checks'; }
                else if (key === 'unhide') { btnElement = unhideTasksButton; btnText = 'Unhide All Tasks'; }
                if(btnElement) {
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
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(checklistData));

    const allCheckboxes = document.querySelectorAll('#checklist-container input[type="checkbox"]');
    allCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
        const listItem = checkbox.closest('li');
        const taskDescription = listItem.querySelector(".task-description");
        if (taskDescription) {taskDescription.classList.remove("checked")};
    });
    updateLastSavedDisplay(checklistData.lastSaved);
    console.log("Checklist reset complete.");
}

function resetSection(section) {
    const validSections = ["daily", "weekly"];
    if (!validSections.includes(section)) {
        console.error("Section '%s' is not a valid section name: %s", section, validSections);
        return;
    }
    let taskList, sectionElement, sectionElementId;
    if (section === "daily") {
        taskList = tasks.daily;
        sectionElement = dailyList;
        sectionElementId = 'daily-tasks-section';
    } else if (section === "weekly") {
        taskList = tasks.weekly;
        sectionElement = weeklyList;
        sectionElementId = 'weekly-tasks-section';
    }
    let didReset = false;
    taskList.forEach(task => {
        if (checklistData.progress[task.id] && !checklistData.hiddenTasks[task.id]) {
            checklistData.progress[task.id] = false;
            didReset = true;
        }
        if (task.subtasks) {
            task.subtasks.forEach(subtask => { //FIXME: recursion
                if (checklistData.progress[subtask.id] && !checklistData.hiddenTasks[subtask.id]) {
                    checklistData.progress[subtask.id] = false;
                    didReset = true;
                }
            });
        }
    });
    const now = new Date().toISOString();
    if (section === "daily") {checklistData.lastDailyReset = now;}
    else if (section === "weekly") {checklistData.lastWeeklyReset = now;}
    saveData();
    if (didReset) {
        populateSection(sectionElement, taskList, checklistData.progress);
        updateSectionControls(sectionElementId);
    }
    console.log("%s checks reset.", section);
}

function resetDailyAction() {
    resetSection("daily");
}

function resetWeeklyAction() {
    resetSection("weekly");
}

function handleSectionToggle(event) {
    const header = event.target.closest('.section-toggle');
    if (!header) return;

    const contentId = header.getAttribute('aria-controls');
    const contentDiv = document.getElementById(contentId);
    if (!contentDiv) return;

    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', !isExpanded);
    contentDiv.classList.toggle('collapsed', isExpanded);
    console.log(`Toggled section ${contentId} to ${!isExpanded ? 'expanded' : 'collapsed'}`);
}

function toggleMenu() {
    if (slideoutMenuOverlay) {
        slideoutMenuOverlay.classList.toggle('open');
    }
}

function unhideAllAction() {
    checklistData.hiddenTasks = {};
    checklistData.manuallyHiddenSections = {};
    saveData(false);

    document.querySelectorAll('.task-item.hidden-task').forEach(item => item.classList.remove('hidden-task'));
    document.querySelectorAll('section.section-is-hidden-by-user').forEach(section => section.classList.remove('section-is-hidden-by-user'));

    populateSection(dailyList, tasks.daily, checklistData.progress);
    populateSection(weeklyList, tasks.weekly, checklistData.progress);
    populateSection(otherList, tasks.other, checklistData.progress);
    ['daily-tasks-section', 'weekly-tasks-section', 'other-tasks-section'].forEach(updateSectionControls);
    console.log("All tasks and sections unhidden.");
    toggleMenu();
}

function updateSectionControls(sectionElementId) {
    const sectionElement = document.getElementById(sectionElementId);
    if (!sectionElement) return;

    const hideSectionButton = sectionElement.querySelector('.hide-section-button');
    if (!hideSectionButton) return;

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

    const allTasksIndividuallyHidden = allTaskItems.every(item => item.classList.contains('hidden-task'));

    if (allTasksIndividuallyHidden) {
        hideSectionButton.classList.add('visible');
    } else {
        hideSectionButton.classList.remove('visible');
    }
}

function loadAndInitializeApp() {
    initializeDOMElements();
    hideError();
    loadThemePreference();

    const savedData = localStorage.getItem(DATA_STORAGE_KEY);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            if (parsedData && typeof parsedData === 'object') {
                checklistData.progress = parsedData.progress || {};
                checklistData.lastSaved = parsedData.lastSaved || null;
                checklistData.lastDailyReset = parsedData.lastDailyReset || null;
                checklistData.lastWeeklyReset = parsedData.lastWeeklyReset || null;
                checklistData.hiddenTasks = parsedData.hiddenTasks || {};
                checklistData.manuallyHiddenSections = parsedData.manuallyHiddenSections || {};
                checklistData.lastTaskResetTimes = parsedData.lastTaskResetTimes || {};
                checklistData.notificationPreferences = parsedData.notificationPreferences || {};
                checklistData.notificationsSent = parsedData.notificationsSent || {};
            } else { console.warn("Invalid data format found in localStorage. Starting fresh."); }
        } catch (e) {
            console.error("Error parsing saved data:", e);
            displayError("Failed to load saved progress. Data might be corrupted.");
            checklistData = { progress: {}, lastSaved: null, lastDailyReset: null, lastWeeklyReset: null, hiddenTasks: {}, manuallyHiddenSections: {}, lastTaskResetTimes: {}, notificationPreferences: {}, notificationsSent: {} };
        }
    }

    setDailyBackground();
    handleResets();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(handleResets, 1000);

    populateSection(dailyList, tasks.daily, checklistData.progress);
    populateSection(weeklyList, tasks.weekly, checklistData.progress);
    populateSection(otherList, tasks.other, checklistData.progress);
    updateLastSavedDisplay(checklistData.lastSaved);

    ['daily-tasks-section', 'weekly-tasks-section', 'other-tasks-section'].forEach(updateSectionControls);


    // Setup event listeners
    if (appVersionElement) appVersionElement.textContent = APP_VERSION;
    else console.error("App version element not found!");

    if (gitHashElement) {
        gitHashElement.textContent = GIT_COMMIT_HASH;
        gitHashElement.href = `https://github.com/warframe-tools/Task-Checklist/tree/${GIT_COMMIT_HASH_LONG}`;
    } else console.error("git hash element not found!");

    if (wfVersionElement) wfVersionElement.textContent = `Warframe Version ${WARFRAME_VERSION}`;
    else console.error("Warframe version element not found!");

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

    if (hamburgerButton) { hamburgerButton.addEventListener('click', toggleMenu); }
    else { console.error("Hamburger button not found!"); }

    if (slideoutMenuOverlay) {
        slideoutMenuOverlay.addEventListener('click', function(event) {
            if (event.target === slideoutMenuOverlay) {
                toggleMenu();
            }
        });
    } else { console.error("Slideout menu overlay not found!"); }

    if (optionsCloseButton) {
        optionsCloseButton.addEventListener('click', toggleMenu);
    } else { console.error("Options close button not found!"); }

    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', handleSectionToggle);
    });

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


    if (errorCloseButton) {
        errorCloseButton.addEventListener('click', hideError);
    } else { console.error("Error close button not found!"); }

    if (errorCopyButton) {
        errorCopyButton.addEventListener('click', copyErrorToClipboard);
    } else { console.error("Error copy button not found!"); }

    if (scheduleDialog) {
        // clicking inside the dialog's top-level div does nothing
        scheduleDialog.querySelector(":scope > div").addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // clicking the close button...
        scheduleDialog.querySelector(":scope .menu-close-button").addEventListener("click", () => {
            scheduleDialog.close();
        });

        // clicking anywhere else on the dialog (i.e., the anywhere else the page (the ::backdrop)) will close it
        scheduleDialog.addEventListener("click", () => {
            scheduleDialog.close();
        });
    } else { console.error("Schedule dialog not found!"); }

    console.log(`Warframe Checklist App Initialized (v${APP_VERSION} (${GIT_COMMIT_HASH})) from app.js.`);
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadAndInitializeApp();
    } catch(error) {
        console.error("Critical Error during app.js initialization:", error);
        const errDisp = document.getElementById('error-display');
        const errMsg = document.getElementById('error-message');
        if(errDisp && errMsg) {
            errMsg.textContent = "A critical error occurred during application startup. Please check the console.";
            errDisp.classList.add('visible');
        } else {
            alert("A critical error occurred during application startup. Please check the console.");
        }
    }
});
