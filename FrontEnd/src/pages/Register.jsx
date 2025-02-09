import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RouteLogin } from '@/Helper/RouteName';
import { getEnv } from '@/Helper/getEnv';
import { showToast } from '@/Helper/ShowToast';
import GoogleLogin from '@/components/GoogleLogin';

const Register = () => {
  const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long!!!'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters long!!!'),
    confirm_password: z.string(),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ['confirm_password'], 
        message: 'Password and Confirm Password should be the same!!!',
      });
    }
  });
  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
      confirm_password:""
    },
  });

  const navigate = useNavigate();
  // console.log(getEnv('VITE_API_BACKEND_URL')); 

const onSubmit = async (data) => {
    try {
        const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const resData = await resp.json();
        if (!resp.ok) {
            showToast('error', resData.message);
            return;
        }

        showToast('success', resData.message);
        navigate(RouteLogin);
    } catch (error) {
        showToast('error', error.message);
    }
};


  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-100 p-4'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-96 space-y-2'>
        <h2 className='text-2xl font-semibold text-center'>Create Your Account</h2>

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
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
                      placeholder="Enter your password"
                      type="password"
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
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter password again!!"
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
              Register
            </Button>
          </form>
        </Form>

        <div className='text-gray-500 text-center'>
          <span>Already have an account? </span>
          <Link to={RouteLogin} className='text-blue-500 hover:underline'>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
