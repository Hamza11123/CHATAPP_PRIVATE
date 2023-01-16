import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import AuthContext from '../../Context/AuthContext'
import { auth } from '../../firebaseconfig'
const SignInCard = () => {
  const { User, showAlert }: object | null = useContext(AuthContext)
  const [Err, setErr] = useState<Error>();
  const nav = useNavigate();
  const Submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const formObj = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }
    console.log();
    (async () => {
      try {

        const user = await signInWithEmailAndPassword(auth, formObj.email, formObj.password);
        console.log(user, "ASHOK")
        nav("/");
        showAlert("green", "Success", "Account Has Been Logged in Successfully")

      } catch (error: unknown ) {
        showAlert("red", "Error", error.message)
 

      }
    })()

  }

  // useEffect(() => {

  //   if(User){

  //   }
  // }, [third])


  return (
    <>


      <section className="h-screen">

         
        <div className="container px-6 py-12 h-full m-auto">
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">

            <div className="flex justify-center items-center">
              <form className='shadow-lg p-4 rounded-md' onSubmit={Submit}>
                <h1 className='font-thin text-3xl my-4'> Login</h1>
                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Email address"
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    name="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="Password"
                  />
                </div>

                <div className="flex flex-col justify-between   mb-6">
                  <Link
                    to="/passwordreset"
                    className="text-blue-600 hover:text-blue-700 focus:text-blue-400 active:text-blue-800 duration-200 transition ease-in-out"
                  >Forgot password?</Link>

                  <div >
                    <span>Don't have an account? </span>
                    <Link to="/signup" className="text-blue-600"
                    >Register </Link>

                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                >
                  Sign in
                </button>


              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SignInCard