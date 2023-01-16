import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import ContactsList from './ContactsList'
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from '../../firebaseconfig';
import AuthContext from '../../Context/AuthContext';

const ContactsBar: React.FC = ({ setSelectedUser, SelectedUser, setCombinedId }): JSX.Element => {
  const [Contacts, setContacts] = useState(null);
  const { User } = useContext(AuthContext)

  const [Query, setQuery] = useState('');
  const search = useRef();



  const fetchAllContacts_ForCurrentUser = async () => {

    // * Fetching All-Users Who Are Registered Except "Me(Current-User)", As These Users Are Shown Up As Contacts-List Of The "Current-User"
    const q = query(collection(db, "_Users"), where("UID", "!=", User.uid));  // * Filtering Docs

    // * Fetched Contact-Items
    const AllUserContacts = await getDocs(q);

    // * Updating State
    setContacts(AllUserContacts?._snapshot?.docChanges)
  }


  useEffect(() => {

    // TODO: Gotta Prevent Rerendring Of [Child-Component(ContactsBar.ts)] On Changing Parent's State
    // * useCallback() or useMemo() Hook Is Quite Better Option for this Work
    console.log("The Child-Compnent is Rendering On Parent's [State-Variable] Changing, Gotta FIx This...!")

    fetchAllContacts_ForCurrentUser();

  }, [])

  return (
    <section className='flex flex-col gap-4 border-2 m-2 border-orange-500 w-[15rem]'>

      <input type={'text'} onChange={(e: React.FormEvent) => setQuery(e.currentTarget.value)} placeholder="search" />


      {Contacts ? Contacts.filter((item) => {
        // console.log(Query, item?.doc?.data?.value?.mapValue?.fields?.name?.stringValue.includes(Query))
        return (Query.toLowerCase() === "") ? true : item?.doc?.data?.value?.mapValue?.fields?.name?.stringValue.toLowerCase().includes(Query)
      }).map((item: object, ind: number) => {

        const contact = item?.doc?.data?.value?.mapValue?.fields;


        return <div key={ind} onClick={() => {

          // * Don't Change The State If The Other-User Is Already Selected!
          if (contact?.UID?.stringValue !== SelectedUser?.UID?.stringValue) {
            setSelectedUser(contact)
          }
          setCombinedId(User.uid + contact?.UID?.stringValue)
        }} className="flex justify-around">
          <img src={contact?.profileURL?.stringValue} className="w-[1.5rem] rounded-full" alt="Image not found" srcset="" />
          <span>{contact?.name?.stringValue}</span>
        </div>
      }) : <>&nbsp; Loading...</>}
    </section>
  )
}

export default ContactsBar;