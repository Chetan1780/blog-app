import { useEffect, useState } from "react"

export const usefetch= (url,options={},dependecies=[])=>{
    const [data,setData] = useState();
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState();
    useEffect(()=>{
        fetchData();
    },dependecies);
    const fetchData = async ()=>{
        setLoading(true);
        try { 
            const resp = await fetch(url,options);
            const temp = await resp.json();
            if(!resp.ok) throw new Error(`Error: ${resp.statusText},${resp.status}`)
                setData(temp);
            setError();
        } catch (error) {
            setError(error);
        } finally{
            setLoading(false);
        }
    }
    
  
    return {data,loading,error};
}