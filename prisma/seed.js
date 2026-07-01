/* eslint-disable @typescript-eslint/no-require-imports */
// Stellarium seed script — run with: bun run seed
const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

// Planet dataset for the 3D solar system.
// visualRadius / orbitRadius are in scene units (not to scale — tuned for beauty).
const planets = [
  {
    slug: 'sun',
    name: 'Sun',
    type: 'star',
    color: '#ffcf5c',
    emissive: '#ff8a00',
    visualRadius: 2.6,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.05,
    ringInner: null,
    ringOuter: null,
    ringColor: null,
    diameterKm: '1,392,700 km',
    distanceAu: '—',
    dayLength: '25–35 Earth days',
    yearLength: '—',
    temperatureC: '5,500 °C (surface)',
    moonCount: 0,
    gravity: '274 m/s²',
    description:
      'The Sun is the star at the center of our Solar System. A nearly perfect ball of hot plasma, it is by far the most important source of energy for life on Earth.',
    funFact:
      'The Sun accounts for about 99.86% of the total mass of the Solar System.',
    composition: 'Hydrogen (~73%), Helium (~25%), trace heavier elements',
  },
  {
    slug: 'mercury',
    name: 'Mercury',
    type: 'planet',
    color: '#a9a29b',
    emissive: '#000000',
    visualRadius: 0.38,
    orbitRadius: 5,
    orbitSpeed: 0.48,
    rotationSpeed: 0.12,
    ringInner: null,
    ringOuter: null,
    ringColor: null,
    diameterKm: '4,879 km',
    distanceAu: '0.39 AU',
    dayLength: '1,408 hours',
    yearLength: '88 Earth days',
    temperatureC: '-173 to 427 °C',
    moonCount: 0,
    gravity: '3.7 m/s²',
    description:
      'Mercury is the smallest planet in the Solar System and the closest to the Sun. Its surface resembles the Moon, with extensive cratering and ancient lava flows.',
    funFact:
      'A year on Mercury is just 88 Earth days — but a single day lasts 176 Earth days!',
    composition: 'Large iron core, silicate mantle and crust',
  },
  {
    slug: 'venus',
    name: 'Venus',
    type: 'planet',
    color: '#e8c285',
    emissive: '#3a2a10',
    visualRadius: 0.62,
    orbitRadius: 7.2,
    orbitSpeed: 0.35,
    rotationSpeed: -0.05,
    ringInner: null,
    ringOuter: null,
    ringColor: null,
    diameterKm: '12,104 km',
    distanceAu: '0.72 AU',
    dayLength: '5,832 hours',
    yearLength: '225 Earth days',
    temperatureC: '464 °C (avg)',
    moonCount: 0,
    gravity: '8.87 m/s²',
    description:
      'Venus is the second planet from the Sun and the hottest in the Solar System. A runaway greenhouse effect traps heat beneath thick clouds of sulfuric acid.',
    funFact:
      'Venus spins backwards! The Sun rises in the west and sets in the east.',
    composition: 'Iron core, silicate mantle, dense CO₂ atmosphere',
  },
  {
    slug: 'earth',
    name: 'Earth',
    type: 'planet',
    color: '#3b82f6',
    emissive: '#0b1f3a',
    visualRadius: 0.65,
    orbitRadius: 9.6,
    orbitSpeed: 0.29,
    rotationSpeed: 0.5,
    ringInner: null,
    ringOuter: null,
    ringColor: null,
    diameterKm: '12,742 km',
    distanceAu: '1.00 AU',
    dayLength: '24 hours',
    yearLength: '365.25 days',
    temperatureC: '-88 to 58 °C',
    moonCount: 1,
    gravity: '9.81 m/s²',
    description:
      'Earth is the third planet from the Sun and the only known place in the universe to harbor life. Liquid water covers 71% of its surface.',
    funFact:
      'Earth is the densest planet in the Solar System — and the only one not named after a Roman or Greek god.',
    composition: 'Iron-nickel core, silicate mantle, nitrogen-oxygen atmosphere',
  },
  {
    slug: 'mars',
    name: 'Mars',
    type: 'planet',
    color: '#c1440e',
    emissive: '#2a0a04',
    visualRadius: 0.5,
    orbitRadius: 12.4,
    orbitSpeed: 0.24,
    rotationSpeed: 0.48,
    ringInner: null,
    ringOuter: null,
    ringColor: null,
    diameterKm: '6,779 km',
    distanceAu: '1.52 AU',
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    temperatureC: '-153 to 20 °C',
    moonCount: 2,
    gravity: '3.71 m/s²',
    description:
      'Mars, the Red Planet, is the fourth from the Sun. Its color comes from iron oxide (rust) on its surface. It hosts the tallest volcano and deepest canyon in the Solar System.',
    funFact:
      'Olympus Mons on Mars is nearly 3x the height of Mount Everest — the tallest volcano in the Solar System.',
    composition: 'Iron core, basaltic crust, thin CO₂ atmosphere',
  },
  {
    slug: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    color: '#d8a47f',
    emissive: '#2a1a10',
    visualRadius: 1.6,
    orbitRadius: 16.5,
    orbitSpeed: 0.13,
    rotationSpeed: 1.2,
    ringInner: null,
    ringOuter: null,
    ringColor: null,
    diameterKm: '139,820 km',
    distanceAu: '5.20 AU',
    dayLength: '9.9 hours',
    yearLength: '11.9 Earth years',
    temperatureC: '-108 °C (cloud tops)',
    moonCount: 95,
    gravity: '24.79 m/s²',
    description:
      'Jupiter is the largest planet — a gas giant more than twice the mass of all other planets combined. The Great Red Spot is a storm that has raged for centuries.',
    funFact:
      "Jupiter's Great Red Spot is a storm larger than Earth that has been spinning for at least 350 years.",
    composition: 'Hydrogen, helium, metallic hydrogen core',
  },
  {
    slug: 'saturn',
    name: 'Saturn',
    type: 'planet',
    color: '#e3c78b',
    emissive: '#2a2010',
    visualRadius: 1.35,
    orbitRadius: 21,
    orbitSpeed: 0.097,
    rotationSpeed: 1.1,
    ringInner: 1.9,
    ringOuter: 3.2,
    ringColor: '#d9c89b',
    diameterKm: '116,460 km',
    distanceAu: '9.54 AU',
    dayLength: '10.7 hours',
    yearLength: '29.4 Earth years',
    temperatureC: '-139 °C (cloud tops)',
    moonCount: 146,
    gravity: '10.44 m/s²',
    description:
      'Saturn is the sixth planet, famous for its spectacular ring system made of ice and rock. It is a gas giant so light it would float in water.',
    funFact:
      'Saturn is so low in density that it would float in a giant bathtub — if you could find one big enough.',
    composition: 'Hydrogen, helium, icy ring particles',
  },
  {
    slug: 'uranus',
    name: 'Uranus',
    type: 'planet',
    color: '#7dd3fc',
    emissive: '#0a2030',
    visualRadius: 1.0,
    orbitRadius: 25.5,
    orbitSpeed: 0.068,
    rotationSpeed: -0.7,
    ringInner: 1.4,
    ringOuter: 1.8,
    ringColor: '#5a8aa0',
    diameterKm: '50,724 km',
    distanceAu: '19.2 AU',
    dayLength: '17.2 hours',
    yearLength: '84 Earth years',
    temperatureC: '-197 °C (avg)',
    moonCount: 27,
    gravity: '8.69 m/s²',
    description:
      'Uranus is the seventh planet, an ice giant that rotates on its side — likely knocked over by an ancient collision. Methane gives it a pale cyan hue.',
    funFact:
      "Uranus is tilted 98° — it essentially rolls around the Sun on its side.",
    composition: 'Water, methane, ammonia ices, hydrogen-helium atmosphere',
  },
  {
    slug: 'neptune',
    name: 'Neptune',
    type: 'planet',
    color: '#3b5bdb',
    emissive: '#0a1240',
    visualRadius: 0.98,
    orbitRadius: 29.5,
    orbitSpeed: 0.054,
    rotationSpeed: 0.67,
    ringInner: null,
    ringOuter: null,
    ringColor: null,
    diameterKm: '49,244 km',
    distanceAu: '30.06 AU',
    dayLength: '16.1 hours',
    yearLength: '164.8 Earth years',
    temperatureC: '-201 °C (avg)',
    moonCount: 14,
    gravity: '11.15 m/s²',
    description:
      'Neptune is the eighth and most distant planet — a frigid ice giant with the strongest winds in the Solar System, reaching 2,100 km/h.',
    funFact:
      'Neptune has the fastest winds in the Solar System — over 5x the speed of the strongest hurricane on Earth.',
    composition: 'Water, methane, ammonia ices, hydrogen-helium atmosphere',
  },
]

const quizQuestions = [
  {
    planetSlug: 'sun',
    question: 'What percentage of the Solar System\'s mass does the Sun contain?',
    options: ['About 50%', 'About 75%', 'About 99.86%', 'About 90%'],
    correctIndex: 2,
    explanation: 'The Sun is overwhelmingly massive — it contains roughly 99.86% of all the mass in the Solar System.',
  },
  {
    planetSlug: 'mercury',
    question: 'How long is a year on Mercury?',
    options: ['88 Earth days', '365 Earth days', '30 Earth days', '687 Earth days'],
    correctIndex: 0,
    explanation: 'Mercury whips around the Sun in just 88 Earth days, the shortest year of any planet.',
  },
  {
    planetSlug: 'venus',
    question: 'Why is Venus the hottest planet in the Solar System?',
    options: [
      'It is closest to the Sun',
      'A runaway greenhouse effect traps heat',
      'It has active volcanoes everywhere',
      'Its core is extremely hot',
    ],
    correctIndex: 1,
    explanation: 'Even though Mercury is closer to the Sun, Venus is hotter due to its thick CO₂ atmosphere creating a runaway greenhouse effect.',
  },
  {
    planetSlug: 'earth',
    question: 'What makes Earth unique in the known universe?',
    options: [
      'It has the most moons',
      'It is the largest planet',
      'It is the only known place to harbor life',
      'It has the strongest gravity',
    ],
    correctIndex: 2,
    explanation: 'Earth is the only place in the universe confirmed to harbor life, thanks to liquid water and a protective atmosphere.',
  },
  {
    planetSlug: 'mars',
    question: 'Olympus Mons on Mars is the tallest what in the Solar System?',
    options: ['Mountain', 'Volcano', 'Canyon', 'Cliff'],
    correctIndex: 1,
    explanation: 'Olympus Mons is a shield volcano standing ~22 km tall — nearly three times the height of Mount Everest.',
  },
  {
    planetSlug: 'jupiter',
    question: 'What is Jupiter\'s Great Red Spot?',
    options: [
      'A giant crater',
      'A volcano',
      'A centuries-old storm',
      'A frozen lake',
    ],
    correctIndex: 2,
    explanation: 'The Great Red Spot is a massive anticyclonic storm that has been observed for at least 350 years.',
  },
  {
    planetSlug: 'saturn',
    question: 'What are Saturn\'s rings mostly made of?',
    options: [
      'Solid metal',
      'Ice and rock particles',
      'Gas clouds',
      'Dust from comets only',
    ],
    correctIndex: 1,
    explanation: 'Saturn\'s rings are composed of countless particles of water ice and rock, ranging in size from grains to mountains.',
  },
  {
    planetSlug: 'uranus',
    question: 'Why is Uranus unusual among the planets?',
    options: [
      'It has no atmosphere',
      'It rotates on its side',
      'It is the hottest planet',
      'It has no moons',
    ],
    correctIndex: 1,
    explanation: 'Uranus is tilted about 98°, so it essentially rolls around the Sun on its side — likely the result of an ancient collision.',
  },
  {
    planetSlug: 'neptune',
    question: 'Neptune holds which Solar System record?',
    options: [
      'Strongest winds',
      'Most moons',
      'Hottest surface',
      'Largest size',
    ],
    correctIndex: 0,
    explanation: 'Neptune has the fastest winds in the Solar System — up to 2,100 km/h, over 5x the strongest hurricane on Earth.',
  },
  {
    planetSlug: null,
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctIndex: 1,
    explanation: 'Mars is called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance.',
  },
  {
    planetSlug: null,
    question: 'Which is the largest planet in the Solar System?',
    options: ['Saturn', 'Earth', 'Jupiter', 'Neptune'],
    correctIndex: 2,
    explanation: 'Jupiter is the largest planet — more than twice the mass of all other planets combined.',
  },
  {
    planetSlug: null,
    question: 'Which planet would float in water (if you had a big enough bathtub)?',
    options: ['Mercury', 'Earth', 'Saturn', 'Mars'],
    correctIndex: 2,
    explanation: 'Saturn\'s density is lower than water, so it would float — in theory — in a sufficiently large body of water.',
  },
]

async function main() {
  console.log('🌱 Seeding Stellarium database...')

  // Wipe existing rows so the script is idempotent.
  await db.note.deleteMany()
  await db.quizScore.deleteMany()
  await db.favorite.deleteMany()
  await db.quizQuestion.deleteMany()
  await db.planet.deleteMany()
  await db.explorer.deleteMany()

  // Planets
  for (const p of planets) {
    await db.planet.create({
      data: {
        ...p,
        ringInner: p.ringInner ?? null,
        ringOuter: p.ringOuter ?? null,
        ringColor: p.ringColor ?? null,
      },
    })
  }
  console.log(`  ✓ Inserted ${planets.length} celestial bodies`)

  // Quiz questions (options stored as JSON string because SQLite has no array type)
  for (const q of quizQuestions) {
    await db.quizQuestion.create({
      data: {
        planetSlug: q.planetSlug,
        question: q.question,
        options: JSON.stringify(q.options),
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      },
    })
  }
  console.log(`  ✓ Inserted ${quizQuestions.length} quiz questions`)

  // A demo explorer so the leaderboard isn't empty on first load
  await db.explorer.create({
    data: {
      handle: 'cosmonaut',
      name: 'Demo Cosmonaut',
      avatarColor: '#f0abfc',
    },
  })
  console.log('  ✓ Inserted demo explorer')

  console.log('🌱 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
