import AppSidebar from '../components/AppSidebar'
import Header from '@/components/Header'
import { SidebarProvider } from '../components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
const Layout = () => {
  return (
    //topbar
    //sidebar
    <SidebarProvider>
      <Header />
      <AppSidebar />
      <main className='w-full '>
        {/* Outlet  */}
        <div className='w-full min-h-[calc(100vh-24px)] pt-28 px-10'>
          <Outlet />
        </div>
        {/* footbar  */}
        {/* <Footer /> */}
      </main>
    </SidebarProvider>
  )
}

export default Layout