let contact = document.getElementById("contact-form")

async function handleSubmit(event) {
    event.preventDefault();

    let firstName = document.getElementById('firstname');
    let lastName = document.getElementById('lastname');
    let email = document.getElementById('email');
    let message = document.getElementById('message');

    let errors = [];
    let was_errors = false;
    let output = document.getElementById('contact-output');

    // Clear existing error classes
    firstName.classList.remove('is-invalid');
    lastName.classList.remove('is-invalid');
    email.classList.remove('is-invalid')
    message.classList.remove('is-invalid')

    if (firstName.value === "") {
        firstName.classList.add('is-invalid');
        errors.push("Please enter first name.");
        was_errors = true;
    }

    if (lastName.value === "") {
        lastName.classList.add('is-invalid');
        errors.push("Please enter your last name.");
        was_errors = true;
    }

    if (email.value === "") {
        email.classList.add('is-invalid');
        errors.push("Please enter your email.");
        was_errors = true;
    }

    if (message.value === "") {
        message.classList.add('is-invalid');
        errors.push("Please enter your message.");
        was_errors = true;
    }

    if (was_errors) {
        output.innerHTML = errors.join('<br>');
        output.classList.add('alert', 'alert-danger');
    } else {
        output.innerHTML = ""
        output.classList.remove('alert-danger');
    }
}

contact.addEventListener('submit', handleSubmit);
