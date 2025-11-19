# CPA Test Prep Platform - Database Schema Documentation

## Overview

This database schema supports a high-fidelity CPA exam simulation platform with complex Task-Based Simulations (TBS) and comprehensive progress tracking.

## Core Architecture Decisions

### 1. Polymorphic Questions Table

**Decision**: Use a single `questions` table for both MCQ and TBS questions, with a `question_type` enum discriminator.

**Rationale**:
- Maintains question order within testlets (critical for exam flow)
- Simplifies querying and pagination
- JSONB columns provide flexibility for TBS complexity without schema rigidity
- PostgreSQL's GIN indexes enable efficient querying of JSONB fields

**Alternative Considered**: Separate `mcq_questions` and `tbs_questions` tables
- **Rejected**: Would require complex UNION queries for testlet rendering and complicate question sequencing

### 2. JSONB for TBS Configuration

**Decision**: Use JSONB columns (`exhibits`, `grid_config`, `correct_answer_data`) for TBS questions.

**Rationale**:
- TBS simulations are highly variable (spreadsheets, forms, drag-drop, etc.)
- Rigid schema would require constant migrations for new simulation types
- JSONB allows validation at application layer while keeping database flexible
- PostgreSQL JSONB has excellent performance and querying capabilities

### 3. Separate User Responses and Progress Tables

**Decision**: Split `user_responses` (historical answers) from `user_progress` (current state).

**Rationale**:
- `user_responses`: Immutable audit trail of all answers (supports retries, analytics)
- `user_progress`: Mutable state for exam navigation and resumption
- Clean separation of concerns: analytics vs. session management

## Task-Based Simulation (TBS) Structure

### TBS Component Architecture

Every TBS question has **three JSONB columns**:

1. **`exhibits`** (Left Panel): Documents the user must read
2. **`grid_config`** (Right Panel): The answer workspace configuration
3. **`correct_answer_data`**: The answer key and scoring rules

### Example 1: Spreadsheet-Style TBS (Journal Entry)

#### Question Stem
```
Based on the exhibits, prepare the journal entry to record the transaction.
```

#### Exhibits (Left Panel)
```json
[
  {
    "id": "exhibit-1",
    "title": "Transaction Details",
    "type": "text",
    "content": "On December 15, 2023, ABC Corp received $50,000 cash from a customer as payment for services that will be performed in January 2024.",
    "order": 1
  },
  {
    "id": "exhibit-2",
    "title": "Chart of Accounts",
    "type": "table",
    "content": {
      "headers": ["Account Number", "Account Name", "Type"],
      "rows": [
        ["1010", "Cash", "Asset"],
        ["1020", "Accounts Receivable", "Asset"],
        ["2010", "Unearned Revenue", "Liability"],
        ["4010", "Service Revenue", "Revenue"]
      ]
    },
    "order": 2
  }
]
```

#### Grid Config (Right Panel - Spreadsheet)
```json
{
  "type": "spreadsheet",
  "title": "Journal Entry Worksheet",
  "instructions": "Enter the appropriate accounts and amounts. Debits must equal credits.",
  "columns": [
    {
      "id": "col-1",
      "header": "Account",
      "type": "dropdown",
      "width": 250,
      "editable": true,
      "options": ["Cash", "Accounts Receivable", "Unearned Revenue", "Service Revenue"]
    },
    {
      "id": "col-2",
      "header": "Debit",
      "type": "number",
      "width": 150,
      "editable": true,
      "format": "currency"
    },
    {
      "id": "col-3",
      "header": "Credit",
      "type": "number",
      "width": 150,
      "editable": true,
      "format": "currency"
    }
  ],
  "rows": [
    {"id": "row-1", "label": "1"},
    {"id": "row-2", "label": "2"},
    {"id": "row-3", "label": "3"},
    {"id": "row-4", "label": "4"}
  ],
  "validation": {
    "required_cells": ["row-1:col-1", "row-2:col-1"],
    "sum_rules": [
      {
        "description": "Debits must equal credits",
        "debit_cells": ["row-1:col-2", "row-2:col-2", "row-3:col-2", "row-4:col-2"],
        "credit_cells": ["row-1:col-3", "row-2:col-3", "row-3:col-3", "row-4:col-3"],
        "must_balance": true,
        "error_message": "Total debits must equal total credits"
      }
    ]
  }
}
```

