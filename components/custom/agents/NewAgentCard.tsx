import React, { useState } from 'react'
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
import AgentEditSheet from './AgentEditSheet';

type Props = {
  createdAgent: CreatedAgentType;
  setUpdatedAgent: (agent: CreatedAgentType) => void
}

export function NewAgentCard({ createdAgent, setUpdatedAgent }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const schedule = createdAgent.schedule
  const scheduleLabel = schedule?.type === 'recurring'
    ? `${schedule.frequency ?? 'Recurring'}${schedule.time ? ` at ${schedule.time}` : ''}`
    : schedule?.type === 'once'
      ? `Once${schedule.time ? ` at ${schedule.time}` : ''}`
      : 'On-demand'

  return (
    <div className='flex min-w-0 flex-col rounded-2xl border p-3 shadow-sm transition-shadow hover:shadow-md'>
      <div className='flex min-w-0 items-start justify-between gap-2'>
        <img
          src={createdAgent.agentImage}
          alt={createdAgent.name}
          width={56}
          height={56}
          className='size-14 shrink-0 rounded-xl border bg-slate-100 p-2'
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label={`Actions for ${createdAgent.name}`}>
                <Ellipsis className="h-4 w-4 cursor-pointer" />
              </Button>
            }
          />
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup>
              <DropdownMenuItem><Play/> Run Now</DropdownMenuItem>
              <DropdownMenuItem><Pause/> Pause Agent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditOpen(true)}><Pencil/> Edit Agent</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant='destructive'><Trash/> Delete Agent</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='mt-2 flex min-w-0 flex-col gap-1'>
        <h2 className='flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold'>
          <span className='truncate'>{createdAgent.name}</span>
          <span className='shrink-0 rounded-2xl bg-green-100 px-2 text-sm text-green-700'>
            {createdAgent.status}
          </span>
        </h2>
        <p className='line-clamp-1 text-sm text-muted-foreground'>{createdAgent.description}</p>
        <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
          <CalendarCheck2Icon className='h-4 w-4 shrink-0 text-purple-700' />
          <span className='truncate'>{scheduleLabel}</span>
        </div>
      </div>

      <div className='mt-auto pt-3'>
        <Button type='button' className='w-full bg-purple-700 hover:bg-purple-800'>
          <Play className='h-4 w-4' />
          Run Agent
        </Button>
      </div>

      <AgentEditSheet
        agentConfig={createdAgent}
        setUpdatedAgent={setUpdatedAgent}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}

export default NewAgentCard