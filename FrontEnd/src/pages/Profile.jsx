import React, { useEffect ,useState} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@/Helper/ShowToast';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
import { Card, CardContent } from '@/components/ui/card';
import { usefetch } from '@/hooks/usefetch';
import { getEnv } from '@/Helper/getEnv';
import Loading from '@/components/Loading';
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from 'react-dropzone'
const Profile = () => {
    const user = useSelector(state => state.persistedReducer.user);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null)
    const { data: userData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/user/get-user/${user.user?._id}`, { method: 'get', credentials: 'include' })
    const dispatch = useDispatch();
    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least of 3 character long!!'),
        email: z.string().email(),
        bio: z.string().min(3, 'Bio must be at least 3 character long!!'),
        password: z.string(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            bio: "",
            password: "",
        },
    });
    useEffect(() => {
        if (userData && userData.success) {
            form.reset({
                name: userData.user.name,
                email: userData.user.email,
                bio: userData.user.bio
            })
        }
    }, [userData])
    const onSubmit = async (data) => {
        console.log(data);
        const formData = new FormData();
        formData.append('file',file)
        formData.append('data',JSON.stringify(data));
        try {
            const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/user/update-user/${userData.user._id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            })
            const temp = await resp.json();
            if (!resp.ok) {
                showToast('error', temp.message); return;
            }
            dispatch(setUser(temp.user));
            showToast('success', temp.message);
        } catch (err) {
            showToast('error', err.message);
        }
    };
    const handleImage = (files)=>{
        const temp = files[0];
        setFile(temp);
        setPreview(URL.createObjectURL(temp));
    }
    if (loading) return <Loading />
    return (
        <Card className='max-w-screen-md mx-auto'>
            <CardContent>
                <div className="flex justify-center items-center mt-10">
                    <Dropzone onDrop={acceptedFiles => handleImage(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Avatar className="w-24 h-24 relative border border-purple-700  group">
                                    <AvatarImage src={preview?preview:userData?.user.avatar} />
                                    <div className="absolute inset-0 hidden group-hover:flex bg-black/30 rounded-full justify-center items-center cursor-pointer ">
                                        <IoCameraOutline color="white" size={24} />
                                    </div>
                                </Avatar>
                            </div>
                        )}
                    </Dropzone>

                </div>

                <div>
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
                                                placeholder="Name"
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
                                                placeholder="Email"
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
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                        <Textarea placeholder="Enter Bio" {...field} />
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
                                                placeholder="Password"
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
                                Save Changes
                            </Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

export default Profile