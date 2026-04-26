import { useState , useEffect } from "react"
import { Routes  , Route } from "react-router-dom"
import Blogs from "./components/Blogs";
import Signup from "./pages/signup";
import Signin from "./pages/Signin";
import CreateBlogs from "./components/CreateBlogs";


function App() {
  
return(
  <Routes>
    <Route path = "/" element ={<Blogs/>}> </Route>
    <Route path = "/signup" element ={<Signup/>}> </Route>
    <Route path = "/signin" element ={<Signin/>}> </Route>
    <Route path = "/create-blog" element={<CreateBlogs/>}> </Route>
    <Route path = "*" element = {<h1>Kya kar rha hai</h1>}></Route>

  </Routes>
)
 
}

export default App
