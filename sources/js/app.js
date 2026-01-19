// --- sources/js/app.js ---

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
const tasks = {
    daily: [
        {
            id: 'daily_login',
            text: 'Log in: Collect the daily login reward.',
            icon: 'LotusFlower.png'
        },
        {
            id: 'daily_craft_forma',
            text: 'Crafting (Forma): Start building a new Forma (and collect finished ones).',
            icon: 'IconBuild.png',
            location: 'Base of Operations',
            terminal: 'Foundry',
        },
        {
            id: 'daily_craft_other',
            text: 'Crafting (Other): Craft other daily resources/items using reusable blueprints (check Foundry/companion app).',
            icon: 'IconBuild.png',
            location: 'Base of Operations',
            terminal: 'Foundry',
        },
        {
            id: 'daily_syndicate_gain',
            text: 'Faction Syndicates: Gain daily standing cap with your pledged Syndicate(s).',
            icon: 'ReputationSmall.png',
            info: 'Gain affinity in any mission to increase faction standing'
        },
        {
            id: 'daily_syndicate_spend',
            text: 'Faction Syndicates: If maxed on standing, spend it (Relic packs, Vosfor packs, etc.).',
            icon: 'ReputationSmall.png',
            location: 'Base of Operations/Any Relay',
            terminal: 'Syndicates',
        },
        {
            id: 'daily_world_syndicate_parent',
            text: 'World Syndicates (Standing)',
            icon: 'ReputationSmall.png',
            isParent: true,
            subtasks: [
                {
                    id: 'daily_world_syndicate_simaris',
                    text: 'Cephalon Simaris',
                    icon: 'syndicates/IconSimaris.png',
                    location: 'Any Relay',
                },
                {
                    id: 'daily_world_syndicate_ostron',
                    text: 'Ostron',
                    icon: 'syndicates/IconCetusElder.png',
                    location: 'Cetus, Earth',
                    prereq: "Saya's Vigil",
                },
                {
                    id: 'daily_world_syndicate_quills',
                    text: 'The Quills',
                    icon: 'syndicates/TheQuillsSigil.png',
                    location: 'Cetus, Earth',
                    prereq: 'The War Within',
                },
                {
                    id: 'daily_world_syndicate_solaris',
                    text: 'Solaris United',
                    icon: 'syndicates/SolarisUnited1.png',
                    location: 'Fortuna, Venus',
                    prereq: 'Vox Solaris (Quest)',
                },
                {
                    id: 'daily_world_syndicate_vox',
                    text: 'Vox Solaris',
                    icon: 'syndicates/IconSolaris.png',
                    location: 'Fortuna, Venus',
                    prereq: 'The War Within',
                },
                {
                    id: 'daily_world_syndicate_ventkids',
                    text: 'Ventkids',
                    icon: 'syndicates/FactionVentKidz.png',
                    location: 'Fortuna, Venus',
                    prereq: 'Vox Solaris (Quest)',
                },
                {
                    id: 'daily_world_syndicate_entrati',
                    text: 'Entrati',
                    icon: 'syndicates/IconEntrati.png',
                    location: 'Necralisk, Deimos',
                    prereq: 'Heart of Deimos',
                },
                {
                    id: 'daily_world_syndicate_necraloid',
                    text: 'Necraloid',
                    icon: 'syndicates/Loid.png',
                    location: 'Necralisk, Deimos',
                    prereq: 'The War Within',
                },
                {
                    id: 'daily_world_syndicate_holdfasts',
                    text: 'The Holdfasts',
                    icon: 'syndicates/TheHoldfastsIcon.png',
                    location: 'Chrysalith, Zariman',
                    prereq: 'Angels of the Zariman',
                },
                {
                    id: 'daily_world_syndicate_cavia',
                    text: 'Cavia',
                    icon: 'syndicates/FactionSigilCavia.png',
                    location: 'Sanctum Anatomica, Deimos',
                    prereq: 'Whispers in the Walls',
                },
                {
                    id: 'daily_world_syndicate_hex',
                    text: 'The Hex',
                    icon: 'syndicates/HexIcon.png',
                    location: 'Höllvania Central Mall',
                    prereq: 'The Hex (Quest)',
                },
            ],
        },
        {
            id: 'daily_dark_sector',
            text: 'Dark Sector Mission (Early Game): Complete one Dark Sector mission first for double credits (if needed & pre-Index).',
            icon: 'IconInfested.png',
            location: 'Base of Operations',
            terminal: 'Navigation',
        },
        {
            id: 'daily_sortie',
            text: 'Sortie: Complete the 3 daily Sortie missions.',
            icon: 'Sortie.png',
            location: 'Base of Operations',
            terminal: 'Navigation',
            prereq: 'The War Within',
        },
        {
            id: 'daily_focus',
            text: 'Focus: Max out daily Focus gain (e.g., via Sanctuary Onslaught).',
            icon: 'FocusLensFocus.png',
            prereq: 'The Second Dream'
        },
        {
            id: 'daily_steel_path',
            text: 'Steel Path Incursions: Complete daily Steel Path missions for Steel Essence.',
            icon: 'SteelEssenceIcon.png',
            prereq: 'Steel Path unlocked'
        },
        {
            id: 'daily_vendors',
            text: 'Vendors',
            icon: 'Market.png',
            isParent: true,
            subtasks: [
                {
                    id: 'daily_acrithis',
                    text: 'Acrithis: Check daily Arcane and Captura offering.',
                    icon: 'Acrithis.png',
                    location: 'Duviri/Dormizone',
                    npc: 'Acrithis',
                },
                {
                    id: 'daily_ticker_crew',
                    text: 'Ticker: Check available railjack crew to hire.',
                    icon: 'IconCommand.png',
                    location: 'Fortuna, Venus',
                    npc: 'Ticker',
                    prereq: 'Rising Tide & Command Intrinsics 1'
                },
                {
                    id: 'daily_marie',
                    text: 'Marie: Purchase Operator and amp mods.',
                    icon: 'Wisp.png',
                    location: 'La Cathédrale (Sanctum Anatomica, Deimos)',
                    npc: 'Marie',
                    prereq: 'The Old Peace',
                },
            ],
        },
    ],
    weekly: [
        {
            id: 'weekly_nightwave_complete',
            text: 'Nightwave: Complete relevant weekly Nightwave missions.',
            icon: 'NightwaveIconSimple.png',
        },
        {
            id: 'weekly_nightwave_spend',
            text: 'Nightwave (Spend): Spend Nightwave credits if needed (Aura mods, Catalysts/Reactors, etc.).',
            icon: 'NightwaveIconSimple.png',
        },
        {
            id: 'weekly_ayatan',
            text: "Ayatan Treasure Hunt: Complete Maroo's weekly mission for an Ayatan Sculpture",
            icon: 'Maroo.png',
            location: "Maroo's Bazaar, Mars",
            npc: 'Maroo',
        },
        {
            id: 'weekly_clem',
            text: 'Help Clem: Help Clem with his weekly survival, or he will die.',
            icon: 'HelpClem_.png',
            location: 'Any Relay',
            npc: 'Darvo',
            prereq: 'A Man of Few Words',
        },
        {
            id: 'weekly_kahl_garrison',
            text: "Break Narmer: Complete Kahl's weekly mission for Stock.",
            icon: 'GarrisonIcon.png',
            location: "Drifter's Camp, Earth",
            npc: 'Kahl',
            prereq: 'Veilbreaker',
        },
        {
            id: 'weekly_archon_hunt',
            text: 'Archon Hunt: Complete the weekly Archon Hunt for a guaranteed Archon Shard.',
            icon: 'IconNarmer.png',
            location: 'Base of Operations',
            terminal: 'Navigation',
            prereq: 'The New War',
        },
        {
            id: 'weekly_duviri_circuit',
            text: 'Duviri Circuit (Normal): Check weekly Warframe options & run Circuit if desired.',
            icon: 'IconDuviriCategory256.png',
            location: 'Base of Operations/Dormizone',
            terminal: 'Navigation',
            prereq: 'The Duviri Paradox',
        },
        {
            id: 'weekly_duviri_circuit_sp',
            text: 'Duviri Circuit (Steel Path): Check weekly Incarnon Adapters & run Circuit if desired.',
            icon: 'IconDuviriCategory256.png',
            location: 'Base of Operations/Dormizone',
            terminal: 'Navigation',
            prereq: 'Steel Path unlocked & The Duviri Paradox',
        },
        {
            id: 'weekly_search_pulses',
            text: 'Search Pulses: Use 5 weekly search pulses on Netracells and Archimedeas.',
            icon: 'MagnifyingGlassIcon.png',
            isParent: true,
            subtasks: [
                {
                    id: 'weekly_netracells',
                    text: 'Netracells: Complete up to 5 weekly Netracell missions for Archon Shard chances.',
                    icon: 'NetraRequiemIcon.png',
                    location: 'Sanctum Anatomica, Deimos',
                    npc: 'Tagfer',
                    prereq: 'Whispers in the Walls',
                    info: 'Costs 1 Search Pulse per successful mission'
                },
                {
                    id: 'weekly_eda',
                    text: 'Elite Deep Archimedea: Attempt weekly Elite Deep Archimedea for high Archon Shard chances (very endgame)',
                    icon: 'Necraloid.png',
                    location: 'Sanctum Anatomica, Deimos',
                    npc: 'Necraloid',
                    prereq: 'Rank 5 Cavia',
                    info: 'Costs 2 Search Pulses to unlock for the week',
                },
                {
                    id: 'weekly_eta',
                    text: 'Elite Temporal Archimedea: Attempt weekly Elite Temporal Archimedea for high Archon Shard chances (very endgame)',
                    icon: 'Kaya_.png',
                    location: 'Höllvania Central Mall',
                    npc: 'Kaya',
                    prereq: 'Rank 5 The Hex',
                    info: 'Costs 2 Search Pulses to unlock for the week',
                },
            ],
        },
        {
            id: 'weekly_calendar',
            text: '1999 Calendar: Complete weekly Calendar tasks.',
            icon: 'Computer.png',
            location: 'Base of Operations',
            terminal: 'POM-2 PC',
            prereq: 'The Hex',
        },
        {
            id: 'weekly_invigorations',
            text: 'Helminth: Use weekly Invigorations.',
            icon: 'IconHelminth.png',
            location: 'Base of Operations',
            npc: 'Helminth',
            prereq: 'Rank 5 Entrati'
        },
        {
            id: 'weekly_descendia',
            text: 'The Descendia (Normal): Weekly Tower gamemode for various resources.',
            icon: 'Heat_d.png',
            location: 'Dark Refractory (Base of Operations)',
            terminal: 'Navigation',
        },
        {
            id: 'weekly_descendia_sp',
            text: 'The Descendia (Steel Path): Weekly Tower gamemode for various resources.',
            icon: 'Heat_d.png',
            location: 'Dark Refractory (Base of Operations)',
            terminal: 'Navigation',
        },
        {
            id: 'weekly_vendors',
            text: 'Vendors',
            icon: 'Market.png',
            isParent: true,
            subtasks: [
                {
                    id: 'weekly_iron_wake',
                    text: 'Paladino: Trade Riven Slivers.',
                    icon: 'IconOmegaMod256.png',
                    location: 'Iron Wake, Earth',
                    npc: 'Paladino',
                    prereq: 'The Chains of Harrow',
                },
                {
                    id: 'weekly_yonta',
                    text: 'Archimedian Yonta: Buy weekly Kuva with Voidplumes.',
                    icon: 'Yonta.png',
                    location: 'Chrysalith, Zariman',
                    npc: 'Yonta',
                    prereq: 'Angels of the Zariman',
                },
                {
                    id: 'weekly_acridies',
                    text: 'Acrithis: Check wares and spend Pathos Clamps if desired (Catalysts/Reactors recommended if needed).',
                    icon: 'Acrithis.png',
                    location: 'Duviri/Dormizone',
                    npc: 'Acrithis',
                    prereq: 'The Duviri Paradox',
                },
                {
                    id: 'weekly_teshin',
                    text: "Teshin (Steel Path): Check Teshin's Steel Essence shop (especially for Umbra Forma rotation every 8 weeks).",
                    icon: 'SteelEssenceIcon.png',
                    location: 'Any Relay',
                    npc: 'Teshin',
                    prereq: 'Steel Path unlocked',
                },
                {
                    id: 'weekly_bird3',
                    text: 'Bird 3: Buy the weekly Archon Shard for 30k Cavia Standing.',
                    icon: 'Bird3.png',
                    location: 'Sanctum Anatomica, Deimos',
                    npc: 'Bird 3',
                    prereq: 'Rank 5 Cavia'
                },
                {
                    id: 'weekly_nightcap',
                    text: 'Nightcap: Trade Fergolyte for Kuva and Ayatan Sculpture.',
                    icon: 'MysteryShroom256_d.png',
                    location: 'Fortuna, Venus',
                    npc: 'Nightcap',
                    prereq: 'The New War',
                },
            ],
        },
    ],
    other: [
        {
            id: 'other_baro',
            text: 'Baro Ki\'Teer: Check Baro Ki\'Teer\'s inventory and purchase desired items with Ducats (trade Prime parts for Ducats). <span id="baro-countdown-timer" class="baro-countdown">(Loading...)</span>',
            icon: 'IconPrimeParts.png',
            location: 'Relay with Symbol',
            npc: "Baro Ki'Teer",
        },
        {
            id: 'other_grandmother_tokens',
            text: 'Mend the Family: Purchase Family Tokens from Grandmother <span id="grandmother_tokens-countdown-timer" class="eight-hour-countdown">(Loading...)</span>',
            icon: 'syndicates/IconEntrati.png',
            isEightHourTask: true,
            location: 'Necralisk, Deimos',
            prereq: 'Heart of Deimos',
        },
        {
            id: 'other_yonta_voidplumes',
            text: 'Trade for Voidplumes <span id="yonta_voidplumes-countdown-timer" class="eight-hour-countdown">(Loading...)</span>',
            icon: 'Yonta.png',
            isEightHourTask: true,
            location: 'Chrysalith, Zariman',
            npc: 'Yonta',
            prereq: 'Angels of the Zariman',
        },
        {
            id: 'other_loid_voca',
            text: 'Trade for Voca <span id="loid_voca-countdown-timer" class="eight-hour-countdown">(Loading...)</span>',
            icon: 'MiniMapCaviaVendor_.png',
            isEightHourTask: true,
            location: 'Sanctum Anatomica, Deimos',
            npc: 'Loid',
            prereq: 'Whispers in the Walls',
        },
    ],
};

