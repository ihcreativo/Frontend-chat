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
  },
  reconnectionDelay: 10000, // defaults to 1000
  reconnectionDelayMax: 10000 // defaults to 5000

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

  let msn =username+' desea charlar en privado con usted ? '; 
  if(confirm('Desea crear sala VIP con '+arg.name)){
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

const generateID = () => {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return 'room_'+uuid;
  }



function Chat() {
    const [room_activas, setRoomActivas] = useState([]);
    const [clientConnet, setCLientConnet] = useState([]);
    const [messageAll, setMessageAll] = useState([]);
    const [estado, setEstado] = useState("OffLive");
    const [room, setSala] = useState('');
    const [roomid, setSalaid] = useState('');
    const [alert_private, setAlertaPrivate] = useState('none');
    const [datos_private, setDatosPrivate] = useState({});
    
    socket.on('on-message', (data) =>{
        setMessageAll([ ...messageAll, data]);
        console.log('msn-public')
        console.log(data);
         console.log('-----------')

    //onload();
    })

    socket.on('solicitud-chat-privated', (data) =>{
        setDatosPrivate(data);
        setAlertaPrivate(data.message);
    })

    const aceptarPrivate = () =>{
        let id_room = generateID();
        //crear sala dinamica para 
        const datos = datos_private;
        datos.crear = 'si';
        const data = {
            'create-room': true,
            'room':{
                'room': 'VIP ['+datos.name+' - '+username+']', 
                'id':id_room, 
                'tipo':'private', 
                'show':true,
                'user1': datos.name,
                'user2':username,
                'partipantes': [{'id':datos.userId, 'name':datos.name},{'id': id, 'name':username}],
            },
        }

        socket.emit('create-room-private', data)
        console.log('datos-para crear sala');
        console.log(data);
        setAlertaPrivate('none');
    }
    
    socket.on('msn-private', (data) =>{
        console.log('mensaje-privado');
        setMessageAll([ ...messageAll, data]);
        console.log(data)
    });

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
    const crearRoom = () =>{
        let sala = prompt ('Nombre de la sala a crear','');
        if(sala != null && sala != ''){
            if(confirm('Realmente dese crear '+sala+' como sala publica adicional')){
                let id_room = generateID();
                const data = {
                    'create-room': true,
                    'room':{
                        'room': sala, 
                        'id':id_room, 
                        'tipo':'public', 
                        'show':true,
                    }
                }
                socket.emit('create-room-private', data)
            }
        }
    }
    
    socket.on('room_connect', (data) =>{
        setMessageAll([ ...messageAll, data]);
        console.log(data);
    })
    socket.on('room_close', (data) =>{
        setMessageAll([ ...messageAll, data]);
        console.log(data);
    })
    socket.on('connect', () =>{
        if (socket.recovered) {
            socket.on('reconectar', (history) => {
                setMessageAll(history);
            })
          } else {
            console.log('new or unrecoverable session'); 
          }
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

    socket.on('room_activas', data =>{
        setRoomActivas(data);
    })

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
        onload();
    }

    const onload = () => {
        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
        //setInterval(function(){if(window.parar)return;document.getElementById('chat').scrollTop=document.getElementById('chat').scrollHeight},100);
    }

  return (
    <div id='contenedor'>
        <div id='super' className={roomid != ''?'d-none':'col-lg-12 col-sm-12 py-5 my-5 px-5'}>
            <div className='card'>
                <div className='card-body'>
                    <div className="card.title">
                        SELECCIONE UN SALA 
                    </div>
                    <Room datos={room_activas} setRoom={setRoom} addRoom={crearRoom} />
                </div>
            </div>
         </div>

         <div className={roomid == ''?'d-none':'row'}>      
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
                  <Room datos={room_activas} setRoom={setRoom} addRoom={crearRoom}/>
                  </div>
                </div>
                {(alert_private != 'none') &&
                <div class="alert alert-primary my-2 " role="alert">
                    {alert_private}
                    <div className=''>
                    <span className='btn btn-primary mx-2' onClick={()=> aceptarPrivate()}>
                        Aceptar
                    </span>
                    <span className='btn btn-danger' onClick={() => setAlertaPrivate('none')}>
                        Cancelar
                    </span>
                    </div>
                </div>
                }
                <div className='card my-3'>
                  <div className='card-body salida-chat' id='chat'>

                    {
                      messageAll.map((elm, i) =>{
                        return(
                          <>
                          {(elm.room  === roomid && (elm.tipo == 'public' || elm.tipo == 'private')) && 
                          
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