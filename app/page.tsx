import { UserButton } from '@clerk/nextjs';
import React from  'react';

export default function Home(){
  return (
    <div>
      <h2> Hello World</h2>
      <UserButton/>
    </div>
  )
}