import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
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
import { RouteBlog, RouteIndex, RouteRegister } from '@/Helper/RouteName';
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
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const AddBlog = () => {
  const user = useSelector((state) => state.persistedReducer.user);
  const formSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long!!'),
    category: z.string().min(3, 'Category must be at least 3 characters long!!'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long!!'),
    content: z.string().min(3, 'Blog content must be at least 3 characters long!!'),
  });
  const { data: categoryData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/category/all-category`, {
    method: 'get',
    credentials: 'include'
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      slug: "",
      content: ""
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
    const newData = {...data,author:user.user._id};
    const formData = new FormData();
    formData.append('file',file)
    formData.append('data',JSON.stringify(newData));
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
    <div className="dark:bg-gray-900 dark:text-white min-h-screen">
      <Card className="pt-5 max-w-screen-xl mx-auto dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 mx-8 dark:text-white">Add Blog</h1>
  
        <CardContent>
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
  
              <Button type="submit" className="w-full py-3 dark:bg-gray-700 dark:hover:bg-gray-600">
                {isSaving ? "Saving" : "Save"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
  
}

export default AddBlog