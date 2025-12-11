// loadHeader.js
document.addEventListener('DOMContentLoaded', function() {
  // Load header HTML
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      
      // Now load and execute header.js
      const script = document.createElement('script');
      script.src = 'header.js';
      document.body.appendChild(script);
    })
    .catch(error => {
      console.error('Error loading header:', error);
      // Fallback to static header
      document.getElementById('header-container').innerHTML = `
                <header id="header">
                    <div class="container header-container">
                        <a href="/personal portfolio/index.html" class="logo">
                            <div class="logo-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="logo-text">
                                <span class="main">MICHAEL EDET</span>
                                <span class="sub">Digital Portfolio</span>
                            </div>
                        </a>
                        
                        <div class="menu-toggle" id="menuToggle">
                            <i class="fas fa-bars"></i>
                        </div>
                        
                        <nav id="navMenu">
                            <ul>
                                <li><a href="/personal portfolio/index.html">Home</a></li>
                                <li><a href="/personal portfolio/asset/c & sp/html/about.html">About</a></li>
                                <li><a href="/personal portfolio/asset/c & sp/html/skill.html">Skills</a></li>
                                <li><a href="/personal portfolio/asset/c & sp/html/service.html">Services</a></li>
                                <li><a href="/personal portfolio/asset/c & sp/html/portfolio.html">Portfolio</a></li>
                                <li><a href="/personal portfolio/asset/c & sp/html/contact.html">Contact</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
            `;
    });
});