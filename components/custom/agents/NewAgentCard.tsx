import React from 'react'
import { CreatedAgentType } from './CreateAgent';
import { Calendar, CalendarCheck2Icon, Pencil } from 'lucide-react';

type Props = {
  createdAgent: CreatedAgentType | null;
}

export function NewAgentCard({createdAgent}: Props) {
  return (
    <div className = 'flex gap-2'>
      <img src = {createdAgent?.agentImage} alt = {createdAgent?.name} width={60} height ={60}
      className = 'p-2 bg-slate-100 rounded-xl'/>
      <div className = 'flex flex-col gap-1'>
        <h2 className = 'font-semibold flex gap-2 item-center'>{createdAgent?.name}
          <span className ='text-green-700 bg-green-100 text-sm rounded-2xl px-2'>{createdAgent?.status}</span>     
        </h2>
        <p className = 'text-muted-foreground text-md'>{createdAgent?.description}</p>
        <div className = 'flex gap-4 text-sm text-muted-foreground items-center'>
          <div className = 'flex gap-2'>
              <CalendarCheck2Icon /> Next Run on {createdAgent?.schedule?.time}
          </div>
          <h2>Runs {createdAgent?.schedule?.frequency}</h2>
        </div>
      </div>

      <div>
        <Pencil/>
      </div>
    </div>
  )
}

export default NewAgentCard
