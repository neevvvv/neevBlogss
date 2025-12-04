import React from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { AuthLayout, Login } from "./components/index.js";

import ThemeProviderWrapper from "./ThemeProviderWrapper";

import AddPost from "./pages/AddPost";
import Signup from "./pages/Signup";
import EditPost from "./pages/EditPost";

import Post from "./pages/Post";

import AllPosts from "./pages/AllPosts";
import SplineBackground from "./components/SplineBackground.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            {" "}
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
    ],
  },
]);

const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <SplineBackground />
      ) : (
        <Provider store={store}>
          <ThemeProviderWrapper>
            <RouterProvider router={router} />
          </ThemeProviderWrapper>
        </Provider>
      )}
    </>
  );
};

const container = document.getElementById("root");

if (!container._reactRootContainer) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
}



