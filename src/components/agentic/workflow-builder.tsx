
"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';
import { Bot, GripVertical, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// A simple utility to reorder a list
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Represents a single step in the workflow
const WorkflowStep = ({ agent, index, isDragDisabled }: { agent: any, index: number, isDragDisabled?: boolean }) => (
    <Draggable draggableId={agent.id} index={index} isDragDisabled={isDragDisabled}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`mb-4 transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
      >
        <Card className={`neo-outset p-4 flex items-center gap-4 ${isDragDisabled ? 'bg-muted/50' : 'bg-card'}`}>
          {!isDragDisabled && <GripVertical className="h-5 w-5 text-muted-foreground" />}
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

export function WorkflowBuilder({ agents: allAgents }: { agents: any[] }) {
  const [workflow, setWorkflow] = useState([allAgents[0], allAgents[1]]); // Start with a default workflow

  const onDragEnd: OnDragEndResponder = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      workflow,
      result.source.index,
      result.destination.index
    );
    
    setWorkflow(items);
  };
  
  const addAgentToWorkflow = (agentId: string) => {
    const agentToAdd = allAgents.find(a => a.id === agentId);
    if(agentToAdd && !workflow.find(w => w.id === agentId)){
        setWorkflow([...workflow, agentToAdd]);
    }
  }

  const availableAgents = allAgents.filter(agent => !workflow.find(w => w.id === agent.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Workflow Canvas */}
        <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg neo-inset min-h-[300px]">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="workflow">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center h-full">
                            <div className="w-px bg-border h-full" />
                        </div>

                        {workflow.map((agent, index) => (
                            <div key={agent.id} className="relative flex items-center justify-center">
                                <WorkflowStep agent={agent} index={index} />
                                {index < workflow.length - 1 && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-full mx-4">
                                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {provided.placeholder}
                        
                        {workflow.length === 0 && (
                            <div className="text-center text-muted-foreground p-8">
                                <p>Drag agents from the right panel to build your workflow.</p>
                            </div>
                        )}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
        </div>

        {/* Available Agents Panel */}
        <div className="p-4 border rounded-lg neo-outset">
            <h3 className="font-headline text-lg mb-4">Available Agents</h3>
            <div className="space-y-2">
                {availableAgents.length > 0 ? availableAgents.map(agent => (
                    <Card key={agent.id} className="p-3 flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="flex-grow text-sm font-medium">{agent.name}</span>
                        <Button size="icon" variant="ghost" onClick={() => addAgentToWorkflow(agent.id)}>
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

    