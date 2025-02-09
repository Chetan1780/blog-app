export const RouteIndex = '/';
export const RouteLogin = '/login'
export const RouteRegister = '/register'
export const RouteProfile = '/profile'
export const RouteCategoryDetails = '/categories'
export const RouteAddCategory = '/category/add'
export const RouteEditCategory = (category_id)=>{
    if(category_id){
        return `/category/edit/${category_id}`
    } 
    return '/category/edit/:category_id'
}
export const RouteBlog = '/blog'
export const RouteBlogAdd = '/blog/add'
export const RouteEditBlog = (blog_id)=>{
    if(blog_id){
        return `/blog/edit/${blog_id}`
    } 
    return '/blog/edit/:blog_id'
}
export const RouteBlogDetails = (category,blog)=>{
    if(!category || !blog){
       return '/blog/:category/:blog'
    } else{
        return `/blog/${category}/${blog}`
    }
}
export const RouteBlogByCategory = (category)=>{
    if(!category){
       return '/blog/:category'
    } else{
        return `/blog/${category}`
    }
}
export const RouteSearch = (query)=>{
    if(query){
        return `/search?q=${query}`
    }
    return '/search'
}

export const RouteComments = '/comments'
export const RouteUsers = '/users'