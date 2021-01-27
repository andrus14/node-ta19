const registerButton = document.getElementById('register-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

registerButton.addEventListener('click', e => {
    console.log(314);
    const data = {username: usernameInput.value, password: passwordInput.value};

    fetch('/register', {
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
        } else if (data == "errorUserExists") {
            $("#register-error").textContent("User already exists!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

});
