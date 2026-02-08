import { useState , useEffect } from "react"


function App() {
  const [userData , setUserData] = useState({name : "" , email : "" , password : ""})
  const  [blogs , setBlogs] = useState([])

  async function fetchBlogs(){
    let data = await  fetch('http://localhost:3000/api/v1/blogs')

    let res = await data.json()
    console.log(res.blogs)
    setBlogs(res.blogs)
  }

  useEffect(() =>{
    fetchBlogs()
  },[])




  async function handleSubmit(){
    let data = await fetch('http://localhost:3000/api/v1/users',{
      method: 'POST',
      body: JSON.stringify(userData),
      headers : {
        "Content-Type" : "application/json"
      }
    })
    let res = await data.json()
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

  {
    blogs.map(blog=>{
      return(   
        <div>
<ul key={blog._id}>
        <li >{blog.title}</li>
        <p>{blog.description}</p>
      </ul>
        </div>
      
    )
    })
  }
  

  </>)
}

export default App
