import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WPFetchPost from "./components/WPFetchPost";
import axios from "axios";
import PostDetails from "./components/PostDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WPFetchPost />,
  },
  {
    path: "/post/:slug",
    element: <PostDetails />,
    loader: async ({ params }) => {
      const res = await axios.get(
        `http://localhost/wpaditya/wp-json/wp/v2/posts?slug=${params.slug}&_embed`
      );
      if (!res.data.length) {
        throw new Response("Not Found", { status: 404 });
      }
      return res.data[0];
    },
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
