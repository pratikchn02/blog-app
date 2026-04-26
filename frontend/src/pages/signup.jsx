import React from 'react'
import { useState , useEffect } from 'react'

function signup() {

    const [userData , setUserData] = useState({name : "" , email : "" , password : ""})
  




  async function handleSubmit(){
    let data = await fetch('http://localhost:3000/api/v1/users',{
      method: 'POST',
      body: JSON.stringify(userData),
      headers : {
        "Content-Type" : "application/json"
      }
    })
    let res = await data.json()
    if(res.success){
      localStorage.setItem("user" , JSON.stringify(res.user))
    }
    alert(res.message)
  }
  return (<>
  <h1>Sign up</h1>
  <div>
    <input onChange={(e) => setUserData(prev => ({...prev , name : e.target.value}))} type="text" placeholder="name" name="" id="" />
    <br /><br />
    <input onChange={(e) => setUserData(prev => ({...prev , email : e.target.value}))} type="email" placeholder="email" name="" id="" />
    <br /><br />
    <input onChange={(e) => setUserData(prev => ({...prev , password : e.target.value}))} type="text" placeholder="password" name="" id="" />
    <br/>
    <br />
  </div>
  <br />
  <button onClick={handleSubmit}>Submit</button>

  
  

  </>)
}

export default signup