import React, { useEffect } from 'react'
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
import { showToast } from '@/Helper/ShowToast';
import { getEnv } from '@/Helper/getEnv';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import slugify from 'slugify';
import { useParams } from 'react-router-dom';
import { usefetch } from '@/hooks/usefetch';
import Loading from '@/components/Loading';
const EditCategory = () => {
    const formSchema = z.object({
        name: z.string().min(3,'Name must be at least 3 characters long!!'),
        slug: z.string().min(3,'Slug must be at least 3 characters long!!')
      });
    
      const {category_id} = useParams();
      const { data: categoryData, loading, error } = usefetch(`${getEnv('VITE_API_BACKEND_URL')}/category/show/${category_id}`, {
        method: 'get',
        credentials: 'include'
    },[category_id]);
    console.log(categoryData);;
    
    
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        slug: "",
      },
    });
    
    useEffect(()=>{
      const slug = slugify(form.getValues('name'),{lower:true});
      form.setValue('slug',slug);
      
    },[form.watch('name')])
    
    
    useEffect(() => {
      if(categoryData){
        form.setValue('name',categoryData.data.name);
        form.setValue('slug',categoryData.data.slug);
      }
      
    }, [categoryData])
    

      const onSubmit = async (data) => {
        console.log(data);
          try{
            const resp = await fetch(`${getEnv('VITE_API_BACKEND_URL')}/category/update/${category_id}`,{
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })   
            const temp = await resp.json() ;
            if(!resp.ok){
              showToast('error',temp.message);return;
            }
            showToast('success',temp.message);
          } catch(err){
            showToast('error',err.message);
          }
      };
  return (
    <div>
      <Card className='pt-5 max-w-screen-md mx-auto'>
      <CardContent>
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Slug"
                      className="w-full bg-transparent outline-none p-3 border rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full py-3">
              Save
            </Button>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>

  )
}

export default EditCategory