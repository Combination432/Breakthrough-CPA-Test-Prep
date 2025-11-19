import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface QuizState {
  correctCount: number
  incorrectCount: number
  currentQuestionIndex: number
  answers: Record<number, {
    selectedAnswer: string
    isCorrect: boolean
    isSubmitted: boolean
  }>
  incrementCorrect: () => void
  incrementIncorrect: () => void
  nextQuestion: () => void
  submitAnswer: (questionIndex: number, selectedAnswer: string, isCorrect: boolean) => void
  resetQuiz: () => void
  getTotalAnswered: () => number
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      correctCount: 0,
      incorrectCount: 0,
      currentQuestionIndex: 0,
      answers: {},

      incrementCorrect: () => set((state) => ({
        correctCount: state.correctCount + 1
      })),

      incrementIncorrect: () => set((state) => ({
        incorrectCount: state.incorrectCount + 1
      })),

      nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1
      })),

      submitAnswer: (questionIndex, selectedAnswer, isCorrect) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionIndex]: {
              selectedAnswer,
              isCorrect,
              isSubmitted: true,
            },
          },
          correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
          incorrectCount: !isCorrect ? state.incorrectCount + 1 : state.incorrectCount,
        }))
      },

      resetQuiz: () => set({
        correctCount: 0,
        incorrectCount: 0,
        currentQuestionIndex: 0,
        answers: {},
      }),

      getTotalAnswered: () => {
        const state = get()
        return state.correctCount + state.incorrectCount
      },
    }),
    {
      name: 'quiz-storage',
    }
  )
)
