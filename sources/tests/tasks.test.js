import { describe, expect, test } from "vitest";
import tasks from "../js/tasks.json" with {type: "json"};
import { parseDuration } from "../js/app";

describe("valildate task definitions", () => {
    describe("sections", () => {
        test("valid sections", () => {
            expect(Object.keys(tasks).sort()).toStrictEqual(["daily", "other", "weekly"]);
        });

        test.for(Object.keys(tasks))("%s", (section) => {
            expect(tasks[section]).toBeInstanceOf(Array);
        });
    });

    describe("well formed tasks", () => {
        // flatten the nested tree of [sub]tasks into an array
        let stack = [];
        let flatTasks = [];
        for (const section in tasks) {
            for (const t of tasks[section]) {
                t.__section__ = section;
                stack.push(t);
            }
        }
        while (stack.length) {
            const t = stack.pop();
            flatTasks.push(t);
            if (t.subtasks) {
                for (const s of t.subtasks) {
                    s.__section__ = t.__section__;
                    stack.push(s);
                }
            }
        }

        test.for(flatTasks)("$id", (task) => {
            expect(task).toHaveProperty("id");
            expect.soft(task.id.split("_")[0], `Task id should start with the section name (e.g. ${task.__section__}_${task.id} instead of ${task.id})`).toEqual(task.__section__);
            expect(task).toHaveProperty("text");
            expect.soft(task, "Task should have an icon").toHaveProperty("icon");
            if (task.subtasks) {expect(task.subtasks).toBeInstanceOf(Array);}
            if (task.npc) {expect.soft(task.terminal, "Tasks should specify only one of [npc, terminal].").toBeUndefined();}
            if (task.__section__ === "other") {
                expect(task, 'other_* tasks MUST specify a "period"').toHaveProperty("period");
                expect(parseDuration(task.period), `"${task.period}" is not a valid period`).toBeGreaterThan(0);
                expect.soft(task, 'other_* tasks SHOULD specify a "ref". The default ref of 0 ("1970-01-01T00:00:00Z") will be used otherwise.').toHaveProperty("ref");
            }
        });
    });
});
