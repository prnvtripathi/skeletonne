import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaygroundState } from './skeleton-playground';

interface PreviewAreaProps {
    state: PlaygroundState;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ state }) => {
    // Group skeletons by orientation to create mixed layouts
    const verticalSkeletons = state.skeletons.filter(s => s.orientation === 'vertical');
    const horizontalSkeletons = state.skeletons.filter(s => s.orientation === 'horizontal');

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <Card className="bg-muted/30 border-dashed border-2">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* Render vertical skeletons */}
                            {verticalSkeletons.length > 0 && (
                                <div className="space-y-4 flex flex-col">
                                    {verticalSkeletons.map((skeleton) => (
                                        <Skeleton
                                            key={skeleton.id}
                                            className="animate-pulse"
                                            style={{
                                                width: skeleton.width,
                                                height: skeleton.height,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Render horizontal skeletons */}
                            {horizontalSkeletons.length > 0 && (
                                <div className="space-x-4 flex items-start">
                                    {horizontalSkeletons.map((skeleton) => (
                                        <Skeleton
                                            key={skeleton.id}
                                            className="animate-pulse flex-shrink-0"
                                            style={{
                                                width: skeleton.width,
                                                height: skeleton.height,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};