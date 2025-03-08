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
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import React from "react";
import logo from "@/assets/Images/logo-white.png";
import { IoHome } from "react-icons/io5";
import { TbCategoryFilled, TbLogs } from "react-icons/tb";
import { FaComments, FaUser } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import {
  RouteBlog,
  RouteBlogByCategory,
  RouteCategoryDetails,
  RouteComments,
  RouteIndex,
  RouteUsers,
} from "@/Helper/RouteName";
import { usefetch } from "@/hooks/usefetch";
import { getEnv } from "@/Helper/getEnv";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const { data: categoryData, loading, error } = usefetch(
    `${getEnv("VITE_API_BACKEND_URL")}/category/all-category`,
    { method: "get", credentials: "include" },
    []
  );

  const user = useSelector((state) => state.persistedReducer.user);

  return (
    <Sidebar className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Header with Logo */}
      <SidebarHeader className="bg-white dark:bg-gray-900 p-4 flex justify-center">
        <img draggable="false" src={logo} width={120} alt="Logo" />
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="bg-white dark:bg-gray-900">
        {/* General Menu */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to={RouteIndex}>
                <SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                  <IoHome />
                  Home
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Show only for logged-in users */}
            {user?.isLoggedIn && (
              <>
                <SidebarMenuItem>
                  <Link to={RouteBlog}>
                    <SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <TbLogs />
                      Blogs
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to={RouteComments}>
                    <SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <FaComments />
                      Comments
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}

            {/* Admin-specific menu */}
            {user?.isLoggedIn && user.user.role === "admin" && (
              <>
                <SidebarMenuItem>
                  <Link to={RouteCategoryDetails}>
                    <SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <TbCategoryFilled />
                      Category
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link to={RouteUsers}>
                    <SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <FaUser />
                      Users
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Categories Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 dark:text-gray-300">
            Categories
          </SidebarGroupLabel>
          <SidebarMenu>
            {loading ? (
              <SidebarMenuItem>
                <span className="text-gray-500 dark:text-gray-400">
                  Loading categories...
                </span>
              </SidebarMenuItem>
            ) : error ? (
              <SidebarMenuItem>
                <span className="text-red-500 dark:text-red-400">
                  Failed to load categories
                </span>
              </SidebarMenuItem>
            ) : categoryData?.category.length > 0 ? (
              categoryData.category.map((category) => (
                <SidebarMenuItem key={category._id}>
                  <Link to={RouteBlogByCategory(category.slug)}>
                    <SidebarMenuButton className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <GoDotFill />
                      {category.name}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))
            ) : (
              <SidebarMenuItem>
                <span className="text-gray-500 dark:text-gray-400">
                  No categories found
                </span>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="bg-gray-200 dark:bg-gray-800 text-center p-2 text-xs text-gray-600 dark:text-gray-400">
        Made with ❤️ by Chetan
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
