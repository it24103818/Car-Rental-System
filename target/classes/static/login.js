// login.js

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Make sure to check these values against your backend authentication service
    fetch('/api/authenticate', {  // Assuming you have a POST endpoint for authentication
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                document.getElementById('error-message').style.display = 'block';  // Show error if authentication fails
            } else {
                window.location.href = '/dashboard';  // Redirect to dashboard or home page
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').style.display = 'block';  // Show error message
        });
});

