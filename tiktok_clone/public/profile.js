document.addEventListener('DOMContentLoaded', () => {
    const settingsModal = document.getElementById('settings-modal');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const closeModal = document.querySelector('.close');
    const profilePhoto = document.getElementById('profile-photo');

    // Charger les informations du profil utilisateur depuis l'API
    async function loadUserProfile() {
        const token = localStorage.getItem('token');

        try {
            // RequÃªte sÃ©curisÃ©e pour rÃ©cupÃ©rer les donnÃ©es de l'utilisateur
            const response = await fetch('https://nutix.fun/api/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Utilisation du token pour sÃ©curiser la requÃªte
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const user = await response.json();
            displayUserProfile(user);

        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    // Afficher les informations de l'utilisateur dans le DOM
    function displayUserProfile(user) {
        document.getElementById('username').textContent = user.username;
        document.getElementById('followers-count').textContent = `${user.followers} followers`;
        profilePhoto.src = user.profilePicture || '/images/default-profile.png'; // Utiliser une photo par dÃ©faut si aucune n'est dÃ©finie
        
        // Charger les publications de l'utilisateur
        const userPosts = document.getElementById('user-posts');
        userPosts.innerHTML = ''; // Clear previous posts
        user.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `<img src="${post.imageUrl}" alt="${post.title}"><p>${post.title}</p>`;
            userPosts.appendChild(postElement);
        });
    }

    // Afficher le modal de paramÃ¨tres
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

    // Charger le profil utilisateur au chargement de la page
    loadUserProfile();
});
