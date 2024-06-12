import React, { useState } from 'react'
import { FaPeopleGroup, FaUserGroup, FaCirclePlus} from 'react-icons/fa6';

export const Room = ({datos, setRoom, addRoom}) => {
 
  const nick = localStorage.getItem('NickName_IH');
  const idUser = localStorage.getItem('id_IH');
  
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

  const crear_room = () =>{
    addRoom();
  }

  return (
    <div key={nick} className="d-flex flex-wrap bd-highlight">
    
    {
      Array.from(datos).map((elm, i) => {
          return(
            <>
              {elm.tipo == 'public' &&
              
              <div key={i} className='bd-highlight px-3 py-2 my-1' 
                  id='room' 
                  onClick={() =>get_room(elm.id)}  >
                  <FaPeopleGroup  /> {elm.room}
              </div>
              }
              {(elm.tipo == 'private' && (elm.user1 === nick || elm.user2 === nick)) &&
              <div key={i} className='bd-highlight px-3 py-2 my-1' 
                  id='room' 
                  onClick={() =>get_room(elm.id)}>
                  <FaUserGroup /> VIP {(elm.user1 != nick)? elm.user1:elm.user2}
              </div>
              }
             
            </>  
          )
        
      })
      
    } 
        <div className='bd-highlight px-3 py-2 my-1' onClick={() => crear_room()}> <FaCirclePlus id='btn-add' /></div>
    </div>
  
    
  )
}
