import React, { useState } from 'react';

import { Navigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Editor from '../Editor' ;

const CreatePost = () => {
   const[title , setTitle] = useState('');
   const[summary , setSummary] = useState('');
   const[content , setContent] = useState('');
   
   const[redirect , setRedirect] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null);

   const handleFileChange = (event) => {
     const fileList = event.target.files;
     setSelectedFile(fileList);
   };

  async  function createNewPost(ev) {
      const data = new FormData();
         data.set('title' , title);
         data.set('summary' , summary);
         data.set('content' , content);
         data.set('file' , selectedFile[0]);
        ev.preventDefault();
     const response = await   fetch('https://blog-app-api-gamma.vercel.app/api/post', {
         method: 'POST' , 
          body: data,
          credentials: 'include' ,
        });
        if(response.ok) {
          setRedirect(true);
        }
      
    }

        if (redirect) {
         return <Navigate to={'/'} />
        }
  return (
     <form onSubmit={createNewPost}>
        <input type='title' 
           value={title}
           onChange={(ev)=> setTitle(ev.target.value)}
        placeholder={'Title'} />
        <input type='summary'
             value={summary}
             onChange={(ev)=> setSummary(ev.target.value)} 
         placeholder={'Summary'} />
           <input type="file" onChange={handleFileChange} />
         <Editor value={content} 
          
            onChange={setContent} 
          />
         <button className='.button' style={{marginTop: '5px'}}>Create Post</button>
     </form>
  )
}

export default CreatePost
