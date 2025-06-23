import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Palette, 
  Grid3X3, 
  Download,
  MousePointer,
  Lightbulb
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WelcomeWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const WelcomeWalkthrough: React.FC<WelcomeWalkthroughProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to PixelFrame! 🎨",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl">🎨</div>
          <p className="text-lg">
            Create amazing pixel art with our intuitive tools and features!
          </p>
          <p className="text-sm text-gray-600">
            This quick tour will show you everything you need to get started.
          </p>
        </div>
      )
    },
    {
      title: "Choose Your Canvas Size",
      icon: Grid3X3,
      content: (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {[8, 16, 32].map(size => (
                <div key={size} className="text-center">
                  <div 
                    className="w-12 h-12 border-2 border-gray-300 mx-auto mb-1"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: `${12/Math.min(size, 8)}px ${12/Math.min(size, 8)}px`
                    }}
                  />
                  <Badge variant="outline" className="text-xs">{size}×{size}</Badge>
                </div>
              ))}
            </div>
          </div>
          <p>
            Start with a smaller canvas (8×8 or 16×16) if you're new to pixel art. 
            You can always change the size later!
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Smaller grids are perfect for learning and creating cute icons!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Pick Your Colors",
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="grid grid-cols-6 gap-1">
              {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                '#FFA500', '#800080', '#FFC0CB', '#90EE90', '#87CEEB', '#DDA0DD'].map(color => (
                <div 
                  key={color}
                  className="w-6 h-6 rounded border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <p>
            Choose from over 40 organized colors, or use the custom color picker 
            to create your perfect palette.
          </p>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              🎨 <strong>Organized by theme:</strong> Basic, Pastels, Earth tones, and Neon colors!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Start Creating",
      icon: MousePointer,
      content: (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="grid grid-cols-4 gap-0 border-2 border-gray-400">
                {Array.from({ length: 16 }, (_, i) => (
                  <div 
                    key={i}
                    className="w-6 h-6 border border-gray-300"
                    style={{
                      backgroundColor: [2, 5, 6, 9, 10].includes(i) ? '#FF6B35' : '#FFFFFF'
                    }}
                  />
                ))}
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <MousePointer className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
          <p>
            Click or drag on the canvas to paint pixels. Use the zoom controls 
            for larger canvases, and hover for a magnified preview!
          </p>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800">
              ✨ <strong>Pro tip:</strong> Hold Ctrl and scroll to zoom, or Ctrl+click to pan around!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Generate Amazing Scenes",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            {['🏔️', '🌅', '🐱', '🏙️', '🌲'].map((emoji, i) => (
              <div key={i} className="text-2xl p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                {emoji}
              </div>
            ))}
          </div>
          <p>
            Use our Scene Generator to create beautiful pixel art instantly! 
            Generate mountains, sunsets, cats, cities, and nature scenes.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              🎲 <strong>One-click magic:</strong> Each scene is optimized for your canvas size!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Save & Share Your Art",
      icon: Download,
      content: (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
              <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">Export as PNG</p>
            </div>
          </div>
          <p>
            Export your creations as high-quality PNG files. Choose custom 
            resolutions, add grid lines, or change the background color.
          </p>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              💾 <strong>Auto-save:</strong> Your work is automatically saved as you create!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "You're Ready to Create! 🚀",
      icon: Lightbulb,
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl">🚀</div>
          <p className="text-lg font-medium">
            You're all set to start creating amazing pixel art!
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <strong>Beginner?</strong><br />
              Start with 16×16 canvas and basic colors
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <strong>Experienced?</strong><br />
              Try larger canvases and scene generation
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Remember: You can always access help tooltips by hovering over any tool!
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <IconComponent className="w-5 h-5 text-purple-600" />
              {currentStepData.title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Step {currentStep + 1} of {steps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {currentStepData.content}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip} className="text-gray-500">
              Skip Tour
            </Button>
            <Button 
              onClick={nextStep}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {currentStep === steps.length - 1 ? 'Start Creating!' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeWalkthrough;
