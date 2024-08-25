import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { UserContext } from './UserContext';

const Header = () => {
  const{setUserInfo , userInfo } = useContext(UserContext);
    
  const username = userInfo?.username;

      useEffect(()=> {
          fetch('https://blog-app-api-gamma.vercel.app/profile' , {
            credentials: 'include',
          }).then(response=> {
             response.json().then(userInfo => {
               setUserInfo(userInfo);
             });
          })
      },[]);
 function logout() {
    fetch('https://blog-app-api-gamma.vercel.app/logout' , {
           credentials :'include' ,
           method : 'POST' ,
    });
      setUserInfo(null);
 }
  

  return (
    <header>
    <Link to='/' className='.logo'>My Blog</Link>
 <nav>
     {username && (
        <>
          <div>{username}</div>
         <Link to='/create' >Create new Post</Link>
         <a onClick={logout}>logout</a>
        </>
     )}
     {!username && (
       <>
        <Link to={'/login'}> Login</Link>
       <Link to={'/register'}> Register</Link>
       </>
     )

     }
   
 </nav>
  </header>
  )
}

export default Header
