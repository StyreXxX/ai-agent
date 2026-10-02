import React from 'react'
import { CreatedAgentType } from './CreateAgent';
import { CalendarCheck2Icon, Ellipsis, Pause, Pencil, Play, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  createdAgent: CreatedAgentType | null;
}

export function NewAgentCard({ createdAgent }: Props) {
  return (
    <div className='flex items-start justify-between gap-2 border mt-7 p-4 rounded-2xl shadow-md hover:shadow-purple-100'>
      <div className='flex gap-2'>
        <img
          src={createdAgent?.agentImage}
          alt={createdAgent?.name}
          width={60}
          height={60}
          className='p-2 bg-slate-100 rounded-xl'
        />
        <div className='flex flex-col gap-1'>
          <h2 className='font-semibold flex gap-2 items-center'>
            {createdAgent?.name}
            <span className='text-green-700 bg-green-100 text-sm rounded-2xl px-2'>
              {createdAgent?.status}
            </span>
          </h2>
          <p className='text-muted-foreground text-md line-clamp-1'>{createdAgent?.description}</p>
          <div className='flex gap-4 text-sm text-muted-foreground items-center'>
            <div className='flex gap-2 items-center'>
              <CalendarCheck2Icon className='h-4 w-4' /> Next Run on {createdAgent?.schedule?.time}
            </div>
            <h2>Runs {createdAgent?.schedule?.frequency}</h2>
          </div>
        </div>
      </div>

      <div className='flex gap-2 items-center text-muted-foreground shrink-0'>
        <Button variant={'ghost'} size={'icon'}>
          <Pencil className='h-4 w-4' />
        </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Ellipsis className="h-4 w-4 cursor-pointer hover:text-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem><Play/> Run Now</DropdownMenuItem>
                <DropdownMenuItem><Pause/> Pause Agent</DropdownMenuItem>
                <DropdownMenuItem><Pencil/> Edit Agent</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant='destructive'><Trash/> Delete Agent</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>          
      </div>
    </div>
  )
}

export default NewAgentCard