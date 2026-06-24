import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with sample data...')

  const sampleData = [
    { imageUrl: '/uploads/sample1.jpg', itemType: 'cardboard',       condition: 'intact',       confidence: 92, hazard: false, action: 'reuse',         recommendation: 'Can be used as school project material or handicraft base' },
    { imageUrl: '/uploads/sample2.jpg', itemType: 'plastic_bottle',  condition: 'dirty',        confidence: 88, hazard: false, action: 'reuse',         recommendation: 'Wash thoroughly with soap and water before reusing as a container' },
    { imageUrl: '/uploads/sample3.jpg', itemType: 'paper',           condition: 'usable',       confidence: 95, hazard: false, action: 'reuse',         recommendation: 'Use the blank side for drafts, note-taking, or art projects' },
    { imageUrl: '/uploads/sample4.jpg', itemType: 'metal_can',       condition: 'intact',       confidence: 90, hazard: false, action: 'reuse',         recommendation: 'Clean and repurpose as a pencil holder, plant pot, or storage container' },
    { imageUrl: '/uploads/sample5.jpg', itemType: 'cable',           condition: 'minor_damage', confidence: 75, hazard: true,  action: 'manual_review', recommendation: 'This item has been flagged as potentially hazardous. Do not reuse without professional inspection.' },
    { imageUrl: '/uploads/sample6.jpg', itemType: 'stationery',      condition: 'intact',       confidence: 93, hazard: false, action: 'donate',        recommendation: 'Donate to underprivileged students or community learning centers' },
    { imageUrl: '/uploads/sample7.jpg', itemType: 'food_container',  condition: 'dirty',        confidence: 85, hazard: false, action: 'reuse',         recommendation: 'Wash thoroughly with hot soapy water before reusing' },
    { imageUrl: '/uploads/sample8.jpg', itemType: 'cardboard',       condition: 'minor_damage', confidence: 80, hazard: false, action: 'reuse',         recommendation: 'Trim damaged sections; remainder can be used for packaging or art projects' },
    { imageUrl: '/uploads/sample9.jpg', itemType: 'plastic_bottle',  condition: 'intact',       confidence: 97, hazard: false, action: 'reuse',         recommendation: 'Can be reused as a water container or for school science experiments' },
    { imageUrl: '/uploads/sample10.jpg',itemType: 'paper',           condition: 'dirty',        confidence: 89, hazard: false, action: 'dispose',       recommendation: 'Place in paper recycling bin for proper recycling' },
    { imageUrl: '/uploads/sample11.jpg',itemType: 'metal_can',       condition: 'minor_damage', confidence: 72, hazard: false, action: 'dismantle',     recommendation: 'Flatten and send to metal recycling facility' },
    { imageUrl: '/uploads/sample12.jpg',itemType: 'stationery',      condition: 'usable',       confidence: 91, hazard: false, action: 'donate',        recommendation: 'Collect with other stationery for donation drives' },
    { imageUrl: '/uploads/sample13.jpg',itemType: 'food_container',  condition: 'intact',       confidence: 94, hazard: false, action: 'reuse',         recommendation: 'Wash and sanitize; can be reused for food storage or as a supply organizer' },
    { imageUrl: '/uploads/sample14.jpg',itemType: 'cable',           condition: 'intact',       confidence: 86, hazard: false, action: 'reuse',         recommendation: 'Test functionality; working cables can be donated to school lab or reused' },
    { imageUrl: '/uploads/sample15.jpg',itemType: 'cardboard',       condition: 'usable',       confidence: 88, hazard: false, action: 'reuse',         recommendation: 'Can be used as school project material or handicraft base' },
  ]

  for (const item of sampleData) {
    await prisma.prediction.upsert({
      where: { id: sampleData.indexOf(item) + 1 },
      update: {},
      create: item,
    })
  }

  console.log(`✅ Seeded ${sampleData.length} sample predictions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
