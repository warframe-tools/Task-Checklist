/// <reference types="vitest/jsdom" />

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import fs from "node:fs";
import * as app from "../js/app.js";

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
})

// document.getElementsByTagName("head")[0].outerHTML = fs.readFileSync("sources/index.html");

describe("displayOtherTaskCountdown({period, duration, ref, observesDst})", () => {
    beforeEach(() => {
        document.getElementsByTagName("body")[0].innerHTML = `
            <div id="other_test"></div>
            <div class="task-description">
                <span class="other-countdown"></span>
            </div>
        `;
    });

    afterEach(() => {
        document.getElementsByTagName("body")[0].innerHTML = "";
    });

    test.for([
        ["8h", undefined, "2023-12-13", undefined, "2026-05-18T04:00:00Z", "(Resets in 04:00:00)"],
        ["8h", undefined, "2023-12-13", undefined, "2026-05-18T09:30:30Z", "(Resets in 06:29:30)"],
        ["8h", undefined, "2023-12-13", undefined, "2026-05-18T16:00:00Z", "(Resets in 08:00:00)"],
        ["8h", undefined, "2023-12-13", undefined, "2022-05-18T23:59:59Z", "(Resets in 00:00:01)"], // ref is in the future
        ["8h", undefined, "2023-12-13", true, "2022-05-18T23:59:59Z", "(Resets in 07:00:01)"],
        ["4d", undefined, "2025-03-18", undefined, "2025-03-18T23:59:59Z", "(Resets in 3d 00:00:01)"],
        ["40d", undefined, undefined, undefined, "2026-05-18T16:59:15Z", "(Resets in 8d 07:00:45)"], // undefined ref defaults to zero (1970-01-01)
        ["1d", "12h", "2026-05-01", undefined, "2026-05-18T00:30:00Z", "(Available for 11:30:00)"],
        ["1d", "12h", "2026-05-01", undefined, "2026-05-18T11:59:00Z", "(Available for 00:01:00)"],
        ["1d", "12h", "2026-05-01", undefined, "2026-05-18T12:00:00Z", "(Available in 12:00:00)"],
        ["1d", "12h", "2026-05-01", undefined, "2026-05-18T20:45:00Z", "(Available in 03:15:00)"],
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2026-01-09T00:00:00-05:00", "(Available in 09:00:00)"],
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2026-01-09T09:30:00-05:00", "(Available for 1d 23:30:00)"],
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2026-01-11T09:00:00-05:00", "(Available in 12d 00:00:00)"],
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2026-03-06T08:00:00-05:00", "(Available in 01:00:00)"],
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2026-03-06T09:00:00-05:00", "(Available for 1d 23:00:00)"], // dst means Baro only stays for 47 hours
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2026-03-08T09:00:00-05:00", "(Available in 11d 23:00:00)"], // dst changes timezone from -5 to -4, so 9:00(-5) is 10:00(-4)
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2026-04-17T09:00:00-04:00", "(Available for 2d 00:00:00)"],
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2024-11-01T08:00:00-04:00", "(Available in 01:00:00)"],
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2024-11-01T09:00:00-04:00", "(Available for 2d 01:00:00)"], // dst means Baro stays for 49 hours
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2024-11-03T09:00:00-04:00", "(Available for 01:00:00)"], // dst changes timezone from -4 to -5, so 9:00(-4) is 8:00(-5)
        ["14d", "2d", "2022-12-30T09:00:00-05:00", true, "2024-11-03T09:00:00-05:00", "(Available in 12d 00:00:00)"],
    ])("(%s, %s, %s, %s) @ %s -> %s", ([period, duration, ref, observesDst, date, countdown]) => {
        vi.setSystemTime(date);
        app.displayOtherTaskCountdown({id: "other_test", period, duration, ref, observesDst});
        expect(document.querySelector(".other-countdown").textContent).toEqual(countdown);
    })
});
