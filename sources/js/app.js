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
const APP_VERSION = "3.1";
const WARFRAME_VERSION = "41.0.0";
const THEME_STORAGE_KEY = 'warframeChecklistTheme';

function getStorageKey(appVersion) {
    const versionParts = appVersion.split('.');
    if (versionParts.length >= 1) {
        const major = versionParts[0];
        return `warframeChecklistData_v${major}`;
    }
    return `warframeChecklistData_v${appVersion.replace(/\./g, '_')}`;
}
const DATA_STORAGE_KEY = getStorageKey(APP_VERSION);

const baroKiTeerData = {
    referenceArrivalUTC: new Date(Date.UTC(2025, 4, 30, 13, 0, 0)).getTime(),
    cycleMilliseconds: 14 * 24 * 60 * 60 * 1000,
    durationMilliseconds: 48 * 60 * 60 * 1000,
};

// --- Task Data ---
import tasks from "./tasks.json" with {type: "json"};

let taskIcons;
/* MODULE-ONLY< */ taskIcons = import.meta.glob("../img/icons/**/*.png", {eager: true, query: '?url', import: 'default'}); /* MODULE-ONLY> */
function iconURL(iconName) {
    if (taskIcons) {
        return taskIcons["../img/icons/" + iconName]
    } else {
        return "./img/icons/" + iconName;
    }
}

// --- DOM Elements (defined after DOMContentLoaded) ---
let bodyElement, contentElement, themeToggleButton, hamburgerButton, slideoutMenuOverlay, menuContentBox, menuCloseButton,
    dailyList, weeklyList, otherList, resetDailyButton, resetWeeklyButton, resetButton, unhideTasksButton,
    lastSavedTimestampElement, saveStatusElement, sectionToggles, dailyResetTimeElement, weeklyResetTimeElement,
    errorDisplayElement, errorMessageElement, errorCloseButton, errorCopyButton, appVersionElement, wfVersionElement,
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
    lastEightHourResets: {},
    notificationPreferences: {},
    notificationsSent: {}
};

let currentTheme = 'dark';
let saveStatusTimeout;
let countdownInterval;

// --- Function Definitions ---

