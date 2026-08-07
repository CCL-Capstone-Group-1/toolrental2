// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Each tool name maps to an ARRAY of images — one per listing occurrence.
// Tools listed by only one person just have a single-item array.
// Tools listed by two people get two different photos so listings don't
// look identical. Confirmed real Pexels photos where found; placeholders
// (with distinguishing labels) where no clean product photo exists.
const toolImageSets = {
  "Cordless Drill/Driver Combo": [
    "https://images.pexels.com/photos/1249610/pexels-photo-1249610.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/6790808/pexels-photo-6790808.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Circular Saw": [
    "https://images.pexels.com/photos/8820180/pexels-photo-8820180.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Table Saw": [
    "https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/10316634/pexels-photo-10316634.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Router": [
    "https://placehold.co/800x600?text=Router+%231",
    "https://placehold.co/800x600?text=Router+%232",
  ],
  "Air Compressor": [
    "https://placehold.co/800x600?text=Air+Compressor+%231",
    "https://placehold.co/800x600?text=Air+Compressor+%232",
  ],
  "Miter Saw": [
    "https://images.pexels.com/photos/8447855/pexels-photo-8447855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Socket Set": [
    "https://images.pexels.com/photos/4792482/pexels-photo-4792482.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/5210901/pexels-photo-5210901.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Claw Hammer": [
    "https://images.pexels.com/photos/5974343/pexels-photo-5974343.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/5974413/pexels-photo-5974413.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Pipe Wrench": [
    "https://placehold.co/800x600?text=Pipe+Wrench+%231",
    "https://placehold.co/800x600?text=Pipe+Wrench+%232",
  ],
  "Adjustable Wrench Set": [
    "https://placehold.co/800x600?text=Adjustable+Wrench+Set",
  ],
  "4ft Level": [
    "https://placehold.co/800x600?text=4ft+Level",
  ],
  "Pry Bar": [
    "https://placehold.co/800x600?text=Pry+Bar",
  ],
  "Tape Measure": [
    "https://images.pexels.com/photos/30413398/pexels-photo-30413398.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Push Lawn Mower": [
    "https://images.pexels.com/photos/4162016/pexels-photo-4162016.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/11364122/pexels-photo-11364122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Leaf Blower": [
    "https://images.pexels.com/photos/1623214/pexels-photo-1623214.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "String Trimmer": [
    "https://placehold.co/800x600?text=String+Trimmer",
  ],
  "Pressure Washer": [
    "https://placehold.co/800x600?text=Pressure+Washer+%231",
    "https://placehold.co/800x600?text=Pressure+Washer+%232",
  ],
  "Chainsaw": [
    "https://images.pexels.com/photos/8820192/pexels-photo-8820192.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  ],
  "Aerator": [
    "https://placehold.co/800x600?text=Aerator",
  ],
  "Snow Blower": [
    "https://placehold.co/800x600?text=Snow+Blower",
  ],
  "Tiller/Cultivator": [
    "https://placehold.co/800x600?text=Tiller+Cultivator",
  ],
};

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
  // Tracks how many times each tool name has been listed so far, so the
  // 2nd occurrence gets a different image than the 1st.
  const toolOccurrence = {};

  async function getOrCreateTool(name, category) {
    if (toolCache[name]) return toolCache[name];

    let tool = await prisma.tool.findFirst({ where: { name } });
    if (!tool) {
      const images = toolImageSets[name] || [];
      tool = await prisma.tool.create({
        data: {
          name,
          category,
          imageUrl: images[0] || null, // Tool record keeps a default/reference image
        },
      });
    }
    toolCache[name] = tool;
    return tool;
  }

  function nextImageFor(name) {
    const images = toolImageSets[name] || [];
    if (images.length === 0) return null;
    const index = toolOccurrence[name] || 0;
    toolOccurrence[name] = index + 1;
    // If there are more listings than images available, loop back around
    return images[index % images.length];
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
      const listingImage = nextImageFor(item.name);

      await prisma.listing.create({
        data: {
          toolId: tool.id,
          ownerId: user.id,
          price: item.price,
          imageUrl: listingImage,
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
  