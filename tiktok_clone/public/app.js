document.addEventListener('DOMContentLoaded', () => {
    const loginRegisterLink = document.getElementById('login-register-link');
    const uploadLink = document.getElementById('upload-link');
    const authModal = document.getElementById('auth-modal');
    const uploadModal = document.getElementById('upload-modal');
    const closeModal = document.querySelectorAll('.close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const uploadForm = document.getElementById('upload-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginContent = document.getElementById('Login');
    const registerContent = document.getElementById('Register');
    const videoContainer = document.getElementById('video-container');

    // Fonction pour vérifier si l'utilisateur est connecté
    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            loginRegisterLink.style.display = 'none';
            uploadLink.style.display = 'inline';
        }
    }

    // Appeler la fonction de vérification au chargement de la page
    checkLoginStatus();

    // Afficher la modale de connexion/inscription
    loginRegisterLink.addEventListener('click', () => {
        authModal.style.display = 'block';
        loginTab.classList.add('active');
        loginContent.classList.add('active');
    });

    // Afficher la modale d'upload
    uploadLink.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    // Fermer les modales
    closeModal.forEach((btn) => {
        btn.addEventListener('click', () => {
            authModal.style.display = 'none';
            uploadModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == authModal) {
            authModal.style.display = 'none';
        }
        if (event.target == uploadModal) {
            uploadModal.style.display = 'none';
        }
    });

    // Gérer les onglets Login/Register
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginContent.classList.add('active');
        registerContent.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerContent.classList.add('active');
        loginContent.classList.remove('active');
    });

    // Handle login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('Login successful');
                authModal.style.display = 'none';
                loginRegisterLink.style.display = 'none';
                uploadLink.style.display = 'inline';
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });

    // Handle register
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                alert('Registration successful. Please login.');
                registerTab.click(); // Basculer vers l'onglet de connexion
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });

    // Handle video upload
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const videoFile = document.getElementById('video-file').files[0];
        const description = document.getElementById('video-description').value;

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('description', description);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/api/videos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Video uploaded successfully');
                uploadModal.style.display = 'none';
                loadVideos(); // Recharger les vidéos après l'upload
            } else {
                alert('Video upload failed');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    });

    // Load videos
    async function loadVideos() {
        try {
            const response = await fetch('http://localhost:3000/api/videos');
            const videos = await response.json();

            videoContainer.innerHTML = ''; // Clear previous videos
            videos.forEach(video => {
                const videoElement = document.createElement('video');
                videoElement.src = `http://localhost:3000/${video.videoUrl}`;
                videoElement.controls = true;
                videoContainer.appendChild(videoElement);
            });
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }

    loadVideos();
});