#### Correct Answer Data
```json
{
  "cells": {
    "row-1:col-1": "Cash",
    "row-1:col-2": "50000",
    "row-2:col-1": "Unearned Revenue",
    "row-2:col-3": "50000"
  },
  "partial_credit": {
    "row-1:col-1": 0.25,
    "row-1:col-2": 0.25,
    "row-2:col-1": 0.25,
    "row-2:col-3": 0.25
  },
  "explanation_by_cell": {
    "row-1:col-1": "Cash is debited as the company received money",
    "row-1:col-2": "The amount received is $50,000",
    "row-2:col-1": "Unearned Revenue is credited because the service has not yet been performed",
    "row-2:col-3": "The liability is $50,000"
  },
  "common_mistakes": [
    {
      "mistake": {"row-1:col-1": "Accounts Receivable"},
      "feedback": "Incorrect. The company received cash, not a promise to pay."
    },
    {
      "mistake": {"row-2:col-1": "Service Revenue"},
      "feedback": "Incorrect. Revenue should not be recognized until the service is performed (January 2024)."
    }
  ]
}
```

#### User Response (How it's stored)
```json
{
  "cells": {
    "row-1:col-1": "Cash",
    "row-1:col-2": "50000",
    "row-2:col-1": "Unearned Revenue",
    "row-2:col-3": "50000"
  },
  "timestamp": "2024-01-15T14:23:45Z"
}
```

### Example 2: Form-Style TBS (Audit Opinion)

#### Exhibits (Left Panel)
```json
[
  {
    "id": "exhibit-1",
    "title": "Auditor's Findings",
    "type": "text",
    "content": "During the audit of XYZ Corporation, we identified that management has refused to provide access to the company's legal correspondence regarding pending litigation. This represents a significant scope limitation.",
    "order": 1
  },
  {
    "id": "exhibit-2",
    "title": "Financial Statement Impact",
    "type": "text",
    "content": "The potential impact of the litigation is estimated to be material to the financial statements, representing approximately 15% of total assets.",
    "order": 2
  }
]
```

#### Grid Config (Right Panel - Form)
```json
{
  "type": "form",
  "title": "Audit Opinion Determination",
  "sections": [
    {
      "id": "section-1",
      "title": "Opinion Type",
      "fields": [
        {
          "id": "opinion-type",
          "label": "Based on the exhibits, what type of audit opinion should be issued?",
          "type": "dropdown",
          "options": [
            "Unqualified Opinion",
            "Qualified Opinion",
            "Adverse Opinion",
            "Disclaimer of Opinion"
          ],
          "required": true
        }
      ]
    },
    {
      "id": "section-2",
      "title": "Justification",
      "fields": [
        {
          "id": "justification",
          "label": "Provide a brief justification for your opinion (2-3 sentences)",
          "type": "textarea",
          "required": true,
          "min_length": 50,
          "max_length": 500,
          "rows": 4,
          "placeholder": "Explain the reason for your opinion based on the auditor's findings..."
        }
      ]
    },
    {
      "id": "section-3",
      "title": "Audit Report Impact",
      "fields": [
        {
          "id": "report-paragraph",
          "label": "Which paragraph of the audit report would be modified?",
          "type": "checkbox_group",
          "options": [
            "Introductory Paragraph",
            "Scope Paragraph",
            "Opinion Paragraph",
            "Emphasis of Matter Paragraph"
          ],
          "min_selections": 1,
          "max_selections": 4
        }
      ]
    }
  ]
}
```

#### Correct Answer Data
```json
{
  "fields": {
    "opinion-type": {
      "correct_value": "Disclaimer of Opinion",
      "points": 0.5
    },
    "justification": {
      "type": "keyword_scoring",
      "required_keywords": [
        {"keyword": "scope limitation", "points": 0.1},
        {"keyword": "insufficient evidence", "points": 0.1},
        {"keyword": "material", "points": 0.1}
      ],
      "max_points": 0.3
    },
    "report-paragraph": {
      "correct_values": ["Scope Paragraph", "Opinion Paragraph"],
      "points": 0.2,
      "scoring": "all_or_nothing"
    }
  },
  "total_points": 1.0,
  "passing_threshold": 0.7,
  "explanation": "A disclaimer of opinion is appropriate when there is a significant scope limitation that prevents the auditor from obtaining sufficient appropriate evidence. The refusal to provide legal correspondence is a scope limitation that affects material accounts. Both the scope and opinion paragraphs must be modified to reflect the disclaimer."
}
```

## Database Querying Examples

