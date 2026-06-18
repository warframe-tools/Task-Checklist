// --- sources/js/i18n/locales/en.js ---
/** Canonical locale. `ui` is the full key set every other locale falls back to.
 * Content overlays (tasks/cycles/moreInfo) are empty here because English content
 * already lives in tasks.json/cycles.json/moreInfo.js.
 *
 * Placeholders: tokens like {name}, {timer}, {minutes}, {time}, {version} are
 * filled at runtime — keep them verbatim in translations. Strings using &nbsp;
 * are injected as HTML; plain entities are fine there but not in aria/title text.
 *
 * Conventions: an empty string ("") means "not translated yet" and falls back to
 * en.js / the source data, so partial locales are safe. A locale only appears in the
 * language switcher once its meta has `ready: true` (en is always available).
 */
export default {
    meta: { code: "en", label: "English", htmlLang: "en" },

    ui: {
        "document.title": "Warframe Task Checklist",
        "app.title": "Warframe Task Checklist",
        "app.description": "Track your daily, weekly, and other Warframe tasks.",

        // aria-labels
        "aria.toggleTheme": "Toggle theme",
        "aria.openMenu": "Open menu",
        "aria.closeError": "Close error message",
        "aria.closeMenu": "Close menu",
        "aria.closeSchedule": "Close schedule",
        "aria.selectLanguage": "Select language",

        // language switcher
        "lang.helpTranslate": "Help translate on GitHub",

        // error display banner
        "error.copy": "Copy",
        "error.copied": "Copied!",
        "error.failed": "Failed",

        // task sections
        "section.daily": "Daily Tasks",
        "section.weekly": "Weekly Tasks",
        "section.other": "Other Tasks",
        "section.hide": "Hide Section",

        // reset / countdown timers ({timer} is the highlighted countdown span)
        "countdown.resetEllipsis": "(Resets ...)",
        "countdown.loading": "(Loading...)",
        "countdown.resetsInTimer": "(Resets in {timer})",
        "countdown.availableForTimer": "(Available for {timer})",
        "countdown.availableInTimer": "(Available in {timer})",
        "countdown.dailyFallback": "(Resets 00:00 UTC)",
        "countdown.weeklyFallback": "(Resets Mon 00:00 UTC)",

        // save status
        "save.saved": "Saved!",
        "save.loading": "Loading...",
        "save.storageNotice": "Your progress is saved locally.",
        "save.lastSaved": "Last saved: {time}",
        "save.never": "Never",

        "reminder": "*Remember, you don't have to do everything! Prioritize tasks based on your current goals and progress.*",

        // footer
        "footer.appVersion": "App Version",
        "footer.warframeVersion": "Warframe Version {version}",
        "footer.license": "License (GPLv3)",
        "footer.disclaimer": "This is an unofficial fan-made tool. Warframe and all related assets are the intellectual property of Digital Extremes Ltd. This project is not affiliated with, endorsed by, or sponsored by Digital Extremes Ltd.",

        // options menu + reset confirmation buttons
        "menu.options": "Options",
        "menu.resetDaily": "Reset Daily Checks",
        "menu.resetWeekly": "Reset Weekly Checks",
        "menu.resetAll": "Reset All Checks",
        "menu.unhideAll": "Unhide All Tasks",
        "menu.confirm": "Are you Sure?",

        // cycle schedule dialog
        "schedule.for": "Schedule for",
        "schedule.date": "Date",
        "schedule.now": "Now",
        "schedule.cycleRepeats": "(Cycle Repeats)",

        // info line (labels are icon tooltips; buttons use &nbsp; to avoid wrapping)
        "info.location": "Location",
        "info.npc": "NPC",
        "info.terminal": "Terminal",
        "info.requirements": "Requirements",
        "info.info": "Info",
        "info.showSchedule": "Show&nbsp;Schedule",
        "info.moreInfo": "More&nbsp;Info",

        // current-cycle prefixes (rendered as HTML; &nbsp; keeps them on one line)
        "cycle.thisWeek": "This&nbsp;Week",
        "cycle.today": "Today",
        "cycle.currentCycle": "Current&nbsp;Cycle",
        "cycle.nextCycle": "Next&nbsp;Cycle",

        "baseOfOperations.label": "Base of Operations",
        "baseOfOperations.tooltip": "Orbiter, Drifter's Camp, or Backroom",

        // desktop notifications + permission prompts
        "notif.toggleFor": "Toggle notifications for {name}",
        "notif.hideTask": "Hide task: {name}",
        "notif.leavingSoonTitle": "{name} Leaving Soon!",
        "notif.leavingSoonBody": "Approximately {minutes} minutes remaining.",
        "notif.resetTitle": "{name} has reset!",
        "notif.resetBody": "Vendor stock may have updated.",
        "notif.noSupport": "This browser does not support desktop notifications.",
        "notif.denied": "Notification permission was denied. You can enable it in your browser settings.",
        "notif.deniedPersist": "Notification permission has been denied. Please enable it in your browser settings if you wish to receive notifications.",

        // save/load/startup errors
        "errors.saveFailed": "Could not save progress.",
        "errors.saveFailedQuota": "Could not save progress. Browser storage might be full.",
        "errors.loadFailed": "Failed to load saved progress. Data might be corrupted.",
        "errors.themeSaveFailed": "Could not save theme preference.",
        "errors.critical": "A critical error occurred during application startup. Please check the console.",
    },

    // English content lives in tasks.json/cycles.json/moreInfo.js
    tasks: {},
    cycles: {},
    moreInfo: {},
};
