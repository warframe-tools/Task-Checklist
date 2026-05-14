import { describe, expect, test, vi } from "vitest";
import { isDst, parseDuration } from "../js/app.js";

describe("Daylight Saving Time", () => {
    test.for([
        ["1970-01-01T00:00:00Z", "America/New_York", false],
        ["2025-07-01T00:00:00Z", "America/Los_Angeles", true],
        ["2025-03-30T00:59:59Z", "Europe/London", false], // just before start
        ["2025-03-30T01:00:00Z", "Europe/London", true], // just after start
        ["2025-03-09T01:59:59-08:00", "America/Los_Angeles", false], // just before start
        ["2025-03-09T02:00:00-08:00", "America/Los_Angeles", true], // just after start
        ["2025-03-09T03:00:00-07:00", "America/Los_Angeles", true], // just after start
        ["2025-11-02T01:59:59-07:00", "America/Los_Angeles", true], // just before end
        ["2025-11-02T02:00:00-07:00", "America/Los_Angeles", false], // just after end

        // non-DST zone
        ["2025-01-01T00:00:00Z", "America/Phoenix", false],
        ["2025-07-01T00:00:00Z", "America/Phoenix", false],
        ["2025-03-09T01:59:59-07:00", "America/Phoenix", false],
        ["2025-03-09T02:00:00-07:00", "America/Phoenix", false],
        ["2025-03-09T03:00:00-07:00", "America/Phoenix", false],

        // Southern hemisphere
        ["2025-01-01T00:00:00Z", "Australia/Sydney", true],
        ["2025-07-01T00:00:00Z", "Australia/Sydney", false],
        ["2025-04-06T02:59:59+11:00", "Australia/Sydney", true], // just before end
        ["2025-04-06T03:00:00+11:00", "Australia/Sydney", false], // just after end
        ["2025-04-06T02:00:00+10:00", "Australia/Sydney", false], // just after end
        ["2025-10-05T01:59:59+10:00", "Australia/Sydney", false], // just before start
        ["2025-10-05T02:00:00+10:00", "Australia/Sydney", true], // just after start
        ["2025-10-05T03:00:00+11:00", "Australia/Sydney", true], // just after start

        // fractional time zones
        ["2025-05-06T00:00:00Z", "Asia/Kathmandu", false],
        ["2025-12-25T00:00:00Z", "Asia/Kathmandu", false],
        ["2025-04-06T02:59:59+10:30", "Australia/Adelaide", true], // just before end
        ["2025-04-06T03:00:00+10:30", "Australia/Adelaide", false], // just after end
        ["2025-04-06T02:00:00+09:30", "Australia/Adelaide", false], // just after end
        ["2025-10-05T01:59:59+09:30", "Australia/Adelaide", false], // just before start
        ["2025-10-05T02:00:00+09:30", "Australia/Adelaide", true], // just after start
        ["2025-10-05T03:00:00+10:30", "Australia/Adelaide", true], // just after start

        // fractional DST
        ["2025-04-06T01:59:59+11:00", "Australia/Lord_Howe", true], // just before end
        ["2025-04-06T02:00:00+11:00", "Australia/Lord_Howe", false], // just after end
        ["2025-04-06T01:30:00+10:30", "Australia/Lord_Howe", false], // just after end
        ["2025-10-05T01:59:59+10:30", "Australia/Lord_Howe", false], // just before start
        ["2025-10-05T02:00:00+10:30", "Australia/Lord_Howe", true], // just after start
        ["2025-10-05T03:00:00+11:00", "Australia/Lord_Howe", true], // just after start
    ])(`isDst(%s, %s) -> %o`, ([d, tz, expected]) => {
        expect(isDst(new Date(d), tz)).toBe(expected);
        expect(isDst(new Date(d).getTime(), tz)).toBe(expected);
        expect(isDst(d, tz)).toBe(expected);
    });
});


describe("parseDuration", () => {
    test.for([
        ["1s", 1000],
        ["15s", 15_000],
        ["3m", 180_000],
        ["12h", 43_200_000],
        ["14d", 1_209_600_000],
        ["2d3H10M12s", 184_212_000],
        ["1m, 359h 1d 3d, 5m6s   4h", 1_652_766_000]
    ])(`parseDuration(%s) -> %i`, ([d, expected]) => {
        expect(parseDuration(d)).toEqual(expected);
    });

    test.for(["", 0, 1000])("%o", (i) => {
        expect(parseDuration(i)).toBeUndefined();
    });

    test.for([
        ["1s 10n", 1, 1000],
        ["10y5w2d3h8x10m12s13g", 4, 184_212_000],
        ["1m, 359h 9p1d 3d, 5m6s   4h\t1234v", 2, 1_652_766_000]
    ])(`parseDuration(%s) warn %i`, ([d, warnings, expected]) => {
        const consoleWarn = vi.spyOn(console, "warn");
        expect(parseDuration(d)).toEqual(expected);
        expect(consoleWarn).toHaveBeenCalledTimes(warnings);
    });
});
