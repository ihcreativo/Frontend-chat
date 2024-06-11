import React from 'react'

export const Room = ({setRoom}) => {
  const room_disponibles = [
    {'room':'Sala general', 'id':'sala_general', 'show':true},
    {'room':'Sala 1',  'id':'sala_1', 'show':false },
    {'room':'Sala 2', 'id':'sala_2', 'show':false},
    {'room':'Sala 3', 'id':'sala_3', 'show':false},
    {'room':'Sala 4', 'id':'sala_4', 'show':false},
  ]
  let room_active = 'sala_general';
  const get_room = (arg) =>{
    room_active = arg;
    room_disponibles.map((e) =>{
        if(e.id === arg){
            e.show = true;  
            setRoom(e);
        }else{
            e.show = false;
        } 
        return e;
    }) 
    console.log(room_disponibles);
  }

  return (
    <>
    <div className='input-group mt-1'>
    {
      Array.from(room_disponibles).map((e, i) => {
        return(
            <div className='form-control' 
                id={e.show? 'room_active':'room'} 
                onClick={() =>get_room(e.id)}  key={i}>
                {e.room}
            </div>
        )
      })
    }
    </div>
    </>
  )
}
