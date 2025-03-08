import React, { useState } from 'react';
import { MdModeComment } from "react-icons/md";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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
import { motion } from 'framer-motion';

const Comment = ({ props }) => {
    const user = useSelector((state) => state.persistedReducer.user);
    
    const formSchema = z.object({
        comment: z.string().min(1, 'Comment must be at least 1 character long!!'),
    });

    const [isSubmit, setisSubmit] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { comment: "" },
    });

    const onSubmit = async (data) => {
        const newData = { ...data, blogid: props.blogid, user: user.user._id };
        setisSubmit(true);
        try {
            const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/comment/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newData)
            });
            const temp = await resp.json();
            if (!resp.ok) {
                showToast('error', temp.message);
                return;
            }
            props.refresh(prev => !prev);
            form.reset();
            showToast('success', temp.message);
        } catch (err) {
            showToast('error', err.message);
        } finally {
            setisSubmit(false);
        }
    };

    return (
        <motion.div
            className="border dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-200 p-5 rounded-lg shadow-lg transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            <h4 className="flex items-center gap-2 text-2xl pb-2 font-bold dark:text-white">
                <MdModeComment className="text-purple-700" /> Comment
            </h4>

            {user && user.isLoggedIn ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your comment..."
                                            {...field}
                                            className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:dark:ring-purple-700"
                                        />
                                    </FormControl>
                                    <FormMessage className="dark:text-red-400" />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full py-3 dark:bg-purple-700 dark:hover:bg-purple-800 dark:text-white">
                            {isSubmit ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>
            ) : (
                <Button className="w-full dark:bg-purple-700 dark:hover:bg-purple-800 dark:text-white">
                    <Link to={RouteLogin}>Login to Comment</Link>
                </Button>
            )}
        </motion.div>
    );
};

export default Comment;
