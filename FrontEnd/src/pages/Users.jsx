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
import { MdDelete } from 'react-icons/md';
import { deletedata } from '@/Helper/HandleDelete';
import { showToast } from '@/Helper/ShowToast';
import moment from 'moment/moment';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import usericon from '@/assets/Images/user.png';

const Users = () => {
    const [referesh, setRefreshData] = useState(false);
    const { data, loading, error } = usefetch(
        `${getEnv('VITE_API_BACKEND_URL')}/user/get-alluser`,
        { method: 'get', credentials: 'include' },
        [referesh]
    );

    const handleDelete = async (id) => {
        const temp = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/user/delete/${id}`);
        if (temp) {
            showToast('success', 'User deleted!');
            setRefreshData(!referesh);
        } else {
            showToast('error', "User couldn't be removed!");
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <div className="p-4 flex flex-col gap-2">
            <Card className="bg-white p-4 dark:bg-gray-900 dark:text-white shadow-lg">
                <CardContent>
                    <Table className="dark:border-gray-700">
                        <TableHeader className="dark:bg-gray-800">
                            <TableRow>
                                <TableHead className="dark:text-gray-300">Role</TableHead>
                                <TableHead className="dark:text-gray-300">Avatar</TableHead>
                                <TableHead className="dark:text-gray-300">Name</TableHead>
                                <TableHead className="dark:text-gray-300">Email</TableHead>
                                <TableHead className="dark:text-gray-300">Registered</TableHead>
                                <TableHead className="dark:text-gray-300">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.users.length > 0 ? (
                                data.users.map(user => (
                                    <TableRow key={user._id} className="dark:border-gray-700">
                                        <TableCell>{user?.role}</TableCell>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={user?.avatar || usericon} />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{user?.name}</TableCell>
                                        <TableCell>{user?.email}</TableCell>
                                        <TableCell>{moment(user.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell className="flex gap-3">
                                            <Button 
                                                onClick={() => handleDelete(user._id)} 
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
                                    <TableCell colSpan="6" className="text-center dark:text-gray-400">
                                        No Users Found!
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

export default Users;
