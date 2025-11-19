-- =====================================================
-- SAMPLE SEED DATA FOR CPA TEST PREP PLATFORM
-- =====================================================
-- This file contains realistic sample data to test the schema
-- Run this AFTER running schema.sql

-- =====================================================
-- 1. EXAM SECTIONS (The 4 CPA Exam Sections)
-- =====================================================

INSERT INTO exam_sections (code, name, description, time_limit_minutes, passing_score, total_testlets, mcq_testlets, tbs_testlets)
VALUES
  ('AUD', 'Auditing and Attestation', 'Tests knowledge of audit procedures, attestation engagements, professional standards, and ethics. Covers planning, internal controls, evidence gathering, and reporting.', 240, 75, 5, 2, 3),
  ('FAR', 'Financial Accounting and Reporting', 'Tests knowledge of GAAP, IFRS, financial statements, governmental and nonprofit accounting. Covers conceptual framework, financial statement accounts, and transactions.', 240, 75, 5, 2, 3),
  ('REG', 'Regulation', 'Tests knowledge of federal taxation, business law, and ethics. Covers individual and business taxation, property transactions, and legal responsibilities.', 240, 75, 5, 2, 3),
  ('BEC', 'Business Environment and Concepts', 'Tests knowledge of corporate governance, economic concepts, financial management, information technology, and operations management.', 240, 75, 5, 2, 3);

-- =====================================================
-- 2. TESTLETS FOR FAR (Financial Accounting)
-- =====================================================

-- First, get the FAR section ID
DO $$
DECLARE
  far_id UUID;
  aud_id UUID;
BEGIN
  -- Get section IDs
  SELECT id INTO far_id FROM exam_sections WHERE code = 'FAR';
  SELECT id INTO aud_id FROM exam_sections WHERE code = 'AUD';

  -- Create testlets for FAR
  INSERT INTO testlets (exam_section_id, testlet_number, testlet_type, title, difficulty_level, instructions)
  VALUES
    -- MCQ Testlets
    (far_id, 1, 'MCQ', 'Multiple Choice - Set 1', 'medium',
     'This testlet contains multiple-choice questions. Select the best answer for each question. You may flag questions for later review.'),
    (far_id, 2, 'MCQ', 'Multiple Choice - Set 2', 'medium',
     'This testlet contains multiple-choice questions. The difficulty may adapt based on your performance in Set 1.'),

    -- TBS Testlets
    (far_id, 3, 'TBS', 'Task-Based Simulations - Set 1', 'medium',
     'This testlet contains task-based simulations. Review the exhibits carefully and complete the required tasks. Use the calculator and spreadsheet tools as needed.'),
    (far_id, 4, 'TBS', 'Task-Based Simulations - Set 2', 'medium',
     'This testlet contains task-based simulations. Some questions may require research in the authoritative literature.'),
    (far_id, 5, 'TBS', 'Task-Based Simulations - Set 3', 'medium',
     'This testlet contains task-based simulations. Ensure all required fields are completed before moving to the next question.');

  -- Create testlets for AUD
  INSERT INTO testlets (exam_section_id, testlet_number, testlet_type, title, difficulty_level, instructions)
  VALUES
    (aud_id, 1, 'MCQ', 'Multiple Choice - Set 1', 'medium',
     'This testlet contains multiple-choice questions covering audit planning and risk assessment.'),
    (aud_id, 2, 'MCQ', 'Multiple Choice - Set 2', 'medium',
     'This testlet contains multiple-choice questions covering audit procedures and evidence.'),
    (aud_id, 3, 'TBS', 'Task-Based Simulations - Set 1', 'medium',
     'Complete the audit procedures and risk assessments in the following simulations.'),
    (aud_id, 4, 'TBS', 'Task-Based Simulations - Set 2', 'medium',
     'Evaluate audit evidence and prepare audit documentation.'),
    (aud_id, 5, 'TBS', 'Task-Based Simulations - Set 3', 'medium',
     'Determine appropriate audit opinions and prepare audit reports.');
