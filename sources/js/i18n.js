// --- sources/js/i18n.js ---
/** Minimal localization layer.
 *
 * English is the source language: the English text in the code, `tasks.json`, `cycles.json`, `moreInfo.js` and
 * `index.html` is used as the lookup key, so a missing translation simply falls back to English.
 * Each additional language lives in `locales/<code>.js` and is registered in `LOCALES` below.
 *
 * The language is chosen once per page load (saved choice > browser language > English).
 * Changing it in the options menu saves the choice and reloads the page.
 */

import ru from "./locales/ru.js";

export const LANGUAGE_STORAGE_KEY = "warframeChecklistLanguage";

/** Registered translations. English is built in and needs no entry. */
const LOCALES = { ru };

/** Languages offered in the options menu, with their names written in their own language. */
export const LANGUAGE_NAMES = {
    en: "English",
    ru: "Русский",
};

/** Returns the language code to use: the saved choice, else the first supported browser language, else "en". */
export function detectLanguage() {
    try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && Object.hasOwn(LANGUAGE_NAMES, stored)) { return stored; }
    } catch (e) {
        console.warn("Could not read language preference:", e);
    }
    const preferred = (typeof navigator === "undefined") ? [] : (navigator.languages ?? [navigator.language]);
    for (const tag of preferred) {
        const code = String(tag).toLowerCase().split("-")[0];
        if (Object.hasOwn(LANGUAGE_NAMES, code)) { return code; }
    }
    return "en";
}

let currentLanguage = detectLanguage();

export function getLanguage() {
    return currentLanguage;
}

/** Overrides the language for this page load (does not save it). */
export function setLanguage(code) {
    currentLanguage = Object.hasOwn(LANGUAGE_NAMES, code) ? code : "en";
}

/** Saves the language choice. Takes effect on the next page load. */
export function saveLanguage(code) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
}

function locale() {
    return LOCALES[currentLanguage];
}

/** BCP 47 tag for date formatting, or undefined to use the browser default (English). */
export function getLocaleTag() {
    return locale()?.tag;
}

function interpolate(text, vars) {
    if (!vars) { return text; }
    return text.replace(/\{(\w+)\}/g, (match, name) => (Object.hasOwn(vars, name) ? vars[name] : match));
}

/** Translates a UI string. `{name}` placeholders are filled from `vars`. */
export function t(text, vars) {
    return interpolate(locale()?.ui?.[text] ?? text, vars);
}

/** Like `t()`, but for strings whose translation depends on context (for example grammar).
 * Looks up the key "context|text" first, then falls back to plain `t()`.
 */
export function tc(context, text, vars) {
    return interpolate(locale()?.ui?.[`${context}|${text}`] ?? locale()?.ui?.[text] ?? text, vars);
}

/** Translates a piece of task data (a title, location, prerequisite, etc. from `tasks.json` or `cycles.json`). */
export function td(text) {
    return locale()?.data?.[text] ?? text;
}

const TASK_TEXT_PROPS = ["title", "text", "location", "terminal", "npc", "prereq", "info"];

/** Translates, in place, all the text in the task tree and the cycle schedules. Does nothing for English. */
export function localizeData(tasks, cycles) {
    if (!locale()) { return; }

    function localizeTask(task) {
        for (const prop of TASK_TEXT_PROPS) {
            if (task[prop]) { task[prop] = td(task[prop]); }
        }
        task.subtasks?.forEach(localizeTask);
    }
    for (const section in tasks) {
        tasks[section].forEach(localizeTask);
    }

    for (const id in cycles) {
        for (const column of cycles[id].columns) {
            column.name = td(column.name);
            for (const entry of column.order) {
                entry.text = td(entry.text);
            }
        }
    }
}

/** Returns the translated "more info" HTML by task id, or `undefined` if the current language has none.
 * `helpers` are things the translated HTML needs to build itself (icons, tooltips).
 */
export function localizeMoreInfo(helpers) {
    return locale()?.moreInfo?.(helpers);
}

/** Translates the static text and the `title`/`aria-label` attributes of the markup in `index.html`. */
export function translateDocument(root = document) {
    if (!locale()) { return; }

    document.documentElement.lang = currentLanguage;
    document.title = t(document.title);

    const walker = document.createTreeWalker(root.body ?? root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) { textNodes.push(walker.currentNode); }
    for (const node of textNodes) {
        const original = node.nodeValue;
        const trimmed = original.trim();
        if (!trimmed || node.parentElement.closest("script, style")) { continue; }
        const translated = t(trimmed);
        if (translated !== trimmed) {
            node.nodeValue = original.replace(trimmed, () => translated);
        }
    }

    for (const attribute of ["title", "aria-label"]) {
        root.querySelectorAll(`[${attribute}]`).forEach((el) => {
            el.setAttribute(attribute, t(el.getAttribute(attribute)));
        });
    }
}
