import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usefetch } from '@/hooks/usefetch';
import { getEnv } from '@/Helper/getEnv';
import Loading from '@/components/Loading';
import { MdDelete } from "react-icons/md";
import { deletedata } from '@/Helper/HandleDelete';
import { showToast } from '@/Helper/ShowToast';
import moment from 'moment/moment';
import { motion } from 'framer-motion';

const Comments = () => {
    const [refresh, setRefreshData] = useState(false);
    const { data: commentData, loading, error } = usefetch(
        `${getEnv('VITE_API_BACKEND_URL')}/comment/get-all-comment`,
        { method: 'get', credentials: 'include' },
        [refresh]
    );

    const handleDelete = async (id) => {
        const temp = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/comment/delete/${id}`);
        if (temp) {
            showToast('success', 'Comment Deleted!');
            setRefreshData(!refresh);
        } else {
            showToast('error', "Comment didn't remove!");
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <motion.div
            className="border dark:border-gray-900 bg-white dark:bg-gray-900 dark:text-gray-200 rounded-lg shadow-lg transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            <Card className="bg-gray-50 dark:bg-gray-900 p-2 dark:text-gray-300 shadow-lg">
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                                <TableHead>Blog</TableHead>
                                <TableHead>Commented By</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commentData && commentData.comments.length > 0 ? (
                                commentData.comments.map(comment => (
                                    <TableRow key={comment._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <TableCell>{comment.blogid?.title}</TableCell>
                                        <TableCell>{comment.user?.name}</TableCell>
                                        <TableCell>{comment?.comment}</TableCell>
                                        <TableCell>{moment(comment.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleDelete(comment._id)}
                                                variant="outline"
                                                className="hover:bg-red-700 hover:text-white dark:hover:bg-red-600"
                                                size="icon"
                                            >
                                                <MdDelete />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center text-gray-500 dark:text-gray-400">
                                        No Comments Found!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Comments;
