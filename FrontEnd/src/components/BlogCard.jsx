import React from 'react';
import { Card, CardContent } from './ui/card';
import { useSelector } from 'react-redux';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage } from './ui/avatar';
import { FaCalendarDays } from 'react-icons/fa6';
import usericon from '@/assets/Images/user.png';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import { RouteBlogDetails } from '@/Helper/RouteName';

const BlogCard = ({ props }) => {
    const user = useSelector((state) => state.persistedReducer.user);
    return (
        <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
            <Card className="pt-5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-full min-h-[450px] overflow-hidden">
                <CardContent className="p-4 flex flex-col h-full">
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Avatar>
                                <AvatarImage src={props.author?.avatar || usericon} />
                            </Avatar>
                            <span>{props.author?.name}</span>
                        </div>
                        {props.author?.role === 'admin' && (
                            <Badge className="bg-purple-600 text-white" variant='outine'>Admin</Badge>
                        )}
                    </div>
                    <div className='rounded my-2 w-full h-[250px] overflow-hidden'>
                        <img draggable="false" src={props.featuredImage} className='rounded w-full h-full object-cover' alt="Blog Thumbnail" />
                    </div>
                    <div className='flex-1'>
                        <p className='flex items-center gap-2 mb-2'>
                            <FaCalendarDays />
                            <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                        </p>
                        <h2 className='text-2xl font-bold line-clamp-2'>{props.title}</h2>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default BlogCard;
