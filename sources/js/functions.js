// --- sources/js/functions.js ---
// Functions that don't manipulate or depend on the DOM or global variables,
// and have no side effects (apart from console messages).
// Functions that generate HTML or DOM elements are allowed here,
// as long as they don't actually insert them into the document

import * as C from "./constants.js";

export function modulo(n, d) {
    return ((n % d) + d) % d;
}

export function formatTimestamp(timestamp) {
    if (!timestamp) return 'Never';
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) { console.error("Error formatting timestamp:", e); return 'Error'; }
}

export function getMostRecentMondayMidnightUTC() {
    const now = new Date();
    const currentUTCDay = now.getUTCDay();
    const daysSinceMondayUTC = (currentUTCDay === 0) ? 6 : currentUTCDay - 1;

    const mondayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    mondayUTC.setUTCDate(mondayUTC.getUTCDate() - daysSinceMondayUTC);
    mondayUTC.setUTCHours(0, 0, 0, 0);
    return mondayUTC.getTime();
}

export function getNextDailyMidnightUTC() {
    const now = new Date();
    const tomorrowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    tomorrowUTC.setUTCHours(0, 0, 0, 0);
    return tomorrowUTC.getTime();
}

export function getUTCDateString(dateObj) {
    const year = dateObj.getUTCFullYear();
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getUTCDayOfYear(date) {
    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear;
    return Math.floor(diff / C.MILLISECONDS_PER_DAY);
}

export function formatCountdown(ms) {
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
        "d": C.MILLISECONDS_PER_DAY,
        "h": C.MILLISECONDS_PER_HOUR,
        "m": C.MILLISECONDS_PER_MINUTE,
        "s": C.MILLISECONDS_PER_SECOND
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

export function calcCycleNumber(task, time) {
    // calculates the cycleNumber (number of resets since the reference time) of the given task at the given time (a Date object or timestamp)
    if (typeof time === "number") {time = new Date(time);}
    const ref = new Date(task.ref || 0);
    const period = parseDuration(task.period);
    let diff = time.getTime() - ref.getTime();
    if (task.observesDst && isDst(time, C.SERVER_TIMEZONE)) {
        diff += C.MILLISECONDS_PER_HOUR;
    }
    return Math.floor(diff / period);
}

export function makeInfoLineItem(task, prop, iconToolTip, icon) {
    if (task[prop]) {
        return `<span class="${prop}"><span title="${iconToolTip}">${icon}</span>${task[prop]}</span><wbr />`;
    } else {
        return "";
    }
}
