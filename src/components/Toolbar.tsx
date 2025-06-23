import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  Palette,
  Grid3X3,
  Volume2,
  Settings,
  Save,
  Undo,
  Redo,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ToolbarProps {
  onClear: () => void;
  onExport: () => void;
  onRandomGenerate: () => void;
  onShowGridSettings: () => void;
  onShowColorPicker: () => void;
  onShowSoundSettings: () => void;
  onShowExportSettings: () => void;
  onShowImageUpload: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onClear,
  onExport,
  onRandomGenerate,
  onShowGridSettings,
  onShowColorPicker,
  onShowSoundSettings,
  onShowExportSettings,
  onShowImageUpload,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Essential tools shown by default
  const essentialTools = [
    {
      icon: Sparkles,
      label: 'Generate Scene',
      description: 'Create random pixel art scenes',
      onClick: onRandomGenerate,
      variant: 'default' as const,
      className: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
    },
    {
      icon: Palette,
      label: 'Colors',
      description: 'Choose colors and palette',
      onClick: onShowColorPicker,
      variant: 'outline' as const
    },
    {
      icon: Grid3X3,
      label: 'Canvas Size',
      description: 'Change canvas resolution',
      onClick: onShowGridSettings,
      variant: 'outline' as const
    },
    {
      icon: Save,
      label: 'Export',
      description: 'Save your pixel art as PNG',
      onClick: onExport,
      variant: 'default' as const,
      className: 'bg-green-600 hover:bg-green-700 text-white'
    },
    {
      icon: RotateCcw,
      label: 'Clear',
      description: 'Clear all pixels and start over',
      onClick: onClear,
      variant: 'destructive' as const
    }
  ];

  // Advanced tools hidden by default
  const advancedTools = [
    {
      icon: Settings,
      label: 'Export Options',
      description: 'Advanced export settings',
      onClick: onShowExportSettings,
      variant: 'outline' as const
    },
    {
      icon: Upload,
      label: 'Upload Image',
      description: 'Convert image to pixel art',
      onClick: onShowImageUpload,
      variant: 'outline' as const
    },
    {
      icon: Volume2,
      label: 'Sound',
      description: 'Audio settings and volume',
      onClick: onShowSoundSettings,
      variant: 'outline' as const
    }
  ];

  const renderToolButton = (tool: any) => {
    const IconComponent = tool.icon;
    return (
      <Tooltip key={tool.label}>
        <TooltipTrigger asChild>
          <Button
            variant={tool.variant}
            size="sm"
            onClick={tool.onClick}
            disabled={tool.disabled}
            className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] ${tool.className || ''}`}
            aria-label={tool.description}
          >
            <IconComponent className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
              {tool.label}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="text-center">
            <div className="font-medium">{tool.label}</div>
            <div className="text-xs text-gray-600 mt-1">
              {tool.description}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 mb-4">
        {/* Essential Tools - Always Visible */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {essentialTools.map(renderToolButton)}
        </div>

        {/* Advanced Tools - Collapsible */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <div className="flex items-center justify-center">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 min-h-[44px]"
                aria-label={showAdvanced ? "Hide advanced tools" : "Show advanced tools"}
              >
                <span className="text-xs font-medium mr-2">
                  {showAdvanced ? 'Less Tools' : 'More Tools'}
                </span>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-3">
            <Separator className="mb-3" />
            <div className="flex flex-wrap items-center justify-center gap-2">
              {advancedTools.map(renderToolButton)}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Mobile-friendly hint */}
        <div className="md:hidden text-xs text-gray-500 text-center mt-3 px-2">
          💡 Tap and hold any tool for help, or tap the ? button for a full tutorial
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
