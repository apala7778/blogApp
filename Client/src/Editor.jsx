import React from 'react'
import ReactQuill from 'react-quill' ;
import 'react-quill/dist/quill.snow.css';

const Editor =  ({value , onChange }) => {

  return (
    <div>
       <ReactQuill 
          value={value}
          theme={'snow'}
          onChange={onChange}
          modules={modules} />
     </div>
  ) ;   
}

export default Editor


