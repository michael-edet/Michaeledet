// pageloader.js

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const pageLoader = document.getElementById('pageLoader');
    const loaderImage = document.getElementById('loaderImage');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    // Image upload elements
    const imageUpload = document.getElementById('imageUpload');
    const browseBtn = document.getElementById('browseBtn');
    const dropArea = document.getElementById('dropArea');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const saveImageBtn = document.getElementById('saveImageBtn');
    const useDefaultBtn = document.getElementById('useDefaultBtn');
    const animationSpeed = document.getElementById('animationSpeed');
    const enableSound = document.getElementById('enableSound');
    
    // Default image URL (replace with your default image)
    const defaultImageUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80';
    
    // Local storage key for saved image
    const STORAGE_KEY = 'pageLoaderImage';
    
    // Sound effects
    const zoomSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3');
    const completeSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    
    // Initialize the page loader
    function initPageLoader() {
        // Load saved image from localStorage or use default
        const savedImage = localStorage.getItem(STORAGE_KEY);
        const imageUrl = savedImage || defaultImageUrl;
        
        // Set the loader image
        loaderImage.src = imageUrl;
        
        // Update preview if saved image exists
        if (savedImage) {
            previewImage.src = savedImage;
            previewContainer.classList.add('show');
        }
        
        // Apply saved animation speed
        const savedSpeed = localStorage.getItem('loaderAnimationSpeed') || 'normal';
        animationSpeed.value = savedSpeed;
        applyAnimationSpeed(savedSpeed);
        
        // Apply sound setting
        const soundEnabled = localStorage.getItem('loaderSoundEnabled') !== 'false';
        enableSound.checked = soundEnabled;
        
        // Start loading simulation
        simulateLoading();
        
        // Hide loader after 3 seconds (simulating page load)
        setTimeout(() => {
            hidePageLoader();
        }, 3000);
    }
    
    // Simulate loading progress
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10 + 5; // Random increment
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Play completion sound if enabled
                if (enableSound.checked) {
                    completeSound.currentTime = 0;
                    completeSound.play();
                }
            }
            
            // Update progress bar and text
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            
            // Play zoom sound at certain intervals if enabled
            if (enableSound.checked && (progress % 25 === 0 || progress === 100)) {
                zoomSound.currentTime = 0;
                zoomSound.play();
            }
        }, 150);
    }
    
    // Hide the page loader
    function hidePageLoader() {
        pageLoader.classList.add('hidden');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (pageLoader.parentNode) {
                pageLoader.style.display = 'none';
            }
        }, 800);
    }
    
    // Image Upload Functions
    function setupImageUpload() {
        // Browse button click
        browseBtn.addEventListener('click', () => {
            imageUpload.click();
        });
        
        // File input change
        imageUpload.addEventListener('change', handleImageSelect);
        
        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('drag-over');
        }
        
        function unhighlight() {
            dropArea.classList.remove('drag-over');
        }
        
        // Handle drop
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        }
        
        // Remove image button
        removeImageBtn.addEventListener('click', () => {
            previewImage.src = '';
            previewContainer.classList.remove('show');
            localStorage.removeItem(STORAGE_KEY);
        });
        
        // Save image button
        saveImageBtn.addEventListener('click', () => {
            if (previewImage.src) {
                // Save to localStorage
                localStorage.setItem(STORAGE_KEY, previewImage.src);
                
                // Update loader image
                loaderImage.src = previewImage.src;
                
                // Show success message
                showNotification('Image saved successfully!', 'success');
            } else {
                showNotification('Please select an image first', 'error');
            }
        });
        
        // Use default image button
        useDefaultBtn.addEventListener('click', () => {
            // Set default image
            loaderImage.src = defaultImageUrl;
            previewImage.src = defaultImageUrl;
            previewContainer.classList.add('show');
            
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, defaultImageUrl);
            
            showNotification('Default image applied successfully!', 'success');
        });
        
        // Animation speed change
        animationSpeed.addEventListener('change', () => {
            const speed = animationSpeed.value;
            applyAnimationSpeed(speed);
            localStorage.setItem('loaderAnimationSpeed', speed);
        });
        
        // Sound toggle
        enableSound.addEventListener('change', () => {
            localStorage.setItem('loaderSoundEnabled', enableSound.checked);
        });
    }
    
    // Handle image file selection
    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    }
    
    // Process image file
    function handleImageFile(file) {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size should be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Set preview image
            previewImage.src = e.target.result;
            previewContainer.classList.add('show');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Apply animation speed to loader
    function applyAnimationSpeed(speed) {
        // Remove existing speed classes
        pageLoader.classList.remove('animation-slow', 'animation-normal', 'animation-fast');
        
        // Add new speed class
        switch(speed) {
            case 'slow':
                pageLoader.classList.add('animation-slow');
                break;
            case 'fast':
                pageLoader.classList.add('animation-fast');
                break;
            default:
                // Normal speed - no additional class needed
                break;
        }
    }
    
    // Show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode && notification.classList.contains('show')) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Add notification styles
    function addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--black-lighter);
                color: var(--text-light);
                padding: 15px 20px;
                border-radius: 10px;
                border-left: 4px solid var(--yellow-primary);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 10001;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #4CAF50;
            }
            
            .notification-error {
                border-left-color: #f44336;
            }
            
            .notification i {
                font-size: 1.2rem;
            }
            
            .notification-success i {
                color: #4CAF50;
            }
            
            .notification-error i {
                color: #f44336;
            }
            
            .notification span {
                flex: 1;
                font-size: 0.95rem;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                font-size: 1rem;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: var(--text-light);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Toggle upload panel (for demonstration)
    function addUploadPanelToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'upload-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-image"></i>';
        toggleBtn.title = 'Configure Page Loader';
        
        toggleBtn.addEventListener('click', () => {
            const uploadPanel = document.querySelector('.image-upload-panel');
            uploadPanel.classList.toggle('active');
        });
        
        document.body.appendChild(toggleBtn);
        
        // Add toggle button styles
        const style = document.createElement('style');
        style.textContent = `
            .upload-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: var(--gradient-primary);
                color: var(--black-primary);
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 9998;
                box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .upload-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize everything
    function init() {
        initPageLoader();
        setupImageUpload();
        addNotificationStyles();
        addUploadPanelToggle(); // Remove this line in production
        
        // For testing: Show the loader again when pressing F5
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                location.reload();
            }
        });
    }
    
    // Start initialization
    init();
});