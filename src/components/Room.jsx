import React, { useState } from 'react'
import { FaPeopleGroup, FaUserGroup, FaCirclePlus} from 'react-icons/fa6';

export const Room = ({datos, setRoom, addRoom}) => {
  const nick = localStorage.getItem('NickName_IH');
  const idUser = localStorage.getItem('id_IH');
  
  return (
    <div className="d-flex flex-wrap bd-highlight">
    
    {
      datos.map((elm, index) => {
          return(
            
            <div key={index}>
              {elm.tipo == 'public' &&
              
              <div className='bd-highlight px-3 py-2 my-1' 
                  id='room' 
                  onClick={() =>setRoom(elm)}  >
                  <FaPeopleGroup  /> {elm.room}
              </div>
              }
              {(elm.tipo == 'private' && (elm.user1 === nick || elm.user2 === nick)) &&
              <div className='bd-highlight px-3 py-2 my-1' 
                  id='room' 
                  onClick={() =>setRoom(elm)}>
                  <FaUserGroup /> VIP {(elm.user1 != nick)? elm.user1:elm.user2}
              </div>
              }
            </div> 
             
          )
        
      })
      
    } 
        <div className='bd-highlight px-3 py-2 my-1' onClick={() => addRoom()}> <FaCirclePlus id='btn-add' /></div>
    </div>
  
    
  )
}
