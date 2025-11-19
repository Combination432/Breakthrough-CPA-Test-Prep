-- =====================================================
-- CPA TEST PREP PLATFORM - DATABASE SCHEMA V1
-- =====================================================
-- This schema supports a complete CPA exam simulation with:
-- - 4 Exam Sections (AUD, FAR, REG, BEC)
-- - 5 Testlets per exam (2 MCQ, 3 TBS)
-- - Complex Task-Based Simulations (TBS) with exhibits and grids
-- - Comprehensive user progress tracking with timing and flags
-- =====================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- The 4 sections of the CPA exam
CREATE TYPE exam_section_code AS ENUM ('AUD', 'FAR', 'REG', 'BEC');

-- Question types: Multiple Choice or Task-Based Simulation
CREATE TYPE question_type AS ENUM ('MCQ', 'TBS');

-- Testlet types: MCQ (testlets 1-2) or TBS (testlets 3-5)
CREATE TYPE testlet_type AS ENUM ('MCQ', 'TBS');

-- User's exam attempt status
CREATE TYPE exam_status AS ENUM ('not_started', 'in_progress', 'completed', 'abandoned');

-- Question difficulty for adaptive testing
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- =====================================================
-- EXAM SECTIONS (Reference Data)
-- =====================================================
-- Represents the 4 sections of the CPA exam
-- Each section has its own time limit and structure

CREATE TABLE exam_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code exam_section_code UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Exam structure
  total_testlets INTEGER DEFAULT 5,
  mcq_testlets INTEGER DEFAULT 2,
  tbs_testlets INTEGER DEFAULT 3,

  -- Exam parameters
  time_limit_minutes INTEGER NOT NULL,
  passing_score INTEGER DEFAULT 75,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE exam_sections IS 'The 4 CPA exam sections (AUD, FAR, REG, BEC). This is reference data that defines exam structure and rules.';

-- =====================================================
-- TESTLETS (Groups of Questions)
-- =====================================================
-- Each exam has 5 testlets:
-- - Testlets 1-2: Multiple Choice Questions (MCQ)
-- - Testlets 3-5: Task-Based Simulations (TBS)

CREATE TABLE testlets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_section_id UUID REFERENCES exam_sections(id) ON DELETE CASCADE,

  -- Testlet position and type
  testlet_number INTEGER NOT NULL CHECK (testlet_number BETWEEN 1 AND 5),
  testlet_type testlet_type NOT NULL,
  difficulty_level difficulty_level,

  -- Content
  title VARCHAR(255),
  instructions TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(exam_section_id, testlet_number)
);

COMMENT ON TABLE testlets IS 'Groups of questions within an exam section. Testlets 1-2 are MCQ, testlets 3-5 are TBS.';

