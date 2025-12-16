require("dotenv").config({ path: [".env"] });
const { faker } = require("@faker-js/faker");
const sequelize = require("../config/database");
const { User, ProgressLog } = require("../models/index");

async function generateData() {
  try {
    // 1. Create a User
    const user = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "$2a$10$hashedpasswordhere",
      isEmailVerified: true,
    });

    for (var i = 0; i < 1000; i++) {
      // 2. Create a single ProgressLog for the user
      await ProgressLog.create({
        user_id: user.id,
        date: faker.date.between({ from: "2000-01-01", to: Date.now() }),
        tasks_completed: faker.number.int({ min: 0, max: 10 }),
        focus_time: 10,
        steak: faker.number.int({ min: 0, max: 10 }),
        xp_earned: 1,
      });
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function main() {
  try {
    await sequelize.sync({ force: true });
    console.log("Connection has been established successfully.");

    await generateData(); // Generate the user and progress log data
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

main();
