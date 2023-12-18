const signupButton = document.getElementById('signup-btn');
signupButton.addEventListener('click', async function(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await axios.post('http://localhost:5000/user/signup', user);
        if (response.status === 201) {
            alert(response.data.message);
            window.location.href = '../Login/login.html';
        }
    } catch (error) {
        if (error.response.status === 400 && error.response.data.err === 'User already exists') {
            alert(error.response.data.err);
        } else {
            console.error(error);
            document.body.innerHTML += `<div >Error: ${error.message} <div>`;
        }
    }
});
