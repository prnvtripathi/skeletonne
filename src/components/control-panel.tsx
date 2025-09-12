import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { PlaygroundState, SkeletonConfig } from './skeleton-playground';
import { Slider } from '@/components/ui/slider';

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
                            variant={"secondary"}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Vertical
                        </Button>
                        <Button
                            onClick={() => onAddSkeleton('horizontal')}
                            className="flex-1"
                            size="sm"
                            variant={"secondary"}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Horizontal
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {state.skeletons.map((skeleton, index) => (
                        <Card key={skeleton.id} className="p-2 bg-muted/30">
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
                                    <div className="flex items-center gap-3">
                                        <Input
                                            value={skeleton.width}
                                            onChange={(e) => onUpdateSkeleton(skeleton.id, { width: e.target.value })}
                                            placeholder="e.g., 100%, 200px"
                                            className="h-8 text-xs w-36"
                                        />
                                        <Slider
                                            value={[Math.min(100, Math.max(0, parseInt((/^(\d+)/.exec(skeleton.width)?.[1] ?? '100'))))]}
                                            onValueChange={(val: number[]) => onUpdateSkeleton(skeleton.id, { width: `${val[0]}%` })}
                                            max={100}
                                            step={1}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Height</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            value={skeleton.height}
                                            onChange={(e) => onUpdateSkeleton(skeleton.id, { height: e.target.value })}
                                            placeholder="e.g., 20px, 2rem"
                                            className="h-8 text-xs w-36"
                                        />
                                        <Slider
                                            value={[Math.min(200, Math.max(0, parseInt((/^(\d+)/.exec(skeleton.height)?.[1] ?? '20'))))]}
                                            onValueChange={(val: number[]) => onUpdateSkeleton(skeleton.id, { height: `${val[0]}px` })}
                                            max={200}
                                            step={1}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Border Radius</Label>
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const tokens: Array<SkeletonConfig['borderRadius']> = ['none','xs','sm','md','lg','xl','2xl','3xl','full'];
                                            const currentIndex = Math.max(0, tokens.indexOf(skeleton.borderRadius));
                                            return (
                                                <>
                                                    <div className="flex-1">
                                                        <Slider
                                                            value={[currentIndex]}
                                                            onValueChange={(val: number[]) => onUpdateSkeleton(skeleton.id, { borderRadius: tokens[val[0]] })}
                                                            min={0}
                                                            max={tokens.length - 1}
                                                            step={1}
                                                        />
                                                        <div className="mt-2">
                                                            <div className="flex justify-between">
                                                                {tokens.map((t, i) => (
                                                                    <div key={t} className="h-2 w-px bg-border" />
                                                                ))}
                                                            </div>
                                                            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                                                {tokens.map((t) => (
                                                                    <span key={t}>{t}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onUpdateSkeleton(skeleton.id, { borderRadius: 'full' })}
                                                        className="h-8 text-xs"
                                                    >
                                                        Round
                                                    </Button>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Color</Label>
                                    <Input
                                        type="color"
                                        value={skeleton.color ?? '#e5e7eb'}
                                        onChange={(e) => onUpdateSkeleton(skeleton.id, { color: e.target.value })}
                                        className="h-8 w-16 p-1"
                                        title="Skeleton color"
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