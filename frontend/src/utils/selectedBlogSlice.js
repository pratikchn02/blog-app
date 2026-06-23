import { createSlice } from "@reduxjs/toolkit";

const selectedBlogSlice = createSlice({
  name: "selectedBlogSlice",
  initialState: JSON.parse(localStorage.getItem("selectedBlog")) || {},
  reducers: {
    addSelectedBlog(state, action) {
      localStorage.setItem("selectedBlog", JSON.stringify(action.payload));
      return action.payload;
    },
    removeSelectedBlog(state, action) {
      localStorage.removeItem("selectedBlog");
      return {};
    },
    changeLikes(state, action) {
      if (state.likes.includes(action.payload)) {
        state.likes = state.likes.filter((like) => like !== action.payload);
      } else {
        state.likes.push(action.payload);
      }
    },
    setComments(state, action) {
      state.comments = [...state.comments, action.payload];
    },
    setCommentLikes(state, action) {
      let { commentId, userId } = action.payload;
      let comment = state.comments.find((comment) => comment._id == commentId);
      if (comment.likes.includes(userId)) {
        comment.likes = comment.likes.filter((like) => like !== userId);
      } else {
        comment.likes = [...comment.likes, userId];
      }
    },
  },
});
export const {
  addSelectedBlog,
  removeSelectedBlog,
  changeLikes,
  setComments,
  setCommentLikes,
} = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
