document.addEventListener('DOMContentLoaded', () => {
    const uploadLink = document.getElementById('upload-link');
    const uploadModal = document.getElementById('upload-modal');
    const closeModal = document.querySelectorAll('.close');
    const uploadForm = document.getElementById('upload-form');
    const videoContainer = document.getElementById('video-container');

    // Fonction pour vÃ©rifier si l'utilisateur est connectÃ©
    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            uploadLink.style.display = 'inline'; // Affiche le lien d'upload
            document.getElementById('form-link').style.display = 'none'; // Masque le bouton "Formulaire"
            document.getElementById('profile-icon').style.display = 'inline'; // Affiche l'icÃ´ne de profil
        } else {
            uploadLink.style.display = 'none'; // Masque le lien d'upload
            document.getElementById('form-link').style.display = 'inline'; // Affiche le bouton "Formulaire"
            document.getElementById('profile-icon').style.display = 'none'; // Masque l'icÃ´ne de profil
        }
    }
    

    // Appeler la fonction de vÃ©rification au chargement de la page
    checkLoginStatus();

    // Afficher la modale d'upload
    uploadLink.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    // Fermer les modales
    closeModal.forEach((btn) => {
        btn.addEventListener('click', () => {
            uploadModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == uploadModal) {
            uploadModal.style.display = 'none';
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
            const response = await fetch('https://nutix.fun/api/videos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Video uploaded successfully');
                uploadModal.style.display = 'none';
                loadVideos(); // Recharger les vidÃ©os aprÃ¨s l'upload
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
            const response = await fetch('https://nutix.fun/api/videos');
            const videos = await response.json();

            videoContainer.innerHTML = ''; // Clear previous videos
            videos.forEach(video => {
                const videoElement = document.createElement('video');
                videoElement.src = `https://nutix.fun/${video.videoUrl}`;
                videoElement.controls = true;
                videoContainer.appendChild(videoElement);
            });
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }


    document.getElementById('profile-image').addEventListener('click', () => {
        window.location.href = 'profile.html'; // Redirige vers la page de profil
    });
    

    loadVideos();
});
