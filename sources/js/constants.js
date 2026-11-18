// --- sources/js/constants.js ---
import { t } from "./i18n.js";

export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
export const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
export const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

export const SERVER_TIMEZONE = "America/Toronto"; // used for determining Daylight Saving Time

export const BASE_OF_OPERATIONS_NAME = t("Base of Operations"); // the text task locations use (translated along with `tasks.json`)
export const BASE_OF_OPERATIONS_TOOLTIP = `<span title="${t("Orbiter, Drifter's Camp, or Backroom")}">${BASE_OF_OPERATIONS_NAME}</span>`;

export const TASKLIST_STAT_NAMES = {
    "completed": "Completed",
    "skipped": "Skipped",
    "hidden": "Hidden",
};

export const TASKLIST_STAT_PROPERTIES = {
    "completed": "progress",
    "skipped": "skippedTasks",
    "hidden": "hiddenTasks",
};

export const SECTION_NAMES = {
    "daily": "Daily",
    "weekly": "Weekly",
    "other": "Other",
};
