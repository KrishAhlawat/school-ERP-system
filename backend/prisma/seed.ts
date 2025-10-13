import { PrismaClient, UserRole, Gender, ExamType, FeeType, AttendanceStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create demo schools
  const school1 = await prisma.school.create({
    data: {
      name: 'दिल्ली पब्लिक स्कूल',
      domain: 'dps.yourapp.com',
      address: '123 एजुकेशन स्ट्रीट, नई दिल्ली - 110001',
      phone: '+91-11-23456789',
      email: 'info@dps.com',
      principalName: 'डॉ. राजेश कुमार',
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#06b6d4',
        fontFamily: 'Inter',
      },
    },
  })

  const school2 = await prisma.school.create({
    data: {
      name: 'मॉडर्न स्कूल',
      domain: 'modern.yourapp.com',
      address: '456 नॉलेज एवेन्यू, मुंबई - 400001',
      phone: '+91-22-98765432',
      email: 'contact@modernschool.com',
      principalName: 'श्रीमती प्रिया शर्मा',
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#6b7280',
        accentColor: '#f59e0b',
        fontFamily: 'Inter',
      },
    },
  })

  console.log('✅ Schools created')

  // Create admin users
  const admin1Password = await bcrypt.hash('admin123', 12)
  const admin1 = await prisma.user.create({
    data: {
      name: 'डॉ. राजेश कुमार',
      email: 'admin@dps.com',
      password: admin1Password,
      role: UserRole.ADMIN,
      schoolId: school1.id,
    },
  })

  const admin2Password = await bcrypt.hash('admin123', 12)
  const admin2 = await prisma.user.create({
    data: {
      name: 'श्रीमती प्रिया शर्मा',
      email: 'admin@modernschool.com',
      password: admin2Password,
      role: UserRole.ADMIN,
      schoolId: school2.id,
    },
  })

  console.log('✅ Admin users created')

  // Create teachers
  const teacher1Password = await bcrypt.hash('teacher123', 12)
  const teacher1 = await prisma.user.create({
    data: {
      name: 'अमित कुमार',
      email: 'amit@dps.com',
      password: teacher1Password,
      role: UserRole.TEACHER,
      schoolId: school1.id,
    },
  })

  await prisma.teacher.create({
    data: {
      name: 'अमित कुमार',
      employeeId: 'T001',
      subjects: ['Mathematics', 'Physics'],
      schoolId: school1.id,
      userId: teacher1.id,
      qualification: 'M.Sc Mathematics',
      experience: 5,
      phone: '+91-9876543210',
      email: 'amit@dps.com',
      address: '789 टीचर कोलोनी, नई दिल्ली',
      joiningDate: new Date('2020-06-01'),
    },
  })

  const teacher2Password = await bcrypt.hash('teacher123', 12)
  const teacher2 = await prisma.user.create({
    data: {
      name: 'सुनीता देवी',
      email: 'sunita@modernschool.com',
      password: teacher2Password,
      role: UserRole.TEACHER,
      schoolId: school2.id,
    },
  })

  await prisma.teacher.create({
    data: {
      name: 'सुनीता देवी',
      employeeId: 'T002',
      subjects: ['Hindi', 'English'],
      schoolId: school2.id,
      userId: teacher2.id,
      qualification: 'M.A Hindi',
      experience: 8,
      phone: '+91-9876543211',
      email: 'sunita@modernschool.com',
      address: '321 एजुकेशन नगर, मुंबई',
      joiningDate: new Date('2018-04-01'),
    },
  })

  console.log('✅ Teachers created')

  // Create parents
  const parent1 = await prisma.parent.create({
    data: {
      name: 'राम सिंह',
      email: 'ram.singh@email.com',
      phone: '+91-9876543212',
      address: '111 पैरेंट सोसाइटी, नई दिल्ली',
      schoolId: school1.id,
    },
  })

  const parent1Password = await bcrypt.hash('parent123', 12)
  await prisma.user.create({
    data: {
      name: 'राम सिंह',
      email: 'ram.singh@email.com',
      password: parent1Password,
      role: UserRole.PARENT,
      schoolId: school1.id,
    },
  })

  const parent2 = await prisma.parent.create({
    data: {
      name: 'गीता शर्मा',
      email: 'geeta.sharma@email.com',
      phone: '+91-9876543213',
      address: '222 फैमिली कॉलोनी, मुंबई',
      schoolId: school2.id,
    },
  })

  const parent2Password = await bcrypt.hash('parent123', 12)
  await prisma.user.create({
    data: {
      name: 'गीता शर्मा',
      email: 'geeta.sharma@email.com',
      password: parent2Password,
      role: UserRole.PARENT,
      schoolId: school2.id,
    },
  })

  console.log('✅ Parents created')

  // Create students
  const student1Password = await bcrypt.hash('student123', 12)
  const student1 = await prisma.user.create({
    data: {
      name: 'राहुल सिंह',
      email: 'rahul.singh@dps.com',
      password: student1Password,
      role: UserRole.STUDENT,
      schoolId: school1.id,
    },
  })

  await prisma.student.create({
    data: {
      name: 'राहुल सिंह',
      rollNumber: 'S001',
      class: '10',
      section: 'A',
      parentId: parent1.id,
      schoolId: school1.id,
      userId: student1.id,
      dateOfBirth: new Date('2008-05-15'),
      gender: Gender.MALE,
      address: '111 पैरेंट सोसाइटी, नई दिल्ली',
      phone: '+91-9876543214',
      email: 'rahul.singh@dps.com',
      admissionDate: new Date('2023-04-01'),
    },
  })

  const student2Password = await bcrypt.hash('student123', 12)
  const student2 = await prisma.user.create({
    data: {
      name: 'प्रिया शर्मा',
      email: 'priya.sharma@modernschool.com',
      password: student2Password,
      role: UserRole.STUDENT,
      schoolId: school2.id,
    },
  })

  await prisma.student.create({
    data: {
      name: 'प्रिया शर्मा',
      rollNumber: 'S002',
      class: '9',
      section: 'B',
      parentId: parent2.id,
      schoolId: school2.id,
      userId: student2.id,
      dateOfBirth: new Date('2009-08-20'),
      gender: Gender.FEMALE,
      address: '222 फैमिली कॉलोनी, मुंबई',
      phone: '+91-9876543215',
      email: 'priya.sharma@modernschool.com',
      admissionDate: new Date('2023-04-01'),
    },
  })

  console.log('✅ Students created')

  // Create classes
  await prisma.class.createMany({
    data: [
      { name: '10', section: 'A', schoolId: school1.id },
      { name: '10', section: 'B', schoolId: school1.id },
      { name: '9', section: 'A', schoolId: school1.id },
      { name: '9', section: 'B', schoolId: school2.id },
      { name: '8', section: 'A', schoolId: school2.id },
    ],
  })

  console.log('✅ Classes created')

  // Create exams
  const exam1 = await prisma.exam.create({
    data: {
      name: 'मिड टर्म एग्जाम',
      type: ExamType.MONTHLY,
      subject: 'Mathematics',
      class: '10',
      section: 'A',
      date: new Date('2024-01-15'),
      duration: 180,
      totalMarks: 100,
      passingMarks: 40,
      schoolId: school1.id,
      createdBy: admin1.id,
    },
  })

  const exam2 = await prisma.exam.create({
    data: {
      name: 'यूनिट टेस्ट',
      type: ExamType.ASSIGNMENT,
      subject: 'Hindi',
      class: '9',
      section: 'B',
      date: new Date('2024-01-20'),
      duration: 90,
      totalMarks: 50,
      passingMarks: 20,
      schoolId: school2.id,
      createdBy: admin2.id,
    },
  })

  console.log('✅ Exams created')

  // Create fees
  await prisma.fee.createMany({
    data: [
      {
        studentId: (await prisma.student.findFirst({ where: { rollNumber: 'S001' } }))!.id,
        type: FeeType.TUITION,
        amount: 5000,
        dueDate: new Date('2024-02-01'),
        status: 'PENDING',
        description: 'मासिक शुल्क',
        schoolId: school1.id,
      },
      {
        studentId: (await prisma.student.findFirst({ where: { rollNumber: 'S002' } }))!.id,
        type: FeeType.TUITION,
        amount: 4500,
        dueDate: new Date('2024-02-01'),
        status: 'PAID',
        paidDate: new Date('2024-01-25'),
        description: 'मासिक शुल्क',
        schoolId: school2.id,
      },
    ],
  })

  console.log('✅ Fees created')

  // Create sample attendance
  const student1Record = await prisma.student.findFirst({ where: { rollNumber: 'S001' } })
  const student2Record = await prisma.student.findFirst({ where: { rollNumber: 'S002' } })

  if (student1Record) {
    await prisma.attendance.createMany({
      data: [
        {
          studentId: student1Record.id,
          date: new Date('2024-01-15'),
          status: AttendanceStatus.PRESENT,
          markedBy: teacher1.id,
          schoolId: school1.id,
        },
        {
          studentId: student1Record.id,
          date: new Date('2024-01-16'),
          status: AttendanceStatus.PRESENT,
          markedBy: teacher1.id,
          schoolId: school1.id,
        },
        {
          studentId: student1Record.id,
          date: new Date('2024-01-17'),
          status: AttendanceStatus.LATE,
          remarks: 'बस देरी से आई',
          markedBy: teacher1.id,
          schoolId: school1.id,
        },
      ],
    })
  }

  if (student2Record) {
    await prisma.attendance.createMany({
      data: [
        {
          studentId: student2Record.id,
          date: new Date('2024-01-15'),
          status: AttendanceStatus.PRESENT,
          markedBy: teacher2.id,
          schoolId: school2.id,
        },
        {
          studentId: student2Record.id,
          date: new Date('2024-01-16'),
          status: AttendanceStatus.ABSENT,
          remarks: 'बुखार',
          markedBy: teacher2.id,
          schoolId: school2.id,
        },
        {
          studentId: student2Record.id,
          date: new Date('2024-01-17'),
          status: AttendanceStatus.PRESENT,
          markedBy: teacher2.id,
          schoolId: school2.id,
        },
      ],
    })
  }

  console.log('✅ Attendance records created')

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: admin1.id,
        title: 'सिस्टम वेलकम',
        message: 'School ERP सिस्टम में आपका स्वागत है!',
        type: 'INFO',
        schoolId: school1.id,
      },
      {
        userId: teacher1.id,
        title: 'नई कक्षा असाइनमेंट',
        message: 'आपको कक्षा 10A का Mathematics विषय दिया गया है।',
        type: 'INFO',
        schoolId: school1.id,
      },
      {
        userId: student1.id,
        title: 'एग्जाम रिमाइंडर',
        message: 'कल Mathematics का मिड टर्म एग्जाम है।',
        type: 'WARNING',
        schoolId: school1.id,
      },
    ],
  })

  console.log('✅ Notifications created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📋 Demo Credentials:')
  console.log('Admin DPS: admin@dps.com / admin123')
  console.log('Admin Modern: admin@modernschool.com / admin123')
  console.log('Teacher DPS: amit@dps.com / teacher123')
  console.log('Teacher Modern: sunita@modernschool.com / teacher123')
  console.log('Student DPS: rahul.singh@dps.com / student123')
  console.log('Student Modern: priya.sharma@modernschool.com / student123')
  console.log('Parent DPS: ram.singh@email.com / parent123')
  console.log('Parent Modern: geeta.sharma@email.com / parent123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
