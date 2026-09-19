import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ShieldCheck, UserRoundCheck, UserRoundX } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { showToast } from '@/Helper/ShowToast';

const Users = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ role: '', status: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const loadMoreRef = useRef(null);
  const queryClient = useQueryClient();
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(search), 350); return () => clearTimeout(timer); }, [search]);
  const params = useMemo(() => new URLSearchParams({ limit: '25', ...(debouncedSearch && { q: debouncedSearch }), ...(filters.role && { role: filters.role }), ...(filters.status && { status: filters.status }) }).toString(), [debouncedSearch, filters]);
  const usersQuery = useInfiniteQuery({
    queryKey: ['users', params],
    queryFn: ({ pageParam }) => api(`/user/get-alluser?${params}${pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''}`),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api(`/user/status/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }),
    onSuccess: (data) => { showToast('success', data.message); queryClient.invalidateQueries({ queryKey: ['users'] }); },
    onError: (error) => showToast('error', error.message),
  });
  useEffect(() => {
    if (!loadMoreRef.current || !usersQuery.hasNextPage) return undefined;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && !usersQuery.isFetchingNextPage && usersQuery.fetchNextPage(), { rootMargin: '250px' });
    observer.observe(loadMoreRef.current); return () => observer.disconnect();
  }, [usersQuery.hasNextPage, usersQuery.isFetchingNextPage, usersQuery.fetchNextPage]);
  const users = usersQuery.data?.pages.flatMap((page) => page.users) || [];
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl border bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white"><p className="text-sm font-semibold uppercase tracking-[.18em] text-violet-300">Administration</p><h1 className="mt-2 text-3xl font-bold">User management</h1><p className="mt-2 text-slate-300">Search accounts, filter access, and suspend abusive users without destroying their audit history.</p></section>
      <Card><CardContent className="space-y-4 p-5"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search by name or email" /></div><select className="rounded-md border bg-background px-3" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}><option value="">All roles</option><option value="user">User</option><option value="author">Author</option><option value="editor">Editor</option><option value="admin">Admin</option></select><select className="rounded-md border bg-background px-3" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option></select></div>
        <div className="divide-y">{users.map((user) => <article key={user._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><Avatar><AvatarImage src={user.avatar} /><AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback></Avatar><div><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div></div><div className="flex items-center gap-3"><Badge variant="secondary" className="capitalize">{user.role}</Badge><Badge className={user.status === 'active' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>{user.status}</Badge><Button size="sm" variant="outline" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate({ id: user._id, status: user.status === 'active' ? 'suspended' : 'active' })}>{user.status === 'active' ? <><UserRoundX className="mr-2 h-4 w-4" /> Suspend</> : <><UserRoundCheck className="mr-2 h-4 w-4" /> Restore</>}</Button></div></article>)}</div>
        {usersQuery.isLoading && <p className="py-10 text-center text-muted-foreground">Loading users…</p>}{usersQuery.isError && <p className="py-10 text-center text-red-600">{usersQuery.error.message}</p>}<div ref={loadMoreRef} className="h-6" />{usersQuery.isFetchingNextPage && <p className="text-center text-sm text-muted-foreground">Loading more…</p>}
      </CardContent></Card>
    </div>
  );
};
export default Users;
