
import { useState } from 'react';
//import '../App.css'

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
  
  const handleSubmit = (e:any) => {
    e.preventDefault();
    //const name = input.value;
    if ( nickname ) {

      localStorage.setItem('NickName_IH', nickname);
      localStorage.setItem('id_IH', generateUUID());
      window.location.href = '/chat';   
    }
 
  }
  
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Digite su NickName" 
                onChange={(e) => setNickName(e.target.value)} 
            />
            <button>Acce</button>
        </form> 
    </div>
  )
}
  export default Home

