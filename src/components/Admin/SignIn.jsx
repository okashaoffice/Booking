import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../config/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

function SignIn({ handleAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const SignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential) {
        setErrorMsg();
        setEmail("");
        setPassword("");
        const currentUser = userCredential.user;
        const userCollection = collection(db, "users");
        const usersData = await getDocs(userCollection);
        let isAdminUser = null;
        usersData.forEach((userDoc) => {
          const userData = userDoc.data();
          if (userDoc.id === currentUser.uid && userData.isAdmin) {
            isAdminUser = userDoc.id;
          }
        });
        if (isAdminUser) {
          navigate("/dashboard");
          alert("User signed in successfully");
          handleAuth();
        } else {
          console.error("Current user is not an admin");
          setErrorMsg("You are not authorized as an admin");
          const userSignOut = auth;
          await signOut(userSignOut);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Sign in error:", error);
      setErrorMsg(error.message);
    }
  };
  return (
    <div className="bg-black h-screen from-[#2bcca0] to-black bg-gradient-to-bl">
      <section className="flex justify-center pt-20 ">
        <div className="w-1/3  bg-[#000000bc] rounded-md p-10">
          <h2 className="text-3xl font-bold leading-tight text-[#2bcca0] sm:text-4xl">
            Sign in
          </h2>
          <form className="mt-8" onSubmit={SignIn}>
            <div className="space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-white">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 text-white outline-none"
                    type="email"
                    placeholder="Email"
                  ></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor=""
                    className="text-base font-medium text-white"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 outline-none text-white"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                <p className="font-semibold text-red-600 text-center pt-2">
                  {errorMsg}
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#2bcca0] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-[#1daa85]"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl loader"></div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
