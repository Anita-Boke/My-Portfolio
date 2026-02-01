// Simple interactive chatbot and games logic
// This script creates a floating chat widget with a chatbot and a few interactive games (quiz, number guess, riddle)

(function() {
  // Create chat widget button
  const chatBtn = document.createElement('div');
  chatBtn.id = 'chatbot-launcher';
  chatBtn.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:600;color:#fff;letter-spacing:0.5px;">Chatbot</div>';
  chatBtn.style.position = 'fixed';
  chatBtn.style.bottom = '32px';
  chatBtn.style.right = '32px';
  chatBtn.style.width = '56px';
  chatBtn.style.height = '56px';
  chatBtn.style.background = '#0073b1';
  chatBtn.style.color = '#fff';
  chatBtn.style.borderRadius = '50%';
  chatBtn.style.display = 'flex';
  chatBtn.style.alignItems = 'center';
  chatBtn.style.justifyContent = 'center';
  chatBtn.style.fontSize = '2rem';
  chatBtn.style.cursor = 'pointer';
  chatBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
  chatBtn.style.zIndex = '9999';
  document.body.appendChild(chatBtn);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chatbot-window';
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '100px';
  chatWindow.style.right = '32px';
  chatWindow.style.width = '340px';
  chatWindow.style.maxHeight = '420px';
  chatWindow.style.background = '#fff';
  chatWindow.style.borderRadius = '12px';
  chatWindow.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.zIndex = '10000';
  document.body.appendChild(chatWindow);

  // Chat header
  const header = document.createElement('div');
  header.style.background = '#0073b1';
  header.style.color = '#fff';
  header.style.padding = '1rem';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.innerHTML = '<span>AI Chatbot 🤖</span><span style="cursor:pointer;font-size:1.2rem;" id="chatbot-close">&times;</span>';
  chatWindow.appendChild(header);

  // Chat body
  const chatBody = document.createElement('div');
  chatBody.id = 'chatbot-body';
  chatBody.style.flex = '1';
  chatBody.style.padding = '1rem';
  chatBody.style.overflowY = 'auto';
  chatBody.style.background = '#f7fafd';
  chatBody.innerHTML = '<div style="margin-bottom:1rem;">Hi! I\'m your portfolio assistant. Ask me anything about Anita Boke, her skills, projects, resume, or how to contact her.</div>';
  chatWindow.appendChild(chatBody);

  // Chat input
  const chatInputDiv = document.createElement('div');
  chatInputDiv.style.display = 'flex';
  chatInputDiv.style.borderTop = '1px solid #eee';
  chatInputDiv.style.background = '#fff';
  chatInputDiv.style.padding = '0.5rem';
  const chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.placeholder = 'Type your message...';
  chatInput.style.flex = '1';
  chatInput.style.border = 'none';
  chatInput.style.outline = 'none';
  chatInput.style.fontSize = '1rem';
  chatInputDiv.appendChild(chatInput);
  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Send';
  sendBtn.style.background = '#0073b1';
  sendBtn.style.color = '#fff';
  sendBtn.style.border = 'none';
  sendBtn.style.borderRadius = '6px';
  sendBtn.style.marginLeft = '0.5rem';
  sendBtn.style.padding = '0.5rem 1rem';
  sendBtn.style.cursor = 'pointer';
  chatInputDiv.appendChild(sendBtn);
  chatWindow.appendChild(chatInputDiv);

  // Chatbot logic
  // No game logic needed

  function botReply(msg) {
    const div = document.createElement('div');
    div.style.margin = '0.5rem 0';
    div.style.textAlign = 'left';
    div.innerHTML = '<span style="background:#e3f2fd;padding:0.5rem 1rem;border-radius:12px;display:inline-block;">' + msg + '</span>';
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function userReply(msg) {
    const div = document.createElement('div');
    div.style.margin = '0.5rem 0';
    div.style.textAlign = 'right';
    div.innerHTML = '<span style="background:#0073b1;color:#fff;padding:0.5rem 1rem;border-radius:12px;display:inline-block;">' + msg + '</span>';
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function resetGame() {
    game = null;
    answer = null;
    quizIndex = 0;
  }
  function handleInput(input) {
    const msg = input.trim().toLowerCase();
    if (!msg) return;
    // Experience Q&A
    if (msg.includes('experience') || msg.includes('work') || msg.includes('internship') || msg.includes('job') || msg.includes('professional background')) {
      botReply("My experience includes internships at E&M Tech Solutions (Software Development Intern, May-Nov 2025) and Diageo One (IT Intern, Apr-Jul 2025). I developed enterprise web apps, built modules for banking and employee management systems, integrated APIs, optimized performance, and supported IT operations, data validation, and audits. See the Resume section for full details!");
      return;
    }
    // Portfolio Q&A only
    if (msg.includes('your name') || msg.includes('who are you')) {
      botReply("I'm Anita Boke, a Full Stack Developer, QA Analyst, and AI/Cybersecurity enthusiast from Nairobi, Kenya.");
      return;
    }
    if (msg.includes('education') || msg.includes('school') || msg.includes('university')) {
      botReply("I graduated from Mount Kenya University with a BSc in Information Technology, specializing in Software Engineering, Web Development, and Cybersecurity.");
      return;
    }
    if (msg.includes('skills') || msg.includes('technologies')) {
      botReply("My skills include React, TypeScript, Node.js, MySQL, PHP, Java, Python, QA (JMeter, Postman), and more. See the Technologies & Skills section for details!");
      return;
    }
    if (msg.includes('project') || msg.includes('what have you built') || msg.includes('portfolio')) {
      botReply("I've built systems like a Bank & Account Management System, Employee Management System, Tech Events Mobile App, Poetry Platform, and AI-powered tools. Check the Projects section for more!");
      return;
    }
    if (msg.includes('contact') || msg.includes('email') || msg.includes('linkedin') || msg.includes('github')) {
      botReply("You can contact me at wintahboke@gmail.com, on LinkedIn (linkedin.com/in/anita-boke), or GitHub (github.com/Anita-Boke).");
      return;
    }
    if (msg.includes('resume') || msg.includes('cv')) {
      botReply("You can view and download my resume in the Resume section of this portfolio.");
      return;
    }
    if (msg.includes('where are you') || msg.includes('location')) {
      botReply("I'm based in Nairobi, Kenya.");
      return;
    }
    if (msg.includes('quality assurance') || msg.includes('qa')) {
      botReply("I have strong QA skills: Manual Testing, JMeter, Postman, SDLC/STLC, Agile/Scrum QA, Functional & Regression Testing, and Test Case Design & Execution.");
      return;
    }
    if (msg.includes('hello') || msg.includes('hi')) {
      botReply('Hello! Ask me about Anita Boke, her skills, projects, or how to contact her.');
    } else if (msg.includes('help')) {
      botReply('Ask me about Anita Boke, her skills, projects, resume, or contact info!');
    } else {
      botReply('I can answer questions about Anita Boke, her portfolio, skills, projects, and contact info.');
    }
  }
  sendBtn.onclick = function() {
    handleInput(chatInput.value);
    chatInput.value = '';
  };
  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
  chatBtn.onclick = function() {
    chatWindow.style.display = 'flex';
  };
  header.querySelector('#chatbot-close').onclick = function() {
    chatWindow.style.display = 'none';
  };
})();
