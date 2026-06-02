import React from 'react';
import type { JourneyStep } from '../../types/content';

interface JourneyStepCardProps {
  step: JourneyStep;
  onNavigate: (path: string) => void;
}

export const JourneyStepCard: React.FC<JourneyStepCardProps> = ({
  step,
  onNavigate,
}) => {
  const isLocked = step.status === 'locked';
  const isActive = step.status === 'active';
  const canNavigate = !isLocked && Boolean(step.route);

  return (
    <button
      type="button"
      disabled={!canNavigate}
      onClick={() => {
        if (step.route) {
          onNavigate(step.route);
        }
      }}
      className={`relative mb-4 flex w-full items-center rounded-2xl border p-4 text-left transition-all ${
        isLocked
          ? 'cursor-not-allowed border-transparent bg-[#efe9dd]/40 opacity-60 grayscale'
          : isActive
            ? 'scale-[1.02] border-[#c68a4c] bg-white shadow-lg'
            : 'border-[#efe9dd] bg-white shadow-sm active:scale-95'
      }`}
    >
      <div
        className={`mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
          isActive ? 'bg-[#c68a4c] text-white' : 'bg-[#efe9dd] text-[#3e4c31]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">
          {isLocked ? 'lock' : step.icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c68a4c]">
            Step {step.order}
          </span>
          {step.status === 'complete' ? (
            <span className="material-symbols-outlined text-sm text-green-600">
              check_circle
            </span>
          ) : null}
        </div>
        <h3 className="font-serif text-lg leading-tight text-[#3e4c31]">
          {step.title}
        </h3>
        <p className="truncate text-xs text-[#3e4c31]/70">{step.subtitle}</p>
      </div>
    </button>
  );
};

export default JourneyStepCard;
