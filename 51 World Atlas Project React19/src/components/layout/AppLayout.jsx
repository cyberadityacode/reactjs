import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../UI/Header'
import Footer from '../UI/Footer'

export default function AppLayout() {
  return (
    <>
      <Header />
        <Outlet />
      <Footer />
    </>
  )
}
