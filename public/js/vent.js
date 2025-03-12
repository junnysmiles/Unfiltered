const axios = require('axios')
let post_diary = document.getElementById("post-diary")

async function handleSubmit(event) {
    event.preventDefault();

    let post = document.getElementById('post');
    let hashtags = document.getElementById('hashtags');
    let terms = document.getElementById('invalidCheck');

    let errors = [];
    let was_errors = false;
    let output = document.getElementById('error-output');
    let radio_output = document.getElementById('radio-error-output')

    output.innerHTML = "";
    output.classList.remove('alert', 'alert-danger', 'alert-success');
    
    // Clear existing error classes
    post.classList.remove('is-invalid');
    hashtags.classList.remove('is-invalid');
    terms.classList.remove('is-invalid')

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

    if (!terms.checked) {
        terms.classList.add('is-invalid');
        radio_output.innerHTML = "You must agree before submitting.";
        was_errors = true;
    } else {
        radio_output.innerHTML = "";
    }

    if (was_errors) {
        output.innerHTML = errors.join('<br>');
        output.classList.add('alert', 'alert-danger');
    }     

    try {
        let response = await axios.post("http://localhost:3000/addpost", {
            post: post.value,
            hashtags: hashtags.value
        });

        if (response.data.success) {
            output.innerHTML = "Post Submitted!";
            output.classList.add('alert', 'alert-success');

            // Clear the form
            post.value = "";
            hashtags.value = "";
            terms.checked = false;
        } else {
            output.innerHTML = "Something went wrong!";
            output.classList.add('alert', 'alert-danger');
        }
    } catch (error) {
        console.error("Submission failed:", error);
        output.innerHTML = "<p>Something went wrong. Please try again.</p>";
        output.classList.add('alert', 'alert-danger');
    }
}

post_diary.addEventListener('submit', handleSubmit);
