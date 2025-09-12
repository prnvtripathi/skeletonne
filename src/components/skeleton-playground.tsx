"use client"

import React, { useState } from 'react';
import { ControlPanel } from './control-panel';
import { PreviewArea } from './preview-area';
import { CodeExport } from './code-export';
import { ModeToggle } from './ui/mode-toggle';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from './ui/button';

export interface SkeletonConfig {
    id: string;
    width: string;
    height: string;
    orientation: 'horizontal' | 'vertical';
    borderRadius: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'; // Tailwind tokens
    color?: string; // hex color e.g., #e5e7eb
    rowId?: string; // for grouping horizontal skeletons in the same row
}

export interface PlaygroundState {
    skeletons: SkeletonConfig[];
}

const SkeletonPlayground: React.FC = () => {
    const [state, setState] = useState<PlaygroundState>({
        skeletons: [
            { id: '1', width: '100%', height: '20px', orientation: 'vertical', borderRadius: 'md', color: '#e5e7eb' },
            { id: '2', width: '80%', height: '20px', orientation: 'vertical', borderRadius: 'md', color: '#e5e7eb' },
            { id: '3', width: '60%', height: '20px', orientation: 'vertical', borderRadius: 'md', color: '#e5e7eb' },
        ],
    });

    const redistributeHorizontalWidths = (skeletons: SkeletonConfig[], targetRowId?: string) => {
        const horizontals = skeletons.filter(s => s.orientation === 'horizontal');
        if (horizontals.length === 0) return skeletons;

        // Group horizontals by rowId
        const horizontalsByRow = horizontals.reduce((acc, skeleton) => {
            const rowId = skeleton.rowId || 'default';
            if (!acc[rowId]) acc[rowId] = [];
            acc[rowId].push(skeleton);
            return acc;
        }, {} as Record<string, SkeletonConfig[]>);

        // Redistribute widths within each row
        const redistributed = skeletons.map(skeleton => {
            if (skeleton.orientation !== 'horizontal') return skeleton;

            const rowId = skeleton.rowId || 'default';
            const rowSkeletons = horizontalsByRow[rowId];
            const count = rowSkeletons.length;

            // If we're targeting a specific row and this isn't it, don't change
            if (targetRowId && skeleton.rowId !== targetRowId) return skeleton;

            const each = (100 / count).toFixed(4);
            return { ...skeleton, width: `${each}%` };
        });

        return redistributed;
    };

    const updateSkeleton = (id: string, updates: Partial<SkeletonConfig>) => {
        setState(prev => {
            const targetSkeleton = prev.skeletons.find(s => s.id === id);
            if (!targetSkeleton) return prev;

            // If orientation is changing to horizontal
            if (updates.orientation === 'horizontal' && targetSkeleton.orientation === 'vertical') {
                // Create a new rowId for this horizontal skeleton
                const newRowId = `row-${Date.now()}`;
                const next = prev.skeletons.map(skeleton =>
                    skeleton.id === id ? { ...skeleton, ...updates, rowId: newRowId } : skeleton
                );
                return { ...prev, skeletons: redistributeHorizontalWidths(next, newRowId) };
            }

            // If orientation is changing to vertical
            if (updates.orientation === 'vertical' && targetSkeleton.orientation === 'horizontal') {
                const oldRowId = targetSkeleton.rowId;
                const next = prev.skeletons.map(skeleton =>
                    skeleton.id === id ? { ...skeleton, ...updates, rowId: undefined } : skeleton
                );
                // Redistribute remaining horizontal skeletons in the old row
                return { ...prev, skeletons: oldRowId ? redistributeHorizontalWidths(next, oldRowId) : next };
            }

            // For other updates, just apply them
            const next = prev.skeletons.map(skeleton =>
                skeleton.id === id ? { ...skeleton, ...updates } : skeleton
            );

            return { ...prev, skeletons: next };
        });
    };

    const addSkeleton = (orientation: 'horizontal' | 'vertical' = 'vertical') => {
        const newId = Date.now().toString();
        setState(prev => {
            if (orientation === 'vertical') {
                // Vertical skeletons always get their own new line/row
                const added: SkeletonConfig = {
                    id: newId,
                    width: '100%',
                    height: '20px',
                    orientation: 'vertical',
                    borderRadius: 'md',
                    color: '#e5e7eb',
                    rowId: undefined, // No rowId means it's on its own line
                };
                return { ...prev, skeletons: [...prev.skeletons, added] };
            } else {
                // Horizontal skeleton - add to current/latest row
                if (prev.skeletons.length === 0) {
                    // First skeleton - create horizontal skeleton with new rowId
                    const rowId = `row-${newId}`;
                    const added: SkeletonConfig = {
                        id: newId,
                        width: '100%',
                        height: '20px',
                        orientation: 'horizontal',
                        borderRadius: 'md',
                        color: '#e5e7eb',
                        rowId,
                    };
                    const next = [...prev.skeletons, added];
                    return { ...prev, skeletons: redistributeHorizontalWidths(next, rowId) };
                }

                // Find the latest row (last skeleton's position determines the current row)
                const lastSkeleton = prev.skeletons[prev.skeletons.length - 1];

                if (lastSkeleton.orientation === 'vertical') {
                    // Current row has vertical skeleton(s) - convert them to horizontal and add new horizontal
                    const newRowId = `row-${newId}`;

                    // Convert the last vertical skeleton to horizontal and assign it the same rowId
                    const updatedSkeletons = prev.skeletons.map((skeleton, index) => {
                        if (index === prev.skeletons.length - 1) {
                            return { ...skeleton, orientation: 'horizontal' as const, rowId: newRowId };
                        }
                        return skeleton;
                    });

                    // Add the new horizontal skeleton to the same row
                    const added: SkeletonConfig = {
                        id: newId,
                        width: '100%',
                        height: '20px',
                        orientation: 'horizontal',
                        borderRadius: 'md',
                        color: '#e5e7eb',
                        rowId: newRowId,
                    };

                    const next = [...updatedSkeletons, added];
                    return { ...prev, skeletons: redistributeHorizontalWidths(next, newRowId) };
                } else {
                    // Current row already has horizontal skeleton(s) - add to same row
                    const currentRowId = lastSkeleton.rowId;
                    const added: SkeletonConfig = {
                        id: newId,
                        width: '100%',
                        height: '20px',
                        orientation: 'horizontal',
                        borderRadius: 'md',
                        color: '#e5e7eb',
                        rowId: currentRowId,
                    };

                    const next = [...prev.skeletons, added];
                    return { ...prev, skeletons: redistributeHorizontalWidths(next, currentRowId) };
                }
            }
        });
    };

    const removeSkeleton = (id: string) => {
        setState(prev => {
            const skeletonToRemove = prev.skeletons.find(s => s.id === id);
            const filtered = prev.skeletons.filter(skeleton => skeleton.id !== id);
            
            // If removing a horizontal skeleton, redistribute the remaining in its row
            if (skeletonToRemove?.orientation === 'horizontal' && skeletonToRemove.rowId) {
                return { ...prev, skeletons: redistributeHorizontalWidths(filtered, skeletonToRemove.rowId) };
            }
            
            return { ...prev, skeletons: filtered };
        });
    };


    return (
        <main className="min-h-screen relative">
            <header className="border-b border-border bg-card">
                <div className='flex items-center justify-between w-11/12 mx-auto py-3'>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-foreground">Skeletonne Loader Playground</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Design and customize skeleton loaders, then export the code
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <ModeToggle />
                        <Button variant="outline" size={"icon"} asChild>
                            <Link href="https://github.com/prnvtripathi/skeletonne" target="_blank" rel="noopener noreferrer">
                                <Github />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto p-3">
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

            <footer className='absolute bottom-0 w-full'>
                <div className="text-center py-4 text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Made with 💀 by {' '}
                    <Link
                        href="https://pranavtripathi.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='underline hover:text-foreground transition-colors'
                    >
                        Pranav Tripathi
                    </Link>
                </div>
            </footer>
        </main>
    );
};

export default SkeletonPlayground;