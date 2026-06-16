import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import selectedBlog from "./selectedBlogSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    selectedBlog: selectedBlog,
  },
});

export default store;
