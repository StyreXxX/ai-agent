import { Button } from '@/components/ui/button'
import { ArrowUp, Plus } from 'lucide-react'
import React from 'react'

function CreateAgent() {
  return (
    <div>
      <div className='mt-5'>
        <h2 className='text-2xl font-semibold tracking-tight'>Create New Agent</h2>
        <p className='mt-1 text-sm text-muted-foreground'>Ask what type of agent you want to create. Type your goal, task, or workflow</p>
      </div>
      {/*Prompt Box*/}
      <div>
        <textarea placeholder ='Describe the agent you want to create...'
            className = 'min-h-[90px] w-full resize-none bg-transparent px-2 py-2 text-sm outline-none' />
        <div className = 'flex justify-between items-center'>
            <div>
                <Button variant = {'ghost'} size={'icon'}>
                    <Plus/>
                </Button>
            </div>
            <Button size ={'icon'} className={'h-9 w-9 rounded-full bg-purple-600'}>
                <ArrowUp/>
            </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateAgent
