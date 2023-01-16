import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { FormEvent, LegacyRef, useContext, useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom';
import AuthContext from '../../Context/AuthContext';
import { db } from '../../firebaseconfig';
import Message from './Message'

const ChatBar: React.FC = ({ SelectedUser, CombinedId }): JSX.Element => {
    const { User } = useContext(AuthContext);
    const [Messages, setMessages] = useState(null)
    const textInputRef = useRef();

    // * Adding All The Ascii-Values (integer) Of The Characters In String
    const SumAsciisOfString = (givenStr: string) => givenStr.split('').map((elem: string) => elem.charCodeAt()).reduce((a, b) => a + b, 0).toString()


    // * Private-ID To Secure The Chat Between-Two-Users, "SalluBhaiID" + "ShahrukhKhanID" ya "ShahrukhKhanID" + "SalluBhaiID" The Resultant ID Must Be Same Order-Doesn't Matter At All
    const COMBINED_ID_CharSum = SumAsciisOfString(SelectedUser?.UID?.stringValue + User?.uid, SelectedUser?.UID, User?.uid)


    // * Posting Message As DOc In FIREBASE
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        console.log("hey ther e", SelectedUser)

        // setCombinedId(SelectedUser?.UID?.stringValue + User?.uid)

        console.log(textInputRef.current)

        console.log(SelectedUser?.UID?.stringValue + User?.uid, SelectedUser?.UID, User?.uid)


        // *  Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "_Chats"), {
            createdAt: serverTimestamp(),
            text: textInputRef?.current.value ?? "",
            UID: User.uid,
            combinedID: COMBINED_ID_CharSum
        });


    }
    const fetchMessages_BetweenBothUsers = async () => {
        // TODO SORT-BY-DATE
        const q = query(collection(db, "_Chats"), where("combinedID", "==", COMBINED_ID_CharSum));  // * Filtering Docs

        // * Fetched Contact-Items 
        const AllMessages = await getDocs(q);

        setMessages(AllMessages?._snapshot?.docChanges)
 
    }

    useEffect(() => {
       
        console.log("object");
        fetchMessages_BetweenBothUsers()
    }, [SelectedUser, Messages])

    return (
        <div className="w-[100%]">
            <h1 className="text-blue-500">{SelectedUser?.name?.stringValue}</h1>

            <section className='border-2 m-2 border-green-500 w-[100%] h-[17.5rem] overflow-scroll'>
                {Messages && Messages.map(item => {
                    const message = item?.doc?.data?.value?.mapValue?.fields;
                    // console.log(message, "MMMM")
                    return <Message text={message?.text?.stringValue} position={message?.UID?.stringValue === User.uid ? "right" : "left"} />
                }) || <>Loading...</>}

            </section>


            <form onSubmit={handleSubmit} className="">
                <input type="text" ref={textInputRef} name="" id="" className="" />
                <input type="submit" value="Send" />
            </form>
        </div>
    )
}

export default ChatBar