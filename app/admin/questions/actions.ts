'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteQuestion(questionId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('questions').delete().eq('id', questionId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/questions')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function createQuestion(data: {
  testlet_id: string
  question_type: 'MCQ' | 'TBS'
  question_number: number
  difficulty_level?: string
  stem: string
  options?: any
  correct_answer?: string
  exhibits?: any
  grid_config?: any
  correct_answer_data?: any
  explanation?: string
}) {
  try {
    const supabase = await createClient()

    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        ...data,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/questions')
    return { success: true, question }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