function initializeDOMElements() {
    bodyElement = document.body;
    contentElement = document.querySelector('.checklist-content');
    themeToggleButton = document.getElementById('theme-toggle-button');
    hamburgerButton = document.getElementById('hamburger-button');
    slideoutMenuOverlay = document.getElementById('slideout-menu-overlay');
    menuContentBox = document.getElementById('menu-content-box');
    menuCloseButton = document.getElementById('menu-close-button');
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
    wfVersionElement = document.querySelector('.warframe-version-text');

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
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
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

function calculateBaroTimings() {
    const now = new Date().getTime();
    let nextArrival = baroKiTeerData.referenceArrivalUTC;

    while (nextArrival < now - baroKiTeerData.durationMilliseconds) {
        nextArrival += baroKiTeerData.cycleMilliseconds;
    }
    if (now >= nextArrival + baroKiTeerData.durationMilliseconds) {
         nextArrival += baroKiTeerData.cycleMilliseconds;
    }

    const departure = nextArrival + baroKiTeerData.durationMilliseconds;
    let status = "arriving";
    if (now >= nextArrival && now < departure) {
        status = "here";
    } else if (now >= departure) {
        status = "departed";
    }

    return {
        nextArrivalTimestamp: nextArrival,
        departureTimestamp: departure,
        status: status
    };
}

function displayBaroCountdown() {
    const baroCountdownElement = document.getElementById('baro-countdown-timer');
    if (!baroCountdownElement) return;

    const timings = calculateBaroTimings();
    const now = new Date().getTime();
    let countdownText = "";
    const arrivalNotificationId = `baro_arrival_${timings.nextArrivalTimestamp}`;
    const departureNotificationId = `baro_departure_${timings.departureTimestamp}`;


    if (timings.status === "here") {
        const diff = timings.departureTimestamp - now;
        countdownText = `Leaves in ${formatCountdown(diff)}`;
        if (checklistData.notificationPreferences['other_baro'] && !checklistData.notificationsSent[arrivalNotificationId]) {
            showNotification("Baro Ki'Teer Has Arrived!", "Check his inventory for exclusive items.");
            checklistData.notificationsSent[arrivalNotificationId] = true;
            saveData(false);
        }
        if (diff > 0 && diff < 60 * 60 * 1000 && checklistData.notificationPreferences['other_baro'] && !checklistData.notificationsSent[departureNotificationId]) {
             showNotification("Baro Ki'Teer Departing Soon!", `Leaves in approximately ${Math.round(diff / (60 * 1000))} minutes.`);
             checklistData.notificationsSent[departureNotificationId] = true;
             saveData(false);
        }

    } else {
        let nextArrivalForCountdown = timings.nextArrivalTimestamp;
        const diff = nextArrivalForCountdown - now;
        countdownText = `Arrives in ${formatCountdown(diff)}`;
        if (timings.status === "departed") {
            const prevArrivalId = `baro_arrival_${timings.nextArrivalTimestamp - baroKiTeerData.cycleMilliseconds}`;
            const prevDepartureId = `baro_departure_${timings.departureTimestamp - baroKiTeerData.cycleMilliseconds}`;
            if(checklistData.notificationsSent[prevArrivalId]) delete checklistData.notificationsSent[prevArrivalId];
            if(checklistData.notificationsSent[prevDepartureId]) delete checklistData.notificationsSent[prevDepartureId];
            if(checklistData.notificationsSent[departureNotificationId]) delete checklistData.notificationsSent[departureNotificationId];
        }
    }
    baroCountdownElement.textContent = countdownText;
}

function getNextEightHourResetUTC() {
    const now = new Date();
    const currentUTCHour = now.getUTCHours();
    let nextResetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    if (currentUTCHour < 8) {
        nextResetDate.setUTCHours(8, 0, 0, 0);
    } else if (currentUTCHour < 16) {
        nextResetDate.setUTCHours(16, 0, 0, 0);
    } else {
        nextResetDate.setUTCDate(nextResetDate.getUTCDate() + 1);
        nextResetDate.setUTCHours(0, 0, 0, 0);
    }
    return nextResetDate.getTime();
}

function displayEightHourTaskCountdown(taskElementId, countdownSpanId) {
    const countdownSpan = document.getElementById(countdownSpanId);
    if (!countdownSpan) return;

    const nextResetTimestamp = getNextEightHourResetUTC();
    const now = new Date().getTime();
    const diff = nextResetTimestamp - now;
    countdownSpan.textContent = `(Resets in ${formatCountdown(diff)})`;
}

function displayLocalResetTimes() {
    try {
        const now = new Date().getTime();

        const nextDailyResetTimestamp = getNextDailyMidnightUTC();
        const dailyDiff = nextDailyResetTimestamp - now;
        if (dailyResetTimeElement) {
            dailyResetTimeElement.textContent = `(Resets in ${formatCountdown(dailyDiff)})`;
        }

        let nextWeeklyResetTimestamp = getMostRecentMondayMidnightUTC();
        if (now >= nextWeeklyResetTimestamp) {
            nextWeeklyResetTimestamp += 7 * 24 * 60 * 60 * 1000;
        }
        const weeklyDiff = nextWeeklyResetTimestamp - now;
        if (weeklyResetTimeElement) {
            weeklyResetTimeElement.textContent = `(Resets in ${formatCountdown(weeklyDiff)})`;
        }

        displayBaroCountdown();
        tasks.other.forEach(task => {
            if (task.isEightHourTask) {
                const countdownSpanId = task.id.replace(/^other_/, '') + '-countdown-timer';
                displayEightHourTaskCountdown(task.id, countdownSpanId);
            }
        });

        runAutoResets()

    } catch (e) {
        console.error("Error calculating or displaying local reset times:", e);
        if (dailyResetTimeElement) dailyResetTimeElement.textContent = `(Resets 00:00 UTC)`;
        if (weeklyResetTimeElement) weeklyResetTimeElement.textContent = `(Resets Mon 00:00 UTC)`;
    }
}

function getStartOfCurrentEightHourCycleUTC() {
    const now = new Date();
    const currentUTCHour = now.getUTCHours();
    let cycleStartHour;

    if (currentUTCHour < 8) {
        cycleStartHour = 0;
    } else if (currentUTCHour < 16) {
        cycleStartHour = 8;
    } else {
        cycleStartHour = 16;
    }
    const cycleStartDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    cycleStartDate.setUTCHours(cycleStartHour, 0, 0, 0);
    return cycleStartDate.getTime();
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
    const startOfCurrentEightHourCycle = getStartOfCurrentEightHourCycleUTC();
    if (!checklistData.lastEightHourResets) checklistData.lastEightHourResets = {};
    if (!checklistData.notificationsSent) checklistData.notificationsSent = {};

    tasks.other.forEach(task => {
        if (task.isEightHourTask) {
            const lastResetForThisTask = checklistData.lastEightHourResets[task.id];
            const notificationId = `${task.id}_${startOfCurrentEightHourCycle}`;

            if (!lastResetForThisTask || lastResetForThisTask < startOfCurrentEightHourCycle) {
                if (checklistData.progress[task.id] && !checklistData.hiddenTasks[task.id]) {
                    checklistData.progress[task.id] = false;
                    console.log(`Resetting 8-hour task: ${task.id}`);
                    didResetOther = true;
                }
                checklistData.lastEightHourResets[task.id] = startOfCurrentEightHourCycle;
                if(checklistData.notificationsSent[notificationId]) {
                    delete checklistData.notificationsSent[notificationId];
                }
            }
            if (nowUTCTimestamp >= startOfCurrentEightHourCycle &&
                nowUTCTimestamp < startOfCurrentEightHourCycle + 60000 &&
                checklistData.notificationPreferences[task.id] &&
                !checklistData.notificationsSent[notificationId]) {

                const taskText = task.text.substring(0, task.text.indexOf(':'));
                showNotification(`${taskText} has reset!`, "Vendor stock may have updated.");
                checklistData.notificationsSent[notificationId] = true;
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

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = task.id;
    checkbox.checked = isChecked;
    checkbox.classList.add('position-relative');
    if (isSubtask) {
        checkbox.dataset.parentId = task.parentId;
    }

    const icon = document.createElement('img');
    if (task.icon) {
        icon.src = iconURL(task.icon);
        if (!task.noIconFilter) {
            icon.classList.add('icon-filter')
        }
    }

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('flex', 'items-center', 'ml-auto');

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

    if (task.isParent) {
        listItem.classList.add('parent-task-container');

        const parentHeaderDiv = document.createElement('div');
        parentHeaderDiv.classList.add('parent-task-header', 'flex', 'items-center', 'mb-1', 'w-full');
        parentHeaderDiv.setAttribute('aria-expanded', 'true');
        parentHeaderDiv.setAttribute('aria-controls', `${task.id}-subtasks`);

        parentHeaderDiv.appendChild(checkbox);
        if (task.icon) { parentHeaderDiv.appendChild(icon); }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        taskTextSpan.classList.add('task-text', 'ml-2', 'flex-grow', 'cursor-pointer');
        if (isChecked) taskTextSpan.classList.add('checked');

        const collapseIcon = document.createElement("div");
        collapseIcon.setAttribute('class', 'collapse-icon');
        collapseIcon.innerHTML = svgIcons.collapseIcon;

        parentHeaderDiv.appendChild(taskTextSpan);
        parentHeaderDiv.appendChild(controlsContainer);
        parentHeaderDiv.appendChild(collapseIcon);
        listItem.appendChild(parentHeaderDiv);

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
        listItem.appendChild(subtaskList);

        parentHeaderDiv.addEventListener('click', (e) => {
            if (e.target !== checkbox && !checkbox.contains(e.target) && !controlsContainer.contains(e.target) && !collapseIcon.contains(e.target) ) {
                const isExpanded = parentHeaderDiv.getAttribute('aria-expanded') === 'true';
                parentHeaderDiv.setAttribute('aria-expanded', !isExpanded);
                subtaskList.classList.toggle('collapsed', isExpanded);
            }
        });
        collapseIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = parentHeaderDiv.getAttribute('aria-expanded') === 'true';
            parentHeaderDiv.setAttribute('aria-expanded', !isExpanded);
            subtaskList.classList.toggle('collapsed', isExpanded);
        });

        checkbox.addEventListener('change', (event) => {
            const currentlyChecked = event.target.checked;
            checklistData.progress[task.id] = currentlyChecked;
            taskTextSpan.classList.toggle('checked', currentlyChecked);

            task.subtasks.forEach(subtask => {
                checklistData.progress[subtask.id] = currentlyChecked;
                const subCheckbox = document.getElementById(subtask.id);
                const subLabel = document.querySelector(`label[for="${subtask.id}"]`);
                if (subCheckbox) subCheckbox.checked = currentlyChecked;
                if (subLabel) subLabel.classList.toggle('checked', currentlyChecked);
            });
            saveData();
        });

    } else {
        if (isSubtask) {
            listItem.classList.add('ml-4');
        }

        const label = document.createElement('label');
        label.htmlFor = task.id;
        label.innerHTML = `<div class="task-text">${task.text}</div>`;

        if (["location", "npc", "terminal", "prereq", "info"].some((prop) => task[prop])) {
            if (task.npc && task.terminal) {console.warn(`Tasks should specify only one of [npc, terminal]. (${task.id})`);}
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

            const infoLineExpander = document.createElement("div");
            infoLineExpander.classList.add("info-line-expander");
            infoLineExpander.appendChild(infoLine);
            label.appendChild(infoLineExpander);
        }

        label.classList.add('ml-2', 'flex-1', 'cursor-pointer');
        if (isChecked) { label.classList.add('checked'); }

        listItem.appendChild(checkbox);
        if (task.icon) { listItem.appendChild(icon); }
        listItem.appendChild(label);
        listItem.appendChild(controlsContainer);

        checkbox.addEventListener('change', (event) => {
            const currentlyChecked = event.target.checked;
            checklistData.progress[task.id] = currentlyChecked;
            label.classList.toggle('checked', currentlyChecked);

            if (isSubtask && task.parentId) {
                let parentTaskDefinition = tasks.daily.find(t => t.id === task.parentId) ||
                                           tasks.weekly.find(t => t.id === task.parentId) ||
                                           tasks.other.find(t => t.id === task.parentId);

                if (parentTaskDefinition && parentTaskDefinition.subtasks) {
                    const allSubtasksChecked = parentTaskDefinition.subtasks.every(st => checklistData.progress[st.id]);
                    checklistData.progress[parentTaskDefinition.id] = allSubtasksChecked;

                    const parentCheckbox = document.getElementById(parentTaskDefinition.id);
                    const parentContainer = parentCheckbox ? parentCheckbox.closest('.parent-task-container') : null;
                    const parentTextSpan = parentContainer ? parentContainer.querySelector('.parent-task-header .task-text') : null;

                    if (parentCheckbox) parentCheckbox.checked = allSubtasksChecked;
                    if (parentTextSpan) parentTextSpan.classList.toggle('checked', allSubtasksChecked);
                }
            }
            saveData();
        });
    }
    return listItem;
}

function makeInfoLineItem(task, prop, iconToolTip, icon) {
    if (task[prop]) {
        return `<span class="${prop}"><span title="${iconToolTip}">${icon}</span>${task[prop]}</span><wbr />`;
    } else {
        return "";
    }
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
        const label = listItem.querySelector('label');
        const parentTextSpan = listItem.querySelector('.parent-task-header .task-text');
        if (label) label.classList.remove('checked');
        if (parentTextSpan) parentTextSpan.classList.remove('checked');
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
        if (task.isParent && task.subtasks) {
            task.subtasks.forEach(subtask => {
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
                checklistData.lastEightHourResets = parsedData.lastEightHourResets || {};
                checklistData.notificationPreferences = parsedData.notificationPreferences || {};
                checklistData.notificationsSent = parsedData.notificationsSent || {};
            } else { console.warn("Invalid data format found in localStorage. Starting fresh."); }
        } catch (e) {
            console.error("Error parsing saved data:", e);
            displayError("Failed to load saved progress. Data might be corrupted.");
            checklistData = { progress: {}, lastSaved: null, lastDailyReset: null, lastWeeklyReset: null, hiddenTasks: {}, manuallyHiddenSections: {}, lastEightHourResets: {}, notificationPreferences: {}, notificationsSent: {} };
        }
    }

    setDailyBackground();
    displayLocalResetTimes();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(displayLocalResetTimes, 1000);

    populateSection(dailyList, tasks.daily, checklistData.progress);
    populateSection(weeklyList, tasks.weekly, checklistData.progress);
    populateSection(otherList, tasks.other, checklistData.progress);
    updateLastSavedDisplay(checklistData.lastSaved);

    ['daily-tasks-section', 'weekly-tasks-section', 'other-tasks-section'].forEach(updateSectionControls);


    // Setup event listeners
    if(appVersionElement) appVersionElement.textContent = `App Version ${APP_VERSION}`;
    else console.error("App version element not found!");

    if(wfVersionElement) wfVersionElement.textContent = `Warframe Version ${WARFRAME_VERSION}`;
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

    if (menuCloseButton) {
        menuCloseButton.addEventListener('click', toggleMenu);
    } else { console.error("Menu close button not found!"); }


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

    console.log(`Warframe Checklist App Initialized (v${APP_VERSION}) from app.js.`);
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
