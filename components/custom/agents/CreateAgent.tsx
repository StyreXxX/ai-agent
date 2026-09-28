"use client"

import { Button } from '@/components/ui/button'
import { ArrowUp, Loader2, Loader2Icon, Plus } from 'lucide-react'
import React, { useState } from 'react'

const quickSuggestions = [
    {
        label: "Summarize a document",
        prompt: "You are a helpful assistant. Please summarize the following document:"
    },
    {
        label: "Translate text",
        prompt: "You are a helpful assistant. Please translate the following text to French:"
    },
    {
        label: "Generate a creative story",
        prompt: "You are a creative writer. Please generate a short story based on the following prompt:"
    },
    {
        label: "Provide coding assistance",
        prompt: "You are a coding assistant. Please help me with the following coding problem:"
    }
]

import { Bot, UserCheck, Code2 } from "lucide-react"
import axios from 'axios'

const templates = [
  {
    title: "Customer Support Agent",
    description: "Resolves user inquiries, handles ticket routing, and references your product documentation.",
    icon: Bot,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    border: "border-blue-500/20 hover:border-blue-500/50",
    glow: "hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.3)]",
  },
  {
    title: "Lead Qualification Agent",
    description: "Interviews inbound prospects, scores leads based on criteria, and books calls directly to your calendar.",
    icon: UserCheck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    glow: "hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]",
  },
  {
    title: "Code Review Assistant",
    description: "Scans pull requests for syntax errors, enforces style guidelines, and drafts performance suggestions.",
    icon: Code2,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    border: "border-violet-500/20 hover:border-violet-500/50",
    glow: "hover:shadow-[0_0_20px_-3px_rgba(139,92,246,0.3)]",
  },
]

type AgentConfigResp={
    status:'needs_clarification'|'ready',
    clarificationQuestions: any,
    config: any
}

function CreateAgent() {

    const [prompt,setPrompt] = React.useState('');
    const [configResult, setConfigResult] = useState<AgentConfigResp | null>(null);
    const [loading,setLoading] = useState(false);

    const OnsSubmit = async () => {
    setLoading(true);
    try {
        const result = await axios.post('/api/agent/configure', { prompt });
        setConfigResult(result.data);
    } catch (e) {
        console.error(e);
        // optionally show a toast: "Something went wrong, please try again"
    } finally {
        setLoading(false);
    }
}

    return (
    <div>
      <div className='mt-5'>
        <h2 className='text-2xl font-semibold tracking-tight'>Create New Agent</h2>
        <p className='mt-1 text-sm text-muted-foreground'>Ask what type of agent you want to create. Type your goal, task, or workflow</p>
      </div>
      {/*Prompt Box*/}
      <div className= 'w-full border rounded-2xl bg-background p-3 mt-4 shadow-lg shadow-purple-100 hover:shadow-purple-200'>
        <textarea placeholder ='Describe the agent you want to create...'
            className = 'min-h-[90px] w-full resize-none bg-transparent px-2 py-2 text-sm outline-none' 
            value={prompt}
            onChange={(event)=>setPrompt(event.target.value)}
            />
        <div className = 'flex justify-between items-center'>
            <div>
                <Button variant = {'ghost'} size={'icon'}>
                    <Plus/>
                </Button>
            </div>
        <Button 
        disabled={loading}
        onClick={OnsSubmit} size ={'icon'} className={'h-9 w-9 rounded-full bg-purple-600'}>
                {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <ArrowUp />}
            </Button>
        </div>
      </div>

      <div className='mt-3 flex gap-2'>
        {quickSuggestions.map((suggestion, index) => (
            <Button 
            key={index}
            variant ={'outline'} 
            onClick={() => setPrompt(suggestion.prompt)}
            className='hover:text-purple-700 hover:bg-purple-200 hover:border-purple-700'>
                {suggestion.label}
            </Button>
        ))}
      </div>

      {loading ? <div className ='flex gap-2 items-ceter p-5 mt-7 border rounded-xl shadhow-sm'>
        <Loader2Icon className = 'animate-spin' />
        <h2>Generating Agent Config...</h2>
      </div>:

      !configResult&& <div className='mt-10'>
        <h2 className='flex text-lg justify-between items-center font-semibold'>Get Started<span className= 'text-sm font-medium'> View All</span></h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 mt-3'>
            {templates.map((template,index) => (
                <div 
                    key={template.title}
                    className={`border rounded-2xl p-5 hover:cursor-pointer hover:shadow-lg ${template.border} ${template.glow} `}>
                    <template.icon className={`h-12 w-12 p-2 ${template.iconBg} ${template.iconColor} rounded-xl`} />
                    <div className='mt-6'>
                        <h2 className ='font-semibold text-foreground'>
                            {template.title}
                        </h2>
                        <p className='text-sm mt-2 leading-5 text-muted-foreground'>{template.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>}

        {configResult && <div className='mt-10 p-5 border rounded-2xl shadow-sm'>
            <p>{JSON.stringify(configResult)}</p>
        </div>}
    </div>
  )
}

export default CreateAgent
