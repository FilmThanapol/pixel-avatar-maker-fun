import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { soundEffects } from '../utils/soundEffects';

const SoundControls: React.FC = () => {
  const [volume, setVolume] = useState([soundEffects.getVolume() * 100]);
  const [isMuted, setIsMuted] = useState(soundEffects.isSoundMuted());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    soundEffects.setVolume(volume[0] / 100);
  }, [volume]);

  const toggleMute = () => {
    const newMutedState = soundEffects.toggleMute();
    setIsMuted(newMutedState);
  };

  const testSound = () => {
    soundEffects.playClick();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
      <div className="space-y-3">
        {/* Quick Mute Toggle */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            Sound
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleMute}
            className={isMuted ? 'text-red-600' : 'text-green-600'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Volume Control */}
        {!isMuted && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Volume: {volume[0]}%
            </label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Advanced Controls */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Sound Options
            </span>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-3 space-y-3">
            {/* Test Sound */}
            <Button
              size="sm"
              variant="outline"
              onClick={testSound}
              className="w-full"
              disabled={isMuted}
            >
              Test Sound
            </Button>

            {/* Sound Info */}
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Pixel painting: Click sounds</p>
              <p>• Color selection: Tone sounds</p>
              <p>• Actions: Unique audio feedback</p>
              <p>• Export: Success melody</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SoundControls;