-- =====================================================
-- QUESTIONS (Polymorphic: MCQ and TBS)
-- =====================================================
-- This table stores both simple MCQ questions and complex TBS questions
-- TBS questions use JSONB columns for flexible structure

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  testlet_id UUID REFERENCES testlets(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_type question_type NOT NULL,
  difficulty_level difficulty_level,

  -- ===== COMMON FIELDS (Both MCQ and TBS) =====
  stem TEXT NOT NULL, -- The main question text/prompt
  points INTEGER DEFAULT 1,
  time_estimate_seconds INTEGER,

  -- ===== MCQ-SPECIFIC FIELDS =====
  -- For multiple choice questions
  options JSONB,
  -- Example: [
  --   {"key": "A", "text": "Revenue is recognized when earned"},
  --   {"key": "B", "text": "Revenue is recognized when cash is received"},
  --   {"key": "C", "text": "Revenue is recognized at end of period"},
  --   {"key": "D", "text": "Revenue is never recognized"}
  -- ]

  correct_answer VARCHAR(10), -- For MCQ: "A", "B", "C", "D", etc.

  -- ===== TBS-SPECIFIC FIELDS =====
  -- For Task-Based Simulations

  -- LEFT PANEL: Exhibits (documents, memos, financial statements)
  exhibits JSONB,
  -- Example TBS exhibits structure:
  -- [
  --   {
  --     "id": "exhibit-1",
  --     "title": "Email from CFO",
  --     "type": "text",
  --     "content": "Dear Auditor,\n\nWe have identified the following issues...",
  --     "order": 1
  --   },
  --   {
  --     "id": "exhibit-2",
  --     "title": "Balance Sheet - Dec 31, 2023",
  --     "type": "table",
  --     "content": {
  --       "headers": ["Account", "2023", "2022"],
  --       "rows": [
  --         ["Cash", "100,000", "95,000"],
  --         ["Accounts Receivable", "250,000", "230,000"],
  --         ["Inventory", "180,000", "165,000"]
  --       ]
  --     },
  --     "order": 2
  --   },
  --   {
  --     "id": "exhibit-3",
  --     "title": "Audit Memo",
  --     "type": "pdf_url",
  --     "content": "/uploads/audit-memo-2023.pdf",
  --     "order": 3
  --   }
  -- ]

  -- RIGHT PANEL: Answer Workspace (spreadsheet or form)
  grid_config JSONB,
  -- Example TBS grid_config for SPREADSHEET-STYLE workspace:
  -- {
  --   "type": "spreadsheet",
  --   "title": "Prepare Journal Entry",
  --   "columns": [
  --     {"id": "col-1", "header": "Account", "type": "text", "width": 200, "editable": false},
  --     {"id": "col-2", "header": "Debit", "type": "number", "width": 150, "editable": true},
  --     {"id": "col-3", "header": "Credit", "type": "number", "width": 150, "editable": true}
  --   ],
  --   "rows": [
  --     {"id": "row-1", "label": "Cash"},
  --     {"id": "row-2", "label": "Accounts Receivable"},
  --     {"id": "row-3", "label": "Revenue"},
  --     {"id": "row-4", "label": "Unearned Revenue"}
  --   ],
  --   "validation": {
  --     "required_cells": ["row-1:col-2", "row-2:col-3"],
  --     "sum_rules": [
  --       {
  --         "description": "Debits must equal credits",
  --         "debit_cells": ["row-1:col-2", "row-2:col-2"],
  --         "credit_cells": ["row-1:col-3", "row-2:col-3"],
  --         "must_balance": true
  --       }
  --     ],
  --     "range_rules": [
  --       {"cell": "row-1:col-2", "min": 0, "max": 999999}
  --     ]
  --   }
  -- }
  --
  -- Example TBS grid_config for FORM-STYLE workspace:
  -- {
  --   "type": "form",
  --   "title": "Determine Audit Opinion",
  --   "sections": [
  --     {
  --       "id": "section-1",
  --       "title": "Opinion Selection",
  --       "fields": [
  --         {
  --           "id": "field-1",
  --           "label": "Based on the exhibits, what audit opinion should be issued?",
  --           "type": "dropdown",
  --           "options": [
  --             "Unqualified Opinion",
  --             "Qualified Opinion",
  --             "Adverse Opinion",
  --             "Disclaimer of Opinion"
  --           ],
  --           "required": true
  --         }
  --       ]
  --     },
  --     {
  --       "id": "section-2",
  --       "title": "Justification",
  --       "fields": [
  --         {
  --           "id": "field-2",
  --           "label": "Provide justification for your opinion",
  --           "type": "textarea",
  --           "required": true,
  --           "max_length": 500,
  --           "rows": 5
  --         }
  --       ]
  --     }
  --   ]
  -- }

  -- ANSWER KEY: Correct answer structure for TBS
  correct_answer_data JSONB,
  -- Example correct_answer_data for SPREADSHEET-STYLE:
  -- {
  --   "cells": {
  --     "row-1:col-2": "50000",
  --     "row-2:col-3": "25000",
  --     "row-3:col-3": "75000"
  --   },
  --   "partial_credit": {
  --     "row-1:col-2": 0.33,
  --     "row-2:col-3": 0.33,
  --     "row-3:col-3": 0.34
  --   },
  --   "explanation_by_cell": {
  --     "row-1:col-2": "Cash debit of $50,000 represents the payment received",
  --     "row-2:col-3": "Accounts Receivable credit reduces the asset",
  --     "row-3:col-3": "Revenue credit recognizes earned income"
  --   }
  -- }
  --
  -- Example correct_answer_data for FORM-STYLE:
  -- {
  --   "fields": {
  --     "field-1": "Qualified Opinion",
  --     "field-2": {
  --       "type": "keyword_matching",
  --       "required_keywords": ["material misstatement", "scope limitation", "GAAP"],
  --       "scoring": "partial"
  --     }
  --   },
  --   "scoring": {
  --     "field-1": 0.6,
  --     "field-2": 0.4
  --   }
  -- }

  -- ===== COMMON FIELDS (Explanations) =====
  explanation TEXT, -- Detailed explanation shown after answering
  reference_materials TEXT, -- Citations to AICPA standards, FASB, etc.

  -- ===== METADATA =====
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(testlet_id, question_number)
);

