var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

var themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("/posts")
        .then(response => response.json())
        .then(posts => {
            // Convert hashtag string into an array for Mustache
            posts.forEach(post => post.hashtags = post.hashtags ? post.hashtags.split(",") : []);
            
            // Render with Mustache.js
            const template = document.getElementById("post-template").innerHTML;
            document.getElementById("posts-container").innerHTML = Mustache.render(template, { posts });

            // Attach Like button events
            document.querySelectorAll(".like-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const postId = this.getAttribute("data-id");
                    fetch(`/like/${postId}`, { method: "POST" })
                        .then(() => this.innerHTML = `❤️ ${parseInt(this.textContent) + 1} Likes`)
                        .catch(error => console.error("Error liking post:", error));
                });
            });
        })
        .catch(error => console.error("Error fetching posts:", error));
});
