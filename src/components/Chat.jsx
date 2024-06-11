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
  window.location.replace('/');
}

const privateChat = (arg) =>{
  let msn = prompt('Digitar mensaje privado a '+arg.name);
  if(msn != ""){
    console.log(msn, arg.name);
    socket.emit('ini-msn-private', {
      'emisor': username,
      'id_emisor': id,
      'msn': msn,
      'receptor':arg.name,
      'id_receptor':arg.id,
    })
  }
}

socket.on('msn-private', (data) =>{
  console.log('mensaje privado');
  console.log(data)
  renderMessage(data, false);
});

const renderMessage = ( payload, adjunto = false ) => {
  const chat = document.querySelector('#chat');
  const {userId, message, name, date, tipo, room, nickname_receptor } = payload;

  const divElement = document.createElement( 'div' );
  divElement.classList.add( 'message' );
  
  let mensajero = name;
  if(tipo === 'private') mensajero = `${ name } [ En Privado  ]`;
  let msn = '';
  if ( userId != socket.id ){
      divElement.classList.add( 'incoming' );
      msn = ` <div id='title-foraneo'>${ mensajero }</div>
              <div id='msn-foraneo'>  ${ message } </div>`;
      if(!adjunto){
      msn+= `<div id='msn-fecha-foraneo'>
                <span id='hora'>
                  Hora ${ date.hora} : ${ date.minuto } : ${ date.segundo }
                </span>
                <span id='space'>|</span>
                <span id='fecha'>
                  ${ date.dia_semana_letra.substring(0.3)}  ${ date.dia } de ${ date.mes_letra } de ${ date.anio }
                </span>
              </div>`;
      }
  }else{
    mensajero = 'Yo';
    if(tipo === 'private') mensajero = `Yo [ Privado con ${ nickname_receptor } ]`;
    msn = `<div id='title-propio'>${ mensajero }</div>
            <div id='msn-propio'>  ${ message } </div>`;
    if(!adjunto){
    msn+= ` <div id='msn-fecha-propio'>
              <span id='hora'>
                Hora ${ date.hora} : ${ date.minuto } : ${ date.segundo }
              </span>
              <span id='space'>|</span>
              <span id='fecha'>
                ${ date.dia_semana_letra.substring(0.3)}  ${ date.dia } de ${ date.mes_letra } de ${ date.anio }
              </span>
            </div>`;
    }else{
      msn+= 'Descargar '+date.file;
    }
  }
  divElement.innerHTML = msn; 
  chat?.appendChild( divElement );
  chat?.lastElementChild?.scrollIntoView({behavior: 'smooth', block: 'end' });

  //notificacion(msn);
}



function Chat() {

  const [clientConnet, setCLientConnet] = useState([])
  const [messageAll, setMessageAll] = useState([])
  const [estado, setEstado] = useState("OffLive");
  const [room, setSala] = useState('Sala general');
  const [roomid, setSalaid] = useState('sala_general')

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
  const [message, setMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('send-message',message);
    setMessage('');
    console.log(message)
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
                      messageAll.map((elm, index) =>{
                        return(
                          <>
                          { (elm.room  === roomid && (elm.tipo == 'public' || elm.tipo == 'private')) && 
                          
                          <div key={index}>
                            <div id={(socket.id === elm.userId) ?'title-propio':'title-foraneo' }> 
                                {elm.name}
                            </div>
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
                          <div key={index}>
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
