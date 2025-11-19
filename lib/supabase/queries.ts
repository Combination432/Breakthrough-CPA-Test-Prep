import { createClient } from './server'

export type QuestionType = 'MCQ' | 'TBS'

export interface MCQQuestion {
  id: string
  type: 'MCQ'
  stem: string
  options: { key: string; text: string }[]
  correct_answer: string
  explanation: string
  difficulty_level?: string
}

export interface TBSQuestion {
  id: string
  type: 'TBS'
  stem: string
  exhibits: any[]
  columns: any[]
  rows: any[]
  correctAnswers: Record<string, any>
  explanation: string
  difficulty_level?: string
}

export type Question = MCQQuestion | TBSQuestion

export interface Testlet {
  id: string
  testletNumber: number
  type: 'MCQ' | 'TBS'
  title: string
  instructions: string
  questions: Question[]
}

export interface Exam {
  id: string
  sectionCode: string
  sectionName: string
  timeLimit: number
  testlets: Testlet[]
}

export async function getExamWithQuestions(sectionCode: string): Promise<Exam | null> {
  const supabase = await createClient()

  // Get exam section
  const { data: section, error: sectionError } = await supabase
    .from('exam_sections')
    .select('*')
    .eq('code', sectionCode)
    .single()

  if (sectionError || !section) {
    console.error('Error fetching exam section:', sectionError)
    return null
  }

  // Get testlets for this section
  const { data: testlets, error: testletsError } = await supabase
    .from('testlets')
    .select('*')
    .eq('exam_section_id', section.id)
    .order('testlet_number')

  if (testletsError) {
    console.error('Error fetching testlets:', testletsError)
    return null
  }

  if (!testlets || testlets.length === 0) {
    console.error('No testlets found for section:', sectionCode)
    return null
  }

  // Get questions for each testlet
  const testletsWithQuestions: Testlet[] = []

  for (const testlet of testlets) {
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('testlet_id', testlet.id)
      .eq('is_active', true)
      .order('question_number')

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
      continue
    }

    if (!questions || questions.length === 0) {
      console.warn(`No questions found for testlet ${testlet.testlet_number}`)
      continue
    }

    // Transform questions to match the expected format
    const transformedQuestions: Question[] = questions.map((q) => {
      if (q.question_type === 'MCQ') {
        return {
          id: q.id,
          type: 'MCQ',
          stem: q.stem,
          options: q.options || [],
          correct_answer: q.correct_answer || '',
          explanation: q.explanation || '',
          difficulty_level: q.difficulty_level,
        } as MCQQuestion
      } else {
        return {
          id: q.id,
          type: 'TBS',
          stem: q.stem,
          exhibits: q.exhibits || [],
          columns: q.grid_config?.columns || [],
          rows: q.grid_config?.rows || [],
          correctAnswers: q.correct_answer_data || {},
          explanation: q.explanation || '',
          difficulty_level: q.difficulty_level,
        } as TBSQuestion
      }
    })

    testletsWithQuestions.push({
      id: testlet.id,
      testletNumber: testlet.testlet_number,
      type: testlet.testlet_type as 'MCQ' | 'TBS',
      title: testlet.title || `Testlet ${testlet.testlet_number}`,
      instructions: testlet.instructions || '',
      questions: transformedQuestions,
    })
  }

  return {
    id: section.id,
    sectionCode: section.code,
    sectionName: section.name,
    timeLimit: section.time_limit_minutes * 60, // Convert to seconds
    testlets: testletsWithQuestions,
  }
}

export async function getExamSections() {
  const supabase = await createClient()

  const { data: sections, error } = await supabase
    .from('exam_sections')
    .select('*')
    .order('code')

  if (error) {
    console.error('Error fetching exam sections:', error)
    return []
  }

  return sections || []
}

export async function getQuestionById(questionId: string) {
  const supabase = await createClient()

  const { data: question, error } = await supabase
    .from('questions')
    .select(
      `
      *,
      testlets (
        id,
        testlet_number,
        testlet_type,
        title,
        exam_sections (
          code,
          name
        )
      )
    `
    )
    .eq('id', questionId)
    .single()

  if (error) {
    console.error('Error fetching question:', error)
    return null
  }

  return question
}
