import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ExamStatus = 'active' | 'review' | 'completed'

export interface ExamAnswer {
  questionId: string
  answer: string | Record<string, any> // String for MCQ, object for TBS
  timeSpent: number
  timestamp: string
}

interface ExamState {
  // Exam identification
  examId: string | null
  examSectionCode: string | null

  // Navigation
  currentTestletIndex: number
  currentQuestionIndex: number

  // User responses
  answers: Record<string, ExamAnswer>
  flags: Set<string>

  // Timer (in seconds)
  timeLeft: number
  totalTime: number
  isTimerRunning: boolean

  // Status
  status: ExamStatus
  completedTestlets: number[]

  // Actions
  setExamId: (examId: string, sectionCode: string) => void
  startExam: (totalTimeSeconds: number) => void

  // Navigation actions
  nextQuestion: () => void
  previousQuestion: () => void
  goToQuestion: (testletIndex: number, questionIndex: number) => void
  nextTestlet: () => void

  // Answer actions
  submitAnswer: (questionId: string, answer: string | Record<string, any>, timeSpent: number) => void
  toggleFlag: (questionId: string) => void

  // Timer actions
  tick: () => void
  pauseTimer: () => void
  resumeTimer: () => void

  // Status actions
  setStatus: (status: ExamStatus) => void
  completeTestlet: (testletIndex: number) => void
  completeExam: () => void
  resetExam: () => void
}

const FOUR_HOURS = 4 * 60 * 60 // 14,400 seconds

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial state
      examId: null,
      examSectionCode: null,
      currentTestletIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      flags: new Set<string>(),
      timeLeft: FOUR_HOURS,
      totalTime: FOUR_HOURS,
      isTimerRunning: false,
      status: 'active',
      completedTestlets: [],

      // Set exam ID
      setExamId: (examId, sectionCode) => set({
        examId,
        examSectionCode: sectionCode,
      }),

      // Start exam
      startExam: (totalTimeSeconds = FOUR_HOURS) => set({
        totalTime: totalTimeSeconds,
        timeLeft: totalTimeSeconds,
        isTimerRunning: true,
        status: 'active',
      }),

      // Navigate to next question
      nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
      })),

      // Navigate to previous question
      previousQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      })),

      // Go to specific question
      goToQuestion: (testletIndex, questionIndex) => set({
        currentTestletIndex: testletIndex,
        currentQuestionIndex: questionIndex,
      }),

      // Move to next testlet
      nextTestlet: () => set((state) => ({
        currentTestletIndex: state.currentTestletIndex + 1,
        currentQuestionIndex: 0,
      })),

      // Submit an answer
      submitAnswer: (questionId, answer, timeSpent) => set((state) => ({
        answers: {
          ...state.answers,
          [questionId]: {
            questionId,
            answer,
            timeSpent,
            timestamp: new Date().toISOString(),
          },
        },
      })),

      // Toggle flag for review
      toggleFlag: (questionId) => set((state) => {
        const newFlags = new Set(state.flags)
        if (newFlags.has(questionId)) {
          newFlags.delete(questionId)
        } else {
          newFlags.add(questionId)
        }
        return { flags: newFlags }
      }),

      // Decrease time by 1 second
      tick: () => set((state) => {
        if (!state.isTimerRunning || state.timeLeft <= 0) {
          return state
        }

        const newTimeLeft = state.timeLeft - 1

        // Auto-submit when time expires
        if (newTimeLeft <= 0) {
          return {
            timeLeft: 0,
            isTimerRunning: false,
            status: 'completed',
          }
        }

        return { timeLeft: newTimeLeft }
      }),

      // Pause timer
      pauseTimer: () => set({ isTimerRunning: false }),

      // Resume timer
      resumeTimer: () => set({ isTimerRunning: true }),

      // Set exam status
      setStatus: (status) => set({ status }),

      // Mark testlet as completed
      completeTestlet: (testletIndex) => set((state) => ({
        completedTestlets: [...state.completedTestlets, testletIndex],
      })),

      // Complete the exam
      completeExam: () => set({
        status: 'completed',
        isTimerRunning: false,
      }),

      // Reset exam (for testing/retry)
      resetExam: () => set({
        currentTestletIndex: 0,
        currentQuestionIndex: 0,
        answers: {},
        flags: new Set<string>(),
        timeLeft: FOUR_HOURS,
        isTimerRunning: false,
        status: 'active',
        completedTestlets: [],
      }),
    }),
    {
      name: 'exam-storage',
      // Custom serialization for Set
      partialize: (state) => ({
        ...state,
        flags: Array.from(state.flags),
      }),
      // Custom deserialization for Set
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.flags)) {
          state.flags = new Set(state.flags as string[])
        }
      },
    }
  )
)
