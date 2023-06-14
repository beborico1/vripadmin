import React, { useState } from 'react'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons'

export default function UserCard({user}) {
    const [masInfo, setMasInfo] = useState(false)
    
  return (
    <div key={user.id} className='bg-white rounded-lg p-2 m-2 shadow-sm flex flex-col items-center flex-center w-96'>
        <img 
            src={user.profile_picture ? user.profile_picture : 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png'} 
            alt={user.id} 
            className={`rounded-full object-cover ${masInfo ? 'w-32 h-32' : 'w-16 h-16'}`}/>
        {user.admin && <b>ADMIN</b>}
        <p>{user.email}</p>
        <button
            className={`text-white rounded-lg p-2 px-4 m-2 shadow-sm ${masInfo ? 'bg-blue-300' : 'bg-blue-500'}`}
            onClick={() => setMasInfo(!masInfo)}
        >
            {masInfo ? '- Mostrar menos informacion del usuario' : '+ Mostrar mas informacion del usuario'}
        </button>

        {masInfo && ( <>

        <b>Nombre: </b>
        <p className='mb-3'>{user.name ? user.name : 'No ha ingresado un Nombre'}</p>

        <b>Presentacion: </b>
        <p className='mb-3'>{user.presentation ? user.presentation : 'No ha ingresado una presentacion'}</p>

        <b>Usuario: </b>
        <p className='mb-3'>{user.username ? user.username : 'No ha ingresado un usuario'}</p>


        <b>Estuvo activo por ultima vez: </b>
        {user.lastTimeActive && user.lastTimeActive.toDate() ?
            <p className='mb-3'>{format(user.lastTimeActive.toDate(), 'yyyy-MM-dd HH:mm')}</p> :
            <p className='mb-3'>No se ha registrado actividad</p>
        }

        <div className='my-2 flex flex-col items-center'>
            <p> <FontAwesomeIcon icon={faEye} className='mr-2' color='blue'/> Ha abierto <b>{user.viewCount || 0}</b> {user.viewCount === 1 ? 'publicacion' : 'publicaciones'}.</p>
            <p> <FontAwesomeIcon icon={faHeart} className='mr-2' color='red'/> Le Gustan <b>{user.viewCount || 0}</b> {user.viewCount === 1 ? 'publicacion' : 'publicaciones'}.</p>
        </div>

        <b>Su ID de usuario es:</b>
        <p className='mb-3'>{user.id}</p>

        <b>Se creo la cuenta el:</b>
        {user.created_at && user.created_at.toDate() ?
            <p className='mb-3'>{format(user.created_at.toDate(), 'yyyy-MM-dd')}</p> :
            <p className='mb-3'>No se cuenta con esta informacion</p>
        }
            
        <b>El idioma en el que ve la aplicacion es: </b>
        <p className='mb-3'>{user.locales[0].languageCode==='es' ? 
            'Español' :
            user.locales[0].languageCode==='en' ?
            'Ingles' :
            user.locales[0].languageCode
        }</p>
        <b>La region donde vive es: </b>
        <p className='mb-3'>
            {user.locales[0].regionCode === 'MX' ?
            'Mexico' :
            user.locales[0].regionCode === 'US' ?
            'Estados Unidos' :
            user.locales[0].regionCode === 'DE' ?
            'Alemania' :
            user.locales[0].regionCode
        }
        </p>
        <b>Su formato de pago es: </b>
        <p className='mb-3'>{user.locales[0].currencySymbol} 1{user.locales[0].digitGroupingSeparator}000{user.locales[0].decimalSeparator}00 {user.locales[0].currencyCode}</p>
        <b>Mide con: </b>
        <p className='mb-3'>
            {user.locales[0].measurementSystem === 'metric' ?
            'Sistema metrico' :
            user.locales[0].measurementSystem === 'imperial' ?
            'Sistema imperial' :
            user.locales[0].measurementSystem === 'us' ? 
            'Sistema estadounidense' :
            user.locales[0].measurementSystem
        }
        </p>
        <b>La direccion del texto que lee es: </b>
        <p className='mb-3'>
            {user.locales[0].textDirection==='ltr' ?
            'Izquierda a derecha' :
            user.locales[0].textDirection==='rtl' ?
            'Derecha a izquierda' :
            user.locales[0].textDirection }
        </p>
        </>
        )}
    </div>
  )
}
