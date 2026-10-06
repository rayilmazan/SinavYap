// lib/types.ts

export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: number;
  learningOutcome: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: OptionKey;
  explanation: string;
}

export interface ExamData {
  examTitle: string;
  subject: string;
  totalQuestions: number;
  pointsPerQuestion: number;
  durationMinutes?: number;
  learningOutcomes: string[];
  questions: Question[];
  createdAt?: string;
}

export interface ExamResult {
  studentCode: string;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  percentage: number;
  answers: Record<number, OptionKey | null>;
  completedAt: string;
  timeSpentSeconds: number;
  outcomeStats: {
    outcome: string;
    total: number;
    correct: number;
    wrong: number;
    empty: number;
    successRate: number;
  }[];
}
