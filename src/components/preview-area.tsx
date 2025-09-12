import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaygroundState } from './skeleton-playground';

interface PreviewAreaProps {
    state: PlaygroundState;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ state }) => {
    // Group skeletons by orientation and rows
    const verticalSkeletons = state.skeletons.filter(s => s.orientation === 'vertical');
    const horizontalSkeletons = state.skeletons.filter(s => s.orientation === 'horizontal');

    // Group horizontal skeletons by rowId
    const horizontalRows = horizontalSkeletons.reduce((acc, skeleton) => {
        const rowId = skeleton.rowId || 'default';
        if (!acc[rowId]) acc[rowId] = [];
        acc[rowId].push(skeleton);
        return acc;
    }, {} as Record<string, typeof horizontalSkeletons>);

    // find overall index of the skeleton in state.skeletons
    const findSkeletonIndex = (id: string) => {
        return state.skeletons.findIndex(s => s.id === id);
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <Card className="bg-muted/30 border-dashed border-2">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {(() => {
                                const renderRows = [];
                                const processedHorizontalRows = new Set();

                                for (let i = 0; i < state.skeletons.length; i++) {
                                    const skeleton = state.skeletons[i];

                                    if (skeleton.orientation === 'vertical') {
                                        // Render vertical skeleton
                                        const rounded = skeleton.borderRadius === 'full' ? 'rounded-full' : skeleton.borderRadius === 'none' ? 'rounded-none' : `rounded-${skeleton.borderRadius}`;
                                        const bg = skeleton.color ? `bg-[${skeleton.color}]` : '';

                                        renderRows.push(
                                            <Skeleton
                                                key={skeleton.id}
                                                className={`animate-pulse ${rounded} ${bg}`}
                                                style={{
                                                    width: skeleton.width,
                                                    height: skeleton.height,
                                                    backgroundColor: skeleton.color,
                                                }}
                                            />
                                        );
                                    } else if (skeleton.orientation === 'horizontal') {
                                        const rowId = skeleton.rowId || `single-${skeleton.id}`;

                                        if (!processedHorizontalRows.has(rowId)) {
                                            // Find all skeletons with the same rowId that come at or after this position
                                            const rowSkeletons = skeleton.rowId
                                                ? horizontalRows[skeleton.rowId]
                                                : [skeleton]; // Single horizontal skeleton without rowId

                                            processedHorizontalRows.add(rowId);

                                            renderRows.push(
                                                <div key={rowId} className="flex items-start gap-1 w-full">
                                                    {rowSkeletons.map((rowSkeleton) => {
                                                        const rounded = rowSkeleton.borderRadius === 'full' ? 'rounded-full' : rowSkeleton.borderRadius === 'none' ? 'rounded-none' : `rounded-${rowSkeleton.borderRadius}`;
                                                        const bg = rowSkeleton.color ? `bg-[${rowSkeleton.color}]` : '';
                                                        return (
                                                            <Skeleton
                                                                key={rowSkeleton.id}
                                                                className={`animate-pulse flex-shrink-0 ${rounded} ${bg}`}
                                                                style={{
                                                                    width: rowSkeleton.width,
                                                                    height: rowSkeleton.height,
                                                                    backgroundColor: rowSkeleton.color,
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            );
                                        }
                                    }
                                }

                                return renderRows;
                            })()}
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};