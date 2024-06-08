import { useState } from 'react';
import io from 'socket.io-client'
import { FaUser, FaUsers, FaSignal} from 'react-icons/fa6';
import '../App.css'

const username = localStorage.getItem('NickName_IH');
const id = localStorage.getItem('id_IH');

let estado = 'OffLive';

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

const notificacion = (msn:any) => {
  if(Notification.permission === 'granted'){
     const nueva_notificacion = new Notification('Nuevo m;ensaje...',{

     })
     nueva_notificacion.onclick = function(){
      window.open('http://localhost:5173');
    }
  }
}

let clientConnet :Object [];

socket.on( 'connect', () =>{
  estado = 'Onlive';
  permisoAlerta();
})
socket.on('disconnect', ()=> {
  estado = 'OffLive';
})

socket.on('on-clients-changed', (data) =>{
  clientConnet = data.filter((elm:any) => elm.name != username)

  console.log(clientConnet);
});

socket.on('welcome-message',msn =>{
  console.log(msn);
});
socket.on('msn-alerta-new-user', (msn) =>{
  console.log(msn +' se ha conectado...');

})

const renderMessage = ( payload:any, adjunto = false ) => {
  const chat = document.querySelector('#chat');
  const {userId, message, name, date, tipo, nickname_receptor } = payload;

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

socket.on('on-message', (data) =>{
   renderMessage(data, false);
})

socket.on('msn-private', (data) =>{
  console.log('mensaje privado');
  console.log(data)
  renderMessage(data, false);
});

const privateChat = (arg:any) =>{
  
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

socket.on('file-send', (data) =>{
    console.log(data);
    renderMessage(data, true)
})

function Chat() {

  if(!username){
      window.location.replace('/');
      throw new Error('Username  requerido');
  }
  const [message, setMessage] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit('send-message',message);
    setMessage('');
    console.log(message)
  }

  const Salida = ()=>{
    localStorage.removeItem('NickName_IH');
    localStorage.removeItem('id_IH');
    window.location.replace('/');
  }

  return (
    <div id='contenedor'>

        <div className='row'>
            <div className='col-3 pe-0 me-0'>
              <div className='vh-100 text-white' id='user-onlive'>
                <div id='top-user-onlive'>
                  Usuarios Onlive
                </div>
                <ul className='list-unstyled my-0 mx-4' id='users_connecteds'>
                  {clientConnet?.map((elm:any, index) =>(
                  <li key={index} className='py-3 px-0 mx-0 border-bottom' id='items' onClick={() => privateChat(elm)}>
                    <div className='d-flex justify-content-between ps-3'>
                      <div className='d-flex flex-row' >
                        <div>
                          <FaUser width={40} />
                          <span className="badge bg-success badge-dot"></span>
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0 px-3 text-white">{elm.name}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  ))}
                </ul>
                <div className='row' id='nickname'>
                  <div className="col-8">
                    <span id='nickname_title'>NickName: </span>
                    <span id='nickname_user'>
                      {socket.auth.name} 
                    </span>
                  </div>
                  <div className="col-4">
                    <span id='nickname_title'> <FaSignal /> { estado } </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-9 px-0 mx-0'>
                <div className='row px-0 mx-0' id='top-chat'>
                    <div className='col-8 mx-0 pe-0 ps-2 py-2 text-start'>
                        <span className=''>
                            <FaUsers  className='rounded fs-1 border border-1 px-1'/>
                        </span>
                        <span className='px-3 fs-4 py-4 d-block-inline'>
                            Sala de chat General
                        </span>
                    </div>
                    <div className='col-4'>
                        <div className='text-end px-4 py-2'>
                            <span className='btn btn-danger' onClick={Salida}>Desconectarse</span>
                        </div>
                    </div>
                </div>
                <div id='chat' className='salida-chat'></div>
                <div className='position-absolute bottom-0 end-0' id='sticky'>
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
  )
}

export default Chat
