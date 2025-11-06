const { faker } = require("@faker-js/faker");
const sequelize = require("../config/database");
const {
  User,
  UserXP,
  ProgressLog,
  PomodoroSession,
  Task,
} = require("../models/index");

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Connection failed:", err));

// Sync models with database (use alter instead of force to avoid data loss)
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Models synced"))
  .catch((err) => console.error("❌ Sync error:", err));

async function generateData() {
  try {
    for (let i = 1; i <= 20; i++) {
      // 1. Create a User
      const user = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "$2a$10$hashedpasswordhere",
        isEmailVerified: true,
      });

      // 2. Create a Task for that user
      const task = await Task.create({
        user_id: user.id,
        title: faker.lorem.words(3),
        focus_time: faker.number.int({ min: 20, max: 60 }),
        status: "todo",
      });

      // 3. Create a PomodoroSession
      const startDate = new Date(Date.parse("2025-10-31"));
      const duration = faker.number.int({ min: 20, max: 60 });
      const endDate = new Date(startDate.getTime() + duration * 60000);
      const completed = faker.datatype.boolean();
      const xp = completed ? faker.number.int({ min: 5, max: 15 }) : 0;

      await PomodoroSession.create({
        user_id: user.id,
        task_id: task.id,
        start_time: startDate,
        end_time: endDate,
        duration,
        completed,
        xp_earned: xp,
      });

      // 4. Create a single ProgressLog for the user
      await ProgressLog.create({
        userId: user.id,
        date: new Date(),
        tasks_completed: 1,
        focus_time: duration,
        steak: faker.number.int({ min: 0, max: 10 }),
        xp_earned: xp,
      });

      // 5. Create a UserXP for the user
      await UserXP.create({
        userId: user.id,
        level: faker.number.int({ min: 1, max: 100 }),
        currentStreak: faker.number.int({ min: 1, max: 100 }),
        lastActiveDate: new Date(Date.parse("2025-10-31")),
      });

      console.log(`Generated user ${i}: ${user.name}`);
    }

    console.log("✅ 20 users with tasks and PomodoroSessions generated!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

generateData();
