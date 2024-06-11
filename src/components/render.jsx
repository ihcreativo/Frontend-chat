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
  