### Get All Questions for a Testlet (with TBS data)
```sql
SELECT
  q.id,
  q.question_number,
  q.question_type,
  q.stem,
  -- MCQ fields
  q.options,
  q.correct_answer,
  -- TBS fields
  q.exhibits,
  q.grid_config,
  -- Don't send correct answer to client!
  -- q.correct_answer_data
FROM questions q
WHERE q.testlet_id = 'uuid-here'
  AND q.is_active = true
ORDER BY q.question_number;
```

### Get User's Exam Progress
```sql
SELECT
  e.id,
  e.status,
  e.time_remaining_seconds,
  e.questions_answered,
  e.questions_flagged,
  up.current_testlet_number,
  up.current_question_number,
  up.completed_testlets
FROM exams e
JOIN user_progress up ON up.exam_id = e.id
WHERE e.user_id = auth.uid()
  AND e.status = 'in_progress';
```

### Get Flagged Questions for Review
```sql
SELECT
  ur.question_id,
  q.question_number,
  q.question_type,
  q.stem,
  ur.response_data,
  ur.is_answered
FROM user_responses ur
JOIN questions q ON q.id = ur.question_id
WHERE ur.exam_id = 'uuid-here'
  AND ur.is_flagged = true
ORDER BY q.question_number;
```

### Check TBS Answer (Spreadsheet)
```sql
-- Example function to grade a TBS spreadsheet response
CREATE OR REPLACE FUNCTION grade_tbs_spreadsheet(
  p_question_id UUID,
  p_response_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_correct_answer JSONB;
  v_partial_credit JSONB;
  v_points_earned NUMERIC := 0;
  v_total_points NUMERIC := 1;
  v_cell_key TEXT;
  v_user_value TEXT;
  v_correct_value TEXT;
BEGIN
  -- Get correct answer from question
  SELECT
    correct_answer_data->'cells',
    correct_answer_data->'partial_credit'
  INTO v_correct_answer, v_partial_credit
  FROM questions
  WHERE id = p_question_id;

  -- Iterate through each cell in correct answer
  FOR v_cell_key IN SELECT jsonb_object_keys(v_correct_answer)
  LOOP
    v_correct_value := v_correct_answer->>v_cell_key;
    v_user_value := p_response_data->'cells'->>v_cell_key;

    -- Award points for correct cells
    IF v_user_value = v_correct_value THEN
      v_points_earned := v_points_earned + (v_partial_credit->>v_cell_key)::NUMERIC;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'points_earned', v_points_earned,
    'points_possible', v_total_points,
    'percentage', (v_points_earned / v_total_points) * 100,
    'is_correct', v_points_earned = v_total_points
  );
END;
$$ LANGUAGE plpgsql;
```

## Sample Seed Data

### Exam Sections
```sql
INSERT INTO exam_sections (code, name, description, time_limit_minutes, passing_score)
VALUES
  ('AUD', 'Auditing and Attestation', 'Tests knowledge of audit procedures, professional standards, and ethics', 240, 75),
  ('FAR', 'Financial Accounting and Reporting', 'Tests knowledge of GAAP, financial statements, and accounting standards', 240, 75),
  ('REG', 'Regulation', 'Tests knowledge of tax law, business law, and ethics', 240, 75),
  ('BEC', 'Business Environment and Concepts', 'Tests knowledge of corporate governance, economics, and IT', 240, 75);
```

### Create Testlets for FAR
```sql
-- Get FAR section ID
WITH far_section AS (
  SELECT id FROM exam_sections WHERE code = 'FAR'
)
INSERT INTO testlets (exam_section_id, testlet_number, testlet_type, title, difficulty_level)
SELECT
  far_section.id,
  t.num,
  CASE WHEN t.num <= 2 THEN 'MCQ'::testlet_type ELSE 'TBS'::testlet_type END,
  CASE
    WHEN t.num = 1 THEN 'Multiple Choice - Set 1'
    WHEN t.num = 2 THEN 'Multiple Choice - Set 2'
    WHEN t.num = 3 THEN 'Task-Based Simulations - Set 1'
    WHEN t.num = 4 THEN 'Task-Based Simulations - Set 2'
    WHEN t.num = 5 THEN 'Task-Based Simulations - Set 3'
  END,
  'medium'::difficulty_level
FROM far_section
CROSS JOIN generate_series(1, 5) AS t(num);
```

## Implementation Notes for Frontend

### TBS Rendering Strategy

1. **Exhibits Component** (Left Panel):
   - Render tabs based on `exhibits` array
   - Support types: `text`, `table`, `pdf_url`, `image`
   - Use `order` field for tab sequence

