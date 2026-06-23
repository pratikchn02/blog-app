import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import EditorsJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Embed from "@editorjs/embed";
import RawTool from "@editorjs/raw";
import ImageTool from "@editorjs/image";
import TextVariantTune from "@editorjs/text-variant-tune";
import { useRef } from "react";
function AddBlog() {
  const { id } = useParams();
  const editorjsRef = useRef(null);
  const formData = new FormData();
  const { token } = useSelector((slice) => slice.user);
  const { title, description, image, content } = useSelector(
    (slice) => slice.selectedBlog,
  );

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    content: "",
  });

  const navigate = useNavigate();
  async function handlePostBlog() {
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(blogData.content));
    blogData.content.blocks.forEach((block) => {
      if (block.type == "image") {
        formData.append("images", block.data.file.image);
      }
    });

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/blogs",
        formData,
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
  async function handleUpdateBlog() {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(blogData.content));
    let existingImages = [];
    blogData.content.blocks.forEach((block) => {
      if (block.type == "image") {
        if (block.data.file.image) {
          formData.append("images", block.data.file.image);
        } else {
          existingImages.push({
            url: block.data.file.url,
            imageId: block.data.file.imageId,
          });
        }
      }
    });
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      let res = await axios.patch(
        `http://localhost:3000/api/v1/blogs/${id}`,
        formData,
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

  async function fetchBlogById() {
    try {
      setBlogData({
        title: title,
        description: description,
        image: image,
        content: content,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  function initializeEditorjs() {
    editorjsRef.current = new EditorsJS({
      holder: "editor",
      placeholder: "write something",
      data: content,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          tunes: ["textVariant"],
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        List: {
          class: NestedList,
          config: {},
          inlineToolbar: true,
        },
        code: CodeTool,
        Marker: Marker,
        Underline: Underline,
        Embed: Embed,
        raw: RawTool,
        textVariant: {
          class: TextVariantTune,
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (image) => {
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(image),
                    image,
                  },
                };
              },
            },
          },
        },
      },

      onChange: async () => {
        let data = await editorjsRef.current.save();
        console.log(data);
        // editorjsRef.current = data
        setBlogData((blogData) => ({ ...blogData, content: data }));
      },
    });
  }

  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);

  useEffect(() => {
    if (editorjsRef.current === null) {
      
      initializeEditorjs();

      return () => {
        if (editorjsRef.current?.destroy) {
          editorjsRef.current.destroy();
          editorjsRef.current = null;
        }
      };
    }
  }, []);

  if (!token) {
    return <Navigate to={"/signin"} />;
  }

  return (
    <div className="w-[50%] mx-auto">
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
              src={
                typeof blogData.image == "string"
                  ? blogData.image
                  : URL.createObjectURL(blogData.image)
              }
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
      <div id="editor"></div>
      <button
        className="px-6 py-4 mt-2 bg-gray-400 rounded hover:bg-gray-700 hover:text-white"
        onClick={id ? handleUpdateBlog : handlePostBlog}
      >
        {id ? "Update blog" : " Post Blog"}
      </button>
    </div>
  );
}

export default AddBlog;
