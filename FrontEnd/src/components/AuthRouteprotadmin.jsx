import { RouteLogin } from '@/Helper/RouteName';
import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRouteprotadmin = () => {
    const user = useSelector(state=>state.persistedReducer.user);
    if(user && user.isLoggedIn && user.user.role === 'admin'){
        return <Outlet/>
    }
    else{
        return <Navigate to={RouteLogin} />
    }
}

export default AuthRouteprotadmin
