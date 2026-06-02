import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JourneyStepCard } from '../components/content/JourneyStepCard';
import { discipleshipSteps } from '../data/appContent';

export const JourneyScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[#3e4c31]">門徒之路</h1>
        <p className="font-medium text-[#c68a4c]">Discipleship Journey</p>
      </header>

      <div className="relative">
        <div className="absolute bottom-4 left-10 top-4 -z-10 w-0.5 bg-[#efe9dd]" />

        {discipleshipSteps.map((step) => (
          <JourneyStepCard
            key={step.id}
            step={step}
            onNavigate={(path) => navigate(path)}
          />
        ))}
      </div>
    </div>
  );
};

export default JourneyScreen;