2. **Grid Component** (Right Panel):
   - Check `grid_config.type`
   - If `spreadsheet`: Use `react-data-grid` with dynamic columns/rows
   - If `form`: Render form fields with validation
   - Store user input in state matching `response_data` structure

3. **Answer Submission**:
   - Convert UI state to `response_data` JSONB format
   - POST to `/api/responses` endpoint
   - Backend validates against `correct_answer_data`
   - Return score and (optionally) explanation

### State Management Strategy

Use **Zustand** for:
- Current exam timer
- Current question index
- Flag status (local optimistic updates)

Use **React Query** for:
- Fetching questions (with caching)
- Submitting answers (with optimistic updates)
- Syncing progress to server

## Performance Considerations

### Indexes
- **GIN indexes** on JSONB columns enable fast querying
- **Partial indexes** on `is_flagged = true` for review screen
- **Composite indexes** on `(exam_id, question_id)` for lookups

### Caching Strategy
- Cache entire testlet of questions (5-10 questions) on client
- Prefetch next testlet when user reaches 80% of current testlet
- Invalidate cache on exam submission

### Scaling Considerations
- JSONB columns are efficient for reads (GIN indexed)
- For 10,000+ TBS questions, consider materialized views for analytics
- Partition `user_responses` by `created_at` if storing years of data

## Security Considerations

### Row Level Security (RLS)
- ✅ Users can only see their own `exams`, `user_responses`, `user_progress`
- ✅ Users can see all `questions` (but NOT `correct_answer_data` in SELECT policy)
- ✅ Supabase Auth handles user authentication

### Answer Key Protection
**CRITICAL**: The frontend must NEVER receive `correct_answer_data` from the database.

Two approaches:
1. **Database Function**: Create a `submit_answer()` function that grades server-side
2. **API Route**: POST to Next.js API route that queries correct answer and grades

**Recommended**: Use Supabase RPC function:
```sql
CREATE OR REPLACE FUNCTION submit_answer(
  p_exam_id UUID,
  p_question_id UUID,
  p_response_data JSONB
)
RETURNS JSONB
SECURITY DEFINER -- Runs with elevated privileges
AS $$
DECLARE
  v_is_correct BOOLEAN;
  v_points_earned NUMERIC;
  v_question_type question_type;
BEGIN
  -- Get question type
  SELECT question_type INTO v_question_type
  FROM questions WHERE id = p_question_id;

  -- Grade based on type
  IF v_question_type = 'MCQ' THEN
    -- Simple equality check
    SELECT
      (p_response_data->>'selected') = correct_answer,
      CASE WHEN (p_response_data->>'selected') = correct_answer THEN points ELSE 0 END
    INTO v_is_correct, v_points_earned
    FROM questions WHERE id = p_question_id;
  ELSE
    -- TBS grading (call grading function)
    -- Implementation depends on TBS type
  END IF;

  -- Insert/update user_response
  INSERT INTO user_responses (exam_id, question_id, user_id, response_data, is_correct, points_earned, is_answered)
  VALUES (p_exam_id, p_question_id, auth.uid(), p_response_data, v_is_correct, v_points_earned, true)
  ON CONFLICT (exam_id, question_id, attempt_number) DO UPDATE
  SET response_data = EXCLUDED.response_data,
      is_correct = EXCLUDED.is_correct,
      points_earned = EXCLUDED.points_earned,
      last_modified_at = NOW();

  -- Return result (without correct answer!)
  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'points_earned', v_points_earned
  );
END;
$$ LANGUAGE plpgsql;
```

## Next Steps

1. ✅ **Schema Created**: `schema.sql` is ready for Supabase migration
2. **Apply Migration**: Run this in Supabase SQL Editor or via CLI
3. **Seed Data**: Add sample exam sections, testlets, and questions
4. **API Layer**: Create Next.js API routes or Supabase Edge Functions
5. **Frontend Components**: Build TBS renderer components
6. **Grading Engine**: Implement server-side answer validation

## Questions & Clarifications

Before proceeding to frontend implementation, please confirm:

1. **Adaptive Testing**: Should testlet difficulty adjust based on user performance? (Requires additional logic)
2. **Practice Mode**: Should users be able to retry questions immediately? (Affects `attempt_number` logic)
3. **Analytics**: Do we need real-time analytics dashboards? (May require additional tables)
4. **Media Storage**: Where should exhibits (PDFs, images) be stored? (Supabase Storage?)
5. **Timer Behavior**: Should timer pause when user navigates away? (Requires activity tracking)

---

**Schema Version**: 1.0
**Last Updated**: 2024-01-15
**Author**: Lead Full-Stack Architect
