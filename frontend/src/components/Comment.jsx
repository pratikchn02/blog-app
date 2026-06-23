import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import axios from "axios";
import { setCommentLikes, setComments } from "../utils/selectedBlogSlice";
import { FormatDate } from "../utils/formatDate";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { _id: blogId, comments } = useSelector((state) => state.selectedBlog);
  const { token , id: userId } = useSelector((state) => state.user);
  async function handleComment() {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
      dispatch(setComments(res.data.newComment));
      setComment("")
    } catch (error) {
      console.log(error);
    }
  }
  async function handleCommentLike(commentId){
    try {
        const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/blogs/like-comment/${commentId}`,
        { },
             {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        )
        console.log(res.data)
        dispatch(setCommentLikes({commentId , userId}))
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className=" h-screen fixed p-5 top-0 right-0 w-[25%] border-l shadow-2xl bg-white overflow-y-scroll bg-slate-200 ">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium ">comments ({comments.length})</h1>
        <i
          onClick={() => dispatch(setIsOpen(false))}
          className="fi fi-br-cross text-lg mt-1 cursor-pointer "
        ></i>
      </div>
      <div className="my-4">
        <textarea
          onChange={(e) => setComment(e.target.value)}
          type="text"
          placeholder="Comment..."
          className="resize-none h-30 shadow-xl w-full p-4 text-lg focus:outline-none"
        />
        <button
          onClick={handleComment}
          className="bg-gray-400 px-7 rounded-full py-3 my-2"
        >
          Add
        </button>
      </div>
      <div className="mt-4">
        {comments.map((comment) => (
            <>
            <hr/>
          <div className="flex flex-col gap-2 my-4">
            <div className="flexw-full justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10">
                  <img
                    className="rounded-full"
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${comment.user.name}`}
                    alt=""
                  />
                </div>
                <div>
                  <p className="capitalize font-medium">{comment.user.name}</p>
                  <p>{FormatDate(comment.createdAt)}</p>
                </div>
              </div>
              <i className="fi fi-bs-menu-dots"></i>
            </div>
            <p className="font-medium text-lg">{comment.comment}</p>
            <div>
              <div className="cursor-pointer flex gap-2">
                {comment.likes.includes(userId) ? (
                  <i
                      onClick={() =>handleCommentLike(comment._id)}
                    className="fi fi-sr-thumbs-up text-blue-700 text-xl mt-1"
                  ></i>
                ) : (
                  <i
                      onClick={() =>handleCommentLike(comment._id)}
                    className="fi fi-rr-social-network text-xl mt-1"
                  ></i>
                )}
                <p className="text-xl">{comment.likes.length}</p>
              </div>
            </div>
          </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default Comment;
