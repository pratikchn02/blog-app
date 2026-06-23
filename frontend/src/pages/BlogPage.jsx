import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedBlog,
  changeLikes,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";
import Comment from "../components/Comment";
import { setIsOpen } from "../utils/commentSlice";

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [blogData, setBlogData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const { token, email, id: userID } = useSelector((state) => state.user);
  const { likes, comments, content } = useSelector(
    (state) => state.selectedBlog,
  );
  const { isOpen } = useSelector((state) => state.comment);

  async function fetchBlogById() {
    try {
      let res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
      setBlogData(res.data.blog);
      const liked = res.data.blog.likes.includes(userID);
      setIsLike(liked);
      dispatch(addSelectedBlog(res.data.blog));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function handleLike() {
    try {
      if (token) {
        setIsLike((prev) => !prev);

        let res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        dispatch(changeLikes(userID));
        // if(res.data.isLiked){
        //   setLikes(prev => prev + 1)
        // }else{
        //   setLikes(prev => prev - 1)
        // }
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
      dispatch(setIsOpen(false));
      if (window.location.pathname !== `/edit/${id}` )
        dispatch(removeSelectedBlog());
    };
  }, [id]);

  return (
    <div className="max-w-[40%] mx-auto ">
      {blogData ? (
        <div className="">
          <h1 className="mt-10 font-bold capitalize text-5xl">
            {blogData.title}
          </h1>
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
              <p className="text-2xl">{likes.length}</p>
            </div>
            <div className="cursor-pointer flex gap-2">
              <i
                onClick={() => dispatch(setIsOpen())}
                className="fi fi-sr-comment-alt text-2xl mt-1"
              ></i>
              <p className="text-2xl">{comments.length}</p>
            </div>
          </div>
          <div className="my-10 ">
            {content.blocks.map((block) => {
              if (block.type == "header") {
                if (block.data.level == 2) {
                  return (
                    <h2
                      className="font-bold text-3xl mt-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h2>
                  );
                } else if (block.data.level == 3) {
                  return (
                    <h3
                      className="font-bold text-2xl mt-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h3>
                  );
                } else if (block.data.level == 4) {
                  return (
                    <h4
                      className="font-bold text-xl mt-4"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h4>
                  );
                }
              } else if (block.type == "paragraph") {
                return (
                  <p className="mt-4" dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
                );
              }
              else if (block.type == "image") {
                return (
                  <div className="mt-4">
                    <img  src={block.data.file.url} alt="" />
                    <p className="text-center my-2">{block.data.caption}</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
