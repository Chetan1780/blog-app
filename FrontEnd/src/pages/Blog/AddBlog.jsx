import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usefetch } from '@/hooks/usefetch';
import { RouteBlog } from '@/Helper/RouteName';
import { showToast } from '@/Helper/ShowToast';
import { getEnv } from '@/Helper/getEnv';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import slugify from 'slugify';
import Loading from '@/components/Loading';
import Dropzone from 'react-dropzone';
import { IoCameraOutline } from "react-icons/io5";
import Editor from '@/components/Editor';
import { useNavigate } from 'react-router-dom';
const AddBlog = () => {
  const formSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long!!'),
    category: z.string().min(3, 'Category must be at least 3 characters long!!'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long!!'),
    content: z.string().min(3, 'Blog content must be at least 3 characters long!!'),
    excerpt: z.string().max(320, 'Keep the excerpt under 320 characters.').optional(),
    tags: z.string().optional(),
    status: z.enum(['draft', 'published']),
    publishedAt: z.string().optional(),
    featuredImageAlt: z.string().max(180, 'Keep alt text under 180 characters.').optional(),
  });
  const { data: categoryData, loading } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/category/all-category`, {
    method: 'get',
    credentials: 'include'
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      slug: "",
      content: "",
      excerpt: "",
      tags: "",
      status: "draft",
      publishedAt: "",
      featuredImageAlt: "",
    },
  });
  useEffect(() => {
    const slug = slugify(form.getValues('title'), { lower: true });
    form.setValue('slug', slug);

  }, [form.watch('title')])
  
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null)
  const [isSaving, setisSaving] = useState(false)
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    // console.log(data);
    setisSaving(true)
    const formData = new FormData();
    const payload = {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : '',
    };
    if (file) formData.append('file',file)
    formData.append('data',JSON.stringify(payload));
    try {
        const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/blog/add`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        const temp = await resp.json();
        if (!resp.ok) {
            showToast('error', temp.message); return;
        }
        form.reset();
        setFile();
        setPreview();
        navigate(RouteBlog);
        showToast('success', temp.message);
    } catch (err) {
        showToast('error', err.message);
    } finally{
      setisSaving(false)
    }
   
  };
  const handleImage = (files) => {
    const temp = files[0];
    setFile(temp);
    setPreview(URL.createObjectURL(temp));
  }
  const handleEditorData = (data) => {
    form.setValue('content', data);
  }
  if (loading) return <Loading />
  // console.log(categoryData);
  return (
    <div className="mx-auto min-h-screen max-w-6xl pb-12 dark:text-white">
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-800 px-6 py-8 text-white shadow-lg md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-violet-200">Writer studio</p>
        <h1 className="mt-2 text-3xl font-bold">Create a story readers remember.</h1>
        <p className="mt-2 max-w-2xl text-violet-100">Save a private draft, add the context readers need, then publish now or schedule for later.</p>
      </div>
      <Card className="overflow-hidden border-none bg-card shadow-lg">
        <div className="border-b bg-muted/40 px-6 py-4"><p className="font-semibold">Story details</p><p className="text-sm text-muted-foreground">Use clear headings, helpful summaries, and accessible images.</p></div>
  
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.defaultValue}
                      >
                        <SelectTrigger className="dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:text-white">
                          {categoryData?.category?.map(item => (
                            <SelectItem
                              key={item._id}
                              value={item._id}
                              className="dark:hover:bg-gray-700"
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        className="w-full bg-transparent outline-none p-3 border rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Slug"
                        className="w-full bg-transparent outline-none p-3 border rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Publishing status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Choose a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Save as draft</SelectItem>
                          <SelectItem value="published">Publish now or schedule</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Publish date (optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" disabled={form.watch('status') === 'draft'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea maxLength={320} placeholder="A concise summary that appears on social cards and listings." {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">{field.value?.length || 0}/320 characters</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="react, frontend, performance" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Use up to 8 comma-separated tags.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
  <div className="space-y-2">
  <span className="dark:text-gray-300">Featured Image</span>
  <Dropzone onDrop={acceptedFiles => handleImage(acceptedFiles)}>
    {({ getRootProps, getInputProps }) => (
      <div className="flex items-center gap-4">
        {/* Clickable Dropzone Box */}
        <div {...getRootProps()} className="w-36 h-28 p-2 rounded-lg border-2 cursor-pointer border-dashed dark:border-gray-600 flex justify-center items-center">
          <input {...getInputProps()} />
          {preview ? (
            <img draggable="false" src={preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <IoCameraOutline size={24} className="dark:text-gray-300" />
          )}
        </div>
      </div>
    )}
  </Dropzone>
</div>

              <FormField
                control={form.control}
                name="featuredImageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Featured image alt text</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the image for readers using a screen reader" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

  
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Blog Content</FormLabel>
                    <FormControl>
                      <Editor
                        initialData=""
                        onChange={handleEditorData}
                        className="dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur">
                <Button type="submit" disabled={isSaving} className="min-w-40 rounded-lg py-3">
                  {isSaving ? "Saving…" : form.watch('status') === 'draft' ? 'Save draft' : 'Publish story'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
  
}

export default AddBlog
