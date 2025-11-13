const { initializeDatabase, getConnection } = require('./lib/database');

async function seedDatabase() {
  try {
    // Initialize database and tables
    await initializeDatabase();
    
    const db = await getConnection();
    
    // Check if projects already exist
    const [existingProjects] = await db.execute('SELECT COUNT(*) as count FROM projects');
    
    if (existingProjects[0].count === 0) {
      console.log('🌱 Seeding database with initial projects...');
      
      // Insert your actual GitHub projects
      const projects = [
        {
          title: 'Fintech System',
          description: 'A comprehensive financial technology platform built with Next.js and TypeScript. Features modern UI/UX design and robust financial management capabilities.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          github_url: 'https://github.com/Anita-Boke/Fintech-system',
          live_url: '#',
          tags: 'Next.js, TypeScript, React, CSS3'
        },
        {
          title: 'Bank Role-Based System',
          description: 'A sophisticated banking management system with role-based access control, built with TypeScript for enhanced security and user management.',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          github_url: 'https://github.com/Anita-Boke/Bank-role-based-system',
          live_url: '#',
          tags: 'TypeScript, React, Next.js, Node.js'
        },
        {
          title: 'Employee Management App',
          description: 'A modern employee management application built with Next.js, featuring comprehensive employee data management and intuitive user interface.',
          image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          github_url: 'https://github.com/Anita-Boke/employee-app',
          live_url: '#',
          tags: 'Next.js, JavaScript, CSS3, React'
        },
        {
          title: 'Event Management System',
          description: 'A comprehensive event planning and management platform developed with TypeScript, providing seamless event organization and coordination tools.',
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          github_url: 'https://github.com/Anita-Boke/eventmanagement',
          live_url: '#',
          tags: 'TypeScript, React, Next.js, CSS3'
        },
        {
          title: 'Poetry Platform',
          description: 'A creative platform for poetry enthusiasts built with PHP, featuring user-friendly content management and community interaction features.',
          image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          github_url: 'https://github.com/Anita-Boke/poetry-platform',
          live_url: '#',
          tags: 'PHP, HTML, CSS, JavaScript'
        },
        {
          title: 'Stock Management System',
          description: 'An efficient inventory and stock management application built with JavaScript, providing real-time tracking and management capabilities.',
          image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          github_url: 'https://github.com/Anita-Boke/stock-take',
          live_url: '#',
          tags: 'JavaScript, HTML, CSS, Node.js'
        }
      ];
      
      for (const project of projects) {
        await db.execute(
          'INSERT INTO projects (title, description, image, github_url, live_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
          [project.title, project.description, project.image, project.github_url, project.live_url, project.tags]
        );
      }
      
      console.log(`✅ Successfully seeded ${projects.length} projects`);
    } else {
      console.log(`ℹ️ Database already contains ${existingProjects[0].count} projects`);
    }
    
    console.log('🎉 Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };