let post_diary = document.getElementById("post-diary")

console.log("this works!!!")

function handleSubmit(event) {
    event.preventDefault();

    let post = document.getElementById('post');
    let hashtags = document.getElementById('hashtags');
    let terms = document.getElementById('invalidCheck');
    console.log(terms.checked)

    let errors = [];
    let was_errors = false;
    let output = document.getElementById('error-output');
    let radio_output = document.getElementById('radio-error-output')

    // Clear existing error classes
    post.classList.remove('is-invalid');
    hashtags.classList.remove('is-invalid');

    if (post.value === "") {
        post.classList.add('is-invalid');
        errors.push("Please enter your diary entry.");
        was_errors = true;
    }

    if (hashtags.value === "") {
        hashtags.classList.add('is-invalid');
        errors.push("Please enter at least 1 hashtag.");
        was_errors = true;
    }

    if (terms.checked === false) {
        terms.classList.add('is-invalid')
        radio_output.innerHTML = "You must agree before submitting."
    }

    if (terms.checked === true) {
        terms.classList.remove('is-invalid')
        radio_output.innerHTML = ""
    }

    if (was_errors) {
        output.innerHTML = errors.join('<br>');
        output.classList.add('alert', 'alert-danger');
    } else {
        output.classList.remove('alert-danger');
    }
}

post_diary.addEventListener('submit', handleSubmit);
