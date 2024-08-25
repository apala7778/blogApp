import React, { useState } from 'react'

const RegisterPage = () => {
    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');

    async function register(ev) {
         ev.preventDefault();
         
           const response = await  fetch('https://blog-app-api-gamma.vercel.app/register', {
                method: 'POST',
                body: JSON.stringify({username , password}),
                headers: {'Content-Type': 'application/json'},
             });
             
        if(response.status === 200)  {
            alert('registration successful');
        }  
        else {
            alert('registration failed');
        }  
       
      
    }

  return (
    <form onSubmit={register} className='register'>
        <h1>register</h1>
    <input type='text'
     value={username}
      onChange={(ev)=>  setUsername(ev.target.value)}
       placeholder='username' />
    <input type='password'
     value={password} 
     onChange={(ev)=>  setPassword(ev.target.value)} 
     placeholder='password' />

    < button className='button'>Register</button>

  </form>
  )
}

export default RegisterPage
