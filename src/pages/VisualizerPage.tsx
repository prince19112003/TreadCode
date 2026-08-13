import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { VisualizerWorkspace } from '../features/visualizer/VisualizerWorkspace';
import { getLessonAsync } from '../lessons/registry';
import { LessonProvider } from '../lessons/LessonContext';
import type { LessonProgram } from '../lessons/types';
import { Loader2 } from 'lucide-react';

export const VisualizerPage: React.FC = () => {
  const { languageId, topicId, programId } = useParams();
  const [lesson, setLesson] = useState<LessonProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!languageId || !topicId || !programId) return;

    setLoading(true);
    getLessonAsync(languageId, topicId, programId).then((loadedLesson) => {
      if (mounted) {
        setLesson(loadedLesson || null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [languageId, topicId, programId]);

  if (!languageId || !topicId || !programId) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#050510] text-slate-400 flex-col gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium tracking-wider uppercase">Loading Environment...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#050510] text-slate-400 flex-col gap-4">
        <div className="text-5xl">🚧</div>
        <p className="text-lg font-medium">Coming Soon!</p>
        <p className="text-sm text-slate-600">This lesson is being prepared.</p>
      </div>
    );
  }

  return (
    <LessonProvider lesson={lesson}>
      <VisualizerWorkspace />
    </LessonProvider>
  );
};
