import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedBlog,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [blogData, setBlogData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const [likes , setLikes] = useState()
  const { token, email, id: userID } = useSelector((slice) => slice.user);

  async function fetchBlogById() {
    try {
      let res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
      setBlogData(res.data.blog);
      setLikes(res.data.blog.likes.length)
      if (res.data.blog.likes.includes(id)) {
        setIsLike((prev) => !prev);
      }
      dispatch(addSelectedBlog(res.data.blog));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function handleLike() {
    try {
      if (token) {
        setIsLike((prev) => !prev);
        console.log(blogData._id);
        let res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if(res.data.isLiked){
          setLikes(prev => prev + 1)
        }else{
          setLikes(prev => prev - 1)
        }
        console.log(res);
      } else {
        return toast.error("Please signin to like this blog");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    fetchBlogById();

    return () => {
      dispatch(removeSelectedBlog());
    };
  }, [id]);

  return (
    <div className="max-w-[40%] ">
      {blogData ? (
        <div className="">
          <h1 className="mt-10 font-bold text-5xl">{blogData.title}</h1>
          <h2 className="my-5 text-3xl">{blogData.creator.name}</h2>
          <img src={blogData.image} className="aspect-video w-[100%]" alt="" />

          {email === blogData.creator.email && (
            <Link to={"/edit/" + blogData.blogId}>
              <button className="bg-gray-400 mt-5 px-6 py-2 rounded hover:bg-gray-700 hover:text-white ">
                Edit
              </button>
            </Link>
          )}
          <div className="flex gap-7 my-4">
            <div className="cursor-pointer flex gap-2">
              {isLike ? (
                <i
                  onClick={handleLike}
                  className="fi fi-sr-thumbs-up text-blue-700 text-2xl mt-1"
                ></i>
              ) : (
                <i
                  onClick={handleLike}
                  className="fi fi-rr-social-network text-2xl mt-1"
                ></i>
              )}
              <p className="text-2xl">{likes}</p>
            </div>
            <div className="cursor-pointer flex gap-2">
              <i className="fi fi-sr-comment-alt text-2xl mt-1"></i>
              <p className="text-2xl">{blogData.comments.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default BlogPage;
