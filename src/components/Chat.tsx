
import { useState } from 'react';
import '../App.css'
import io from 'socket.io-client'
import { FaUser, FaPaperPlane, FaUsers, FaXmark} from 'react-icons/fa6';


const username = localStorage.getItem('NickName_IH');
const id = localStorage.getItem('id_IH');

let estado = false;

const socket = io("/",{
  auth: {
      'name': username,
      'id': id,
  }
});


let clientConnet :Object [];

const lblOn  = document.querySelector('#online');
const lblOff = document.querySelector('#offline');

socket.on( 'connect', () =>{
  estado = true;
  lblOff?.classList.add('hidden');
  lblOn?.classList.remove('hidden');


})
socket.on('disconnect', ()=> {
  estado = false;
  lblOff?.classList.remove('hidden');
  lblOn?.classList.add('hidden');

})

socket.on('on-clients-changed', (data) =>{
  clientConnet = data;
  console.log(clientConnet);
  //renderUsuarios(data);
});


socket.on('welcome-message',msn =>{
 // alert(msn);
});
socket.on('msn-alerta-new-user', (msn) =>{
  console.log(msn +' se ha conectado...');

})

function renderUsuarios(payload:any){
  // console.log('listado-----')
  // console.log(payload);
  // console.log('------------')
  // const lista = document.querySelector('#lista');
  // const {id, name } = payload;

  // const divElement = document.createElement( 'li' );
  // //divElement.classList.add( 'message' );
  // let msn = `<li>${ name }</li>`;
  // divElement.innerHTML = msn;
  // lista?.appendChild( divElement );
  // return (
  //   <ul className='list-unstyled my-0 mx-4' id='users_connecteds'>
  //     {payload.map((elm:any, index:any) =>(
  //     <li key={index} className='py-3 px-0 mx-0 border-bottom'>
  //       <div className='d-flex justify-content-between'>
  //         <div className='d-flex flex-row'>
  //           <div>
  //             <FaUser width={40} />
  //             <span className="badge bg-success badge-dot"></span>
  //           </div>
  //           <div className="pt-1">
  //             <p className="fw-bold mb-0 px-3 text-white">{elm.name}</p>
  //           </div>
  //         </div>
  //       </div>

  //     </li>
  //     ))}
  //   </ul>
  // )

}

const renderMessage = ( payload:any, adjunto = false ) => {
  const chat = document.querySelector('#chat');
  const {userId, message, name, date } = payload;

  const divElement = document.createElement( 'div' );
  divElement.classList.add( 'message' );
  
  let mensajero = name;
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
    msn = ` <div id='title-propio'>${ mensajero }</div>
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
  //divElement.innerHTML = `<small> ${ mensajero } <p>${ message }</p> </small>`;

  chat?.appendChild( divElement );
  //chat.scrollTop = chat.scrollHeight;
  chat?.lastElementChild?.scrollIntoView({behavior: 'smooth', block: 'end' });
  //scroll al final de los mensajes
}


socket.on('on-message', (data) =>{
  // console.log({data});
   renderMessage(data, false);
})

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
    //const btnn = document.querySelector('#input-msn').value = '';
    setMessage('');
    console.log(message)
  }

  
  const handleFile = (e:any) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(evt) {
     //socket.emit('upload-file',file);
      socket.emit('upload-file',evt, (status:any) =>{
        console.log(status, evt);
      })
    };

    reader.onerror = function() {
      console.log(reader.error);
    };





    // reader.onload = function(evt){
    //   socket.emit('upload-file',evt, (status:any) =>{
    //     alert('isaias')
    //     console.log(status, evt);
    //   })
    // }
    // socket.emit('upload-file', file, (status:any) =>{
    //   console.log(status, file);
    // })

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
                 <ul id='lista'></ul>
                <ul className='list-unstyled my-0 mx-4' id='users_connecteds'>
                  {clientConnet?.map((elm:any, index) =>(
                  <li key={index} className='py-3 px-0 mx-0 border-bottom'>
                    <div className='d-flex justify-content-between'>
                      <div className='d-flex flex-row'>
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
                    <span id='nickname_user'>{socket.auth.name}   { estado }</span>

                  </div>
                  <div className="col-4">
                      <button className='btn btn-danger' onClick={Salida}><FaXmark/></button>
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
                            <span className='btn btn-danger'>Desconectarse</span>
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
