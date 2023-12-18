const forgotBtn= document.getElementById('forgotpassword');
forgotBtn.addEventListener('click',async function(e){
    e.preventDefault();
    const email= document.getElementById('email').value;
    const obj={
        email
    }
    console.log(obj);
    //console.log(email);
    const respone= await axios.post('http://localhost:5000/password/forgotpassword',obj);
    //console.log(respone);
    try{
        if(respone.status === 200){
           document.getElementById('message').textContent= 'Mail sent successfully';
        } else {
            throw new Error('Something went wrong!!!')
        }
    }catch(err ) {
        console.log(err);
    }
})