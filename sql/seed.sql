// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ------------------------------------------------------------
// 15 seed users across Power Tools, Hand Tools, and Yard Tools,
// each with 2 listings appropriate for Central Ohio (30 total).
// First names only (fun cohort-flavored placeholders) — no
// fabricated age or personal details attached to real people.
// Image URLs are left blank (null) — add them later.
// ------------------------------------------------------------

const people = [
  // ---------------- POWER TOOLS ----------------
  {
    name: "Kendall",
    email: "kendall@example.com",
    category: "Power Tools",
    tools: [
      { name: "Cordless Drill/Driver Combo", price: 8 },
      { name: "Circular Saw", price: 12 },
    ],
  },
  {
    name: "Miguel",
    email: "miguel@example.com",
    category: "Power Tools",
    tools: [
      { name: "Table Saw", price: 18 },
      { name: "Router", price: 9 },
    ],
  },
  {
    name: "Joy",
    email: "joy@example.com",
    category: "Power Tools",
    tools: [
      { name: "Air Compressor", price: 14 },
      { name: "Cordless Drill/Driver Combo", price: 8 },
    ],
  },
  {
    name: "Dennis",
    email: "dennis@example.com",
    category: "Power Tools",
    tools: [
      { name: "Miter Saw", price: 15 },
      { name: "Router", price: 9 },
    ],
  },
  {
    name: "Stokley",
    email: "stokley@example.com",
    category: "Power Tools",
    tools: [
      { name: "Table Saw", price: 18 },
      { name: "Air Compressor", price: 14 },
    ],
  },

  // ---------------- HAND TOOLS ----------------
  {
    name: "Kdusan",
    email: "kdusan@example.com",
    category: "Hand Tools",
    tools: [
      { name: "Socket Set", price: 6 },
      { name: "Claw Hammer", price: 3 },
    ],
  },
  {
    name: "Michelle",
    email: "michelle@example.com",
    category: "Hand Tools",
    tools: [
      { name: "Pipe Wrench", price: 5 },
      { name: "Adjustable Wrench Set", price: 6 },
    ],
  },
  {
    name: "Rojika",
    email: "rojika@example.com",
    category: "Hand Tools",
    tools: [
      { name: "Socket Set", price: 6 },
      { name: "4ft Level", price: 5 },
    ],
  },
  {
    name: "Barbra",
    email: "barbra@example.com",
    category: "Hand Tools",
    tools: [
      { name: "Pry Bar", price: 4 },
      { name: "Pipe Wrench", price: 5 },
    ],
  },
  {
    name: "Bruce",
    email: "bruce@example.com",
    category: "Hand Tools",
    tools: [
      { name: "Claw Hammer", price: 3 },
      { name: "Tape Measure", price: 2 },
    ],
  },

  // ---------------- YARD TOOLS ----------------
  {
    name: "Shahem",
    email: "shahem@example.com",
    category: "Yard Tools",
    tools: [
      { name: "Push Lawn Mower", price: 20 },
      { name: "Leaf Blower", price: 12 },
    ],
  },
  {
    name: "Juan",
    email: "juan@example.com",
    category: "Yard Tools",
    tools: [
      { name: "String Trimmer", price: 10 },
      { name: "Pressure Washer", price: 22 },
    ],
  },
  {
    name: "Jordan",
    email: "jordan@example.com",
    category: "Yard Tools",
    tools: [
      { name: "Chainsaw", price: 18 },
      { name: "Push Lawn Mower", price: 20 },
    ],
  },
  {
    name: "Max",
    email: "max@example.com",
    category: "Yard Tools",
    tools: [
      { name: "Pressure Washer", price: 22 },
      { name: "Aerator", price: 20 },
    ],
  },
  {
    name: "Helen",
    email: "helen@example.com",
    category: "Yard Tools",
    tools: [
      { name: "Snow Blower", price: 25 },
      { name: "Tiller/Cultivator", price: 24 },
    ],
  },
];

async function main() {
  console.log("Seeding users, tools, and listings...");

  // Cache of already-created Tool rows, keyed by name, so the same
  // tool type (e.g. "Circular Saw") is reused across multiple owners
  // instead of creating duplicate Tool rows.
  const toolCache = {};

  async function getOrCreateTool(name, category) {
    if (toolCache[name]) return toolCache[name];

    let tool = await prisma.tool.findFirst({ where: { name } });
    if (!tool) {
      tool = await prisma.tool.create({
        data: {
          name,
          category,
          imageUrl: null, // add later
        },
      });
    }
    toolCache[name] = tool;
    return tool;
  }

  for (const person of people) {
    const user = await prisma.user.create({
      data: {
        name: person.name,
        email: person.email,
      },
    });

    for (const item of person.tools) {
      const tool = await getOrCreateTool(item.name, person.category);

      await prisma.listing.create({
        data: {
          toolId: tool.id,
          ownerId: user.id,
          price: item.price,
          available: true,
        },
      });
    }

    console.log(`Created ${person.name} with ${person.tools.length} listings`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  