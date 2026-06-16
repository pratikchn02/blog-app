import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

function AddBlog() {
  const { id } = useParams();
  const {token }= useSelector(slice => slice.user)
  const {title  , description, image} = useSelector(slice => slice.selectedBlog)

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const navigate = useNavigate();
  async function handlePostBlog() {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/blogs",
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  async function handleUpdateBlog(){
    try{
      let res = await axios.patch(`http://localhost:3000/api/v1/blogs/${id}` , blogData,
        {
            headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message)
      navigate("/")
    }catch(error ){
        toast.error(error.response.data.message)
    }
  }

  async function fetchBlogById() {
    try {
      setBlogData({
        title: title,
        description: description,
        image: image,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);

  if (!token) {
    return <Navigate to={"/signin"} />;
  }

  return  (
    <div className="w-[50%]">
      <label htmlFor="">Title</label>
      <input
        className="px-10 py-1 bg-white rounded  m-4"
        type="text"
        value={blogData.title}
        placeholder="title"
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <label htmlFor="">Description</label>
      <input
        className="px-10 py-1 bg-white rounded  m-4"
        type="text"
        placeholder="description"
        value={blogData.description}
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <div>
        <label htmlFor="image">
          {blogData.image ? (
            <img 
              className="aspect-video object-cover"
              src={typeof(blogData.image) == "string" ? blogData.image : URL.createObjectURL(blogData.image)}
            ></img>
          ) : (
            <div className="aspect-video bg-slate-700 flex justify-center items-center text-4xl">
              Select Image
            </div>
          )}
        </label>
        <input
          className="hidden"
          id="image"
          accept=".png , .jpeg , .jpg"
          type="file"
          onChange={(e) =>
            setBlogData((prev) => ({ ...prev, image: e.target.files[0] }))
          }
        />
      </div>

      <button className="px-6 py-4 mt-2 bg-gray-400 rounded hover:bg-gray-700 hover:text-white" onClick={id ? handleUpdateBlog : handlePostBlog}>
        {id ? "Update blog" : " Post Blog"}
      </button>
    </div>
  )
}

export default AddBlog;
