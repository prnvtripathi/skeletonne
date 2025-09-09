"use client"

import React, { useState } from 'react';
import { ControlPanel } from './control-panel';
import { PreviewArea } from './preview-area';
import { CodeExport } from './code-export';
import { ModeToggle } from './ui/mode-toggle';

export interface SkeletonConfig {
    id: string;
    width: string;
    height: string;
    orientation: 'horizontal' | 'vertical';
}

export interface PlaygroundState {
    skeletons: SkeletonConfig[];
}

const SkeletonPlayground: React.FC = () => {
    const [state, setState] = useState<PlaygroundState>({
        skeletons: [
            { id: '1', width: '100%', height: '20px', orientation: 'vertical' },
            { id: '2', width: '80%', height: '20px', orientation: 'vertical' },
            { id: '3', width: '60%', height: '20px', orientation: 'vertical' },
        ],
    });

    const updateSkeleton = (id: string, updates: Partial<SkeletonConfig>) => {
        setState(prev => ({
            ...prev,
            skeletons: prev.skeletons.map(skeleton =>
                skeleton.id === id ? { ...skeleton, ...updates } : skeleton
            ),
        }));
    };

    const addSkeleton = (orientation: 'horizontal' | 'vertical' = 'vertical') => {
        const newId = Date.now().toString();
        setState(prev => ({
            ...prev,
            skeletons: [...prev.skeletons, { id: newId, width: '100%', height: '20px', orientation }],
        }));
    };

    const removeSkeleton = (id: string) => {
        setState(prev => ({
            ...prev,
            skeletons: prev.skeletons.filter(skeleton => skeleton.id !== id),
        }));
    };


    return (
        <main className="min-h-screen bg-background">
            <header className="border-b border-border bg-card">
                <div className='flex items-center justify-between w-11/12 mx-auto py-3'>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-foreground">Skeletonne Loader Playground</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Design and customize skeleton loaders, then export the code
                        </p>
                    </div>
                    <ModeToggle />
                </div>
            </header>

            <div className="mx-auto py-3 w-11/12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <ControlPanel
                            state={state}
                            onUpdateSkeleton={updateSkeleton}
                            onAddSkeleton={addSkeleton}
                            onRemoveSkeleton={removeSkeleton}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <PreviewArea state={state} />
                    </div>

                    <div className="lg:col-span-1">
                        <CodeExport state={state} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SkeletonPlayground;