const request = require("supertest");
const app = require("../app"); // Express app
const { UserXP, User, XPLog, Badge, UserBadge } = require("../models");

describe("XP and Badge System", () => {
    let testUser;

    beforeAll(async () => {
        testUser = await User.create({
            name: "Test User",
            email: "testuser@example.com",
            password: "password123"
        });
        await UserXP.create({ user_id: testUser.id });
    });

    afterAll(async () => {
        if (testUser?.id) {
            await UserBadge.destroy({ where: { userId: testUser.id } });
            await XPLog.destroy({ where: { user_id: testUser.id } });
            await UserXP.destroy({ where: { user_id: testUser.id } });
            await User.destroy({ where: { id: testUser.id } });
        }
    });

    test("Add valid XP", async () => {
        const res = await request(app)
            .post("/xp")
            .send({ userId: testUser.id, xpAmount: 50, source: "test" });

        expect(res.status).toBe(200);
        expect(res.body.data.xp).toBeGreaterThanOrEqual(50);
        expect(res.body.data.level).toBeGreaterThanOrEqual(1);
    });

    test("Add negative XP should fail", async () => {
        const res = await request(app)
            .post("/xp")
            .send({ userId: testUser.id, xpAmount: -10 });

        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/must be greater than 0/);
    });

    test("Add XP for invalid user", async () => {
        const res = await request(app)
            .post("/xp")
            .send({ userId: 999999, xpAmount: 50 });

        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/UserXP not found/);
    });

    test("Fetch XP status", async () => {
        const res = await request(app)
            .get("/status")
            .query({ userId: testUser.id });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("xp");
        expect(res.body.data).toHaveProperty("level");
        expect(res.body.data).toHaveProperty("nextLevelXp");
        expect(res.body.data).toHaveProperty("pendingXP");
    });

    test("Fetch XP history", async () => {
        const res = await request(app)
            .get("/history")
            .query({ userId: testUser.id });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // test("Award badge to user", async () => {
    //     const badge = await Badge.create({ name: "Test Badge" });

    //     const res = await request(app)
    //         .post("/xp/award-badge")
    //         .send({ userId: testUser.id, badgeId: badge.id });

    //     expect(res.status).toBe(200);
    //     expect(res.body.success).toBe(true);

    //     // Try awarding same badge again → should fail gracefully
    //     const res2 = await request(app)
    //         .post("/xp/award-badge")
    //         .send({ userId: testUser.id, badgeId: badge.id });

    //     expect(res2.body.success).toBe(false);

    //     await badge.destroy();
    // });

    test("Claim pending XP", async () => {
        await UserXP.update({ pendingXP: 50 }, { where: { user_id: testUser.id } });

        const res = await request(app)
            .post("/claim-xp")
            .send({ userId: testUser.id });

        expect(res.status).toBe(200);
        expect(res.body.data.pendingXP).toBe(0);
    });
});