COMMENT ON TABLE questions IS 'Polymorphic table storing both MCQ and TBS questions. TBS questions use JSONB columns (exhibits, grid_config, correct_answer_data) for flexible structure.';
COMMENT ON COLUMN questions.exhibits IS 'LEFT PANEL: Array of exhibit objects for TBS. Each exhibit has id, title, type (text/table/pdf_url), content, and order. Users read these documents to solve the simulation.';
COMMENT ON COLUMN questions.grid_config IS 'RIGHT PANEL: Configuration for TBS answer workspace. Can be spreadsheet-style (columns/rows for Excel-like grids) or form-style (fields for dropdown/text inputs). Includes validation rules.';
COMMENT ON COLUMN questions.correct_answer_data IS 'ANSWER KEY: Correct answer structure for TBS, matching grid_config format. Includes partial credit weighting and cell-by-cell explanations.';

-- =====================================================
-- EXAMS (User Exam Attempts)
-- =====================================================
-- Represents a user's attempt at a specific exam section

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_section_id UUID REFERENCES exam_sections(id) ON DELETE CASCADE,

  status exam_status DEFAULT 'not_started',

  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  time_limit_minutes INTEGER NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  time_remaining_seconds INTEGER,

  -- Scoring
  total_questions INTEGER,
  questions_answered INTEGER DEFAULT 0,
  questions_flagged INTEGER DEFAULT 0,
  score NUMERIC(5,2), -- Final score (0-100)
  passed BOOLEAN,

  -- Settings
  is_practice_mode BOOLEAN DEFAULT false,
  show_answers_immediately BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE exams IS 'User exam attempts. Tracks timing, scoring, and settings for each attempt at an exam section.';

-- =====================================================
-- USER RESPONSES (Answers to Questions)
-- =====================================================
-- Stores user answers with timing data and flagged status

CREATE TABLE user_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ===== RESPONSE DATA =====
  -- Format varies by question type
  response_data JSONB,
  -- Example for MCQ:
  -- {"selected": "B"}
  --
  -- Example for TBS spreadsheet:
  -- {
  --   "cells": {
  --     "row-1:col-2": "50000",
  --     "row-2:col-3": "25000",
  --     "row-3:col-3": "75000"
  --   }
  -- }
  --
  -- Example for TBS form:
  -- {
  --   "fields": {
  --     "field-1": "Qualified Opinion",
  --     "field-2": "The company has a material misstatement in their revenue recognition policy that violates GAAP..."
  --   }
  -- }

  -- ===== SCORING =====
  is_correct BOOLEAN,
  points_earned NUMERIC(5,2),
  points_possible NUMERIC(5,2),

  -- ===== STATUS FLAGS =====
  is_flagged BOOLEAN DEFAULT false, -- User flagged for review
  is_answered BOOLEAN DEFAULT false, -- Has user entered any answer

  -- ===== TIMING =====
  time_spent_seconds INTEGER DEFAULT 0,
  first_viewed_at TIMESTAMPTZ,
  last_modified_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,

  -- ===== METADATA =====
  attempt_number INTEGER DEFAULT 1, -- For practice mode with retries
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(exam_id, question_id, attempt_number)
);

