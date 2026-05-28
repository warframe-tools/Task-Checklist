import { describe, expect, test } from "vitest";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";
import tasks from "../js/tasks.json" with {type: "json"};
import tasks_schema from "./tasks.schema.json" with {type: "json"};

const ajv = new Ajv({ allErrors: false, verbose: true });
addFormats(ajv);
const validate_tasks_schema = ajv.compile(tasks_schema);

describe("valildate task definitions", () => {
    test("validate tasks against schema", () => {
        const valid = validate_tasks_schema(tasks);
        if (!valid) { console.error(validate_tasks_schema.errors); }
        const message = `Schema validation failed:\n${JSON.stringify(validate_tasks_schema.errors, null, 4)}\n`;
        expect(valid, message).toBeTruthy();
    });
});
