  import React, { useState } from "react";
  import toast from "react-hot-toast";
  import axios from "axios"
  import { Link, useNavigate } from "react-router-dom";
  import { useDispatch } from "react-redux";
  import { login } from "../utils/userSlice";
import HomePage from "../components/Homepage";

  function AuthForm({ type }) {
    const navigation = useNavigate()
    const [userData, setUserData] = useState({
      name: "",
      email: "",
      password: "",
    });
    const dispatch = useDispatch()
    async function handleAuthForm(e) {
      e.preventDefault();
      try {
        const res = await axios.post(`http://localhost:3000/api/v1/${type}` , userData)
        navigation("/")
        dispatch(login(res.data.user))
        toast.success(res.data.message)
        console.log(res)
        setUserData({
          name: "",
          email: "",
          password: "",
        });
        

      } catch (error) {
          toast.error(error.response.data.message)
      }
      

    }
    return (
      <div className="w-[20%] flex flex-col justify-center items-center gap-5 mt-20 ">
        <h1 className="text-3xl">{type === "signin" ? "Sign in" : "Sign up"}</h1>

        <form
          className="w-[100%] flex flex-col justify-center items-center gap-5"
          onSubmit={handleAuthForm}
        >
          {type === "signup" && (
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="enter your name"
              className="w-full h-[40px] bg-gray-500 p-2 text-white text-xs rounded-md focus:outline-none "
            />
          )}
          <input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="enter your email"
            className="w-full h-[40px] bg-gray-500 p-2 text-white text-xs rounded-md focus:outline-none "
          />
          <input
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="password"
            className="w-full h-[40px] bg-gray-500 p-2 text-white text-xs rounded-md focus:outline-none"
          />
          <button
            type="submit"
            className="w-[35%] bg-gray-800 p-2 text-white text-xl rounded-md focus:outline-none"
          >
            {type === "signin" ? "Login" : "Register"}
          </button>
        </form>
        {type ==="signin" ? <p>Don't have an account ? <Link className="text-blue-700" to={"/signup"}>Signup</Link></p>: <p>Already have an account ? <Link className="text-blue-700" to={"/signin"}>Signin</Link></p>}
      </div>
    );
  }

  export default AuthForm;
