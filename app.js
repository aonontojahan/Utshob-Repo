/* ==========================================================================
   DEVELOPER PORTFOLIO - BAHALUL HOSSAIN CHOWDHURY (UTSHOB)
   App Logic - Interactivity, Modals, Terminal CLI, and Filters
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Theme Toggle (Dark / Light) --- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlDoc = document.documentElement;

  // Check stored theme preference or fallback to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlDoc.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlDoc.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlDoc.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'light') {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#f59e0b';
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = '';
    }
  }

  /* --- 2. Navbar Scroll Observer & Active Links --- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight current section in navbar
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* --- 3. Hero Typing Effect --- */
  const typingTextEl = document.getElementById('typing-text');
  const titles = [
    'Software Engineer & Full-Stack Developer',
    'FastAPI & Django Specialist',
    'React & Next.js Frontend Architect',
    'Realtime WebSockets & Escrow Systems'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeEffect() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingTextEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      typingTextEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 90;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typingDelay = 2200; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingDelay = 400; // Pause before next word
    }

    setTimeout(typeEffect, typingDelay);
  }
  typeEffect();

  /* --- 4. Technical Skills Filter & Live Search --- */
  const skillSearchInput = document.getElementById('skill-search-input');
  const skillFilterPills = document.querySelectorAll('#skill-filter-pills .filter-pill');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  // Filter Pills Click
  skillFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      skillFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');
      filterSkills(filter, skillSearchInput.value.toLowerCase().trim());
    });
  });

  // Search Input Keyup
  skillSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activePill = document.querySelector('#skill-filter-pills .filter-pill.active');
    const activeFilter = activePill ? activePill.getAttribute('data-filter') : 'all';
    filterSkills(activeFilter, query);
  });

  function filterSkills(categoryFilter, searchQuery) {
    skillCategoryCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const tags = Array.from(card.querySelectorAll('.skill-tag')).map(tag => tag.textContent.toLowerCase());
      const cardTitle = card.querySelector('.category-title').textContent.toLowerCase();

      const matchesCategory = (categoryFilter === 'all' || cardCategory === categoryFilter);
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || tags.some(t => t.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  }

  /* --- 5. Work Experience & Education Timeline Toggle --- */
  const tabExp = document.getElementById('tab-experience');
  const tabEdu = document.getElementById('tab-education');
  const contentExp = document.getElementById('experience-content');
  const contentEdu = document.getElementById('education-content');

  tabExp.addEventListener('click', () => {
    tabExp.classList.add('active');
    tabEdu.classList.remove('active');
    contentExp.style.display = 'block';
    contentEdu.style.display = 'none';
  });

  tabEdu.addEventListener('click', () => {
    tabEdu.classList.add('active');
    tabExp.classList.remove('active');
    contentEdu.style.display = 'block';
    contentExp.style.display = 'none';
  });

  /* --- 6. Projects Filter --- */
  const projectFilterPills = document.querySelectorAll('#project-filter-pills .filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      projectFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-project-filter');
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --- 7. LaTeX Resume Modal & Copy Logic --- */
  const latexModal = document.getElementById('latex-modal');
  const btnOpenLatex = document.getElementById('btn-open-latex');
  const fabLatex = document.getElementById('fab-latex');
  const closeLatex = document.getElementById('close-latex');
  const btnCopyLatex = document.getElementById('btn-copy-latex');
  const latexCodeContent = document.getElementById('latex-code-content');

  function openLatexModal() {
    latexModal.classList.add('active');
  }

  function closeLatexModal() {
    latexModal.classList.remove('active');
  }

  if (btnOpenLatex) btnOpenLatex.addEventListener('click', openLatexModal);
  if (fabLatex) fabLatex.addEventListener('click', openLatexModal);
  if (closeLatex) closeLatex.addEventListener('click', closeLatexModal);

  latexModal.addEventListener('click', (e) => {
    if (e.target === latexModal) closeLatexModal();
  });

  btnCopyLatex.addEventListener('click', () => {
    const textToCopy = latexCodeContent.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      btnCopyLatex.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      btnCopyLatex.style.borderColor = 'var(--accent-emerald)';
      btnCopyLatex.style.color = 'var(--accent-emerald)';
      showToast('LaTeX source code copied to clipboard!', 'success');
      setTimeout(() => {
        btnCopyLatex.innerHTML = '<i class="fa-solid fa-copy"></i> Copy LaTeX';
        btnCopyLatex.style.borderColor = '';
        btnCopyLatex.style.color = '';
      }, 2500);
    });
  });

  /* --- 8. Terminal CLI Modal (`utshob-cli`) --- */
  const terminalModal = document.getElementById('terminal-modal');
  const btnOpenTerminal = document.getElementById('btn-open-terminal');
  const fabTerminal = document.getElementById('fab-terminal');
  const closeTerminal = document.getElementById('close-terminal');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  function openTerminalModal() {
    terminalModal.classList.add('active');
    setTimeout(() => terminalInput.focus(), 150);
  }

  function closeTerminalModal() {
    terminalModal.classList.remove('active');
  }

  if (btnOpenTerminal) btnOpenTerminal.addEventListener('click', openTerminalModal);
  if (fabTerminal) fabTerminal.addEventListener('click', openTerminalModal);
  if (closeTerminal) closeTerminal.addEventListener('click', closeTerminalModal);

  terminalModal.addEventListener('click', (e) => {
    if (e.target === terminalModal) closeTerminalModal();
  });

  // CLI Command Interpreter
  const commandHistory = [];
  let historyIdx = -1;

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim();
      if (cmd) {
        commandHistory.push(cmd);
        historyIdx = commandHistory.length;
        processTerminalCommand(cmd);
      }
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = commandHistory[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        terminalInput.value = commandHistory[historyIdx];
      } else {
        historyIdx = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  function appendTerminalLine(htmlContent) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'terminal-line';
    lineDiv.innerHTML = htmlContent;
    terminalOutput.appendChild(lineDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function processTerminalCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase();
    appendTerminalLine(`<span class="terminal-prompt">utshob@dev-machine:~$</span> ${escapeHTML(rawCmd)}`);

    switch (cmd) {
      case 'help':
        appendTerminalLine(`
          <div style="color: #94a3b8; margin: 0.4rem 0;">
            <strong style="color: #f8fafc;">Available Commands:</strong><br>
            • <span style="color: #10b981;">about</span>       - Print professional summary<br>
            • <span style="color: #10b981;">skills</span>      - Display technical skills stack<br>
            • <span style="color: #10b981;">projects</span>    - List featured full-stack projects<br>
            • <span style="color: #10b981;">experience</span>  - View work experience & education<br>
            • <span style="color: #10b981;">contact</span>     - Show direct email, phone & social links<br>
            • <span style="color: #10b981;">hire</span>        - Direct recruitment request callout<br>
            • <span style="color: #10b981;">clear</span>       - Clear terminal screen
          </div>
        `);
        break;

      case 'about':
        appendTerminalLine(`
          <div style="color: #e2e8f0; margin: 0.4rem 0;">
            <strong>Bahalul Hossain Chowdhury (Utshob)</strong><br>
            B.Sc. in Computer Science & Engineering graduate from IUBAT (CGPA 3.10).<br>
            Adept at building scalable full-stack applications with FastAPI, Django, WebSockets, React & Next.js.
          </div>
        `);
        break;

      case 'skills':
        appendTerminalLine(`
          <div style="color: #38bdf8; margin: 0.4rem 0;">
            <strong>[Languages]:</strong> Python, C++, C, Java, C#, SQL<br>
            <strong>[Backend]:</strong> FastAPI, Django, REST APIs, WebSockets, JWT Auth, SQLAlchemy<br>
            <strong>[Frontend]:</strong> React, Next.js, JavaScript, HTML5, CSS3, Tailwind CSS, shadcn/ui<br>
            <strong>[Databases]:</strong> PostgreSQL, MSSQL, MySQL<br>
            <strong>[Tools]:</strong> Git, GitHub, VS Code, XAMPP, Figma
          </div>
        `);
        break;

      case 'projects':
        appendTerminalLine(`
          <div style="color: #e2e8f0; margin: 0.4rem 0;">
            1. <strong style="color: #6366f1;">ReSale</strong> - Escrow Electronics Marketplace (FastAPI, PostgreSQL)<br>
            2. <strong style="color: #6366f1;">ChatApp</strong> - Realtime Messaging over WebSockets (FastAPI, Next.js)<br>
            3. <strong style="color: #6366f1;">EMS</strong> - Event Management System (PHP, MySQL)<br>
            4. <strong style="color: #6366f1;">CALC</strong> - Smart Full-Stack Calculator (FastAPI, React)
          </div>
        `);
        break;

      case 'experience':
        appendTerminalLine(`
          <div style="color: #e2e8f0; margin: 0.4rem 0;">
            • <strong style="color: #10b981;">Product Engineer</strong> @ 3S Software Limited (Nov 2025 – May 2026)<br>
            • <strong style="color: #10b981;">Junior Executive</strong> @ SkyTech (Jun 2026 – Aug 2026)<br>
            • <strong style="color: #6366f1;">B.Sc. CSE</strong> @ IUBAT (2022 – 2026) | CGPA 3.10
          </div>
        `);
        break;

      case 'contact':
        appendTerminalLine(`
          <div style="color: #f59e0b; margin: 0.4rem 0;">
            📧 Email: utshobchowdhury35@gmail.com<br>
            📞 Phone: +880 1921-806099<br>
            🌐 Portfolio: https://aonontojahan.vercel.app/<br>
            🐙 GitHub: https://github.com/aonontojahan<br>
            💼 LinkedIn: https://www.linkedin.com/in/aonontojahan/
          </div>
        `);
        break;

      case 'hire':
        appendTerminalLine(`
          <div style="color: #10b981; margin: 0.4rem 0; padding: 0.5rem; border: 1px dashed #10b981; border-radius: 6px;">
            🎉 <strong>Let's Connect!</strong> Bahalul is actively open for Full-Stack & Software Engineering roles.<br>
            Send an email directly to <a href="mailto:utshobchowdhury35@gmail.com" style="color: #38bdf8;">utshobchowdhury35@gmail.com</a>
          </div>
        `);
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      default:
        appendTerminalLine(`
          <div style="color: #ef4444;">
            Command not recognized: '${escapeHTML(rawCmd)}'. Type <span style="color: #f59e0b;">'help'</span> for valid commands.
          </div>
        `);
        break;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  /* --- 9. Contact Form Handler & Toast System --- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Simulate sending email
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
        submitBtn.style.background = 'var(--accent-emerald)';
        showToast(`Thank you, ${name}! Your message has been sent.`, 'success');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 1200);
    });
  }

  /* Toast Notification Function */
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-emerald);"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
