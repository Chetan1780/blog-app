import React from 'react'
import logo from '@/assets/Images/logo-white.png'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { MdLogin } from "react-icons/md";
import SearchBox from './SearchBox';
import { RouteBlogAdd, RouteIndex, RouteLogin } from '@/Helper/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage,AvatarFallback } from "@/components/ui/avatar"
import userIcon from '@/assets/Images/user.png'
import { FaUser } from "react-icons/fa";
import { MdOutlinePostAdd,MdLogout } from "react-icons/md";
import { getEnv } from '@/Helper/getEnv';
import { showToast } from '@/Helper/ShowToast';
import { removeUser } from '@/redux/user/user.slice';
import { IoMenu } from "react-icons/io5";
import { useSidebar } from './ui/sidebar';
import Logo from '@/components/Logo'
import DarkModeToggle from './DarkModeToggle';

const Header =  () => {
  const user = useSelector((state) => state.persistedReducer.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async ()=>{
    let resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/auth/logout`,{
       method: 'get',
       credentials:'include'
    })
    const data = await resp.json();
    if(!resp.ok){
      return showToast('error',data.message);
    }
    dispatch(removeUser()) ;
    navigate(RouteIndex);
    showToast('success',data.message);
  }
  const {toggleSidebar} = useSidebar();
  
  return (
    <div className='flex justify-between items-center h-16 fixed w-full z-30 bg-white dark:bg-gray-950 px-4 md:px-5 border-b'>
      
      {/* Left Section (Mobile Menu & Logo - Logo shown on tablets & above) */}
      <div className='flex items-center gap-2'>
        <button onClick={toggleSidebar} className='md:hidden'>
          <IoMenu size={22} />
        </button>
        <div className='hidden sm:block'>
          <Logo />
        </div>
      </div>

      {/* Center Section (Search Box) */}
      <div className='w-full max-w-[400px] md:max-w-[550px]'>
        <SearchBox />
      </div>

      {/* Right Section (Dark Mode & Sign-In/Profile) */}
      <div className='flex items-center gap-3 sm:gap-4'>
        <DarkModeToggle />
        {!user.isLoggedIn ? (
          <Button className="rounded-2xl flex justify-center items-center px-4 py-2">
            <Link to={RouteLogin} className="flex justify-center items-center gap-1 font-bold">
              <MdLogin />
              <span>Sign-In</span>
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.user.avatar || userIcon} />
                <AvatarFallback>
                  <img draggable="false" src={userIcon} alt="User Icon" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex justify-center items-center flex-col">
                <h4>Welcome <span className='text-purple-700'>!!</span></h4>
                <p className='text-purple-700'>{user.user?.name}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile">
                  <FaUser />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={RouteBlogAdd}>
                  <MdOutlinePostAdd />
                  Add Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
                <MdLogout color='red' />
                LogOut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

    </div>
  );
};

export default Header;
