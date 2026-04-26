import React, { useEffect, useState } from "react";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  async function fetchBlogs() {
    let data = await fetch("http://localhost:3000/api/v1/blogs");

    let res = await data.json();
    console.log(res.blogs);
    setBlogs(res.blogs);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      {blogs.map((blog) => {
        return (
          <div>
            <ul key={blog._id}>
              <li>{blog.title}</li>
              <p>{blog.description}</p>
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default Blogs;
