import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.book.count();
  console.log("Total arsip di DB:", count);

  const sample = await prisma.book.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { title: true, year: true, category: true, status: true },
  });
  console.log("Sample (5 terbaru):");
  sample.forEach((b, i) =>
    console.log(`  [${i + 1}] ${b.year} | ${b.category} | ${b.status} | ${b.title}`)
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
