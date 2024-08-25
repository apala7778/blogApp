import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const LoginPage = () => {
    const[username , setUsername] = useState('');
    const[password , setPassword] = useState('');
    const[ redirect , setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
   
 async   function login(ev) {
        ev.preventDefault();

    const response =  await  fetch('https://blog-app-api-gamma.vercel.app/login', {
            method: 'POST' ,
            body: JSON.stringify({username , password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include' ,
        });
        if(response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            })
          
            alert('login successful');
        }
        else {
            alert('wrong credentials');
        }
    }

    if(redirect) {
        return <Navigate to={'/'} />
    }

  return (
    <form action="" className='login' onSubmit={login}>
        <h1>login</h1>
    <input type='text' 
       value={username}
       onChange={(ev)=> setUsername(ev.target.value) }
    placeholder='username' />
    <input type='password'
      value={password}
      onChange={(ev)=> setPassword(ev.target.value) }
     placeholder='password' />
    <button className='.button'>login</button>

  </form>
  )
}

export default LoginPage