let icons;
/* MODULE-ONLY< */ icons = import.meta.glob("../img/icons/**/*.png", {eager: true, query: '?url', import: 'default'}); /* MODULE-ONLY> */
function iconURL(iconName) {
    if (icons) {
        return icons["../img/icons/" + iconName]
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

        const bellIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`;

        notificationButton.innerHTML = bellIcon;
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
    hideButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>`;
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

        const collapseIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        collapseIcon.setAttribute('class', 'collapse-icon');
        collapseIcon.setAttribute('fill', 'none');
        collapseIcon.setAttribute('viewBox', '0 0 24 24');
        collapseIcon.setAttribute('stroke-width', '1.5');
        collapseIcon.setAttribute('stroke', 'currentColor');
        collapseIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />';

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

        if (task.location || task.npc || task.terminal || task.prereq || task.info) {
            const infoLine = document.createElement('div');
            infoLine.classList.add('info-line');
            if (task.location) {
                const loc = task.location.replace('Base of Operations', '<span class="tooltip" title="Orbiter, Drifter\'s Camp, or Backroom">$&</span>');
                const locationIcon = '<span title="Location"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" /></svg></span>';
                infoLine.innerHTML += `<span class="location">${locationIcon}${loc}</span><wbr />`;;
            }
            if (task.npc && task.terminal) {console.warn(`Tasks should specify only one of [npc, terminal]. (${task.id})`);}
            if (task.npc) {
                const npcIcon = '<span title="NPC"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" /></svg></span>';
                infoLine.innerHTML += `<span class="npc">${npcIcon}${task.npc}</span><wbr />`;
            }
            if (task.terminal) {
                const terminalIcon = '<span title="Terminal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clip-rule="evenodd" /></svg></span>';
                infoLine.innerHTML += `<span class="terminal">${terminalIcon}${task.terminal}</span><wbr />`;
            }
            if (task.prereq) {
                const prereqIcon = '<span title="Requirements"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clip-rule="evenodd" /></svg></span>';
                infoLine.innerHTML += `<span class="prereq">${prereqIcon}${task.prereq}</span><wbr />`;
            }
            if (task.info) {
                const infoIcon = '<span title="Info"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg></span>';
                infoLine.innerHTML += `<span class="info">${infoIcon}${task.info}</span><wbr />`;
            }
            label.appendChild(infoLine);
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
