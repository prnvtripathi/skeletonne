import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { PlaygroundState, SkeletonConfig } from './skeleton-playground';

interface ControlPanelProps {
    state: PlaygroundState;
    onUpdateSkeleton: (id: string, updates: Partial<SkeletonConfig>) => void;
    onAddSkeleton: (orientation?: 'horizontal' | 'vertical') => void;
    onRemoveSkeleton: (id: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    state,
    onUpdateSkeleton,
    onAddSkeleton,
    onRemoveSkeleton,
}) => {
    return (
        <Card className="sticky top-6 h-fit">
            <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onAddSkeleton('vertical')}
                            className="flex-1"
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Vertical
                        </Button>
                        <Button
                            onClick={() => onAddSkeleton('horizontal')}
                            className="flex-1"
                            size="sm"
                            variant="outline"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Horizontal
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {state.skeletons.map((skeleton, index) => (
                        <Card key={skeleton.id} className="p-4 bg-muted/30">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Skeleton {index + 1}
                                    </Label>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onRemoveSkeleton(skeleton.id)}
                                        className="text-destructive hover:text-destructive h-6 w-6 p-0"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Orientation</Label>
                                    <Select
                                        value={skeleton.orientation}
                                        onValueChange={(value: 'horizontal' | 'vertical') =>
                                            onUpdateSkeleton(skeleton.id, { orientation: value })
                                        }
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vertical">Vertical</SelectItem>
                                            <SelectItem value="horizontal">Horizontal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Width</Label>
                                    <Input
                                        value={skeleton.width}
                                        onChange={(e) => onUpdateSkeleton(skeleton.id, { width: e.target.value })}
                                        placeholder="e.g., 100%, 200px"
                                        className="h-8 text-xs"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Height</Label>
                                    <Input
                                        value={skeleton.height}
                                        onChange={(e) => onUpdateSkeleton(skeleton.id, { height: e.target.value })}
                                        placeholder="e.g., 20px, 2rem"
                                        className="h-8 text-xs"
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};