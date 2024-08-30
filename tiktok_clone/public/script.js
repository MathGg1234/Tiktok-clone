const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginButton = document.getElementById('login');
    const registerButton = document.getElementById('register');
    const container = document.getElementById('container');
    const notification = document.getElementById('notification');
    const notificationBody = document.getElementById('notification-body');

    // Fonction pour afficher les notifications
    function showNotification(message, isSuccess = true) {
        notificationBody.textContent = message;
        notification.className = isSuccess ? 'notification' : 'notification notificationBad';
        notification.style.opacity = 1;
        notification.style.visibility = 'visible';
        setTimeout(() => {
            notification.style.opacity = 0;
            notification.style.visibility = 'hidden';
        }, 3000);
    }

    // GÃ©rer les boutons pour basculer entre connexion et inscription
    loginButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active'); // Basculer vers le mode connexion
    });

    registerButton.addEventListener('click', () => {
        container.classList.add('right-panel-active'); // Basculer vers le mode inscription
    });

    // GÃ©rer la connexion
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('https://nutix.fun/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                const errorData = await response.json();
                showNotification(`Login failed: ${errorData.message || 'Unknown error'}`, false);
            }
        } catch (error) {
            console.error('Error during login:', error);
            showNotification('Error during login. Please try again.', false);
        }
    });

    // GÃ©rer l'inscription avec connexion automatique
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('https://nutix.fun/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                showNotification('Registration successful. You are now logged in.');
                // Connexion automatique aprÃ¨s inscription
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                const errorData = await response.json();
                showNotification(`Registration failed: ${errorData.message || 'Unknown error'}`, false);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            showNotification('Error during registration. Please try again.', false);
        }
    });
});
