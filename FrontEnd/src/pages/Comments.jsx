import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RouteAddCategory, RouteEditCategory } from '@/Helper/RouteName';
import React, { useState } from 'react';
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
import { usefetch } from '@/hooks/usefetch';
import { getEnv } from '@/Helper/getEnv';
import Loading from '@/components/Loading';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { deletedata } from '@/Helper/HandleDelete';
import { showToast } from '@/Helper/ShowToast';
import moment from 'moment/moment';

const Comments = () => {
    const [referesh,setRefreshData] = useState(false);
    const { data: commentData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/comment/get-all-comment`, {
        method: 'get',
        credentials: 'include'
    },[referesh]);

    const handleDelete = async (id)=>{
        console.log(id);
        const temp = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/comment/delete/${id}`)
        if(temp){
            showToast('success','Comment Deleted!!')
            setRefreshData(!referesh);
        }
        else{
            showToast('error','Comment didn\'t remove!!')
        }
    }

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    console.log(commentData);
    

    return (
        <div>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Blog</TableHead>
                                <TableHead>Commented By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commentData && commentData.comments.length > 0 ? (
                                commentData.comments.map(comment => (
                                    <TableRow key={comment._id}>
                                        <TableCell>{comment.blogid?.title}</TableCell>
                                        <TableCell>{comment.user?.name}</TableCell>
                                        <TableCell>{comment?.comment}</TableCell>
                                        <TableCell>{moment(comment.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell className="flex gap-4">
                                            <Button onClick={()=>handleDelete(comment._id)} variant="outline" className="hover:bg-red-700 hover:text-white" size="icon">
                                                <MdDelete />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                             : (
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
};

export default Comments;
