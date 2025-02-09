import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import React from "react"
import logo from '@/assets/Images/logo-white.png'
import { IoHome } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { TbLogs } from "react-icons/tb";
import { FaComments } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { RouteBlog, RouteBlogByCategory, RouteCategoryDetails, RouteComments, RouteIndex, RouteUsers } from "@/Helper/RouteName";
import { usefetch } from "@/hooks/usefetch";
import { getEnv } from "@/Helper/getEnv";
import { useSelector } from "react-redux";

  const AppSidebar = () => {
    const { data: categoryData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/category/all-category`, {
      method: 'get',
      credentials: 'include'
    }, []);
    console.log(categoryData);
    const user = useSelector((state) => state.persistedReducer.user);
    
    
    return (
      <Sidebar >
        <SidebarHeader className="bg-white">
          <img src={logo} width={120} alt="" srcset="" />
        </SidebarHeader>
        <SidebarContent className="bg-white">
          <SidebarGroup >
            <SidebarMenu>
                <SidebarMenuItem>
                  <Link to={RouteIndex}>
                    <SidebarMenuButton>
                        <IoHome />
                        Home
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>

              {user && user.isLoggedIn?<>
                <SidebarMenuItem>
                <Link to={RouteBlog}>
                    <SidebarMenuButton>
                    <TbLogs />
                      Blogs
                    </SidebarMenuButton></Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <Link to={RouteComments}>
                    <SidebarMenuButton>
                    <FaComments />
                    Comments
                    </SidebarMenuButton></Link>
                </SidebarMenuItem></>:<></>}

                {user && user.isLoggedIn && user.user.role==='admin'?<>
                  <SidebarMenuItem>
                <Link to={RouteCategoryDetails}>
                    <SidebarMenuButton>
                        <TbCategoryFilled />
                        Category
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                <Link to={RouteUsers}>
                    <SidebarMenuButton>
                    <FaUser />
                    Users
                    </SidebarMenuButton></Link>
                </SidebarMenuItem>
              </>:<></>}

               
            </SidebarMenu>
          </SidebarGroup >

        {/* Group 2 */}

          <SidebarGroup>
          <SidebarGroupLabel>
            Categories
          </SidebarGroupLabel>
            <SidebarMenu>
              {categoryData && categoryData.category.length>0?categoryData.category.map(category=>{
                return <SidebarMenuItem key={category._id}>
                <Link to={RouteBlogByCategory(category.slug)}>
                    <SidebarMenuButton>
                    <GoDotFill />
                       {category.name}
                    </SidebarMenuButton></Link>
                </SidebarMenuItem>
              }):""}
               </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }
  
  export default AppSidebar
  