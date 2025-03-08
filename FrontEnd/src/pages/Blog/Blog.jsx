import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RouteBlogAdd, RouteEditBlog } from '@/Helper/RouteName';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Loading from '@/components/Loading';
import { usefetch } from '@/hooks/usefetch';
import { getEnv } from '@/Helper/getEnv';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import moment from 'moment/moment';
import { deletedata } from '@/Helper/HandleDelete';
import { showToast } from '@/Helper/ShowToast';
import { motion } from 'framer-motion';

const Blog = () => {
    const [referesh, setRefreshData] = useState(false);
    const { data: blogData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/all-user-blog`, {
        method: 'get',
        credentials: 'include'
    }, [referesh]);

    const handleDelete = async (id) => {
        const temp = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/blog/delete/${id}`);
        if (temp) {
            showToast('success', 'Blog removed!!');
            setRefreshData(!referesh);
        } else {
            showToast('error', 'Blog didn\'t remove!!');
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <motion.div
            className="p-4 flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            <Button asChild className="dark:bg-purple-700 dark:hover:bg-purple-800 dark:text-white">
                <Link to={RouteBlogAdd}>Add a New Blog</Link>
            </Button>
            
            <Card className="bg-white dark:bg-gray-900 dark:text-white shadow-lg">
                <CardHeader className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-semibold dark:text-gray-300">Your Blogs</h2>
                </CardHeader>
                <CardContent>
                    <Table className="dark:border-gray-700">
                        <TableHeader className="dark:bg-gray-800">
                            <TableRow>
                                <TableHead className="dark:text-gray-300">Author</TableHead>
                                <TableHead className="dark:text-gray-300">Category</TableHead>
                                <TableHead className="dark:text-gray-300">Title</TableHead>
                                <TableHead className="dark:text-gray-300">Slug</TableHead>
                                <TableHead className="dark:text-gray-300">Dated</TableHead>
                                <TableHead className="dark:text-gray-300">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogData && blogData.blog.length > 0 ? (
                                blogData.blog.map(blog => (
                                    <TableRow key={blog._id} className="dark:border-gray-700">
                                        <TableCell className="dark:text-gray-300">{blog.author?.name}</TableCell>
                                        <TableCell className="dark:text-gray-300">{blog.category?.name}</TableCell>
                                        <TableCell className="dark:text-gray-300">{blog?.title}</TableCell>
                                        <TableCell className="dark:text-gray-300">{blog?.slug}</TableCell>
                                        <TableCell className="dark:text-gray-300">{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell className="flex gap-3">
                                            <Button variant="outline" className="hover:bg-purple-700 hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:bg-purple-800 dark:hover:text-white" asChild>
                                                <Link to={RouteEditBlog(blog._id)}><FaEdit /></Link>
                                            </Button>
                                            <Button onClick={() => handleDelete(blog._id)} variant="outline" className="hover:bg-red-700 hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:bg-red-800 dark:hover:text-white" size="icon">
                                                <MdDelete />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center dark:text-gray-400">
                                        No Blogs Found!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default Blog;
