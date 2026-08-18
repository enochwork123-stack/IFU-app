import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JourneyStepCard } from '../components/content/JourneyStepCard';
import { useAppContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/Icon';
import { AnswerBackupModal } from '../components/AnswerBackupModal';

export const JourneyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { discipleshipSteps, customScreenTexts } = useAppContent();
  const { user } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setCompletedSteps([]);
      setLoading(false);
      return;
    }

    const fetchCompletedSteps = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_progress')
          .select('reference_id')
          .eq('user_id', user.id)
          .eq('type', 'discipleship_step');

        if (!error && data) {
          setCompletedSteps(data.map((row) => row.reference_id));
        }
      } catch (err) {
        console.error('Error fetching completed steps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedSteps();
  }, [user]);

  // Derive step statuses based on completedSteps array
  const dynamicSteps = [...discipleshipSteps]
    .sort((a, b) => a.order - b.order)
    .map((step, index, sortedSteps) => {
      if (!user) {
        return step;
      }

      const isCompleted = completedSteps.includes(step.id);
      if (isCompleted) {
        return { ...step, status: 'complete' as const };
      }

      // Check if this is the first uncompleted step in chronological order
      const firstUncompleted = sortedSteps.find(
        (s) => !completedSteps.includes(s.id)
      );
      const isActive = firstUncompleted && firstUncompleted.id === step.id;

      return {
        ...step,
        status: (isActive ? 'active' : 'available') as const,
      };
    });

  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#3e4c31]">{customScreenTexts['journey:title'] || '門徒之路'}</h1>
          <p className="font-medium text-[#c68a4c]">{customScreenTexts['journey:subtitle'] || 'Discipleship Journey'}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsBackupOpen(true)}
          className="inline-flex items-center self-start sm:self-auto gap-2 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-xs font-bold text-primary shadow-xs transition hover:border-secondary/50 hover:bg-surface-container active:scale-95 cursor-pointer"
        >
          <Icon name="save" className="text-[18px] text-secondary" />
          <span>作答備份與載入</span>
        </button>
      </header>

      <div className="relative">
        <div className="absolute bottom-4 left-10 top-4 -z-10 w-0.5 bg-[#efe9dd]" />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
          </div>
        ) : (
          dynamicSteps.map((step) => (
            <JourneyStepCard
              key={step.id}
              step={step}
              onNavigate={(path) => navigate(path)}
            />
          ))
        )}
      </div>

      <AnswerBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  );
};

export default JourneyScreen;

