import React, { useState } from 'react'
import { auth, db } from '../helpers/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function InicioSesion() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigation = useNavigate()

    const iniciarSesion = async () => {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        console.log('querySnapshot',querySnapshot)

        const user = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))[0]

        console.log('user',user)

        if (!user) {
            setError('El usuario no existe')
            return
        }

        if (!user.admin) {
            setError('El usuario no es admin')
            return
        }

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user)
            navigation('/reports')
        }
        )
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            setError(errorMessage)
        }
        );
    }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>

        <h1
            className='text-4xl font-bold text-center text-green-600'
        >
            Vrip Admin
        </h1>
        <input
            type='text'
            placeholder='Correo'
            className='border-2 border-gray-400 rounded-lg p-2 m-2 shadow-sm w-72'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
        />

        <input
            type='password'
            placeholder='Contraseña'
            className='border-2 border-gray-400 rounded-lg p-2 m-2 shadow-sm w-72'
            onChange={(e) => setPassword(e.target.value)}
            value={password}

        />

        <button
            className='bg-green-600 text-white rounded-lg p-2 m-2 shadow-sm w-72 hover:bg-green-400 hover:shadow-lg'
            onClick={iniciarSesion}
        >
            Iniciar Sesion
        </button>

        <p className='text-red-500'>
            {error}
        </p>
    </div>
  )
}