END $$;

-- =====================================================
-- 3. SAMPLE MCQ QUESTIONS (FAR - Testlet 1)
-- =====================================================

DO $$
DECLARE
  testlet_1_id UUID;
BEGIN
  -- Get testlet 1 ID for FAR
  SELECT t.id INTO testlet_1_id
  FROM testlets t
  JOIN exam_sections es ON es.id = t.exam_section_id
  WHERE es.code = 'FAR' AND t.testlet_number = 1;

  -- Insert MCQ questions
  INSERT INTO questions (testlet_id, question_number, question_type, difficulty_level, stem, options, correct_answer, explanation, reference_materials, points, time_estimate_seconds)
  VALUES
    -- Question 1: Revenue Recognition
    (testlet_1_id, 1, 'MCQ', 'medium',
     'On December 15, Year 1, a company received $10,000 from a customer as an advance payment for services to be performed in February, Year 2. The company uses accrual accounting. How should this transaction be recorded on December 15, Year 1?',
     '[
       {"key": "A", "text": "Debit Cash $10,000; Credit Service Revenue $10,000"},
       {"key": "B", "text": "Debit Cash $10,000; Credit Unearned Revenue $10,000"},
       {"key": "C", "text": "Debit Accounts Receivable $10,000; Credit Service Revenue $10,000"},
       {"key": "D", "text": "Debit Cash $10,000; Credit Accounts Payable $10,000"}
     ]'::jsonb,
     'B',
     'Under accrual accounting, revenue is recognized when earned, not when cash is received. Since the services will be performed in February Year 2, the revenue has not been earned as of December 15, Year 1. Therefore, the $10,000 should be recorded as Unearned Revenue (a liability) until the services are performed.',
     'FASB ASC 606 - Revenue from Contracts with Customers',
     1,
     90),

    -- Question 2: Depreciation
    (testlet_1_id, 2, 'MCQ', 'medium',
     'A company purchased equipment for $100,000 on January 1, Year 1. The equipment has an estimated useful life of 5 years and a salvage value of $10,000. Using the straight-line method, what is the depreciation expense for Year 1?',
     '[
       {"key": "A", "text": "$10,000"},
       {"key": "B", "text": "$18,000"},
       {"key": "C", "text": "$20,000"},
       {"key": "D", "text": "$25,000"}
     ]'::jsonb,
     'B',
     'Straight-line depreciation = (Cost - Salvage Value) / Useful Life = ($100,000 - $10,000) / 5 = $18,000 per year.',
     'FASB ASC 360 - Property, Plant, and Equipment',
     1,
     90),

    -- Question 3: Inventory Valuation
    (testlet_1_id, 3, 'MCQ', 'hard',
     'During periods of rising prices, which inventory cost flow method will result in the highest ending inventory balance on the balance sheet?',
     '[
       {"key": "A", "text": "FIFO (First-In, First-Out)"},
       {"key": "B", "text": "LIFO (Last-In, First-Out)"},
       {"key": "C", "text": "Weighted Average"},
       {"key": "D", "text": "Specific Identification"}
     ]'::jsonb,
     'A',
     'Under FIFO, the oldest (and cheapest, during rising prices) costs are expensed first as COGS, leaving the newest (most expensive) costs in ending inventory. This results in the highest ending inventory balance. LIFO does the opposite, resulting in the lowest ending inventory.',
     'FASB ASC 330 - Inventory',
     1,
     120);
END $$;

-- =====================================================
-- 4. SAMPLE TBS QUESTION - SPREADSHEET STYLE (FAR - Testlet 3)
-- =====================================================

DO $$
DECLARE
  testlet_3_id UUID;
