"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CreatedAgentType } from './CreateAgent';
import { NewAgentCard } from './NewAgentCard';

function MyAgents() {
    const [myAgents, setMyAgents] = useState<CreatedAgentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        AllUsersAgent();
    }, []);

    const AllUsersAgent = async () => {
        try {
            const result = await axios.get('/api/agent/configure');
            setMyAgents(result.data);
        } catch (e) {
            console.error(e);
            setLoadError('Unable to load your agents. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleAgentUpdated = (updatedAgent: CreatedAgentType) => {
        setMyAgents((agents) =>
            agents.map((agent) =>
                agent.agentId === updatedAgent.agentId ? updatedAgent : agent
            )
        );
    }

    return (
        <div className='mt-6'>
            <h2 className='font-bold text-xl'>My Agents</h2>
            <p className='text-sm text-muted-foreground mt-1'>Run, Manage and Update All the agents you've created</p>

            {loading && (
                <p className='text-sm text-muted-foreground mt-6'>Loading your agents...</p>
            )}

            {!loading && loadError && (
                <p role='alert' className='text-sm text-destructive mt-6'>{loadError}</p>
            )}

            {!loading && !loadError && myAgents.length === 0 && (
                <p className='text-sm text-muted-foreground mt-6'>You haven't created any agents yet.</p>
            )}

            {!loading && !loadError && myAgents.length > 0 && (
                <div className='grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2'>
                    {myAgents.map((agent) => (
                        <NewAgentCard
                            key={agent.agentId}
                            createdAgent={agent}
                            setUpdatedAgent={handleAgentUpdated}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyAgents