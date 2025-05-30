import {createBrowserRouter, RouterProvider} from "react-router-dom"
import MainLayout from "./components/Layout/MainLayout"
import Home from "./pages/Home"
import OldWay from "./pages/OldWay"
import RQWay from "./pages/RQWay"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RQWayDetails from "./components/UI/RQWayDetails"
import InfiniteScrolling from "./pages/InfiniteScrolling"
import InfiniteScrollingInterObs from "./pages/InfiniteScrollingInterObs"

const router = createBrowserRouter([
  {
    path:"/",
    element: <MainLayout />,
    children:[
      {
        path: "/",
        element: <Home />
      },
      {
        path:"/trad",
        element: <OldWay />
      },
      {
        path: "/rq",
        element: <RQWay />
      },
      {
        path:"/rq/:id",
        element: <RQWayDetails />
      },
      {
        path: "infinite",
        element: <InfiniteScrolling />
      },
      {
        path: "interobs",
        element: <InfiniteScrollingInterObs />
      }
    ]
  },
])

export default function App() {
  const query = new QueryClient()

  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </QueryClientProvider>
  )
}
