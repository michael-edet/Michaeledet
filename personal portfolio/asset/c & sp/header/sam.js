// Load Header
fetch('header/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
    
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'header/header.css';
    document.head.appendChild(link);
    
    // Load and execute JS
    const script = document.createElement('script');
    script.src = 'header/header.js';
    script.onload = function() {
      // Header JS is now loaded and executed
    };
    document.body.appendChild(script);
  })
  .catch(error => console.error('Error loading header:', error));