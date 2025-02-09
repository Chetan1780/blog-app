import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RouteIndex, RouteRegister } from '@/Helper/RouteName';
import { showToast } from '@/Helper/ShowToast';
import { getEnv } from '@/Helper/getEnv';
import GoogleLogin from '@/components/GoogleLogin';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
const Login = () => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    // console.log(data);
      try{
        const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/auth/login`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials:'include',
          body: JSON.stringify(data)
        })   
        const temp = await resp.json();
        if(!resp.ok){
          showToast('error',temp.message);return;
        }
        // console.log(temp.user);
        dispatch(setUser(temp.user));
        navigate(RouteIndex)
        showToast('success',temp.message);
      } catch(err){
        showToast('error',err.message);
      }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-100 p-4'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-96 space-y-2'>
        <h2 className='text-2xl font-semibold text-center'>Login to your account</h2>

        {/* Google Sign In  */}
        <GoogleLogin/>

        <div className='flex items-center'>
          <hr className='flex-grow border-gray-300' />
          <span className='mx-3 text-gray-500'>or</span>
          <hr className='flex-grow border-gray-300' />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="w-full bg-transparent outline-none p-3 border rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      className="w-full bg-transparent outline-none p-3 border rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full py-3">
              Login
            </Button>
          </form>
        </Form>

        <div className='text-gray-500 text-center'>
          <span>Don't have an account? </span>
          <Link to={RouteRegister} className='text-blue-500 hover:underline'>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
