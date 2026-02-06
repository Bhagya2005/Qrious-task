import "dotenv/config";
import { DataSource } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "../users/users.entity";
import { Role } from "../roles/role.entity";
import { Permission } from "../permissions/permission.entity";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Role, Permission],
  synchronize: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();

    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);

    let adminRole = await roleRepo.findOne({ where: { name: "Admin" } });
    if (!adminRole) {
      adminRole = roleRepo.create({ name: "Admin", permissions: [] });
      await roleRepo.save(adminRole);
    }

    let userRole = await roleRepo.findOne({ where: { name: "User" } });
    if (!userRole) {
      userRole = roleRepo.create({ name: "User", permissions: [] });
      await roleRepo.save(userRole);
    }

    let adminUser = await userRepo.findOne({ where: { email: "admin@example.com" } });
    if (!adminUser) {
      adminUser = userRepo.create({
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: adminRole,
      });
      await userRepo.save(adminUser);
    }

    let normalUser = await userRepo.findOne({ where: { email: "user@example.com" } });
    if (!normalUser) {
      normalUser = userRepo.create({
        name: "Normal User",
        email: "user@example.com",
        password: await bcrypt.hash("user123", 10),
        role: userRole,
      });
      await userRepo.save(normalUser);
    }

    console.log("DATABASE SEED COMPLETED SUCCESSFULLY");
    process.exit(0);
  } catch (error) {
    console.error("SEED FAILED", error);
    process.exit(1);
  }
}

seed();
