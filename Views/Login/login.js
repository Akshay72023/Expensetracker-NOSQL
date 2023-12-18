const loginBtn= document.getElementById('login-btn');
loginBtn.addEventListener('click',
    async function(e){
        e.preventDefault();
        const email= document.getElementById('email').value;
        const password= document.getElementById('password').value;

        const obj= {
            email,
            password
        }
        try{
            const response= await axios.post('http://localhost:5000/user/login',obj)
            //console.log(response);
                if(response.status === 201){
                    localStorage.setItem('token', response.data.token);
                    alert(response.data.message);
                    window.location.href = '../Expense/expense.html';
                }
        }
        catch(error){
            if(error.response.status=== 404){
                alert(error.response.data.err);
            }
            else if(error.response.status===401){
                alert(error.response.data.err);
            }
            console.log(error);
    };

});