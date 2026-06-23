import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FormatDate } from "../utils/formatDate";
function HomePage() {
  const [blogs, setBlogs] = useState([]);

  async function fetchBlogs() {
    let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`);
    console.log(res.data.blogs);
    setBlogs(res.data.blogs);
  }
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="w-[50%] mx-auto">
      {blogs.map((blog) => (
        <div key={blog._id}>
          <Link to={"blog/" + blog.blogId}>
            <div className="w-full my-10 flex justify-between">
              <div className="w-[60%] flex flex-col gap-2">
                <div>
                  {/* <img src="" alt="" /> */}
                  <p>{blog.creator.name}</p>
                </div>
                <h2 className="font-bold text-3xl">{blog.title}</h2>
                <h4 className="line-clamp-2">{blog.description}</h4>
                <div className="flex gap-5">
                    <p>{FormatDate(blog.createdAt)}</p>
                  <div className="flex gap-7 ">
                    <div className="cursor-pointer flex gap-2">

                      <i className="fi fi-rr-social-network text-xl mt-1"></i>

                      <p className="text-xl">{blog.likes.length}</p>
                    </div>
                    <div className="cursor-pointer flex gap-2">
                      <i className="fi fi-sr-comment-alt text-xl mt-1"></i>
                      <p className="text-xl">{blog.comments.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[25%] aspect-video">
                <img src={blog.image} alt="" />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
