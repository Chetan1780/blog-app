import { usefetch } from "@/hooks/usefetch";

export const deletedata = async(endpoint)=>{
    const c = confirm('Delete this data?');
    if(c){
        try {
            const resp = await fetch(endpoint,{
                method:'delete',
                credentials:'include'
            })
            const data = await resp.json();
            if(!resp.ok){
                throw new Error(resp.statusText);
            } 
            return true;
        } catch (error) {
            // console.log(error);
            return false;
        }
    }
}