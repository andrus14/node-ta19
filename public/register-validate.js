const submit = document.getElementById("register-button");

submit.addEventListener("click", validate);

function validate(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const passwordAgain = document.getElementById("password-again").value;

  if (!username || username === '') {
    const nameError = document.getElementById("username-error");
    nameError.innerHTML = `
        <p class="text-red-500">Username not valid!</p>
    `
  }

  if(password.length < 6 || !password) {
    const passwordError = document.getElementById("password-error");
    passwordError.innerHTML = `
        <p class="text-red-500">Password not valid!</p>
    `
  }

  if(!password === passwordAgain) {
    const passwordAgainError = document.getElementById("password-again-error");
    passwordAgainError.innerHTML = `
        <p class="text-red-500">Password must be the same!</p>
    `
  }
}
