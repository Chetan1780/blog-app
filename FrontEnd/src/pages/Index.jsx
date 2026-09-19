import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const Index = () => {
  const loadMoreRef = useRef(null);
  const query = useInfiniteQuery({
    queryKey: ['public-blog-feed'],
    queryFn: ({ pageParam }) => api(`/blog/feed?limit=12${pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''}`),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
  const blogs = query.data?.pages.flatMap((page) => page.items) || [];

  useEffect(() => {
    if (!loadMoreRef.current || !query.hasNextPage) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !query.isFetchingNextPage) query.fetchNextPage();
    }, { rootMargin: '300px' });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  if (query.isLoading) return <Loading />;
  if (query.isError) return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Could not load stories. <Button variant="link" onClick={() => query.refetch()}>Try again</Button></div>;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-800 px-6 py-10 text-white md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-violet-200">Fresh ideas</p>
        <h1 className="mt-2 text-3xl font-bold md:text-5xl">Stories worth your time.</h1>
        <p className="mt-3 max-w-xl text-violet-100">Thoughtful writing from our community of builders, designers, and curious minds.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {blogs.map((blog) => <BlogCard key={blog._id} props={blog} />)}
      </div>
      {!blogs.length && <p className="py-16 text-center text-muted-foreground">No published stories yet.</p>}
      <div ref={loadMoreRef} className="flex min-h-20 items-center justify-center py-8">
        {query.isFetchingNextPage && <Loading />}
        {!query.hasNextPage && blogs.length > 0 && <p className="text-sm text-muted-foreground">You are all caught up.</p>}
      </div>
    </section>
  );
};

export default Index;
