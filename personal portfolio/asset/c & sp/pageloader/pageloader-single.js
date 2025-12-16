// Page Loader with 2-Second Delay - Single File Implementation

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        LOAD_TIME: 2000, // 2 seconds delay
        DEFAULT_IMAGE: 'https://i.imgur.com/y0goG5T.jpeg',
        STORAGE_KEY: 'pageLoaderImage',
        ANIMATION_SPEED: 'normal', // slow, normal, fast
        ENABLE_SOUND: false
    };
    
    // Global variables
    let progressInterval;
    let currentProgress = 0;
    let isLoaderShown = false;
    
    // Create and inject CSS
    function injectStyles() {
        const styles = `
        /* Page Loader Styles */
        #pageLoader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0a0a0a;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            overflow: hidden;
            opacity: 1;
            transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        
        #pageLoader.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        
        .loader-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 1) 70%);
            z-index: 1;
        }
        
        .loader-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 600px;
            width: 90%;
            text-align: center;
        }
        
        .image-container {
            width: 250px;
            height: 250px;
            margin-bottom: 40px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #FFD700;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
            position: relative;
            animation: zoomInOut 4s ease-in-out infinite;
        }
        
        @keyframes zoomInOut {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
            }
            25% {
                transform: scale(1.15);
                box-shadow: 0 0 70px rgba(255, 215, 0, 0.5);
            }
            50% {
                transform: scale(0.95);
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
            }
            75% {
                transform: scale(1.1);
                box-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
            }
        }
        
        .loader-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .loader-title {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
            letter-spacing: 2px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .loader-subtitle {
            font-size: 1.3rem;
            color: #9E9E9E;
            margin-bottom: 40px;
            letter-spacing: 1px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .progress-container {
            width: 300px;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin: 30px auto 0;
            position: relative;
            overflow: hidden;
        }
        
        .progress-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            position: absolute;
            top: -25px;
            right: 0;
            color: #FFD700;
            font-weight: 600;
            font-size: 0.9rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        /* Upload Panel Styles */
        .image-upload-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1e1e1e;
            border-radius: 16px;
            padding: 25px;
            width: 400px;
            max-width: 90vw;
            border: 1px solid rgba(255, 215, 0, 0.2);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
        }
        
        .image-upload-panel.active {
            display: block;
        }
        
        .upload-container h3 {
            color: #FFD700;
            margin-bottom: 15px;
            font-size: 1.5rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .upload-container p {
            color: #9E9E9E;
            margin-bottom: 20px;
            font-size: 0.95rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .upload-area {
            border: 2px dashed rgba(255, 215, 0, 0.3);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin-bottom: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .upload-area:hover {
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.05);
        }
        
        .upload-area.drag-over {
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.1);
        }
        
        .upload-icon {
            font-size: 3rem;
            color: #FFD700;
            margin-bottom: 15px;
        }
        
        .btn-upload {
            background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
            color: #0a0a0a;
            border: none;
            padding: 10px 25px;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .btn-upload:hover {
            transform: translateY(-3px);
        }
        
        .upload-note {
            font-size: 0.85rem;
            margin-top: 15px;
            color: #9E9E9E;
        }
        
        .image-preview-container {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border: 1px solid rgba(255, 215, 0, 0.1);
            display: none;
        }
        
        .image-preview-container.show {
            display: block;
        }
        
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .preview-header h4 {
            color: #FFD700;
            font-size: 1.1rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .btn-small {
            background: transparent;
            color: #ff6b6b;
            border: 1px solid #ff6b6b;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            cursor: pointer;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .btn-small:hover {
            background: #ff6b6b;
            color: white;
        }
        
        .image-preview {
            width: 150px;
            height: 150px;
            margin: 0 auto;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #FFD700;
        }
        
        .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .preview-note {
            font-size: 0.85rem;
            text-align: center;
            margin-top: 10px;
            color: #9E9E9E;
        }
        
        .upload-actions {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .upload-actions .btn {
            flex: 1;
            justify-content: center;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 25px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 14px;
            cursor: pointer;
            border: none;
            gap: 8px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
            color: #0a0a0a;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
        }
        
        .btn-outline {
            background: transparent;
            color: #FFD700;
            border: 2px solid #FFD700;
        }
        
        .btn-outline:hover {
            background: #FFD700;
            color: #0a0a0a;
            transform: translateY(-3px);
        }
        
        .animation-controls {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 20px;
        }
        
        .animation-controls h4 {
            color: #FFD700;
            margin-bottom: 15px;
            font-size: 1.1rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .control-group {
            margin-bottom: 15px;
        }
        
        .control-group label {
            color: #F5F5F5;
            display: block;
            margin-bottom: 8px;
            font-size: 0.95rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .control-group select {
            width: 100%;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 8px;
            color: #F5F5F5;
            font-size: 0.95rem;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .control-group select:focus {
            outline: none;
            border-color: #FFD700;
        }
        
        .control-group label input[type="checkbox"] {
            margin-right: 10px;
            accent-color: #FFD700;
        }
        
        /* Toggle Button */
        .upload-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
            color: #0a0a0a;
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
        
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e1e1e;
            color: #F5F5F5;
            padding: 15px 20px;
            border-radius: 10px;
            border-left: 4px solid #FFD700;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10001;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
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
            color: #9E9E9E;
            cursor: pointer;
            font-size: 1rem;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-close:hover {
            color: #F5F5F5;
        }
        
        /* Animation Variations */
        .animation-slow .image-container {
            animation-duration: 6s;
        }
        
        .animation-fast .image-container {
            animation-duration: 2s;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .image-container {
                width: 200px;
                height: 200px;
            }
            
            .loader-title {
                font-size: 2.8rem;
            }
            
            .loader-subtitle {
                font-size: 1.1rem;
            }
            
            .progress-container {
                width: 250px;
            }
            
            .image-upload-panel {
                width: 350px;
                right: 10px;
                bottom: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .image-container {
                width: 180px;
                height: 180px;
                margin-bottom: 30px;
            }
            
            .loader-title {
                font-size: 2.2rem;
            }
            
            .loader-subtitle {
                font-size: 1rem;
            }
            
            .progress-container {
                width: 200px;
            }
            
            .upload-actions {
                flex-direction: column;
            }
        }
        `;
        
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    }
    
    // Create HTML structure
    function createLoaderHTML() {
        const loaderHTML = `
        <div id="pageLoader" class="page-loader">
            <div class="loader-background"></div>
            <div class="loader-content">
                <div class="image-container">
                    <img id="loaderImage" src="${CONFIG.DEFAULT_IMAGE}" alt="Loading..." class="loader-image">
                </div>
                <div class="loader-text">
                    <h1 class="loader-title">MICHAEL EDET</h1>
                    <p class="loader-subtitle">Digital Creator & Developer</p>
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                        <div class="progress-text">0%</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="image-upload-panel">
            <div class="upload-container">
                <h3>Page Loader Image Setup</h3>
                <p>Upload your image for the page loader animation:</p>
                
                <div class="upload-area" id="dropArea">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <p>Drag & drop your image here or click to browse</p>
                    <input type="file" id="imageUpload" accept="image/*" hidden>
                    <button class="btn btn-upload" id="browseBtn">Browse Files</button>
                    <p class="upload-note">Recommended: Square or portrait image (min 500x500px)</p>
                </div>
                
                <div class="image-preview-container" id="previewContainer">
                    <div class="preview-header">
                        <h4>Current Image Preview</h4>
                        <button class="btn btn-small" id="removeImageBtn">Remove</button>
                    </div>
                    <div class="image-preview">
                        <img id="previewImage" src="" alt="Preview">
                    </div>
                    <p class="preview-note">This image will be used in the page loader animation</p>
                </div>
                
                <div class="upload-actions">
                    <button class="btn btn-primary" id="saveImageBtn">Save & Apply</button>
                    <button class="btn btn-outline" id="useDefaultBtn">Use Default Image</button>
                </div>
                
                <div class="animation-controls">
                    <h4>Animation Settings</h4>
                    <div class="control-group">
                        <label for="animationSpeed">Animation Speed:</label>
                        <select id="animationSpeed">
                            <option value="slow">Slow (6s)</option>
                            <option value="normal" selected>Normal (4s)</option>
                            <option value="fast">Fast (2s)</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>
                            <input type="checkbox" id="enableSound" checked>
                            Enable Sound Effects
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <button class="upload-toggle-btn" title="Configure Page Loader">
            <i class="fas fa-image"></i>
        </button>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = loaderHTML;
        document.body.insertBefore(container, document.body.firstChild);
    }
    
    // Initialize page loader
    function initPageLoader() {
        // Load saved image from localStorage
        const savedImage = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (savedImage) {
            document.getElementById('loaderImage').src = savedImage;
            document.getElementById('previewImage').src = savedImage;
            document.getElementById('previewContainer').classList.add('show');
        }
        
        // Set animation speed
        const savedSpeed = localStorage.getItem('loaderAnimationSpeed') || CONFIG.ANIMATION_SPEED;
        document.getElementById('animationSpeed').value = savedSpeed;
        applyAnimationSpeed(savedSpeed);
        
        // Set sound setting
        const soundEnabled = localStorage.getItem('loaderSoundEnabled') !== 'false';
        document.getElementById('enableSound').checked = soundEnabled;
        CONFIG.ENABLE_SOUND = soundEnabled;
        
        // Start loading simulation
        simulateLoading();
        
        // Hide loader after 2 seconds
        setTimeout(() => {
            hidePageLoader();
        }, CONFIG.LOAD_TIME);
    }
    
    // Simulate loading progress
    function simulateLoading() {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        // Calculate interval based on 2-second total time (2000ms / 100% = 20ms per 1%)
        const intervalTime = CONFIG.LOAD_TIME / 100;
        
        currentProgress = 0;
        
        progressInterval = setInterval(() => {
            // Smooth progress with random variation for realism
            currentProgress += 1 + Math.random() * 0.5;
            
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(progressInterval);
                
                // Play completion sound if enabled
                if (CONFIG.ENABLE_SOUND) {
                    playSound('complete');
                }
            }
            
            // Update progress bar and text
            progressBar.style.width = `${currentProgress}%`;
            progressText.textContent = `${Math.round(currentProgress)}%`;
            
            // Play zoom sound at certain intervals if enabled
            if (CONFIG.ENABLE_SOUND && (Math.round(currentProgress) % 25 === 0 || currentProgress === 100)) {
                playSound('zoom');
            }
        }, intervalTime);
    }
    
    // Hide the page loader
    function hidePageLoader() {
        const pageLoader = document.getElementById('pageLoader');
        if (pageLoader) {
            // Complete progress to 100% if not already
            if (currentProgress < 100) {
                clearInterval(progressInterval);
                currentProgress = 100;
                document.querySelector('.progress-bar').style.width = '100%';
                document.querySelector('.progress-text').textContent = '100%';
            }
            
            // Add hidden class for fade out
            pageLoader.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                pageLoader.style.display = 'none';
                isLoaderShown = false;
                
                // Dispatch custom event when loader is hidden
                document.dispatchEvent(new CustomEvent('pageLoaderHidden'));
            }, 800);
        }
    }
    
    // Play sound effects
    function playSound(type) {
        if (!CONFIG.ENABLE_SOUND) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'zoom') {
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } else if (type === 'complete') {
                // Play a success chord
                const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
                frequencies.forEach((freq, index) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                    gain.gain.setValueAtTime(0, audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5 + (index * 0.1));
                    osc.start(audioContext.currentTime);
                    osc.stop(audioContext.currentTime + 0.6);
                });
            }
        } catch (error) {
            // Audio context not supported or blocked - fail silently
        }
    }
    
    // Apply animation speed
    function applyAnimationSpeed(speed) {
        const pageLoader = document.getElementById('pageLoader');
        if (pageLoader) {
            // Remove existing speed classes
            pageLoader.classList.remove('animation-slow', 'animation-fast');
            
            // Add new speed class
            if (speed === 'slow') {
                pageLoader.classList.add('animation-slow');
            } else if (speed === 'fast') {
                pageLoader.classList.add('animation-fast');
            }
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
    
    // Setup image upload functionality
    function setupImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        const browseBtn = document.getElementById('browseBtn');
        const dropArea = document.getElementById('dropArea');
        const removeImageBtn = document.getElementById('removeImageBtn');
        const saveImageBtn = document.getElementById('saveImageBtn');
        const useDefaultBtn = document.getElementById('useDefaultBtn');
        const animationSpeed = document.getElementById('animationSpeed');
        const enableSound = document.getElementById('enableSound');
        const uploadToggleBtn = document.querySelector('.upload-toggle-btn');
        const uploadPanel = document.querySelector('.image-upload-panel');
        
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
        
        function highlight() {
            dropArea.classList.add('drag-over');
        }
        
        function unhighlight() {
            dropArea.classList.remove('drag-over');
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
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
            document.getElementById('previewImage').src = '';
            document.getElementById('previewContainer').classList.remove('show');
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            showNotification('Image removed', 'success');
        });
        
        // Save image button
        saveImageBtn.addEventListener('click', () => {
            const previewImage = document.getElementById('previewImage');
            if (previewImage.src) {
                // Save to localStorage
                localStorage.setItem(CONFIG.STORAGE_KEY, previewImage.src);
                
                // Update loader image
                document.getElementById('loaderImage').src = previewImage.src;
                
                showNotification('Image saved successfully!', 'success');
            } else {
                showNotification('Please select an image first', 'error');
            }
        });
        
        // Use default image button
        useDefaultBtn.addEventListener('click', () => {
            // Set default image
            document.getElementById('loaderImage').src = CONFIG.DEFAULT_IMAGE;
            document.getElementById('previewImage').src = CONFIG.DEFAULT_IMAGE;
            document.getElementById('previewContainer').classList.add('show');
            
            // Save to localStorage
            localStorage.setItem(CONFIG.STORAGE_KEY, CONFIG.DEFAULT_IMAGE);
            
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
            CONFIG.ENABLE_SOUND = enableSound.checked;
            localStorage.setItem('loaderSoundEnabled', enableSound.checked);
        });
        
        // Toggle upload panel
        uploadToggleBtn.addEventListener('click', () => {
            uploadPanel.classList.toggle('active');
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!uploadPanel.contains(e.target) && !uploadToggleBtn.contains(e.target) && uploadPanel.classList.contains('active')) {
                uploadPanel.classList.remove('active');
            }
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
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('previewContainer').classList.add('show');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Public API for controlling the loader
    window.PageLoader = {
        // Show the loader again (useful for single-page applications)
        show: function() {
            const pageLoader = document.getElementById('pageLoader');
            if (pageLoader) {
                pageLoader.style.display = 'flex';
                pageLoader.classList.remove('hidden');
                isLoaderShown = true;
                simulateLoading();
                
                setTimeout(() => {
                    hidePageLoader();
                }, CONFIG.LOAD_TIME);
            }
        },
        
        // Hide the loader immediately
        hide: function() {
            hidePageLoader();
        },
        
        // Set a custom image URL
        setImage: function(imageUrl) {
            if (imageUrl) {
                document.getElementById('loaderImage').src = imageUrl;
                document.getElementById('previewImage').src = imageUrl;
                document.getElementById('previewContainer').classList.add('show');
                localStorage.setItem(CONFIG.STORAGE_KEY, imageUrl);
                showNotification('Image updated successfully!', 'success');
            }
        },
        
        // Set animation speed
        setSpeed: function(speed) {
            if (['slow', 'normal', 'fast'].includes(speed)) {
                applyAnimationSpeed(speed);
                document.getElementById('animationSpeed').value = speed;
                localStorage.setItem('loaderAnimationSpeed', speed);
            }
        },
        
        // Toggle sound
        setSound: function(enabled) {
            CONFIG.ENABLE_SOUND = enabled;
            document.getElementById('enableSound').checked = enabled;
            localStorage.setItem('loaderSoundEnabled', enabled);
        },
        
        // Open upload panel
        openSettings: function() {
            document.querySelector('.image-upload-panel').classList.add('active');
        },
        
        // Close upload panel
        closeSettings: function() {
            document.querySelector('.image-upload-panel').classList.remove('active');
        },
        
        // Check if loader is currently shown
        isShown: function() {
            return isLoaderShown;
        },
        
        // Get current configuration
        getConfig: function() {
            return { ...CONFIG };
        },
        
        // Reset to defaults
        reset: function() {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            localStorage.removeItem('loaderAnimationSpeed');
            localStorage.removeItem('loaderSoundEnabled');
            
            document.getElementById('loaderImage').src = CONFIG.DEFAULT_IMAGE;
            document.getElementById('previewImage').src = '';
            document.getElementById('previewContainer').classList.remove('show');
            document.getElementById('animationSpeed').value = CONFIG.ANIMATION_SPEED;
            document.getElementById('enableSound').checked = CONFIG.ENABLE_SOUND;
            
            applyAnimationSpeed(CONFIG.ANIMATION_SPEED);
            CONFIG.ENABLE_SOUND = false;
            
            showNotification('All settings reset to defaults', 'success');
        }
    };
    
    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Inject styles
        injectStyles();
        
        // Create loader HTML
        createLoaderHTML();
        
        // Setup image upload functionality
        setupImageUpload();
        
        // Initialize the loader
        initPageLoader();
        isLoaderShown = true;
    });
    
    // Also initialize if script is loaded after DOMContentLoaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
            injectStyles();
            createLoaderHTML();
            setupImageUpload();
            initPageLoader();
            isLoaderShown = true;
        }, 1);
    }
})();