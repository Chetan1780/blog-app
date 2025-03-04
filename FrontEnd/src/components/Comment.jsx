import React, { useState } from 'react'
import { MdModeComment } from "react-icons/md";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@/Helper/ShowToast';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteLogin } from '@/Helper/RouteName';
import { getEnv } from '@/Helper/getEnv';
const Comment = ({ props }) => {
    const user = useSelector((state) => state.persistedReducer.user);
    const formSchema = z.object({
        comment: z.string().min(1, 'Comment must be at least 1 characters long!!'),
    });
    const [isSubmit, setisSubmit] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: ""
        },
    });
    const onSubmit = async (data) => {
        const newData = {...data,blogid:props.blogid,user:user.user._id};
        setisSubmit(true);
        try {
            const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/comment/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials:'include',
                body: JSON.stringify(newData)
            })
            const temp = await resp.json();
            if (!resp.ok) {
                showToast('error', temp.message);
                return;
            }
            props.refresh(prev=>!prev);
            form.reset()
            showToast('success', temp.message);
        } catch (err) {
            showToast('error', err.message);
        } finally{
            setisSubmit(false);
        }
    };
    return (
        <div>
            <h4 className='flex items-center gap-2 text-2xl font-bold'><MdModeComment className='text-purple-700' /> Comment</h4>
            {user && user.isLoggedIn ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Comment</FormLabel> */}
                                    <FormControl>
                                        <Textarea placeholder="Type your comment" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full py-3">
                            {isSubmit?"Submiting":"Submit"}
                        </Button>
                    </form>
                </Form> : <Button>
                    <Link to={RouteLogin}>
                        Login</Link>
                </Button>}
        </div> 
    )
}

export default Comment