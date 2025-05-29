import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import LiveRQ from "./pages/LiveRQ";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/liveRQ",
        element: <LiveRQ />,
      },
    ],
  },
]);
export default function App() {
  const query = new QueryClient();
  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  );
}
