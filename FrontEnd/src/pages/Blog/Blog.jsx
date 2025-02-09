import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RouteAddCategory, RouteBlogAdd, RouteEditBlog, RouteEditCategory } from '@/Helper/RouteName';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
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

const Blog = () => {
    const [referesh,setRefreshData] = useState(false);
    const { data: blogData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/all-user-blog`, {
        method: 'get',
        credentials: 'include'
    },[referesh]);

    const handleDelete = async (id)=>{
        (id);
        const temp = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/blog/delete/${id}`)
        if(temp){
            showToast('success','Blog removed!!')
            setRefreshData(!referesh);
        }
        else{
            showToast('error','Blog didn\'t remove!!')
        }
    }

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    // console.log(blogData);
    
    return (
        <div>
            <Card>
                <CardContent>
                    <CardHeader>
                        <div>
                            <Button asChild>
                                <Link to={RouteBlogAdd}>
                                    Add Blog
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Dated</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogData && blogData.blog.length > 0 ? (
                                blogData.blog.map(blog => (
                                    <TableRow key={blog._id}>
                                        <TableCell>{blog.author?.name}</TableCell>
                                        <TableCell>{blog.category?.name}</TableCell>
                                        <TableCell>{blog?.title}</TableCell>
                                        <TableCell>{blog?.slug}</TableCell>
                                        <TableCell>{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell className="flex gap-4">
                                            <Button variant="outline" className="hover:bg-purple-700 hover:text-white" asChild>
                                                <Link to={RouteEditBlog(blog._id)}><FaEdit /></Link>
                                            </Button>
                                            <Button onClick={()=>handleDelete(blog._id)} variant="outline" className="hover:bg-red-700 hover:text-white" size="icon">
                                                <MdDelete />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="3" className="text-center">
                                        Data Not Found!!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default Blog