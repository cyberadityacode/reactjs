import {createBrowserRouter, RouterProvider} from "react-router-dom"
import MainLayout from "./components/Layout/MainLayout"
import Home from "./pages/Home"
import OldWay from "./pages/OldWay"
import RQWay from "./pages/RQWay"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
      }
    ]
  },
])

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </QueryClientProvider>
  )
}
