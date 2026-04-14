// Feature: pj-mutamayizin-role, Property 12: Service error propagation
// Validates: Requirements 13.3

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";

// We test the service functions directly by mocking global fetch
// Each function should throw an Error when the response is 4xx or 5xx

const mockFetch = vi.fn();

beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    // Stub localStorage
    vi.stubGlobal("localStorage", {
        getItem: () => "mock-token",
        setItem: () => {},
        removeItem: () => {},
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

/**
 * Helper: create a mock Response with a given status code and optional JSON body.
 */
function makeMockResponse(status: number, body?: object): Response {
    const json = body ?? { message: `HTTP ${status}`, code: status };
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => json,
    } as unknown as Response;
}

// Dynamically import service after globals are stubbed
async function importService() {
    // Reset module cache so env vars are re-evaluated
    return await import("./mutamayizinService");
}

describe("Property 12: mutamayizinService error propagation", () => {
    it("getDashboard throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getDashboard } = await importService();
                await expect(getDashboard()).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getAchievements throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getAchievements } = await importService();
                await expect(getAchievements()).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getAchievement throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getAchievement } = await importService();
                await expect(getAchievement(1)).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("createAchievement throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { createAchievement } = await importService();
                await expect(
                    createAchievement({
                        student_profile_id: 1,
                        academic_year_id: 1,
                        competition_name: "Test",
                        rank: "Juara 1",
                        level: "Provinsi",
                        date: "2025-01-01",
                    })
                ).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("updateAchievement throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { updateAchievement } = await importService();
                await expect(updateAchievement(1, { rank: "Juara 2" })).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("deleteAchievement throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { deleteAchievement } = await importService();
                await expect(deleteAchievement(1)).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getExtracurriculars throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getExtracurriculars } = await importService();
                await expect(getExtracurriculars()).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getExtracurricularDetail throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getExtracurricularDetail } = await importService();
                await expect(getExtracurricularDetail(1)).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getAttendanceSessions throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getAttendanceSessions } = await importService();
                await expect(getAttendanceSessions(1)).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getAttendanceSession throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getAttendanceSession } = await importService();
                await expect(getAttendanceSession(1, 1)).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getTutorAttendance throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getTutorAttendance } = await importService();
                await expect(getTutorAttendance()).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getStudents throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getStudents } = await importService();
                await expect(getStudents()).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getAcademicYears throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getAcademicYears } = await importService();
                await expect(getAcademicYears()).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("getProfile throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { getProfile } = await importService();
                await expect(getProfile()).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("updateProfile throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { updateProfile } = await importService();
                await expect(updateProfile({ name: "Test" })).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("updateAvatar throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { updateAvatar } = await importService();
                const file = new File(["content"], "avatar.jpg", { type: "image/jpeg" });
                await expect(updateAvatar(file)).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("updatePassword throws Error for any 4xx/5xx status", async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
                mockFetch.mockResolvedValueOnce(makeMockResponse(status));
                const { updatePassword } = await importService();
                await expect(
                    updatePassword({
                        current_password: "old",
                        password: "new",
                        password_confirmation: "new",
                    })
                ).rejects.toThrow();
            }),
            { numRuns: 50 }
        );
    });

    it("error message is taken from API response body when available", async () => {
        const apiMessage = "Data prestasi tidak ditemukan.";
        mockFetch.mockResolvedValueOnce(makeMockResponse(404, { message: apiMessage, code: 404 }));
        const { getAchievement } = await importService();
        await expect(getAchievement(999)).rejects.toThrow(apiMessage);
    });

    it("falls back to HTTP status message when response body is not JSON", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => { throw new Error("not json"); },
        } as unknown as Response);
        const { getDashboard } = await importService();
        await expect(getDashboard()).rejects.toThrow("HTTP 500");
    });
});
