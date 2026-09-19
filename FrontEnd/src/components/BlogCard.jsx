import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage } from './ui/avatar';
import { FaCalendarDays } from 'react-icons/fa6';
import { FiClock } from 'react-icons/fi';
import usericon from '@/assets/Images/user.png';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import { RouteBlogDetails } from '@/Helper/RouteName';

const BlogCard = ({ props }) => {
    return (
        <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
            <Card className="group w-full max-w-sm overflow-hidden border-transparent pt-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl md:max-w-md lg:max-w-lg xl:max-w-xl">
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
                    <div className='my-3 h-56 w-full overflow-hidden rounded-xl bg-muted'>
                        <img draggable="false" src={props.featuredImage} className='h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-105' alt={props.featuredImageAlt || props.title} />
                    </div>
                    <div className='flex-1'>
                        <p className='mb-2 flex items-center gap-3 text-sm text-muted-foreground'>
                            <span className="flex items-center gap-2"><FaCalendarDays />
                            <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                            </span>
                            <span className="flex items-center gap-1"><FiClock /> {props.readingTime || 1} min read</span>
                        </p>
                        <h2 className='text-2xl font-bold line-clamp-2'>{props.title}</h2>
                        {props.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{props.excerpt}</p>}
                        {props.tags?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {props.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="font-normal">#{tag}</Badge>)}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default BlogCard;
