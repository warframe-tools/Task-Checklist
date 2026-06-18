// --- sources/js/i18n/i18n.js ---
// Locales are imported statically (not fetched at runtime) so Vite inlines them into the build.
// `en` is canonical: complete `ui` dict, empty content overlays (English lives in the JSON/JS data).

// Auto-discover every locale in ./locales/. Vite bundles eager-globbed files at
// build time, so this still inlines into the single-file build (no runtime fetch).
// To add a language: drop a `<code>.js` file in ./locales/ — no edits here needed.
const localeModules = import.meta.glob("./locales/*.js", { eager: true, import: "default" });

export const DEFAULT_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "warframeChecklistLocale";

// registry keyed by each module's meta.code
export const LOCALE_MODULES = {};
for (const path in localeModules) {
    const mod = localeModules[path];
    if (mod && mod.meta && mod.meta.code) {
        LOCALE_MODULES[mod.meta.code] = mod;
    } else {
        console.warn(`i18n: ignoring locale file '${path}' (missing meta.code).`);
    }
}

const FALLBACK = LOCALE_MODULES[DEFAULT_LOCALE];

// task fields the `tasks` overlay may translate
const TASK_FIELDS = ["text", "location", "prereq", "info", "terminal", "npc"];

// where contributors add/fill in translations (linked from the switcher footer)
export const TRANSLATE_URL = "https://github.com/warframe-tools/Task-Checklist/tree/main/sources/js/i18n";

// a locale appears in the switcher only once it's marked ready; en is always available
const isVisibleLocale = (m) => m.meta.code === DEFAULT_LOCALE || m.meta.ready === true;

// [{code, label}] for the selector — English first, then the rest alphabetically
export const AVAILABLE_LOCALES = Object.values(LOCALE_MODULES)
    .filter(isVisibleLocale)
    .map((m) => ({ code: m.meta.code, label: m.meta.label }))
    .sort((a, b) => (
        a.code === DEFAULT_LOCALE ? -1
        : b.code === DEFAULT_LOCALE ? 1
        : a.label.localeCompare(b.label)
    ));

// map a browser language tag ("pt-BR", "zh-CN", "en-US"...) to a registered locale
// code, or null if none fits. Each return is guarded so it only yields a real code:
//   1. exact tag                 — "pt-br", "zh-hans" (if the browser sends the script)
//   2. Chinese script via Intl   — "zh-CN"/"zh-TW"/"zh-HK"... -> "zh-hans"/"zh-hant"
//   3. Portuguese                — we only ship Brazilian, so any "pt*" -> "pt-br"
//   4. base language             — "en-US" -> "en"
export function resolveLocale(tag) {
    const lower = tag.toLowerCase();
    if (Object.hasOwn(LOCALE_MODULES, lower)) { return lower; }

    const base = lower.split("-")[0];

    if (base === "zh") {
        try {
            const script = new Intl.Locale(tag).maximize().script; // "Hans" / "Hant"
            const code = script === "Hant" ? "zh-hant" : "zh-hans";
            if (Object.hasOwn(LOCALE_MODULES, code)) { return code; }
        } catch (e) { /* fall through to base match */ }
    }
    if (base === "pt" && Object.hasOwn(LOCALE_MODULES, "pt-br")) { return "pt-br"; }

    if (Object.hasOwn(LOCALE_MODULES, base)) { return base; }
    return null;
}

function detectLocale() {
    try {
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (stored && Object.hasOwn(LOCALE_MODULES, stored)) {
            return stored;
        }
    } catch (e) {
        console.warn("i18n: could not read stored locale.", e);
    }

    try {
        const langs = (navigator.languages && navigator.languages.length)
            ? navigator.languages
            : [navigator.language];
        for (const lang of langs) {
            if (!lang) { continue; }
            const code = resolveLocale(lang);
            // only auto-select a locale that's actually shown (translated) in the switcher
            if (code && isVisibleLocale(LOCALE_MODULES[code])) {
                return code;
            }
        }
    } catch (e) {
        console.warn("i18n: could not detect browser language.", e);
    }

    return DEFAULT_LOCALE;
}

let currentLocale = detectLocale();

export function getLocale() {
    return currentLocale;
}

export function getMeta() {
    return LOCALE_MODULES[currentLocale].meta;
}

export function setLocale(code) {
    if (!Object.hasOwn(LOCALE_MODULES, code)) {
        console.warn(`i18n: unknown locale '${code}', ignoring.`);
        return;
    }
    if (code === currentLocale) { return; }
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch (e) {
        console.warn("i18n: could not persist locale preference.", e);
    }
    currentLocale = code;
    location.reload(); // simplest way to re-render every string + all task content
}

// substitute {placeholder} tokens
function interpolate(str, params) {
    if (!params) { return str; }
    return str.replace(/\{(\w+)\}/g, (match, key) => (
        Object.hasOwn(params, key) ? params[key] : match
    ));
}

// look up a UI string; fall back to en, then the key itself
export function t(key, params) {
    const dict = LOCALE_MODULES[currentLocale].ui;
    let str;
    // an empty string means "not translated yet" — fall through to the en fallback
    if (dict && Object.hasOwn(dict, key) && dict[key] !== "") {
        str = dict[key];
    } else if (Object.hasOwn(FALLBACK.ui, key)) {
        str = FALLBACK.ui[key];
    } else {
        console.warn(`i18n: missing translation key '${key}'.`);
        str = key;
    }
    return interpolate(str, params);
}

// translated `location` strings must use baseOfOperations.label verbatim so makeInfoLine's swap-in matches
export function baseOfOperationsHTML() {
    return `<span class="tooltip" title="${t("baseOfOperations.tooltip")}">${t("baseOfOperations.label")}</span>`;
}

// overlay translated task text in place; no-op for en
export function localizeTasks(tasks) {
    const overlay = LOCALE_MODULES[currentLocale].tasks || {};

    function walk(task) {
        const fields = overlay[task.id];
        if (fields) {
            for (const field of TASK_FIELDS) {
                // empty string = not translated yet; leave the English value in place
                if (Object.hasOwn(fields, field) && fields[field] !== "") {
                    task[field] = fields[field];
                }
            }
        }
        if (task.subtasks) { task.subtasks.forEach(walk); }
    }

    for (const section in tasks) {
        tasks[section].forEach(walk);
    }
}

// overlay translated cycle column names + cell text in place; no-op for en
export function localizeCycles(cycles) {
    const textMap = LOCALE_MODULES[currentLocale].cycles || {};
    // empty string = not translated yet; keep the original cell/column text
    const tr = (s) => (Object.hasOwn(textMap, s) && textMap[s] !== "" ? textMap[s] : s);

    for (const id in cycles) {
        for (const column of cycles[id].columns) {
            if (column.name) { column.name = tr(column.name); }
            for (const cell of column.order) {
                if (cell.text) { cell.text = tr(cell.text); }
            }
        }
    }
}

// translated moreInfo HTML for a task id, or undefined to keep the default
export function getMoreInfo(id) {
    const overlay = LOCALE_MODULES[currentLocale].moreInfo || {};
    // empty string = not translated yet; undefined keeps the default English moreInfo
    return Object.hasOwn(overlay, id) && overlay[id] !== "" ? overlay[id] : undefined;
}

// translate <html lang>, title, and elements tagged data-i18n / data-i18n-html / data-i18n-aria-label
export function applyStaticTranslations(root = document) {
    try {
        document.documentElement.lang = getMeta().htmlLang;
        document.title = t("document.title");
    } catch (e) {
        console.warn("i18n: could not set document lang/title.", e);
    }

    root.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => {
        el.innerHTML = t(el.dataset.i18nHtml);
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
    });
}

const CHEVRON_SVG = `<svg class="lang-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>`;
const CHECK_SVG = `<svg class="lang-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;
const EXTERNAL_SVG = `<svg class="lang-ext" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>`;

// custom button + listbox dropdown (a native <select> popup can't be themed)
export function setupLanguageSwitcher(container) {
    if (!container) { return; }
    container.innerHTML = "";

    const current = AVAILABLE_LOCALES.find((l) => l.code === currentLocale) || AVAILABLE_LOCALES[0];

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "lang-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "lang-menu");
    trigger.setAttribute("aria-label", t("aria.selectLanguage"));
    trigger.innerHTML = `<span class="lang-current">${current.code.toUpperCase()}</span>${CHEVRON_SVG}`;

    const menu = document.createElement("ul");
    menu.id = "lang-menu";
    menu.className = "lang-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    for (const { code, label } of AVAILABLE_LOCALES) {
        const selected = code === currentLocale;
        const item = document.createElement("li");
        item.className = "lang-option" + (selected ? " is-selected" : "");
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", selected ? "true" : "false");
        item.dataset.code = code;
        item.tabIndex = -1;
        item.innerHTML = `<span class="lang-option-code">${code.toUpperCase()}</span><span class="lang-option-name">${label}</span>${selected ? CHECK_SVG : ""}`;
        item.addEventListener("click", () => {
            if (code !== currentLocale) { setLocale(code); } // reloads the page
            else { close(); }
        });
        menu.appendChild(item);
    }

    // footer CTA: untranslated languages are hidden, so point people to where they can help
    const help = document.createElement("li");
    help.className = "lang-option lang-help";
    help.setAttribute("role", "option");
    help.tabIndex = -1;
    help.innerHTML = `<span class="lang-option-name">${t("lang.helpTranslate")}</span>${EXTERNAL_SVG}`;
    help.addEventListener("click", () => {
        window.open(TRANSLATE_URL, "_blank", "noopener");
        close();
    });
    menu.appendChild(help);

    const options = () => [...menu.querySelectorAll(".lang-option")];

    function open() {
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        container.classList.add("open");
        document.addEventListener("click", onOutside, true);
        document.addEventListener("keydown", onKey, true);
        (menu.querySelector(".is-selected") || options()[0])?.focus();
    }
    function close() {
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        container.classList.remove("open");
        document.removeEventListener("click", onOutside, true);
        document.removeEventListener("keydown", onKey, true);
    }
    function onOutside(e) {
        if (!container.contains(e.target)) { close(); }
    }

    // type-ahead: typing letters jumps to the matching language (by code or name)
    let typeBuffer = "";
    let typeTimer = null;
    function typeahead(char) {
        typeBuffer += char.toLowerCase();
        if (typeTimer) { clearTimeout(typeTimer); }
        typeTimer = setTimeout(() => { typeBuffer = ""; }, 500);
        const match = options().find((o) => {
            const code = (o.dataset.code || "").toLowerCase(); // help item has no code
            const name = (o.querySelector(".lang-option-name")?.textContent || "").toLowerCase();
            return code.startsWith(typeBuffer) || name.startsWith(typeBuffer);
        });
        match?.focus();
    }

    function onKey(e) {
        const opts = options();
        const idx = opts.indexOf(document.activeElement);
        if (e.key === "Escape") { e.preventDefault(); close(); trigger.focus(); }
        else if (e.key === "Tab") { close(); trigger.focus(); } // let focus continue from the trigger
        else if (e.key === "ArrowDown") { e.preventDefault(); (opts[idx + 1] || opts[0]).focus(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); (opts[idx - 1] || opts[opts.length - 1]).focus(); }
        else if (e.key === "Home") { e.preventDefault(); opts[0]?.focus(); }
        else if (e.key === "End") { e.preventDefault(); opts[opts.length - 1]?.focus(); }
        else if ((e.key === "Enter" || e.key === " ") && document.activeElement.classList.contains("lang-option")) {
            e.preventDefault();
            document.activeElement.click();
        }
        else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            typeahead(e.key);
        }
    }

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.hidden ? open() : close();
    });

    // open with the keyboard and land on the right end of the list
    trigger.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") { return; }
        e.preventDefault();
        if (menu.hidden) { open(); }
        const opts = options();
        ((e.key === "ArrowUp" || e.key === "End") ? opts[opts.length - 1] : opts[0])?.focus();
    });

    container.appendChild(trigger);
    container.appendChild(menu);
}
