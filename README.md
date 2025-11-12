# My-Portfolio

A modern, responsive portfolio website built with Node.js, Express, and vanilla JavaScript.

## 🌟 Features

- **Modern Design**: Glass morphism effects with responsive layout
- **Full-Stack Architecture**: Node.js backend with Express server
- **Database Integration**: MySQL database for projects and contact messages
- **Email System**: Automated email notifications using Nodemailer
- **Resume Management**: Upload, view, and download resume functionality
- **Project Management**: Add, edit, and showcase projects with images
- **Social Integration**: GitHub, LinkedIn, and email contact links

## 🚀 Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid and Flexbox
- Glass morphism and modern animations
- Dynamic project rendering

### Backend
- Node.js with Express.js
- MySQL database integration
- Multer for file uploads
- Nodemailer for email services
- RESTful API architecture

### Database
- MySQL with three main tables:
  - `projects`: Portfolio projects
  - `messages`: Contact form submissions
  - `resumes`: Uploaded resume files

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anita-Boke/My-Portfolio.git
   cd My-Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   - Install XAMPP or MySQL server
   - Create a database named `portfolio_db`
   - Update database credentials in `.env` file

4. **Configure environment variables**
   Create a `.env` file with:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_EMAIL=your_admin_email@gmail.com
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=portfolio_db
   ```

5. **Start the server**
   ```bash
   npm start
   # or
   node server.js
   ```

6. **Visit the application**
   Open `http://localhost:3000` in your browser

## 🎯 Features Overview

### Portfolio Sections
- **Home**: Welcome message with dynamic typing effect
- **About Me**: Personal introduction with education timeline
- **Projects**: Dynamic project showcase with CRUD operations
- **Contact**: Contact form with email integration

### Admin Features
- Add new projects with image uploads
- Edit existing project details
- View and download uploaded resumes
- Receive email notifications for contact messages

### Email Integration
- Automatic thank you emails to visitors
- Admin notifications for new messages
- Gmail integration with app passwords

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🛠️ Development

### Project Structure
```
My-Portfolio/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── uploads/
├── services/
│   └── emailService.js
├── server.js
├── package.json
├── .env
└── README.md
```

### API Endpoints
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Add new project
- `PUT /api/projects/:id` - Update project
- `GET /api/github-repos` - Sync GitHub repositories
- `POST /api/contact` - Submit contact form
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/current` - Get latest resume

## 👨‍💻 About the Developer

**Anita Boke**  
Full-Stack Developer | IT Student at Mount Kenya University

- 🎓 Bachelor of Science in Information Technology (2021-2025)
- 💻 Specializing in React, Node.js, and modern web technologies
- 🌱 Passionate about creating efficient, scalable solutions
- 📧 Contact: wintahboke@gmail.com

## 🔗 Connect

- **GitHub**: [Anita-Boke](https://github.com/Anita-Boke)
- **LinkedIn**: [anita-boke](https://www.linkedin.com/in/anita-boke/)
- **Email**: wintahboke@gmail.com

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Modern design inspiration from contemporary portfolio websites
- Glass morphism effects and animations
- Professional development best practices
- Clean code architecture and responsive design principles

---

⭐ **Star this repository if you found it helpful!** ⭐
