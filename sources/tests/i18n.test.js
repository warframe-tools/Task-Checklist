/// <reference types="vitest/jsdom" />

import { afterEach, describe, expect, test } from "vitest";
import { getLanguage, localizeData, setLanguage, t, tc, td } from "../js/i18n.js";
import ru from "../js/locales/ru.js";

afterEach(() => {
    setLanguage("en");
});

describe("language selection", () => {
    test("defaults to English in the test environment", () => {
        expect(getLanguage()).toBe("en");
    });

    test("unknown languages fall back to English", () => {
        setLanguage("xx");
        expect(getLanguage()).toBe("en");
    });
});

describe("t()", () => {
    test("English text is returned as is, with placeholders filled in", () => {
        expect(t("Copy")).toBe("Copy");
        expect(t("Hide task: {title}", { title: "Sortie" })).toBe("Hide task: Sortie");
    });

    test("missing translations fall back to English", () => {
        setLanguage("ru");
        expect(t("This text has no translation")).toBe("This text has no translation");
        expect(t("{a} and {b}", { a: 1 })).toBe("1 and {b}");
    });

    test("translates and fills in placeholders", () => {
        setLanguage("ru");
        expect(t("Hide task: {title}", { title: "Вылазка" })).toBe("Скрыть задачу: Вылазка");
    });

    test("context-specific text falls back to the plain translation, then to English", () => {
        expect(tc("list", "Completed")).toBe("Completed");
        setLanguage("ru");
        expect(tc("list", "Completed")).toBe("Выполненные");
        expect(t("Completed")).toBe("Выполнено");
        expect(tc("list", "Copy")).toBe("Копировать");
    });
});

describe("localizeData()", () => {
    function sample() {
        return [
            { daily: [{ id: "daily_x", title: "Sortie", prereq: "The War Within", subtasks: [{ id: "daily_y", title: "Ostron" }] }] },
            { daily_x: { columns: [{ name: "Item", order: [{ text: "Winter" }] }] } },
        ];
    }

    test("does nothing for English", () => {
        const [tasks, cycles] = sample();
        localizeData(tasks, cycles);
        expect(tasks).toEqual(sample()[0]);
        expect(cycles).toEqual(sample()[1]);
    });

    test("translates tasks, subtasks, and cycle schedules", () => {
        setLanguage("ru");
        const [tasks, cycles] = sample();
        localizeData(tasks, cycles);
        expect(tasks.daily[0].title).toBe("Вылазка");
        expect(tasks.daily[0].prereq).toBe("Война внутри");
        expect(tasks.daily[0].subtasks[0].title).toBe("Острон");
        expect(cycles.daily_x.columns[0].name).toBe("Предмет");
        expect(cycles.daily_x.columns[0].order[0].text).toBe("Зима");
    });

    test("untranslated data is left alone", () => {
        setLanguage("ru");
        const tasks = { daily: [{ id: "daily_x", title: "Something new" }] };
        localizeData(tasks, {});
        expect(tasks.daily[0].title).toBe("Something new");
        expect(td("Something new")).toBe("Something new");
    });
});

describe("translations", () => {
    function placeholders(text) {
        return (text.match(/\{\w+\}/g) ?? []).sort();
    }

    test.for(Object.entries(ru.ui))("ru.ui[%j] keeps the same placeholders", ([key, value]) => {
        expect(placeholders(value)).toEqual(placeholders(key));
    });
});
