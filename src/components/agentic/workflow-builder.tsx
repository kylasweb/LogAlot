
"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';
import { Bot, GripVertical, Plus, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Agent } from '@/lib/types';


// A simple utility to reorder a list
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Represents a single step in the workflow
const WorkflowStep = ({ agent, index, isDragDisabled }: { agent: Agent, index: number, isDragDisabled?: boolean }) => (
    <Draggable draggableId={agent.id} index={index} isDragDisabled={isDragDisabled}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={`mb-4 transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
      >
        <Card className={`neo-outset p-4 flex items-center gap-4 ${isDragDisabled ? 'bg-muted/50' : 'bg-card'}`}>
            <div {...provided.dragHandleProps} className={isDragDisabled ? 'cursor-not-allowed' : 'cursor-grab'}>
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          <Bot className="h-6 w-6 text-primary" />
          <div className="flex-grow">
            <h4 className="font-semibold">{agent.name}</h4>
            <p className="text-xs text-muted-foreground">{agent.description}</p>
          </div>
          <Badge variant="secondary">{agent.model}</Badge>
        </Card>
      </div>
    )}
  </Draggable>
);

// This component uses react-beautiful-dnd which is not fully compatible with React 18 Strict Mode.
// A wrapper is needed to ensure it only renders on the client and avoids strict mode double-rendering issues.
function WorkflowDndContainer({ allAgents, activeWorkflow, setActiveWorkflow, isCustomMode }: { allAgents: Agent[], activeWorkflow: Agent[], setActiveWorkflow: (agents: Agent[]) => void, isCustomMode: boolean }) {
  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination || !isCustomMode) {
      return;
    }
    const items = reorder(activeWorkflow, result.source.index, result.destination.index);
    setActiveWorkflow(items);
  };
  
  const addAgentToWorkflow = (agentId: string) => {
    const agentToAdd = allAgents.find(a => a.id === agentId);
    if(agentToAdd && !activeWorkflow.find(w => w.id === agentId)){
        setActiveWorkflow([...activeWorkflow, agentToAdd]);
    }
  }

  const availableAgents = allAgents.filter(agent => !activeWorkflow.find(w => w.id === agent.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg neo-inset min-h-[300px] relative">
            {!isCustomMode && (
                <div className="absolute inset-0 bg-background/50 z-10 flex flex-col items-center justify-center rounded-lg">
                    <Info className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">Workflow is managed by the selected template.</p>
                    <p className="text-muted-foreground text-sm">Switch to "Custom Workflow" to drag, drop, and edit.</p>
                </div>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="workflow" isDropDisabled={!isCustomMode}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center h-full">
                            {activeWorkflow.map((_, index) => (
                                <React.Fragment key={index}>
                                    <div className="h-20" /> 
                                    {index < activeWorkflow.length - 1 && <ArrowRight className="h-6 w-6 text-muted-foreground my-2 rotate-90" />}
                                </React.Fragment>
                            ))}
                        </div>

                        {activeWorkflow.map((agent, index) => (
                            <div key={agent.id} className="relative flex items-center justify-center">
                                <WorkflowStep agent={agent} index={index} isDragDisabled={!isCustomMode} />
                            </div>
                        ))}
                        {provided.placeholder}
                        
                        {activeWorkflow.length === 0 && (
                            <div className="text-center text-muted-foreground p-8">
                                <p>Drag agents from the right panel to build your workflow.</p>
                            </div>
                        )}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
        </div>

        <div className={`p-4 border rounded-lg neo-outset ${!isCustomMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <h3 className="font-headline text-lg mb-4">Available Agents</h3>
            <div className="space-y-2">
                {availableAgents.length > 0 ? availableAgents.map(agent => (
                    <Card key={agent.id} className="p-3 flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="flex-grow text-sm font-medium">{agent.name}</span>
                        <Button size="icon" variant="ghost" onClick={() => addAgentToWorkflow(agent.id)} disabled={!isCustomMode}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </Card>
                )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">All agents are in the workflow.</p>
                )}
            </div>
        </div>
    </div>
  );
}


export function WorkflowBuilder({ allAgents, activeWorkflow, setActiveWorkflow, isCustomMode }: { allAgents: Agent[], activeWorkflow: Agent[], setActiveWorkflow: (agents: Agent[]) => void, isCustomMode: boolean }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Render the DragDropContext only on the client side
    if (!isClient) {
        return null;
    }

    return (
        <WorkflowDndContainer
            allAgents={allAgents}
            activeWorkflow={activeWorkflow}
            setActiveWorkflow={setActiveWorkflow}
            isCustomMode={isCustomMode}
        />
    );
}
