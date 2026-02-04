document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postId = this.dataset.postId;

            // If the user is logged in, send the like via AJAX
            if (likeButtonData.nonce) {
                fetch(likeButtonData.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'handle_like',
                        post_id: postId,
                        nonce: likeButtonData.nonce,
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Toggle the "liked" class based on the response action
                            if (data.data.action === 'liked') {
                                button.classList.add('icon-heart-filled');
                                button.classList.remove('icon-heart');
                            } else {
                                button.classList.add('icon-heart');
                                button.classList.remove('icon-heart-filled');
                            }
                        } else {
                            console.error(data.data.message);
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                // If the user is not logged in, use localStorage
                let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];

                if (likedPosts.includes(postId)) {
                    likedPosts = likedPosts.filter(id => id !== postId);
                    button.classList.add('icon-heart-filled');
                    button.classList.remove('icon-heart');
                } else {
                    likedPosts.push(postId);
                    button.classList.add('icon-heart');
                    button.classList.remove('icon-heart-filled');
                }

                localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            }
        });
    });

    // Set initial state for localStorage likes
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
    likeButtons.forEach(button => {
        if (likedPosts.includes(button.dataset.postId)) {
            button.classList.add('icon-heart-filled');
            button.classList.remove('icon-heart');
        }
    });
});
