import { signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../../firebaseconfig'
import ChatBar from './ChatBar'
import ContactsBar from './ContactsBar'

const ChatBox = () => {
  const [SelectedUser, setSelectedUser] = useState('');
  const [CombinedId, setCombinedId] = useState('')


  return (
    <>
      <button onClick={() => signOut(auth)}>Logout</button>
      <div className='flex p-2 m-auto bg-slate-300 max-w-[44rem] border-yellow-600 border h-[20rem]'>
        <ContactsBar setSelectedUser={setSelectedUser} setCombinedId={setCombinedId} SelectedUser={SelectedUser} />
        <ChatBar SelectedUser={SelectedUser} CombinedId={CombinedId} />


      </div>
    </>
  )
}

export default ChatBox;