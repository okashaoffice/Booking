import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../config/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        userName: userName,
        email: user.email,
        uid: user.uid,
        isAdmin: false,
      });
      setUserName("");
      setEmail("");
      setPassword("");
      setError("");
      setLoading(false);
      alert("User created successfully");
      console.log("Login data successfully sent to Firestore!");
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <section className="bg-black h-screen from-[#2bcca0] to-black bg-gradient-to-bl">
      <div className="flex justify-center h-full items-center ">
        <div className="w-1/3 bg-[#000000bc] p-10 rounded-md   ">
          <h2 className="text-3xl font-bold leading-tight text-primaryColor sm:text-4xl">
            Log In
          </h2>
          <form className="mt-8" onSubmit={registerUser}>
            <div className="space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-white">
                  User Name
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setUserName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 text-white outline-non "
                    type="text"
                    placeholder="username"
                  ></input>
                </div>
              </div>
              <div>
                <label htmlFor="" className="text-base font-medium text-white">
                  {" "}
                  Email address{" "}
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
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 text-white outline-none"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                <p className="font-semibold text-red-600 text-center pt-2">
                  {error}
                </p>
              </div>
              <p className="mt-2 text-base text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/dashboard"
                  className="font-medium text-[#20c196] transition-all duration-200 hover:underline"
                >
                  Sign In
                </Link>
              </p>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-primaryColor px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-[#1da37f] transition-all"
                >
                  Log In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl loader"></div>
        </div>
      )}
    </section>
  );
}

export default Login;
{
}
