import React from 'react'
import { FaUser, FaUsers, FaSignal} from 'react-icons/fa6';
import '../App.css'

export const ListaUsuarios = ({dato, privateChat}) => {
  
  const sendUser = (arg) =>{
    privateChat(arg);
  }
  

  return (
    <>
    <ul className='list-unstyled my-0 mx-4'>
    {  
      Array.from(dato).map((e, k) => { 
      return(
        <li key={k} className='py-3 px-0 mx-0 border-bottom' id='items'  onClick={() => sendUser(e)}>
          <div className='d-flex justify-content-between ps-3'>
            <div className='d-flex flex-row' >
              <div>
                <FaUser width={40} />
                <span className="badge bg-success badge-dot"></span>
              </div>
              <div className="pt-1">
                <p className="fw-bold mb-0 px-3 text-white">{e.name}</p>
              </div>
            </div>
          </div>
        </li>
      )})
    }
    </ul>
    </> 
  )
  
}