BEGIN
  -- Get testlet 3 ID for FAR
  SELECT t.id INTO testlet_3_id
  FROM testlets t
  JOIN exam_sections es ON es.id = t.exam_section_id
  WHERE es.code = 'FAR' AND t.testlet_number = 3;

  -- Insert TBS question: Journal Entry
  INSERT INTO questions (testlet_id, question_number, question_type, difficulty_level, stem, exhibits, grid_config, correct_answer_data, explanation, reference_materials, points, time_estimate_seconds)
  VALUES
    (testlet_3_id, 1, 'TBS', 'medium',
     'Review the transaction details in Exhibit 1 and the Chart of Accounts in Exhibit 2. Prepare the journal entry to record the transaction on the worksheet provided.',

     -- EXHIBITS (Left Panel)
     '[
       {
         "id": "exhibit-1",
         "title": "Transaction Details",
         "type": "text",
         "content": "Transaction Date: December 15, 2023\n\nABC Corporation received $50,000 cash from a customer as payment for services that will be performed in January 2024. The company uses accrual accounting and has a December 31 fiscal year-end.",
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
             ["2020", "Accounts Payable", "Liability"],
             ["4010", "Service Revenue", "Revenue"],
             ["5010", "Salaries Expense", "Expense"]
           ]
         },
         "order": 2
       }
     ]'::jsonb,

     -- GRID CONFIG (Right Panel - Spreadsheet)
     '{
       "type": "spreadsheet",
       "title": "Journal Entry Worksheet - December 15, 2023",
       "instructions": "Enter the appropriate account names and amounts to record the transaction. Debits must equal credits.",
       "columns": [
         {
           "id": "col-account",
           "header": "Account",
           "type": "dropdown",
           "width": 250,
           "editable": true,
           "options": ["Cash", "Accounts Receivable", "Unearned Revenue", "Accounts Payable", "Service Revenue", "Salaries Expense"]
         },
         {
           "id": "col-debit",
           "header": "Debit",
           "type": "number",
           "width": 150,
           "editable": true,
           "format": "currency"
         },
         {
           "id": "col-credit",
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
         {"id": "row-3", "label": "3"}
       ],
       "validation": {
         "required_cells": ["row-1:col-account"],
         "sum_rules": [
           {
             "description": "Total debits must equal total credits",
             "debit_cells": ["row-1:col-debit", "row-2:col-debit", "row-3:col-debit"],
             "credit_cells": ["row-1:col-credit", "row-2:col-credit", "row-3:col-credit"],
             "must_balance": true,
             "error_message": "The journal entry is out of balance. Debits must equal credits."
           }
         ]
       }
     }'::jsonb,

     -- CORRECT ANSWER
     '{
       "cells": {
         "row-1:col-account": "Cash",
         "row-1:col-debit": "50000",
         "row-2:col-account": "Unearned Revenue",
         "row-2:col-credit": "50000"
       },
       "partial_credit": {
         "row-1:col-account": 0.25,
         "row-1:col-debit": 0.25,
         "row-2:col-account": 0.25,
         "row-2:col-credit": 0.25
       },
       "explanation_by_cell": {
         "row-1:col-account": "Cash is debited because the company received money (asset increase).",
         "row-1:col-debit": "$50,000 is the amount of cash received.",
         "row-2:col-account": "Unearned Revenue is credited because the service has not yet been performed, creating a liability.",
         "row-2:col-credit": "$50,000 represents the obligation to perform services in the future."
       },
       "common_mistakes": [
         {
           "mistake_pattern": {"row-1:col-account": "Accounts Receivable"},
           "feedback": "Incorrect. The company received cash, not a promise to pay. Debit Cash, not Accounts Receivable."
         },
         {
           "mistake_pattern": {"row-2:col-account": "Service Revenue"},
           "feedback": "Incorrect. Under accrual accounting, revenue should not be recognized until the service is performed (January 2024). Use Unearned Revenue to record the liability."
         }
       ]
     }'::jsonb,

     'This transaction involves receiving cash for services not yet performed. Since ABC Corporation uses accrual accounting, revenue cannot be recognized until it is earned (i.e., when the services are performed in January 2024). Therefore, the $50,000 creates a liability called Unearned Revenue, which represents the company''s obligation to perform services in the future.',
     'FASB ASC 606 - Revenue from Contracts with Customers',
     3,
     600);
