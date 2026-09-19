import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RouteBlogAdd, RouteEditBlog } from '@/Helper/RouteName';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Loading from '@/components/Loading';
import { usefetch } from '@/hooks/usefetch';
import { getEnv } from '@/Helper/getEnv';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { FiCalendar, FiClock, FiEye, FiFileText, FiPenTool } from 'react-icons/fi';
import moment from 'moment/moment';
import { deletedata } from '@/Helper/HandleDelete';
import { showToast } from '@/Helper/ShowToast';
import { motion } from 'framer-motion';

const getPublishingState = (blog) => {
  if (blog.status === 'draft') return { label: 'Draft', className: 'bg-slate-200 text-slate-700 hover:bg-slate-200' };
  if (blog.publishedAt && new Date(blog.publishedAt) > new Date()) {
    return { label: 'Scheduled', className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' };
  }
  return { label: 'Published', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' };
};

const Blog = () => {
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState('all');
  const { data: blogData, loading, error } = usefetch(
    `${getEnv('VITE_API_BACKEND_URL')}/blog/all-user-blog`,
    { method: 'get', credentials: 'include' },
    [refresh]
  );
  const { data: activityData } = usefetch(
    `${getEnv('VITE_API_BACKEND_URL')}/blog/activity`,
    { method: 'get', credentials: 'include' },
    [refresh]
  );

  const blogs = blogData?.blog || [];
  const stats = blogData?.stats || { total: 0, drafts: 0, scheduled: 0, published: 0, views: 0 };
  const filteredBlogs = useMemo(() => blogs.filter((blog) => {
    const state = getPublishingState(blog).label.toLowerCase();
    return filter === 'all' || state === filter;
  }), [blogs, filter]);

  const handleDelete = async (id) => {
    const deleted = await deletedata(`${getEnv('VITE_API_BACKEND_URL')}/blog/delete/${id}`);
    if (deleted) {
      showToast('success', 'Blog removed.');
      setRefresh((value) => !value);
      return;
    }
    showToast('error', 'The blog could not be removed.');
  };

  if (loading) return <Loading />;
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">Could not load your dashboard: {error.message}</div>;

  const statCards = [
    { label: 'All posts', value: stats.total, icon: FiFileText, tone: 'text-violet-700 bg-violet-100' },
    { label: 'Published', value: stats.published, icon: FiPenTool, tone: 'text-emerald-700 bg-emerald-100' },
    { label: 'Scheduled', value: stats.scheduled, icon: FiCalendar, tone: 'text-amber-700 bg-amber-100' },
    { label: 'Article views', value: stats.views, icon: FiEye, tone: 'text-sky-700 bg-sky-100' },
  ];

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-6 pb-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-gradient-to-br from-violet-50 via-background to-background p-6 dark:from-violet-950/40 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">Writer workspace</p>
          <h1 className="text-3xl font-bold tracking-tight">Your editorial dashboard</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Track your publishing pipeline, schedule stories, and keep an eye on reader interest.</p>
        </div>
        <Button asChild className="shrink-0 gap-2 rounded-xl">
          <Link to={RouteBlogAdd}><FiPenTool /> Write a story</Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="border-none shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-3xl font-bold">{value}</p>
              </div>
              <span className={`rounded-xl p-3 ${tone}`}><Icon size={22} /></span>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Stories</h2>
              <p className="text-sm text-muted-foreground">{filteredBlogs.length} of {blogs.length} posts</p>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter stories by status">
              {['all', 'published', 'scheduled', 'draft'].map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={filter === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(option)}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Story</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Performance</TableHead>
                  <TableHead className="hidden lg:table-cell">Last updated</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.length ? filteredBlogs.map((blog) => {
                  const status = getPublishingState(blog);
                  return (
                    <TableRow key={blog._id}>
                      <TableCell className="min-w-60">
                        <p className="font-medium">{blog.title}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{blog.excerpt || blog.category?.name || 'No excerpt yet'}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.className}>{status.label}</Badge>
                        {status.label === 'Scheduled' && <p className="mt-1 text-xs text-muted-foreground">{moment(blog.publishedAt).format('DD MMM, HH:mm')}</p>}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><FiEye /> {blog.viewCount || 0}</span>
                        <span className="ml-3 inline-flex items-center gap-1 text-sm text-muted-foreground"><FiClock /> {blog.readingTime || 1} min</span>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground lg:table-cell">{moment(blog.updatedAt).fromNow()}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button aria-label={`Edit ${blog.title}`} variant="outline" size="icon" asChild>
                            <Link to={RouteEditBlog(blog._id)}><FaEdit /></Link>
                          </Button>
                          <Button aria-label={`Delete ${blog.title}`} onClick={() => handleDelete(blog._id)} variant="outline" size="icon" className="text-red-600 hover:bg-red-600 hover:text-white">
                            <MdDelete />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow><TableCell colSpan="5" className="py-12 text-center text-muted-foreground">No stories match this filter.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="h-fit shadow-sm">
          <CardHeader className="border-b p-5"><h2 className="font-semibold">Recent activity</h2></CardHeader>
          <CardContent className="space-y-4 p-5">
            {activityData?.activity?.length ? activityData.activity.map((item) => (
              <div key={item._id} className="border-l-2 border-violet-300 pl-3">
                <p className="text-sm"><span className="font-medium">{item.action}</span> <span className="line-clamp-1">{item.blogTitle}</span></p>
                <p className="mt-1 text-xs text-muted-foreground">{moment(item.createdAt).fromNow()}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">Your publishing activity will appear here.</p>}
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
};

export default Blog;
