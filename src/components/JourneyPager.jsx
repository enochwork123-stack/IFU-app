import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

/**
 * @param {object} props
 * @param {{to: string, label: string}} [props.previous]
 * @param {{to: string, label: string}} [props.next]
 */
export function JourneyPager({ previous, next }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Parse path segments to dynamically identify step/lesson type and reference ID
  const segments = location.pathname.split('/').filter(Boolean);
  const isJourneyRoute = segments[0] === 'journey';
  const type = isJourneyRoute 
    ? (segments.length === 3 ? 'bible_study' : (segments.length === 2 ? 'discipleship_step' : null))
    : null;
  const referenceId = type === 'bible_study' 
    ? segments[2] 
    : (type === 'discipleship_step' ? segments[1] : null);

  useEffect(() => {
    if (!user || !type || !referenceId) {
      setIsCompleted(false);
      return;
    }

    const checkProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('type', type)
          .eq('reference_id', referenceId)
          .maybeSingle();

        if (!error && data) {
          setIsCompleted(true);
        } else {
          setIsCompleted(false);
        }
      } catch (err) {
        console.error('Error checking progress:', err);
      }
    };

    checkProgress();
  }, [user, type, referenceId]);

  const handleComplete = async () => {
    if (!user) {
      alert('請先登入以保存您的學習進度！');
      navigate('/login');
      return;
    }

    if (!type || !referenceId) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from('user_progress').insert({
        user_id: user.id,
        type: type,
        reference_id: referenceId,
        completed_at: new Date().toISOString().split('T')[0],
      });

      if (error) {
        // Handle duplicate key error (23505) gracefully
        if (error.code === '23505') {
          setIsCompleted(true);
        } else {
          throw error;
        }
      } else {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error('Error logging progress:', err);
      alert('保存進度失敗，請重試！');
    } finally {
      setSubmitting(false);
    }
  };

  const hasCompletionButton = !!(type && referenceId);

  return (
    <div className="flex flex-col gap-4 pt-4 w-full items-center">
      {/* Complete Button - Centered above previous/next buttons */}
      {hasCompletionButton && (
        <div className="flex justify-center w-full">
          {isCompleted ? (
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-6 py-2.5 text-sm font-bold text-green-700 justify-center whitespace-nowrap"
            >
              <Icon name="check_circle" className="text-[18px]" />
              本課已完成 ✓
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary-fixed border border-primary/20 px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95 justify-center cursor-pointer shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              <Icon name={submitting ? "autorenew" : "done_all"} className={`text-[18px] ${submitting ? 'animate-spin' : ''}`} />
              {user ? '標記本課已完成' : '登入後可記錄進度'}
            </button>
          )}
        </div>
      )}

      {/* Navigation Row - Page Before and Next Page */}
      <div className="flex items-center justify-between gap-4 w-full">
        {previous ? (
          <Link
            to={previous.to}
            className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2.5 text-sm font-bold text-primary transition-all hover:bg-surface-container active:scale-95 whitespace-nowrap"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            {previous.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={next.to}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95 whitespace-nowrap"
          >
            {next.label}
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