END $$;

-- =====================================================
-- 5. SAMPLE TBS QUESTION - FORM STYLE (AUD - Testlet 5)
-- =====================================================

DO $$
DECLARE
  aud_testlet_5_id UUID;
BEGIN
  -- Get testlet 5 ID for AUD
  SELECT t.id INTO aud_testlet_5_id
  FROM testlets t
  JOIN exam_sections es ON es.id = t.exam_section_id
  WHERE es.code = 'AUD' AND t.testlet_number = 5;

  -- Insert TBS question: Audit Opinion
  INSERT INTO questions (testlet_id, question_number, question_type, difficulty_level, stem, exhibits, grid_config, correct_answer_data, explanation, reference_materials, points, time_estimate_seconds)
  VALUES
    (aud_testlet_5_id, 1, 'TBS', 'hard',
     'Review the auditor''s findings in the exhibits below. Based on the information provided, determine the appropriate audit opinion and complete the required fields.',

     -- EXHIBITS (Left Panel)
     '[
       {
         "id": "exhibit-1",
         "title": "Auditor Findings Summary",
         "type": "text",
         "content": "During the audit of XYZ Corporation for the year ended December 31, 2023, the auditor identified the following:\n\n1. Management refused to provide access to minutes from Board of Directors meetings.\n\n2. Management also refused to provide copies of legal correspondence regarding pending litigation.\n\n3. The auditor was unable to obtain sufficient appropriate evidence regarding potential legal liabilities.\n\n4. The litigation represents a material uncertainty that could impact 15-20% of total assets.",
         "order": 1
       },
       {
         "id": "exhibit-2",
         "title": "Management Response",
         "type": "text",
         "content": "Management''s Response to Audit Request:\n\n\"The Board meeting minutes and legal correspondence contain confidential information that we cannot disclose. We assure you that there are no material legal issues that would affect the financial statements.\"\n\nManagement has not provided any alternative procedures or evidence.",
         "order": 2
       },
       {
         "id": "exhibit-3",
         "title": "Financial Statement Impact",
         "type": "table",
         "content": {
           "headers": ["Description", "Amount"],
           "rows": [
             ["Total Assets", "$10,000,000"],
             ["Estimated Litigation Impact", "$1,500,000 - $2,000,000"],
             ["Impact as % of Total Assets", "15% - 20%"]
           ]
         },
         "order": 3
       }
     ]'::jsonb,

     -- GRID CONFIG (Right Panel - Form)
     '{
       "type": "form",
       "title": "Audit Opinion Determination",
       "sections": [
         {
           "id": "section-1",
           "title": "Part A: Opinion Type",
           "fields": [
             {
               "id": "opinion-type",
               "label": "Based on the exhibits, what type of audit opinion should be issued?",
               "type": "dropdown",
               "options": [
                 "Unqualified Opinion",
                 "Qualified Opinion - GAAP Departure",
                 "Qualified Opinion - Scope Limitation",
                 "Adverse Opinion",
                 "Disclaimer of Opinion"
               ],
               "required": true
             }
           ]
         },
         {
           "id": "section-2",
           "title": "Part B: Primary Reason",
           "fields": [
             {
               "id": "primary-reason",
               "label": "What is the primary reason for your opinion?",
               "type": "radio",
               "options": [
                 "Material GAAP violation",
                 "Material scope limitation",
                 "Immaterial GAAP violation",
                 "Going concern issue",
                 "Lack of independence"
               ],
               "required": true
             }
           ]
         },
         {
           "id": "section-3",
           "title": "Part C: Report Modifications",
           "fields": [
             {
               "id": "report-paragraphs",
               "label": "Which paragraphs of the audit report would be modified? (Select all that apply)",
               "type": "checkbox_group",
               "options": [
                 "Introductory Paragraph",
                 "Scope Paragraph",
                 "Opinion Paragraph",
                 "Emphasis of Matter Paragraph"
               ],
               "min_selections": 1
             }
           ]
         },
         {
           "id": "section-4",
           "title": "Part D: Justification",
           "fields": [
             {
               "id": "justification",
               "label": "Provide a brief justification for your opinion (3-4 sentences)",
               "type": "textarea",
               "required": true,
               "min_length": 100,
               "max_length": 600,
               "rows": 5,
               "placeholder": "Explain the reason for your opinion based on the auditor findings and professional standards..."
             }
           ]
         }
       ]
     }'::jsonb,

     -- CORRECT ANSWER
     '{
       "fields": {
         "opinion-type": {
           "correct_value": "Disclaimer of Opinion",
           "points": 0.4
         },
         "primary-reason": {
           "correct_value": "Material scope limitation",
           "points": 0.2
         },
         "report-paragraphs": {
           "correct_values": ["Scope Paragraph", "Opinion Paragraph"],
           "scoring": "all_or_nothing",
           "points": 0.2
         },
         "justification": {
           "type": "keyword_scoring",
           "required_keywords": [
             {"keyword": "scope limitation", "points": 0.05},
             {"keyword": "insufficient evidence", "points": 0.05},
             {"keyword": "material", "points": 0.03},
             {"keyword": "unable to obtain", "points": 0.02}
           ],
           "max_points": 0.2
         }
       },
       "total_points": 1.0,
       "passing_threshold": 0.7
     }'::jsonb,

     'A disclaimer of opinion is appropriate when the auditor is unable to obtain sufficient appropriate audit evidence and the possible effects on the financial statements are both material and pervasive. In this case:\n\n1. SCOPE LIMITATION: Management refused to provide critical evidence (Board minutes and legal correspondence)\n\n2. MATERIALITY: The litigation impact is material (15-20% of total assets = $1.5-2M)\n\n3. PERVASIVENESS: The scope limitation prevents the auditor from assessing a pervasive area (legal liabilities)\n\n4. NO ALTERNATIVE PROCEDURES: Management has not provided alternative evidence\n\nBoth the scope paragraph and opinion paragraph must be modified. The scope paragraph explains the limitation, and the opinion paragraph states that the auditor does not express an opinion.\n\nNote: A qualified opinion would only be appropriate if the scope limitation were material but NOT pervasive. Here, the inability to assess legal liabilities affects multiple accounts and is pervasive.',
     'AU-C Section 705 - Modifications to the Opinion in the Independent Auditor''s Report; AU-C Section 706 - Emphasis-of-Matter Paragraphs and Other-Matter Paragraphs',
     4,
     900);
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the seed data was inserted correctly

