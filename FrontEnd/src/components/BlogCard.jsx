import React from 'react'
import { Card, CardContent } from './ui/card'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge';
import { Avatar, AvatarImage } from './ui/avatar';
import { FaCalendarDays } from "react-icons/fa6";
import usericon from '@/assets/Images/user.png';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import { RouteBlogDetails } from '@/Helper/RouteName';
const BlogCard = ({ props }) => {
    const user = useSelector((state) => state.persistedReducer.user);
    return (
        <Link to={RouteBlogDetails(props.category.slug, props.slug)} >
            <Card className="pt-5">
                <CardContent>
                    <div className='flex items-center justify-between'>
                        <div className='flex justify-between items-center gap-2'>
                            <Avatar>
                                <AvatarImage src={props.author?.avatar || usericon} />
                            </Avatar>
                            <span className=''>{props.author?.name}</span>
                        </div>
                        {props.author?.role === 'admin' &&
                            <Badge className="bg-purple-600 text-white" variant='outine'>Admin</Badge>}
                    </div>
                    <div className='rounded my-2'>
                        <img src={props.featuredImage} className='rounded' alt="" srcset="" />
                    </div>
                    <div className=''>
                        <p className='flex items-center gap-2 mb-2'>
                            <FaCalendarDays />
                            <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                        </p>
                        <h2 className='text-2xl font-bold line-clamp-2'>{props.title}</h2>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default BlogCard