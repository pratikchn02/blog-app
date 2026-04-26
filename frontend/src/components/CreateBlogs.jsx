import React, { useEffect , useState } from 'react'
import signup from '../pages/signup'
import {Navigate} from "react-router-dom"

function CreateBlogs() {
  let user =JSON.parse(localStorage.getItem("user"))
  const [blogData, setBlogData] = useState({title : "" , description : "" })

    
  // let token = JSON.parse(localStorage.getItem("user"));


  async function handleSubmit(){
    let data = await fetch('http://localhost:3000/api/v1/blogs',{
      method: 'POST',
      body: JSON.stringify(blogData),
      headers : {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${user.token}`,
      }
    })
    let res = await data.json()
    // if(res.success){
    //   localStorage.setItem("user" , JSON.stringify(res.user))
    // }
    alert(res.message)
  }
  // useEffect(() =>{

  // },[])
  if(!user){
    return <Navigate to={"/signup"}/>
  }
  return (
    <>
  <h1>Create Blogs</h1>
  <div>
    <input onChange={(e) => setBlogData(prev => ({...prev , title : e.target.value}))} type="text" placeholder="title" name="" id="" />
    <br /><br />
    <input onChange={(e) => setBlogData(prev => ({...prev , description : e.target.value}))} type="email" placeholder="description" name="" id="" />
    <br /><br />
    <br/>
    <br />
  </div>
  <br />
  <button onClick={handleSubmit}>Submit</button>
  </>
  )
}

export default CreateBlogs