COMMENT ON TABLE user_responses IS 'Stores user answers with timing data and flagged status. Response format matches question type (MCQ vs TBS).';
COMMENT ON COLUMN user_responses.response_data IS 'User answer in JSONB format. For MCQ: selected option. For TBS: cells object (spreadsheet) or fields object (form).';
COMMENT ON COLUMN user_responses.is_flagged IS 'User flagged this question for review. Important for exam navigation.';
COMMENT ON COLUMN user_responses.time_spent_seconds IS 'Cumulative time spent on this question. Critical for analytics and exam simulation.';

-- =====================================================
-- USER PROGRESS (Current State in Exam)
-- =====================================================
-- Tracks where the user is in their exam for resumption and navigation

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,

  -- Current position
  current_testlet_id UUID REFERENCES testlets(id) ON DELETE SET NULL,
  current_question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  current_testlet_number INTEGER,
  current_question_number INTEGER,

  -- Navigation rules
  can_navigate_back BOOLEAN DEFAULT true, -- Some exam modes lock previous testlets
  completed_testlets INTEGER[] DEFAULT ARRAY[]::INTEGER[],

  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, exam_id)
);

COMMENT ON TABLE user_progress IS 'Tracks current position in exam for resumption and navigation. Essential for maintaining exam state across sessions.';
COMMENT ON COLUMN user_progress.can_navigate_back IS 'Controls navigation rules. In strict exam mode, users cannot return to previous testlets once submitted.';
COMMENT ON COLUMN user_progress.completed_testlets IS 'Array of completed testlet numbers. Used to enforce progression and navigation rules.';

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Testlets
CREATE INDEX idx_testlets_section ON testlets(exam_section_id);
CREATE INDEX idx_testlets_number ON testlets(testlet_number);

-- Questions
CREATE INDEX idx_questions_testlet ON questions(testlet_id);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_active ON questions(is_active);

-- Exams
CREATE INDEX idx_exams_user ON exams(user_id);
CREATE INDEX idx_exams_section ON exams(exam_section_id);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_created ON exams(created_at DESC);

-- User Responses
CREATE INDEX idx_responses_exam ON user_responses(exam_id);
CREATE INDEX idx_responses_user ON user_responses(user_id);
CREATE INDEX idx_responses_question ON user_responses(question_id);
CREATE INDEX idx_responses_flagged ON user_responses(is_flagged) WHERE is_flagged = true;

-- User Progress
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_exam ON user_progress(exam_id);

-- GIN indexes for JSONB columns (enables efficient querying of TBS data)
CREATE INDEX idx_questions_exhibits ON questions USING GIN (exhibits) WHERE question_type = 'TBS';
CREATE INDEX idx_questions_grid_config ON questions USING GIN (grid_config) WHERE question_type = 'TBS';
CREATE INDEX idx_responses_data ON user_responses USING GIN (response_data);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_exam_sections_updated_at BEFORE UPDATE ON exam_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testlets_updated_at BEFORE UPDATE ON testlets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_responses_updated_at BEFORE UPDATE ON user_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on user-specific tables
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- EXAMS: Users can only access their own exam attempts
CREATE POLICY "Users can view their own exams"
  ON exams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exams"
  ON exams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exams"
  ON exams FOR UPDATE
  USING (auth.uid() = user_id);

-- USER RESPONSES: Users can only access their own responses
CREATE POLICY "Users can view their own responses"
  ON user_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON user_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses"
  ON user_responses FOR UPDATE
  USING (auth.uid() = user_id);

-- USER PROGRESS: Users can only access their own progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable RLS on exam content tables (public read access)
ALTER TABLE exam_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE testlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- EXAM CONTENT: Anyone authenticated can view exam sections
CREATE POLICY "Anyone can view exam sections"
  ON exam_sections FOR SELECT
  USING (true);

-- TESTLETS: Anyone authenticated can view testlets
CREATE POLICY "Anyone can view testlets"
  ON testlets FOR SELECT
  USING (true);

-- QUESTIONS: Anyone authenticated can view active questions
CREATE POLICY "Anyone can view active questions"
  ON questions FOR SELECT
  USING (is_active = true);
