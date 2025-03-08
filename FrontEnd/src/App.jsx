import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import { RouteAddCategory, RouteBlog, RouteBlogAdd, RouteBlogByCategory, RouteBlogDetails, RouteCategoryDetails, RouteComments, RouteEditBlog, RouteEditCategory, RouteIndex, RouteLogin, RouteProfile, RouteRegister, RouteSearch, RouteUsers } from './Helper/RouteName'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AddCategory from './pages/Category/AddCategory'
import CategoryDetails from './pages/Category/CategoryDetails'
import EditCategory from './pages/Category/EditCategory'
import AddBlog from './pages/Blog/AddBlog'
import Blog from './pages/Blog/Blog'
import EditBlog from './pages/Blog/EditBlog'
import BlogDetails from './pages/BlogDetails'
import BlogByCategory from './pages/Blog/BlogByCategory'
import SearchResult from './pages/SearchResult'
import Comments from './pages/Comments'
import Users from './pages/Users'
import AuthRouteProt from './components/AuthRouteProt'
import AuthRouteprotadmin from './components/AuthRouteprotadmin'
// import "./App.css"
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path={RouteIndex} element={<Layout/>}>
          <Route index element={<Index/>}/>
          


          <Route path={RouteBlogDetails()} element={<BlogDetails/>} />
          <Route path={RouteBlogByCategory()} element={<BlogByCategory/>} />
          <Route path={RouteSearch()} element={<SearchResult/>} />

          <Route element={<AuthRouteProt/>}>
            <Route path={RouteBlog} element={<Blog/>} />
            <Route path={RouteProfile} element={<Profile/>} />
            <Route path={RouteEditBlog()} element={<EditBlog/>} />
            <Route path={RouteBlogAdd} element={<AddBlog/>} />
            <Route path={RouteComments} element={<Comments/>} />
          </Route>
          <Route element={<AuthRouteprotadmin/>}>
            <Route path={RouteUsers} element={<Users/>} />
            <Route path={RouteAddCategory} element={<AddCategory/>} />
            <Route path={RouteCategoryDetails} element={<CategoryDetails/>} />
            <Route path={RouteEditCategory()} element={<EditCategory/>} />

          </Route>
      </Route>
      <Route path={RouteLogin} element={<Login/>}/>
      <Route path={RouteRegister} element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}
export default App