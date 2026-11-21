"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CreatedAgentType } from './CreateAgent';
import { NewAgentCard } from './NewAgentCard';

function MyAgents() {
    const [myAgents, setMyAgents] = useState<CreatedAgentType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AllUsersAgent();
    }, []);

    const AllUsersAgent = async () => {
        try {
            const result = await axios.get('/api/agent/configure');
            console.log(result);
            setMyAgents(result.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className='font-bold text-xl'>My Agents</h2>
            <p className='text-sm text-muted-foreground mt-1'>Run, Manage and Update All the agents you've created</p>

            {loading && (
                <p className='text-sm text-muted-foreground mt-6'>Loading your agents...</p>
            )}

            {!loading && myAgents.length === 0 && (
                <p className='text-sm text-muted-foreground mt-6'>You haven't created any agents yet.</p>
            )}

            {!loading && myAgents.length > 0 && (
                <div className='flex flex-col gap-3 mt-4'>
                    {myAgents.map((agent) => (
                        <NewAgentCard key={agent.agentId} createdAgent={agent} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyAgents