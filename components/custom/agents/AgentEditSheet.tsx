import React, { useState } from 'react'
import Image from 'next/image'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { CreatedAgentType } from './CreateAgent'
import { Shuffle } from 'lucide-react'
import { previousDay } from 'date-fns'
import { Input } from '@base-ui/react'

type Props ={
    children:any,
    agentConfig: CreatedAgentType | null
}

function AgentEditSheet({children, agentConfig}: Props) {

    const [draftAgent,setDraftAgent] = useState<CreatedAgentType | null>(agentConfig); 

    const shuffleImage = () => {
        const randomSeed = crypto.randomUUID();
        const newImage = `https://api.dicebear.com/10.x/marbles/svg?noseProbability=0&seed=${randomSeed}`;
        setDraftAgent((prev:any)=>({
            ...prev,
            agentImage: newImage
        }))
    }

    const updateDraft=(key:string,value:string)=>{
        setDraftAgent((prev:any)=>({
            ...prev,
            [key]:value
        }))
    }

    const handleSubmit=()=>{
        
    }

    return (
    <Sheet>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent>
            <form onSubmit={handleSubmit}>
            <SheetHeader className='border-b py-4'>
            <div className='flex gap-2.5 items-center'>
                <div>
                    <Image src={'/logo.svg'} alt='logo' width={35} height={35} />
                </div>
                <div>
                    <SheetTitle>Edit Agent</SheetTitle>
                    <SheetDescription>Update how this agent looks, works and more</SheetDescription>
                </div>
            </div>
            </SheetHeader>

            <ScrollArea className={'p-5'}>
                <section className='flex gap-3 items-center border rounded-2xl bg-gray-50 p-3 shadow-sm hover:shadow-purple-300'>
                    <div>
                        <img src={draftAgent?.agentImage} alt={draftAgent?.name ?? ''} 
                            width={88} height={88} 
                        className='bg-slate-100 p-2 border rounded-2xl size-20 '/>
                    </div>
                    <div className='space-y-2'>
                        <p className='font-medium'>Agent Image</p>
                        <p className='text-xs text-muted-foreground'>
                            Shuffle to Generate new look
                        </p>
                        <Button variant={'outline'}
                            onClick={shuffleImage}>
                        <Shuffle/>Shuffle Image</Button>
                    </div>
                </section>

                <section>
                    <label>Agent Name</label>
                    <Input
                    value={draftAgent?.name}
                    onChange={(event)=>updateDraft('name', event.target.value)}
                    placeholder='Give your agent name: '
                    required
                    />
                </section>

            </ScrollArea>
            <SheetFooter className='border-t'>
                <div className='flex justify-end gap-2.5'>
                    <Button variant='outline'>Cancel</Button>
                    <Button className={'bg-purple-700'}>Save Changes</Button>
                </div>
            </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>
  )
}

export default AgentEditSheet
