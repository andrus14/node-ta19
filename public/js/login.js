const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');


loginButton.addEventListener('click', e => {
    const data = {username: usernameInput.value, password: passwordInput.value};

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(data => {
        if ( data.response == 'success' ) {
            window.location.href = "/";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

});