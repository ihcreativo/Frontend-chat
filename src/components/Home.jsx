import { useState } from 'react';
import '../App.css'

function generateUUID () {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function Home() {
 
  if(localStorage.getItem('NickName_IH')){
      window.location.replace('/chat');
      throw new Error('Username  requerido');
  }

  const [nickname, setNickName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    //const name = input.value;
    if ( nickname ) {

      localStorage.setItem('NickName_IH', nickname);
      localStorage.setItem('id_IH', generateUUID());
      window.location.href = '/chat';   
    }
 
  }
  
  return (
    <div className='container' id='access'>
        <div className='card py-5 px-5'>
            <form  onSubmit={handleSubmit}>
                <label htmlFor="">
                  
                </label>
                <input className='form-control mb-5' type="text" required placeholder="Digite su Nickname..." 
                    onChange={(e) => setNickName(e.target.value)} 
                />
                <button className='btn btn-primary'>Ingresar</button>
            </form> 
        </div>
    </div>
  )
}
  export default Home

