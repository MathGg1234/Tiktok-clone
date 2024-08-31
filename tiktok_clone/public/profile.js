document.addEventListener('DOMContentLoaded', () => {
    const settingsModal = document.getElementById('settings-modal');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const closeModal = document.querySelector('.close');
    const profilePhoto = document.getElementById('profile-photo');
    const settingsForm = document.getElementById('settings-form');


    // Charger les informations du profil utilisateur depuis l'API
    async function loadUserProfile() {
        let token = localStorage.getItem('token');
      
        try {
          console.log('Fetching user profile...');
          const response = await fetch('http://localhost:3000/api/user/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
      
          console.log('API response status:', response.status);
          if (response.status === 401) {
            console.log('Token expired. Attempting to refresh...');
            const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
      
            if (!refreshResponse.ok) throw new Error('Failed to refresh token');
      
            const data = await refreshResponse.json();
            token = data.token;
            localStorage.setItem('token', token);
      
            // Retry fetching the profile with the new token
            return loadUserProfile();
          }
      
          if (!response.ok) throw new Error('Failed to fetch user profile');
      
          const user = await response.json();
          console.log('User data received:', user);
          displayUserProfile(user);
        } catch (error) {
          console.error('Error loading user profile:', error);
          alert('Erreur lors du chargement du profil utilisateur.');
        }
      }
      

    // Afficher les informations de l'utilisateur dans le DOM
    function displayUserProfile(user) {
        console.log('Displaying user profile...');
        document.getElementById('username').textContent = user.username;
        document.getElementById('followers-count').textContent = `${user.followers} followers`;
        profilePhoto.src = user.profilePicture || '/images/default-profile.png'; // Utiliser une photo par défaut si aucune n'est définie
        
        // Charger les publications de l'utilisateur
        const userPosts = document.getElementById('user-posts');
        userPosts.innerHTML = ''; // Clear previous posts
        user.posts.forEach((post, index) => {
            console.log(`Displaying post ${index + 1}:`, post);

            const postElement = document.createElement('div');
            postElement.className = 'post';

            // Utilise le bon champ pour le chemin des vidéos
            const videoUrl = `http://localhost:3000${post.imageUrl}`;
            console.log('Video URL:', videoUrl);

            // Créer l'élément vidéo
            const videoElement = document.createElement('video');
            videoElement.src = videoUrl;
            videoElement.controls = true;
            videoElement.className = 'post-video';

            // Ajouter la vidéo et la description au DOM
            postElement.appendChild(videoElement);
            postElement.innerHTML += `<p>${post.description}</p>`;
            userPosts.appendChild(postElement);

            // Ajouter un écouteur pour vérifier si la vidéo charge correctement
            videoElement.onerror = () => {
                console.error(`Failed to load video: ${videoUrl}`);
            };
        });
    }

    // Afficher le modal de paramètres
    editProfileBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    // Fermer le modal
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });



    // Gérer l'envoi du formulaire de paramètres pour mettre à jour la photo de profil
    settingsForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const profilePictureInput = document.getElementById('profile-picture').files[0];
        const formData = new FormData();

        // Vérifie si une nouvelle photo de profil a été sélectionnée
        if (profilePictureInput) {
            formData.append('profilePicture', profilePictureInput);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/user/upload/profile-picture', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to update profile picture');

                // Mettre à jour l'image de profil affichée
                profilePhoto.src = `http://localhost:3000${data.profilePicture}`;
                alert('Photo de profil mise à jour avec succès.');

            } catch (error) {
                console.error('Error updating profile picture:', error);
                alert('Erreur lors de la mise à jour de la photo de profil.');
            }
        } else {
            alert('Veuillez sélectionner une photo de profil à télécharger.');
        }
    });

    // Charger le profil utilisateur au chargement de la page
    loadUserProfile();
});
