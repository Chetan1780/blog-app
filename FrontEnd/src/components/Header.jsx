import React from 'react'
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import userIcon from '@/assets/Images/user.png'
import { FaUser } from "react-icons/fa";
import { MdOutlinePostAdd, MdLogout } from "react-icons/md";
import { getEnv } from '@/Helper/getEnv';
import { showToast } from '@/Helper/ShowToast';
import { removeUser } from '@/redux/user/user.slice';
import { IoMenu } from "react-icons/io5";
import { useSidebar } from './ui/sidebar';
import Logo from '@/components/Logo'
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const user = useSelector((state) => state.persistedReducer.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    let resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/auth/logout`, {
      method: 'get',
      credentials: 'include'
    })
    const data = await resp.json();
    if (!resp.ok) {
      return showToast('error', data.message);
    }
    dispatch(removeUser());
    navigate(RouteIndex);
    showToast('success', data.message);
  }

  const { toggleSidebar } = useSidebar();

  return (
    <div className='flex justify-between items-center h-14 sm:h-16 fixed w-full z-30 bg-white dark:bg-gray-950 px-3 sm:px-4 md:px-5 border-b'>

      {/* Left Section (Mobile Menu & Logo - Logo shown on tablets & above) */}
      <div className='flex items-center gap-2'>
        <button onClick={toggleSidebar} className='sm:hidden p-2'>
          <IoMenu size={24} />
        </button>
        <div className='hidden sm:block'>
          <Logo className="h-8 sm:h-10" />
        </div>
      </div>

      {/* Center Section (Search Box) */}
      <div className='w-full max-w-[280px] sm:max-w-[350px] md:max-w-[500px]'>
        <SearchBox />
      </div>

      {/* Right Section (Dark Mode & Sign-In/Profile) */}
      <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
        <DarkModeToggle className="h-6 w-6 sm:h-7 sm:w-7" />
        {!user.isLoggedIn ? (
          <Button className="rounded-xl flex items-center px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
            <Link to={RouteLogin} className="flex items-center gap-1 font-bold">
              <MdLogin size={18} />
              <span>Sign-In</span>
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className='h-8 w-8 sm:h-9 sm:w-9'>
                <AvatarImage src={user.user.avatar || userIcon} />
                <AvatarFallback>
                  <img draggable="false" src={userIcon} alt="User Icon" className='h-full w-full' />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='text-sm sm:text-base'>
              <DropdownMenuLabel className="flex flex-col items-center text-center">
                <h4 className='text-sm sm:text-base'>Welcome <span className='text-purple-700'>!!</span></h4>
                <p className='text-purple-700 text-xs sm:text-sm'>{user.user?.name}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer flex items-center gap-2">
                <Link to="/profile">
                  <FaUser />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer flex items-center gap-2">
                <Link to={RouteBlogAdd}>
                  <MdOutlinePostAdd />
                  Add Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer flex items-center gap-2 text-red-600">
                <MdLogout />
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