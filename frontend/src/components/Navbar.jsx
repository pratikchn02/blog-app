import React from "react";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Navbar() {
  const { token } = useSelector((state) => state.user);

  return (
    <>
      <div className="bg-gray-500 drop-shadow-gray-700 drop-shadow-sm w-full h-[70px] px-7  flex justify-between items-center ">
        <div className="flex gap-4  items-center">
          <Link to={"/"}>
            <div className="">
              <img src={logo} alt="logo" />
            </div>
          </Link>

          <div className="relative">
            <i className="fi fi-rr-search absolute text-lg top-1/2 -translate-y-1/2 ml-4 mt-1"></i>
            <input
              type="text"
              className="bg-gray-400 focus:outline-none rounded-full pl-11 p-3"
              placeholder="search"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center">
          <Link to={"/add-blog"}>
            <div className="flex gap-2 text-md items-center">
              <i className="fi fi-rr-edit text-xl mt-1"></i>
              <span>write</span>
            </div>
          </Link>
{
  token ? (
    <div className="text-md capitalize">name</div>
  ):(
          <div className="flex gap-3">
            <Link to={"/signup"}>
              <button className="bg-gray-400 px-6 py-3 rounded-full">
                Signup
              </button>
            </Link>
            <Link to={"/signin"}>
              <button className="border text-white px-6 py-3  rounded-full">
                Signin
              </button>
            </Link>
          </div>)
}
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
