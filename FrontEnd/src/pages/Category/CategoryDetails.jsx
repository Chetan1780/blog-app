import { Card, CardContent } from '@/components/ui/card';
import { RouteAddCategory, RouteEditCategory } from '@/Helper/RouteName';
import React, { useState } from 'react';
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
import { usefetch } from '@/hooks/usefetch';
import { getEnv } from '@/Helper/getEnv';
import Loading from '@/components/Loading';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { deletedata } from '@/Helper/HandleDelete';
import { showToast } from '@/Helper/ShowToast';

const CategoryDetails = () => {
    const [referesh, setRefreshData] = useState(false);
    const { data: categoryData, loading, error } = usefetch(
        `${getEnv('VITE_API_BACKEND_URL')}/category/all-category`, 
        { method: 'get', credentials: 'include' },
        [referesh]
    );

    const handleDelete = async (id) => {
        const temp = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/category/delete/${id}`);
        if (temp) {
            showToast('success', 'Category removed!!');
            setRefreshData(!referesh);
        } else {
            showToast('error', "Category didn't remove!!");
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <div className="p-4 flex flex-col gap-2">
            <Button asChild className="dark:bg-purple-700 dark:hover:bg-purple-800 dark:text-white">
                <Link to={RouteAddCategory}>Add Category</Link>
            </Button>
            <Card className="bg-white p-4 dark:bg-gray-900 dark:text-white shadow-lg">
                <CardContent>
                    <Table className="dark:border-gray-700">
                        <TableHeader className="dark:bg-gray-800">
                            <TableRow>
                                <TableHead className="dark:text-gray-300">Category</TableHead>
                                <TableHead className="dark:text-gray-300">Slug</TableHead>
                                <TableHead className="dark:text-gray-300">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categoryData && categoryData.category.length > 0 ? (
                                categoryData.category.map(category => (
                                    <TableRow key={category._id} className="dark:border-gray-700">
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell className="flex gap-3">
                                            <Button 
                                                variant="outline" 
                                                className="hover:bg-purple-700 hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:bg-purple-800 dark:hover:text-white" 
                                                asChild
                                            >
                                                <Link to={RouteEditCategory(category._id)}>
                                                    <FaEdit />
                                                </Link>
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(category._id)} 
                                                variant="outline" 
                                                className="hover:bg-red-700 hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:bg-red-800 dark:hover:text-white" 
                                                size="icon"
                                            >
                                                <MdDelete />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="3" className="text-center dark:text-gray-400">
                                        No Categories Found!
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

export default CategoryDetails;
