import React, { useContext, useEffect } from 'react'
import AuthContext from '../Context/AuthContext';
interface Props {
    type: string;
    message: string;
    color: string;
}
const Alert: React.FC<Props> = ({ type, message, color }) => {
    const {setShowAlert} = useContext(AuthContext)

    return (
        <div className={`flex items-center justify-between p-4 text-${color}-900 bg-${color}-300 h-[4rem]`}>
            <div className='flex items-center '>
            <strong>{type}! </strong> 
            <p className='ml-2' >{message}</p>
            </div>
            
            <span className='cursor-pointer' onClick={ () => setShowAlert(false) }>Close</span>
        </div>
    )
}

export default Alert