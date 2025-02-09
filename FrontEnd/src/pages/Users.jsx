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
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import usericon from '@/assets/Images/user.png'
const Users = () => {
    const [referesh,setRefreshData] = useState(false);
    const { data, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/user/get-alluser`, {
        method: 'get',
        credentials: 'include'
    },[referesh]);

    const handleDelete = async (id)=>{
        console.log(id);
        const temp = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/user/delete/${id}`)
        if(temp){
            showToast('success','user Deleted!!')
            setRefreshData(!referesh);
        }
        else{
            showToast('error','user didn\'t remove!!')
        }
    }

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    
    console.log(data);
    
    return (
        <div>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.users.length > 0 ? (
                                data.users.map(user => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user?.role}</TableCell>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={user?.avatar || usericon} />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{user?.name}</TableCell>
                                        <TableCell>{user?.email}</TableCell>
                                        <TableCell>{moment(user.createdAt).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell className="flex gap-4">
                                            <Button onClick={()=>handleDelete(user._id)} variant="outline" className="hover:bg-red-700 hover:text-white" size="icon">
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

export default Users;
