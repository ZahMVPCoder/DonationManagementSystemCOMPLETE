// @ts-ignore - Prisma types are generated but TS can't find them
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seed script for DonorHub database
 * Populates database with test data including:
 * - 1 test user account
 * - 6 test donors
 * - 5 test donations
 * - 3 test campaigns
 * - 5 test tasks
 *
 * Run with: npm run prisma:seed
 * Or: npx prisma db seed
 */

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (optional - comment out if you want to preserve data)
  console.log('🗑️  Clearing existing data...');
  await prisma.task.deleteMany({});
  await prisma.donation.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.donor.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Data cleared\n');

  // ============================================================================
  // 1. CREATE TEST USER
  // ============================================================================
  console.log('👤 Creating test user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@donorhub.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });
  console.log(`✅ User created: ${user.email}\n`);

  // ============================================================================
  // 2. CREATE DONORS
  // ============================================================================
  console.log('👥 Creating donors...');
  const donors = await Promise.all([
    prisma.donor.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        status: 'active',
        notes: 'Major donor. Interested in education programs.',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '(555) 234-5678',
        status: 'active',
        notes: 'Monthly recurring donor.',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '(555) 345-6789',
        status: 'new',
        notes: 'First-time donor from holiday campaign.',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'David Thompson',
        email: 'david.t@email.com',
        phone: '(555) 456-7890',
        status: 'lapsed',
        notes: 'Last donation over 1 year ago. Needs follow-up.',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '(555) 567-8901',
        status: 'active',
        notes: 'Legacy donor. Member of planned giving circle.',
      },
    }),
    prisma.donor.create({
      data: {
        name: 'James Wilson',
        email: 'james.w@email.com',
        phone: '(555) 678-9012',
        status: 'active',
        notes: 'Prefers check donations.',
      },
    }),
  ]);
  console.log(`✅ Created ${donors.length} donors\n`);

  // ============================================================================
  // 3. CREATE CAMPAIGNS
  // ============================================================================
  console.log('📢 Creating campaigns...');
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: 'Winter Appeal 2025',
        description: 'Annual winter fundraising campaign to support our community programs.',
        goal: 50000,
        raised: 3750, // Will be calculated dynamically in the app
        startDate: new Date('2025-11-01'),
        endDate: new Date('2026-01-31'),
        status: 'active',
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Spring Gala 2026',
        description: 'Annual gala event and silent auction.',
        goal: 75000,
        raised: 0,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-04-15'),
        status: 'upcoming',
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Summer Education Fund',
        description: 'Scholarship fund for summer educational programs.',
        goal: 30000,
        raised: 32500,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31'),
        status: 'completed',
      },
    }),
  ]);
  console.log(`✅ Created ${campaigns.length} campaigns\n`);

  // ============================================================================
  // 4. CREATE DONATIONS
  // ============================================================================
  console.log('💰 Creating donations...');
  const donations = await Promise.all([
    prisma.donation.create({
      data: {
        amount: 250,
        date: new Date('2026-01-02'),
        method: 'credit_card',
        recurring: true,
        thanked: true,
        notes: 'Monthly recurring donation',
        donorId: donors[1].id, // Michael Chen
        campaignId: campaigns[0].id, // Winter Appeal 2025
      },
    }),
    prisma.donation.create({
      data: {
        amount: 1000,
        date: new Date('2026-01-05'),
        method: 'bank_transfer',
        recurring: false,
        thanked: false,
        notes: 'First donation - needs thank you call',
        donorId: donors[2].id, // Emily Rodriguez
        campaignId: campaigns[0].id, // Winter Appeal 2025
      },
    }),
    prisma.donation.create({
      data: {
        amount: 500,
        date: new Date('2025-12-15'),
        method: 'credit_card',
        recurring: false,
        thanked: true,
        notes: '',
        donorId: donors[0].id, // Sarah Johnson
        campaignId: campaigns[0].id, // Winter Appeal 2025
      },
    }),
    prisma.donation.create({
      data: {
        amount: 2000,
        date: new Date('2025-12-28'),
        method: 'check',
        recurring: false,
        thanked: true,
        notes: 'Year-end contribution',
        donorId: donors[4].id, // Lisa Anderson
        campaignId: campaigns[0].id, // Winter Appeal 2025
      },
    }),
    prisma.donation.create({
      data: {
        amount: 300,
        date: new Date('2025-11-30'),
        method: 'check',
        recurring: false,
        thanked: true,
        notes: 'General fund',
        donorId: donors[5].id, // James Wilson
        campaignId: null, // No specific campaign
      },
    }),
  ]);
  console.log(`✅ Created ${donations.length} donations\n`);

  // ============================================================================
  // 5. CREATE TASKS
  // ============================================================================
  console.log('✅ Creating tasks...');
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        type: 'thank_you',
        description: 'Send thank you letter for first donation',
        dueDate: new Date('2026-01-08'),
        priority: 'high',
        completed: false,
        donorId: donors[2].id, // Emily Rodriguez
      },
    }),
    prisma.task.create({
      data: {
        type: 'follow_up',
        description: 'Follow-up call - lapsed donor outreach',
        dueDate: new Date('2026-01-10'),
        priority: 'medium',
        completed: false,
        donorId: donors[3].id, // David Thompson
      },
    }),
    prisma.task.create({
      data: {
        type: 'call',
        description: 'Quarterly update call with major donor',
        dueDate: new Date('2026-01-15'),
        priority: 'high',
        completed: false,
        donorId: donors[0].id, // Sarah Johnson
      },
    }),
    prisma.task.create({
      data: {
        type: 'email',
        description: 'Send planned giving information packet',
        dueDate: new Date('2026-01-12'),
        priority: 'medium',
        completed: false,
        donorId: donors[4].id, // Lisa Anderson
      },
    }),
    prisma.task.create({
      data: {
        type: 'thank_you',
        description: 'Monthly recurring donor appreciation email',
        dueDate: new Date('2026-01-07'),
        priority: 'low',
        completed: true,
        donorId: donors[1].id, // Michael Chen
      },
    }),
  ]);
  console.log(`✅ Created ${tasks.length} tasks\n`);

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Database seeding completed successfully!\n');
  console.log('📊 Seed Data Summary:');
  console.log(`   • 1 Test User (test@donorhub.com / password123)`);
  console.log(`   • ${donors.length} Donors`);
  console.log(`   • ${donations.length} Donations`);
  console.log(`   • ${campaigns.length} Campaigns`);
  console.log(`   • ${tasks.length} Tasks`);
  console.log('\n🚀 You can now start the application with: npm run dev');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the seed and handle errors
main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
