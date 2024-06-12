import React, { useState } from 'react'
import { FaPeopleGroup, FaUserGroup, FaFolderOpen } from 'react-icons/fa6';

export const Room = ({datos, setRoom}) => {
  // const room_disponibles = [
  //   {'room':'Sala principal', 'id':'sala_principal', 'show':true},
  //   {'room':'Sala 1',  'id':'sala_1', 'show':false },
  //   {'room':'Sala 2', 'id':'sala_2', 'show':false},
  //   {'room':'Sala 3', 'id':'sala_3', 'show':false},
  //   {'room':'Sala 4', 'id':'sala_4', 'show':false},
  // ]
  const nick = localStorage.getItem('NickName_IH');
  const idUser = localStorage.getItem('id_IH');
  const [room_activas, setRoomActivas] = useState(datos);
  console.log('rooooom');
  console.log(datos);


  const get_room = (arg) =>{
    datos.map((e) =>{
        if(e.id === arg){
            setRoom(e);
        }else{
            e.show = false;
        } 
        return e;
    }) 
  }

  return (
    
    <div className='input-group mt-1'>
    {
      Array.from(datos).map((elm, i) => {
          return(
            <>
              {elm.tipo == 'public' &&
              <div key={i} className='form-control' 
                  id='room' 
                  onClick={() =>get_room(elm.id)}  >
                  <FaPeopleGroup  /> {elm.room}
              </div>
              }
              {(elm.tipo == 'private' && (elm.user1 === nick || elm.user2 === nick)) &&
              <div key={i} className='form-control' 
                  id='room' 
                  onClick={() =>get_room(elm.id)}>
                  <FaUserGroup /> VIP {(elm.user1 != nick)? elm.user1:elm.user2}
              </div>
              }
            </>  
          )
        
      })
    }
    </div>
    
  )
}
