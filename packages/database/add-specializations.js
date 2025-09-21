const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
    }
  }
});

async function addSpecializationsColumn() {
  try {
    console.log('Adding specializations column to teachers table...');

    // Check if column exists first
    const result = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'teachers'
      AND column_name = 'specializations'
    `;

    if (result.length === 0) {
      // Add the column using raw SQL
      await prisma.$executeRaw`
        ALTER TABLE "teachers"
        ADD COLUMN "specializations" TEXT[] DEFAULT ARRAY['blues']
      `;

      // Create index
      await prisma.$executeRaw`
        CREATE INDEX "idx_teachers_specializations"
        ON "teachers" USING GIN ("specializations")
      `;

      console.log('✅ Added specializations column successfully');
    } else {
      console.log('✅ specializations column already exists');
    }

    // Verify by testing a query
    const teachers = await prisma.teacher.findMany({
      take: 2,
      select: {
        id: true,
        name: true,
        specializations: true
      }
    });

    console.log(`✅ Successfully queried ${teachers.length} teachers`);
    teachers.forEach(teacher => {
      console.log(`- ${teacher.name}: ${JSON.stringify(teacher.specializations)}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'P2022') {
      console.log('Column does not exist in database - need to add it');
    }
  } finally {
    await prisma.$disconnect();
  }
}

addSpecializationsColumn();