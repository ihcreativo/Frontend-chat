import { useState } from 'react'
import io from 'socket.io-client'
import {ListaUsuarios}  from './ListaUsuarios'
import { Room } from './Room'
import { FaUser, FaUsers, FaSignal} from 'react-icons/fa6'
//import '../App.css'

const username = localStorage.getItem('NickName_IH');
const id = localStorage.getItem('id_IH');

const socket = io("/",{
  auth: {
      'name': username,
      'id': id,
  }
});

const permisoAlerta =() =>{
  Notification.requestPermission().then(resultado => {
    console.log('permiso', resultado);
  })
}

const notificacion = (msn) => {
  if(Notification.permission === 'granted'){
     const nueva_notificacion = new Notification('Nuevo m;ensaje...',{

     })
     nueva_notificacion.onclick = function(){
      window.open('http://localhost:5173');
    }
  }
}
const Salida = ()=>{
  localStorage.removeItem('NickName_IH');
  localStorage.removeItem('id_IH');
  socket.disconnect();
  window.location.replace('/');
}


function Chat() {

  const [clientConnet, setCLientConnet] = useState([])
  const [messageAll, setMessageAll] = useState([])
  const [estado, setEstado] = useState("OffLive");
  const [room, setSala] = useState('Sala general');
  const [roomid, setSalaid] = useState('sala_general');
  const [room_tipo, setRoomTipo] = useState('piblic');

  const privateChat = (arg) =>{
    console.log('datos-privados')
    // id, name, socket
    arg.tipo = 'private';
    setSala(arg.name);
    setSalaid(arg.id);
    setRoomTipo(arg.tipo);
    console.log(arg);
    // let msn = prompt('Digitar mensaje privado a '+arg.name);
    // if(msn != ""){
    //   console.log(msn, arg.name);
    //   socket.emit('ini-msn-private', {
    //     'emisor': username,
    //     'id_emisor': id,
    //     'msn': msn,
    //     'receptor':arg.name,
    //     'id_receptor':arg.id,
    //   })
    // }
  }
  
  socket.on('msn-private', (data) =>{
    console.log('mensaje -sala room');
    console.log(data)
    setMessageAll([...messageAll, data]);
  
  });
  
  socket.on('on-message', (data) =>{
    setMessageAll([ ...messageAll, data]);
    console.log(data);
    onload();
  })
  
  const setRoom = (arg) =>{
    socket.emit('joinroom',
    {
      'room':arg.room,
      'id':arg.id,
      'room_close':room,
      'room_id_close':roomid,
    })
    setSala(arg.room);
    setSalaid(arg.id);
    setRoomTipo('public');
  }
  const [message, setMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if(room_tipo === 'public'){
      socket.emit('send-message',message);
    }else{
      socket.emit('ini-msn-private', {
        'emisor': username,
        'id_emisor': id,
        'msn': message,
        'receptor':room,
        'room':room,
        'roomid':roomid,
        'tipo':room_tipo,
      }) 
    }
    setMessage('');
    console.log(message)
  }
  
  socket.on('room_connect', (data) =>{
    setMessageAll([ ...messageAll, data]);
    console.log(data);
  })
  socket.on('room_close', (data) =>{
    setMessageAll([ ...messageAll, data]);
    console.log(data);
  })
  socket.on( 'connect', () =>{
    setEstado('Onlive')
  })

  socket.on('disconnect', ()=> {
    setEstado('OffLive');
  })
  
  socket.on('welcome-message',msn =>{
    console.log(msn);
  });
  
  socket.on('msn-alerta-new-user', (msn) =>{
    console.log(msn +' se ha conectado...');
  })

  socket.on('on-clients-changed', (data) =>{
    setCLientConnet(data.filter((elm) => elm.name != username));
  });

  if(!username){
      window.location.replace('/');
      throw new Error('Username  requerido');
  }
  

  const onload = () => {
    setInterval(function(){if(window.parar)return;document.getElementById('chat').scrollTop=document.getElementById('chat').scrollHeight},100);
  }

  return (
    <div id='contenedor'>

         <div className='row'>      
            <div className='col-lg-3 col-sm-12'>
              <div className='card text-white' id='user-onlive'>
                <div id='top-user-onlive'>
                  Usuarios Onlive
                </div>
                <div id='users_connecteds'>
                    <ListaUsuarios dato={clientConnet}  privateChat={privateChat} />
                </div>
                
                <div className='row' id='nickname'>
                  <div className="col-8">  
                    <span id='nickname_title'>NickName: </span>
                    <span id='nickname_user'>
                      {socket.auth.name} 
                    </span>
                  </div>
                  <div className="col-4">
                    <span id='nickname_title'> 
                      <FaSignal /> 
                      { estado } </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-9 col-sm-12'>
              <div className='card'>
                <div className='card-body'>
                <div className='row px-0 mx-0' id='top-chat'>
                    <div className='col-8 mx-0 pe-0 ps-2 py-2 text-start'>

                      <span className=''>
                          <FaUsers  className='rounded fs-1 border border-1 px-1'/>
                      </span>
                      <span className='fs-4 ps-3 fw-1'>
                          {room}
                      </span>
                    </div>
                    
                    <div className='col-4 px-0'>
                        <div className='text-end px-0 py-2'>
                            <span className='btn btn-danger' onClick={Salida}>Desconectarse</span>
                        </div>
                    </div>
                  </div>
                  <Room setRoom={setRoom} />
                  </div>
                </div>
                <div className='card my-3'>
                  <div className='card-body salida-chat' id='chat'>

                    {
                      messageAll.map((elm, i) =>{
                        return(
                          <>
                          { (elm.room  === roomid && (elm.tipo == 'public' || elm.tipo == 'private')) && 
                          
                          <div key={i}>
                            {elm.userId === socket.id &&
                            <div id='title-propio'> 
                                Yo
                            </div>
                            }
                            {elm.userId != socket.id &&
                            <div id='title-foraneo'> 
                                {elm.name} 
                            </div>
                            }
                            <div id={(socket.id === elm.userId) ? 'msn-propio':'msn-foraneo'}> { elm.message } </div>
                            <div id={(socket.id === elm.userId) ? 'msn-fecha-propio':'msn-fecha-foraneo'}>
                              <span id='hora'>
                                Hora { elm.date.hora} : { elm.date.minuto } : { elm.date.segundo }
                              </span>
                              <span id='space'>|</span>
                              <span id='fecha'>
                                { elm.date.dia_semana_letra.substring(0.3)}  { elm.date.dia } de { elm.date.mes_letra } de { elm.date.anio }
                              </span>
                            </div>
                          
                          </div>
                          }
                            
                          { (elm.room  === roomid && (elm.tipo == 'general_off' || elm.tipo == 'general_on')) &&
                          <div key={i}>
                              <div id='general_off'> 
                                {elm.message} 
                              </div>
                            </div>
                          } 
                          </>
                        )
                      })
                    }
          
                  </div>
                </div>
                
                <div className='card'>
                  <div className='card-body'>
                    <form onSubmit={handleSubmit}>

                      <div className="input-group-xl">
                          <input type="text"
                            placeholder="Mensaje..."
                            value={message}
                            aria-describedby="basic-addon2"
                            onChange={(e) => setMessage(e.target.value)}
                            className="vw-80 form-control form-control-xl"
                            id="input-msn"
                          />

                          {/*<button className="btn btn-primary" onClick={handleSubmit}><FaPaperPlane/></button>
                          <input type='file' name='file' onChange={handleFile}/> */}
                      </div>
                    </form>
                  </div>
                </div>
            </div>
        </div>
       
    </div>   
  )
}
export default Chat
