"use client"
import axios from 'axios';
import React, { useEffect } from 'react'

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
    useEffect(()=>{
        createNewUser();
    }, [])

    const createNewUser = async() => {
        const result = await axios.post('/api/users');
        console.log(result);
    }

    return (
        <div> {children} </div>
    )
}
export default Provider