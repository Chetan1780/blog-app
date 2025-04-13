import { RouteIndex, RouteLogin } from '@/Helper/RouteName';
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
const PublicRoute = ({children}) => {
    const user = useSelector((state)=>state.persistedReducer.user);
    if(user && user.isLoggedIn){
        return <Navigate to={RouteIndex} replace/>
    }
    console.log("Enter here");
    
    return children
};

export default PublicRoute
