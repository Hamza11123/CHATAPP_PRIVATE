import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { KnownAsTypeMap } from 'vite/types/importGlob'
import { auth, db, storage } from '../../firebaseconfig'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { async } from '@firebase/util'
import AuthContext from '../../Context/AuthContext'
import { addDoc, getFirestore, collection, setDoc, doc, serverTimestamp } from "firebase/firestore"


const SignupCard = () => {
  const { setUser, User, showAlert }: object | null = useContext(AuthContext) as object | null
  const [Img, setImg] = useState<string>('https://dummyimage.com/600x400/f5f5f5/e6e6e6.png&text=Not+Selected')
  const [Err, setErr] = useState<boolean>()
  const [ProfileImg, setProfileImg] = useState<File>()
  const nav = useNavigate()

  const usersCollection = "_Users"; // * Collection-Name Of The Users In [Fire-Store]
  const userChatsCollection = "_UserChats"; // * Collection-Name Of The Given-User-Chats In [Fire-Store]


  const handleSelectedFile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {

    // * Multiple Files 
    const AllFiles: File[] = Array.from(e.target.files as FileList) as File[];

    // * Destructuring A Single File From The Array-Of-Multiple-Files
    const [file]: File[] = AllFiles as File[];

    // * Updating The State By Entered-FIle
    setProfileImg(file as File)

    console.log(file)


  }

  const AddUserToFireStore = async (UID: string, name: string, email: string, profileURL: string) => {

    // * First Create The Collection if doesn't Exist, And Set The Given-Data Corresponding to the fields into the db

    // * 'setDoc()' -> "The UID Must Be Provided (Firebase Won't Do Auto-Generation)"
    await setDoc(doc(db, usersCollection, UID), {
      UID,
      name,
      email,
      profileURL,
      createdAt: serverTimestamp()
    })

    console.log("SUCCESSFULLY ADDED")
  }
  const Submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    // * FormData Object, Helped To Get The Form-Data
    const formData = new FormData(e.currentTarget as HTMLFormElement);


    // * Entered-Input-Fields By User, Required For Account-Creation
    const formObj = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }


    try {
      // * Posting/Creating User With Its Valid-Credentials In FireStore (DB)
      console.log(User);
      const userCredential = await createUserWithEmailAndPassword(auth, formObj.email as string, formObj.password as string)

      // * Setting/Preparing The Folder Structure Of The Image In DB, "User-Profile-Image" would be uploaded by its own "user-name"
      const storageRef = ref(storage, `User-Profile-Imgs/${formObj.username.replace(/\s/g, '_')}`);

      // * Providing the real-file To The Function To Upload On The Server
      const uploadTask = uploadBytesResumable(storageRef, ProfileImg as File);

      // * Listening The Event
      uploadTask.on('state_changed',
        (snapshot: any) => {

          // * Tracking Uploading-Progress For Animation On Client-Side
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log(`Upload is ${progress}% done`, snapshot.state);

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => { setErr(true) },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL: string) => {
            console.log('File available at', downloadURL);

            // * Updating The State-Variable By The Choosed-Image From "input:file"
            setImg(downloadURL as string)


            // * Updating the Currently-SignedUp-User's Info-Object 
            await updateProfile(userCredential.user, {
              displayName: formObj.username as string,
              photoURL: downloadURL as string
            });


            // * Destructring Essentials-Properties From Authenticated-User (Account-Created) To Add It In Fire-Store For Further Computations
            const { uid, email, displayName, emailVerified, photoURL } = userCredential.user;

            // * Adding The Signed-Up User Into Fire-Store-DATA-BASE
            AddUserToFireStore(uid as string, displayName as string, email as string, photoURL as string);


            // * Adding Anoter Collection For "User-Chats"
            await setDoc(doc(db, userChatsCollection, uid), {
              createdAt: serverTimestamp()
            });

            // * And Then, Navigate To Home-Page (main-page)
            nav("/")

          });
        }
      );

      const { uid, email, emailVerified } = userCredential.user;
      // ...

      console.log(uid, email, emailVerified, ProfileImg, User);
      showAlert("red", "Error", "Successfully Registered")


    } catch (error: unknown) {
      setErr(true as boolean)
      showAlert("red", "Error", error.message)
    }



  }




  return (
    <>
      <section className="h-screen">
        <div className="container px-6 py-12 h-full m-auto">
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">

            <div className="flex justify-center items-center">
              <form className='shadow-lg p-4 rounded-md' onSubmit={Submit}>
                <h1 className='font-thin text-3xl my-4'> Register </h1>
                <div className="mb-6">
                  <input
                    name='username'
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="User name"
                  />
                </div>
                <div className="mb-6">
                  <input
                    name='email'
                    type="email"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Email address"

                  />
                </div>

                <div className="mb-6">
                  <input
                    name='password'
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Password"
                  />
                </div>
                <div className="mb-6">
                  <input
                    id='_file'
                    type="file"
                    className="hidden"
                    onChange={handleSelectedFile}
                  />
                  <label htmlFor="_file" className='flex items-center justify-start gap-2 rounded-md'>
                    <span className='rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer border-2 p-2 px-4'>+ Add Profile</span>
                    <img src={Img} className="w-10 h-10 rounded-lg my-3" alt="" />
                  </label>
                </div>

                <div className="flex flex-col justify-between mb-6">
                  <Link
                    to="/passwordreset"
                    className="text-blue-600 hover:text-blue-700 focus:text-blue-400 active:text-blue-800 duration-200 transition ease-in-out"
                  >Forgot password?</Link>

                  <div >
                    <span>Already have an account? </span>
                    <Link to="/signin" className="text-blue-600"
                    >Signin</Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                >
                  Sign Up
                </button>


              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SignupCard