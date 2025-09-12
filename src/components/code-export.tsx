"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { PlaygroundState } from './skeleton-playground';

interface CodeExportProps {
    state: PlaygroundState;
}

export const CodeExport: React.FC<CodeExportProps> = ({ state }) => {
    const [copied, setCopied] = useState(false);

    const convertToTailwindClass = (value: string, type: 'width' | 'height') => {
        const prefix = type === 'width' ? 'w-' : 'h-';

        // Handle percentage values
        if (value.endsWith('%')) {
            const percent = parseInt(value.replace('%', ''));
            const percentMap: { [key: number]: string } = {
                100: 'full',
                75: '3/4',
                66: '2/3',
                60: '3/5',
                50: '1/2',
                40: '2/5',
                33: '1/3',
                25: '1/4',
                20: '1/5',
                16: '1/6',
            };

            if (percentMap[percent]) {
                return `${prefix}${percentMap[percent]}`;
            }
            return `${prefix}[${value}]`;
        }

        // Handle pixel values for height
        if (type === 'height' && value.endsWith('px')) {
            const pixels = parseInt(value.replace('px', ''));
            const heightMap: { [key: number]: string } = {
                4: '1',
                8: '2',
                12: '3',
                16: '4',
                20: '5',
                24: '6',
                28: '7',
                32: '8',
                36: '9',
                40: '10',
                44: '11',
                48: '12',
                56: '14',
                64: '16',
                80: '20',
                96: '24',
                112: '28',
                128: '32',
            };

            if (heightMap[pixels]) {
                return `${prefix}${heightMap[pixels]}`;
            }
        }

        // Handle pixel values for width
        if (type === 'width' && value.endsWith('px')) {
            const pixels = parseInt(value.replace('px', ''));
            const widthMap: { [key: number]: string } = {
                16: '4',
                20: '5',
                24: '6',
                32: '8',
                40: '10',
                48: '12',
                56: '14',
                64: '16',
                80: '20',
                96: '24',
                112: '28',
                128: '32',
                144: '36',
                160: '40',
                176: '44',
                192: '48',
                208: '52',
                224: '56',
                240: '60',
                256: '64',
                288: '72',
                320: '80',
                384: '96',
            };

            if (widthMap[pixels]) {
                return `${prefix}${widthMap[pixels]}`;
            }
        }

        // Fallback to arbitrary value
        return `${prefix}[${value}]`;
    };

    const generateCode = () => {
        const { skeletons } = state;

        // Group horizontal skeletons by rowId
        const horizontalSkeletons = skeletons.filter(s => s.orientation === 'horizontal');
        const horizontalRows = horizontalSkeletons.reduce((acc, skeleton) => {
            const rowId = skeleton.rowId || 'default';
            if (!acc[rowId]) acc[rowId] = [];
            acc[rowId].push(skeleton);
            return acc;
        }, {} as Record<string, typeof horizontalSkeletons>);

        const generateSkeletonElement = (skeleton: typeof skeletons[0], indent: string = '  ', isHorizontal = false) => {
            const widthClass = convertToTailwindClass(skeleton.width, 'width');
            const heightClass = convertToTailwindClass(skeleton.height, 'height');
            const rounded = skeleton.borderRadius === 'full' ? 'rounded-full' : skeleton.borderRadius === 'none' ? 'rounded-none' : `rounded-${skeleton.borderRadius}`;
            const bg = skeleton.color ? `bg-[${skeleton.color}]` : '';
            const flexClass = isHorizontal ? ' flex-1 min-w-0' : '';
            return `${indent}<Skeleton className="animate-pulse${flexClass} ${rounded} ${bg} ${widthClass} ${heightClass}" />`;
        };

        // Generate layout content in order, respecting rows
        let layoutElements = [];
        const processedHorizontalRows = new Set();

        for (let i = 0; i < skeletons.length; i++) {
            const skeleton = skeletons[i];
            
            if (skeleton.orientation === 'vertical') {
                layoutElements.push(generateSkeletonElement(skeleton, '          '));
            } else if (skeleton.orientation === 'horizontal') {
                const rowId = skeleton.rowId || `single-${skeleton.id}`;
                
                if (!processedHorizontalRows.has(rowId)) {
                    processedHorizontalRows.add(rowId);
                    const rowSkeletons = skeleton.rowId 
                        ? horizontalRows[skeleton.rowId] 
                        : [skeleton]; // Single horizontal skeleton without rowId
                        
                    const horizontalRow = `          <div className="flex items-start gap-4 w-full">
${rowSkeletons.map(s => generateSkeletonElement(s, '            ', true)).join('\n')}
          </div>`;
                    layoutElements.push(horizontalRow);
                }
            }
        }

        const layoutContent = `        <div className="space-y-4">
${layoutElements.join('\n')}
        </div>`;

        return `import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const SkeletonLoader = () => {
  return (
    <Card>
      <CardContent className="p-6">
${layoutContent}
      </CardContent>
    </Card>
  );
};`;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generateCode());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle className="text-lg">Export Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    readOnly
                    value={generateCode()}
                    className="h-80 text-xs font-mono resize-none"
                />
                <Button
                    onClick={copyToClipboard}
                    className="w-full"
                    variant={copied ? "default" : "outline"}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};