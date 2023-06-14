import React, { useEffect, useState } from 'react'
import { auth, db } from '../helpers/firebaseConfig'
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import UserCard from '../components/UserCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSignOut, faSort } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'


export default function ReportsScreen() {
    const [outfits, setOutfits] = useState([])
    const [users, setUsers] = useState([])
    const [filtrarKey, setFiltrarKey] = useState('')
    const [filtrarValue, setFiltrarValue] = useState('')
    const [filtrarKeyInput, setFiltrarKeyInput] = useState('')
    const [filtrarValueInput, setFiltrarValueInput] = useState('')
    const [ordenarKey, setOrdenarKey] = useState('')
    const [ordenarInput, setOrdenarInput] = useState('')
    const [ordenarDirection, setOrdenarDirection] = useState('desc'); // 'asc' para ascendente y 'desc' para descendente
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getOutfits = async () => { // usando Firebase web v9 modular traemos todos los documentos de la colección "outfits"donde reported sea truede la base de datos Firestorey los mostramos en la consola del navegador
        setLoading(true);
        try {
            const q = query(collection(db, "outfits"), where("reported", "==", true))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            });
            setOutfits(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const getUsers = async (filtrarKeyParam, filtrarValueParam, ordenarKeyParam, ordenarDirectionParam) => {
        setLoading(true);

        try {
            let q;
            
            if (isFilterActive) {
                q = query(collection(db, "users"), where(filtrarKeyParam, "==", filtrarValueParam));
            } else {
                q = ordenarKey ? query(collection(db, "users"), orderBy(ordenarKeyParam, ordenarDirectionParam)) : query(collection(db, "users"));
            }
        
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            });
            setUsers(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }  

    useEffect(() => {      
        getUsers();
        getOutfits();
    }, [])

    useEffect(() => {
        if (isFilterActive) {
            getUsers(filtrarKey, filtrarValue, null, null);
        } else {
            getUsers(null, null, ordenarKey, ordenarDirection);
        }
    }, [filtrarKey, filtrarValue, ordenarKey, ordenarDirection, isFilterActive])
    

    const handleDesreportar = (outfit) => {
        // confirmar que se quiere desreportar
        // si se confirma, desreportar

        if (!window.confirm('¿Estás seguro de que quieres desreportar este atuendo?')) {
            return
        }

        updateDoc(doc(db, "outfits", outfit.id), {
            reported: false
        })

        setOutfits(outfits.filter(outfitItem => outfitItem.id !== outfit.id))
    }


  return (
    <div className='flex flex-col md:flex-row'>
        <div className='bg-slate-300 md:w-1/2 p-2 flex flex-col items-center'>
            <button
                className='relative top-0 right-0 bg-red-500 text-white rounded-lg p-2 m-2 shadow-sm w-52 h-12'
                onClick={() => {
                    auth.signOut();
                    navigate('/inicio-sesion');
                }}
            >
                <FontAwesomeIcon icon={faSignOut} className='mr-2'/>
                Cerrar Sesion
            </button>
            <b className='text-red-500 text-center text-xl'>
                Atuendos Reportados ({outfits.length}):
            </b>
            {outfits.map(outfit => (
                <div key={outfit.id} className='bg-white rounded-lg p-2 m-2 shadow-sm w-72 flex flex-col items-center flex-center'>
                    <img src={outfit.imageUrl} alt={outfit.id} className='w-72'/>
                    <p>{outfit.id}</p>
                    <button
                        className='bg-red-500 text-white rounded-lg p-2 m-2 shadow-sm w-52'
                        onClick={() => handleDesreportar(outfit)}
                    >
                        Quitar Reporte
                    </button>
                </div>
            ))}
        </div>

        <div className='bg-slate-400 md:w-1/2 p-2 flex flex-col items-center'>

            <b className='text-center text-xl'>
                Usuarios ({users.length}):
            </b>

            <div className='flex flex-col items-center'>
                <div className='flex flex-col'>
                    <input
                        placeholder='Ordenar por'
                        value={ordenarInput}
                        onChange={(e) => setOrdenarInput(e.target.value)}
                        type='text'
                        className='border-2 border-gray-400 rounded-lg p-2 m-2 shadow-sm w-72'
                    />
                    <button
                        className='bg-green-600 text-white rounded-lg p-2 m-2 shadow-sm w-72 hover:bg-green-400 hover:shadow-lg'
                        onClick={() => {
                            setOrdenarKey(ordenarInput);
                            setIsFilterActive(false); // Desactiva el filtro cuando se activa la ordenación
                        }}
                    >
                        <FontAwesomeIcon icon={faSort}  className='mr-2'/> Ordenar
                    </button>
                </div>
                
                o

                <div className='flex flex-col'>
                    <input
                        placeholder='Donde el campo'
                        value={filtrarKeyInput}
                        onChange={(e) => setFiltrarKeyInput(e.target.value)}
                        type='text'
                        className='border-2 border-gray-400 rounded-lg p-2 m-2 shadow-sm w-72'
                    />
                    <input
                        placeholder='Tenga el valor'
                        value={filtrarValueInput}
                        onChange={(e) => setFiltrarValueInput(e.target.value)}
                        type='text'
                        className='border-2 border-gray-400 rounded-lg p-2 m-2 shadow-sm w-72'
                    />
                    <button
                        className='bg-green-600 text-white rounded-lg p-2 m-2 shadow-sm w-72 hover:bg-green-400 hover:shadow-lg'
                        onClick={() => {
                            setFiltrarKey(filtrarKeyInput);
                            setFiltrarValue(filtrarValueInput);
                            setIsFilterActive(true); // Activa el filtro cuando se selecciona
                        }}
                    >
                        <FontAwesomeIcon icon={faFilter} className='mr-2'/> Filtrar
                    </button>
                </div>
            </div>

            {loading && <p>Cargando...</p>}


            {users.map(user => (
                <UserCard user={user} key={user.id}/>
            ))}
        </div>

    </div>
  )
}
