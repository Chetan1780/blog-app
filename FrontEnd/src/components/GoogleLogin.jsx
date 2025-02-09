import React from 'react'
import { Button } from './ui/button'
import { signInWithPopup } from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc';
import { auth, provider } from '@/Helper/FIreBase';
import { getEnv } from '@/Helper/getEnv';
import { showToast } from '@/Helper/ShowToast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
import { RouteIndex } from '@/Helper/RouteName';
const GoogleLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin = async () => {
        try {
            const googleResponse = await signInWithPopup(auth, provider);
            const user = googleResponse.user;
            const data = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }
            const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            })
            const temp = await resp.json();
            if (!resp.ok) {
                showToast('error', temp.message); return;
            }
            dispatch(setUser(temp.user));
            showToast('success', temp.message);
            navigate(RouteIndex)

        } catch (err) {
            showToast('error', err.message);
        }

    }
    return (
        <Button onClick={handleLogin} variant='outline' className='w-full flex items-center justify-center gap-3 py-3'>
            <FcGoogle size={24} />
            <span>Continue with Google</span>
        </Button>
    )
}

export default GoogleLogin