-- Check exam sections
-- SELECT code, name, time_limit_minutes FROM exam_sections ORDER BY code;

-- Check testlets for FAR
-- SELECT t.testlet_number, t.testlet_type, t.title
-- FROM testlets t
-- JOIN exam_sections es ON es.id = t.exam_section_id
-- WHERE es.code = 'FAR'
-- ORDER BY t.testlet_number;

-- Check MCQ questions in FAR testlet 1
-- SELECT q.question_number, q.question_type, LEFT(q.stem, 100) as stem_preview
-- FROM questions q
-- JOIN testlets t ON t.id = q.testlet_id
-- JOIN exam_sections es ON es.id = t.exam_section_id
-- WHERE es.code = 'FAR' AND t.testlet_number = 1
-- ORDER BY q.question_number;

-- Check TBS questions
-- SELECT
--   es.code as section,
--   t.testlet_number,
--   q.question_number,
--   q.question_type,
--   LEFT(q.stem, 80) as stem_preview,
--   jsonb_array_length(q.exhibits) as num_exhibits,
--   q.grid_config->>'type' as grid_type
-- FROM questions q
-- JOIN testlets t ON t.id = q.testlet_id
-- JOIN exam_sections es ON es.id = t.exam_section_id
-- WHERE q.question_type = 'TBS'
-- ORDER BY es.code, t.testlet_number, q.question_number;
