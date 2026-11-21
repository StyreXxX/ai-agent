"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AgentSchedule, CreatedAgentType } from './CreateAgent'
import { Plus, Shuffle, X } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import axios from 'axios'

type EditableTool = {
    slug: string
    name: string
    connected: boolean
}

// Placeholder list — swap this for the real connected-tools state later
const AVAILABLE_TOOLS: EditableTool[] = [
    { slug: 'google_calendar', name: 'google_calendar', connected: false },
    { slug: 'notion', name: 'notion', connected: false },
]

type Props = {
    agentConfig: CreatedAgentType
    setUpdatedAgent: (agent: CreatedAgentType) => void
    open: boolean
    onOpenChange: (open: boolean) => void
}

function AgentEditSheet({ agentConfig, setUpdatedAgent, open, onOpenChange }: Props) {

    const [draftAgent, setDraftAgent] = useState<CreatedAgentType>(agentConfig)
    const [skillInput, setSkillInput] = useState("")
    const [tools, setTools] = useState<EditableTool[]>(AVAILABLE_TOOLS)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setDraftAgent(agentConfig)
    }, [agentConfig])

    const updateDraft = <K extends keyof CreatedAgentType>(key: K, value: CreatedAgentType[K]) => {
        setDraftAgent((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const updateSchedule = <K extends keyof AgentSchedule>(key: K, value: AgentSchedule[K]) => {
        setDraftAgent((prev) => ({
            ...prev,
            schedule: {
                ...prev?.schedule,
                [key]: value,
            },
        }))
    }

    const shuffleImage = () => {
        const randomSeed = crypto.randomUUID();
        const newImage = `https://api.dicebear.com/10.x/marbles/svg?noseProbability=0&seed=${randomSeed}`;
        updateDraft("agentImage", newImage)
    }

    const addSkill = () => {
        const skill = skillInput.trim()
        if (!skill) return
        if (draftAgent?.skills?.includes(skill)) {
            setSkillInput("")
            return
        }
        setDraftAgent((prev: any) => ({
            ...prev,
            skills: [...(prev?.skills ?? []), skill],
        }))
        setSkillInput("")
    }

    const removeSkill = (skillToRemove: string) => {
        setDraftAgent((prev: any) => ({
            ...prev,
            skills: (prev?.skills ?? []).filter((s: string) => s !== skillToRemove),
        }))
    }

    const toggleToolConnection = (slug: string) => {
        // Stub — wire up real connect/disconnect flow later
        setTools((prev) =>
            prev.map((tool) =>
                tool.slug === slug ? { ...tool, connected: !tool.connected } : tool
            )
        )
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true)

        try {
            const result = await axios.put('/api/agent/configure', {
                agentConfig: draftAgent
            })

            if (result.data?.error) {
                toast.add({
                    title: result.data.error,
                    type: "error",
                })
                return
            }

            setUpdatedAgent(result.data)
            toast.add({
                title: "Agent Updated",
                type: "success",
            })
            onOpenChange(false)
        } catch (error) {
            console.error('Unable to update agent:', error)
            toast.add({
                title: "Unable to update agent",
                type: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    const isRecurring = draftAgent?.schedule?.type === "recurring"

    return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
            <form onSubmit={handleSubmit} className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
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
                {/* Agent Image */}
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
                        <Button variant={'outline'} type="button"
                            onClick={shuffleImage}>
                        <Shuffle/>Shuffle Image</Button>
                    </div>
                </section>

                {/* Agent Name */}
                <div className='space-y-2 mt-4'>
                    <Label htmlFor='agent-name'>Agent Name</Label>
                    <Input
                    id='agent-name'
                    value={draftAgent?.name ?? ''}
                    onChange={(event)=>updateDraft('name', event.target.value)}
                    placeholder='Give your agent name: '
                    required
                    className='mt-1'
                    />
                </div>

                {/* Prompt / Instructions */}
                <section className='space-y-4 mt-6'>
                    <div className='space-y-2'>
                        <Label htmlFor='agent-objective'>Objective</Label>
                        <Textarea
                            id='agent-objective'
                            value={draftAgent?.objective ?? ''}
                            onChange={(event) =>
                                updateDraft('objective', event.target.value)
                            }
                            placeholder='What should this agent accomplish?'
                            className='min-h-[80px]'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='agent-instructions'>Instructions</Label>
                        <Textarea
                            id='agent-instructions'
                            value={draftAgent?.instructions ?? ''}
                            onChange={(event) =>
                                updateDraft('instructions', event.target.value)
                            }
                            placeholder='Step-by-step instructions for this agent'
                            className='min-h-[120px]'
                        />
                    </div>
                </section>

                {/* Schedule */}
                <section className='space-y-4 rounded-2xl border p-4 mt-6'>
                    <div>
                        <h3 className='font-medium'>Schedule</h3>
                        <p className='text-xs text-muted-foreground'>
                            Choose when and how often this agent runs.
                        </p>
                    </div>

                    <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label>Run type</Label>
                            <Select
                                value={draftAgent?.schedule?.type ?? 'manual'}
                                onValueChange={(value) => {
                                    if (value) updateSchedule('type', value)
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select run type' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='manual'>Manual</SelectItem>
                                    <SelectItem value='once'>Once</SelectItem>
                                    <SelectItem value='recurring'>Recurring</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='agent-time'>Time</Label>
                            <Input
                                id='agent-time'
                                type='time'
                                value={draftAgent?.schedule?.time ?? ''}
                                onChange={(event) => updateSchedule('time', event.target.value)}
                                disabled={draftAgent?.schedule?.type === 'manual'}
                            />
                        </div>
                    </div>

                    {isRecurring && (
                        <div className='space-y-2'>
                            <Label>Frequency</Label>
                            <Select
                                value={draftAgent?.schedule?.frequency ?? ''}
                                onValueChange={(value) => {
                                    if (
                                        value === 'hourly' ||
                                        value === 'daily' ||
                                        value === 'weekly' ||
                                        value === 'monthly'
                                    ) {
                                        updateSchedule('frequency', value)
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select frequency' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='hourly'>Hourly</SelectItem>
                                    <SelectItem value='daily'>Daily</SelectItem>
                                    <SelectItem value='weekly'>Weekly</SelectItem>
                                    <SelectItem value='monthly'>Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </section>

                {/* Skills */}
                <section className='space-y-3 rounded-2xl border p-4 mt-6'>
                    <div>
                        <h3 className='font-medium'>Skills</h3>
                        <p className='text-xs text-muted-foreground'>
                            Add or remove capabilities this agent should use.
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                        {(draftAgent?.skills ?? []).map((skill: string) => (
                            <Badge key={skill} variant='secondary' className='gap-1 pr-1'>
                                {skill}
                                <button
                                    type='button'
                                    onClick={() => removeSkill(skill)}
                                    className='rounded-full hover:bg-muted-foreground/20 p-0.5'
                                >
                                    <X className='h-3 w-3' />
                                </button>
                            </Badge>
                        ))}
                    </div>

                    <div className='flex gap-2'>
                        <Input
                            value={skillInput}
                            onChange={(event) => setSkillInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault()
                                    addSkill()
                                }
                            }}
                            placeholder='Add a skill'
                        />
                        <Button type='button' variant='outline' onClick={addSkill}>
                            <Plus className='h-4 w-4' />
                            Add
                        </Button>
                    </div>
                </section>

                {/* Connected Tools */}
                <section className='space-y-3 mt-6'>
                    <div>
                        <h3 className='font-medium'>Connected Tools</h3>
                        <p className='text-xs text-muted-foreground'>
                            {tools.filter((t) => t.connected).length} of {tools.length} connected
                        </p>
                    </div>

                    <div className='space-y-2'>
                        {tools.map((tool) => (
                            <div
                                key={tool.slug}
                                className='flex items-center justify-between border rounded-xl p-3'
                            >
                                <div className='flex items-center gap-2'>
                                    <Shuffle className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>{tool.name}</p>
                                        <p className='text-xs text-muted-foreground'>
                                            {tool.connected ? 'Connected' : 'Not connected'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type='button'
                                    size='sm'
                                    variant={tool.connected ? 'outline' : 'default'}
                                    onClick={() => toggleToolConnection(tool.slug)}
                                >
                                    {tool.connected ? 'Disconnect' : 'Connect'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Output Format */}
                <section className='space-y-2 mt-6'>
                    <Label htmlFor='agent-output-format'>Output Format</Label>
                    <Textarea
                        id='agent-output-format'
                        value={draftAgent?.outputFormat ?? ''}
                        onChange={(event) => updateDraft('outputFormat', event.target.value)}
                        placeholder='Describe how results should be formatted'
                        className='min-h-[80px]'
                    />
                </section>

            </ScrollArea>
            <SheetFooter className='border-t'>
                <div className='flex justify-end gap-2.5'>
                    <SheetClose render={<Button variant='outline' type='button'>Cancel</Button>} />
                    <Button className={'bg-purple-700'} type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>
  )
}

export default AgentEditSheet