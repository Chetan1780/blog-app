import { RouteIndex, RouteLogin } from '@/Helper/RouteName';
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
const AuthRouteProt = () => {
    const user = useSelector(state=>state.persistedReducer.user);
    if(user && user.isLoggedIn){
        return <Outlet/>
    }
    else{
        return <Navigate to={RouteLogin} />
    }
}

export default AuthRouteProt
