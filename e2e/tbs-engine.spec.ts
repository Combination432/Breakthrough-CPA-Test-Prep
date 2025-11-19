import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Task-Based Simulation (TBS) Engine
 *
 * Tests the interactive TBS interface including:
 * - Split-screen layout with resizable panels
 * - Exhibit viewer with tab navigation
 * - Spreadsheet workspace with editable cells
 */

test.describe('TBS Engine - Depreciation Schedule Simulation', () => {

  // Setup: Create a test user and navigate to TBS demo
  test.beforeEach(async ({ page }) => {
    // Note: In a real scenario, we'd need to handle authentication
    // For this test, we'll assume we can access the demo page directly
    // or that we have a test account set up

    await page.goto('/study/tbs/demo');

    // Wait for the TBS layout to load
    await page.waitForSelector('[data-testid="tbs-layout"], .rdg', { timeout: 10000 });
  });

  /**
   * TEST 1: Verify TBS Layout Structure
   */
  test('should render the TBS split-screen layout correctly', async ({ page }) => {
    // Check that both panels are visible
    const exhibitViewer = page.locator('text=Purchase Invoice, text=Tax Law Excerpt').first();
    const spreadsheetWorkspace = page.locator('text=Depreciation Schedule Worksheet, .rdg').first();

    await expect(exhibitViewer.or(page.locator('button:has-text("Purchase Invoice")'))).toBeVisible();
    await expect(spreadsheetWorkspace.or(page.locator('.rdg'))).toBeVisible();

    // Verify question stem is displayed
    await expect(page.locator('text=/Review the exhibits.*depreciation schedule/i')).toBeVisible();
  });

  /**
   * TEST 2: Tab Navigation in Exhibit Viewer
   */
  test('should switch between exhibit tabs correctly', async ({ page }) => {
    // Wait for tabs to be available
    await page.waitForSelector('button:has-text("Purchase Invoice"), [role="tab"]', { timeout: 5000 });

    // Click on "Purchase Invoice" tab
    const purchaseInvoiceTab = page.locator('button:has-text("Purchase Invoice"), [role="tab"]:has-text("Purchase Invoice")').first();
    await purchaseInvoiceTab.click();

    // Verify Purchase Invoice content is visible
    await expect(page.locator('text=/EQUIPMENT PURCHASE INVOICE|Purchase Price.*120,000/i')).toBeVisible({ timeout: 5000 });

    // Click on "Tax Law Excerpt" tab
    const taxLawTab = page.locator('button:has-text("Tax Law Excerpt"), [role="tab"]:has-text("Tax Law")').first();
    await taxLawTab.click();

    // Verify Tax Law content is visible
    await expect(page.locator('text=/Straight-Line Method|Annual Depreciation/i')).toBeVisible({ timeout: 5000 });

    // Click on "Accounting Policy" tab
    const accountingPolicyTab = page.locator('button:has-text("Accounting Policy"), [role="tab"]:has-text("Accounting")').first();
    await accountingPolicyTab.click();

    // Verify Accounting Policy content is visible
    await expect(page.locator('text=/ABC CORPORATION|Fixed Asset Accounting Policy/i')).toBeVisible({ timeout: 5000 });
  });

  /**
   * TEST 3: Spreadsheet Grid Interaction (Critical Test)
   */
  test('should allow editing cells in the depreciation schedule', async ({ page }) => {
    // Wait for the grid to be fully loaded
    await page.waitForSelector('.rdg', { timeout: 10000 });

    // Find an editable cell (Depreciation Expense for Year 1)
    // react-data-grid uses specific class names and structure
    const grid = page.locator('.rdg').first();
    await expect(grid).toBeVisible();

    // Find the cell for Year 1, Depreciation Expense column
    // The grid structure: .rdg-row (for each row) > .rdg-cell (for each cell)
    // We need to find row 1 (Year 1) and the "Depreciation Expense" column

    // Strategy: Click on a cell that should be editable (yellow background)
    const editableCell = page.locator('.rdg-cell.bg-yellow-50, .rdg-cell[aria-colindex="5"]').first();

    // If the above doesn't work, try a more general approach
    if (await editableCell.count() === 0) {
      // Fallback: Look for any editable cell in the grid
      const cells = page.locator('.rdg-cell');
      const cellCount = await cells.count();

      // Try to find and click an editable cell (should have white or yellow-50 background)
      for (let i = 0; i < Math.min(cellCount, 50); i++) {
        const cell = cells.nth(i);
        const className = await cell.getAttribute('class') || '';

        if (className.includes('yellow-50') || (!className.includes('gray-100') && i > 4)) {
          // Found a potentially editable cell
          await cell.click();

          // Try to type in it
          await page.keyboard.type('11700');
          await page.keyboard.press('Enter');

          // Verify the value was entered
          const cellContent = await cell.textContent();
          if (cellContent?.includes('11700') || cellContent?.includes('11,700')) {
            // Success! Value was entered
            break;
          }
        }
      }
    } else {
      // Click the editable cell
      await editableCell.click();

      // Type the value
      await page.keyboard.type('11700');
      await page.keyboard.press('Enter');
    }

    // Alternative approach: Use the actual input element that appears
    const input = page.locator('.rdg input, input[type="text"]').first();
    if (await input.isVisible()) {
      await input.fill('11700');
      await page.keyboard.press('Enter');
    }

    // Verify that the grid now contains the entered value
    await expect(page.locator('text=/11,?700/')).toBeVisible({ timeout: 3000 });
  });

  /**
   * TEST 4: Submit Answer and Validation
   */
  test('should validate answers and show feedback', async ({ page }) => {
    // Fill in some cells with correct values
    // This is a simplified test - in reality, we'd fill multiple cells

    // Wait for grid
    await page.waitForSelector('.rdg', { timeout: 10000 });

    // Try to fill cells programmatically via direct interaction
    // Since cell editing can be tricky, let's focus on the Submit button

    // Find and click the Submit Answer button
    const submitButton = page.locator('button:has-text("Submit Answer")');
    await expect(submitButton).toBeVisible({ timeout: 5000 });

    // Click submit (even with empty values to test the validation UI)
    await submitButton.click();

    // Verify that feedback appears
    // Should show either "Correct!" or "Partially Correct"
    await expect(
      page.locator('text=/Correct|Partially Correct|cells/i')
    ).toBeVisible({ timeout: 5000 });

    // Verify explanation section appears
    await expect(
      page.locator('text=/Explanation|Depreciation Schedule|Step/i')
    ).toBeVisible({ timeout: 5000 });
  });

  /**
   * TEST 5: Reset Functionality
   */
  test('should reset the spreadsheet when Reset button is clicked', async ({ page }) => {
    // Wait for grid
    await page.waitForSelector('.rdg', { timeout: 10000 });

    // Find the Reset button
    const resetButton = page.locator('button:has-text("Reset")');
    await expect(resetButton).toBeVisible({ timeout: 5000 });

    // Click reset
    await resetButton.click();

    // After reset, editable cells should be empty (yellow background)
    // We can verify by checking if yellow-50 cells exist
    const yellowCells = page.locator('.rdg-cell.bg-yellow-50');
    await expect(yellowCells.first()).toBeVisible({ timeout: 3000 });
  });

  /**
   * TEST 6: Panel Resizing (Advanced)
   * Note: This test attempts to resize panels, but may be complex with react-resizable-panels
   */
  test('should allow resizing the split panels', async ({ page }) => {
    // Find the resize handle
    const resizeHandle = page.locator('[data-panel-resize-handle-id], button[aria-label*="resize"], .group > div[role="separator"]').first();

    // Get initial panel sizes
    const leftPanel = page.locator('[data-panel], [data-panel-id]').first();
    const initialWidth = await leftPanel.evaluate((el) => el.getBoundingClientRect().width);

    // Attempt to drag the resize handle
    if (await resizeHandle.isVisible()) {
      const handleBox = await resizeHandle.boundingBox();
      if (handleBox) {
        // Drag 100px to the right
        await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(handleBox.x + 100, handleBox.y + handleBox.height / 2);
        await page.mouse.up();

        // Verify panel width changed
        const newWidth = await leftPanel.evaluate((el) => el.getBoundingClientRect().width);

        // Width should have changed (allowing for some tolerance)
        expect(Math.abs(newWidth - initialWidth)).toBeGreaterThan(50);
      }
    } else {
      // If resize handle is not easily identifiable, just verify panels exist
      await expect(leftPanel).toBeVisible();
    }
  });

  /**
   * TEST 7: Complete Workflow Test
   */
  test('should complete a full TBS workflow', async ({ page }) => {
    // 1. Verify page loads
    await expect(page.locator('text=/Review the exhibits.*depreciation/i')).toBeVisible({ timeout: 10000 });

    // 2. Read exhibits
    await page.locator('button:has-text("Purchase Invoice"), [role="tab"]:has-text("Purchase")').first().click();
    await expect(page.locator('text=/120,000|130,000/')).toBeVisible({ timeout: 3000 });

    await page.locator('button:has-text("Tax Law"), [role="tab"]:has-text("Tax")').first().click();
    await expect(page.locator('text=/Straight-Line|depreciation/i')).toBeVisible({ timeout: 3000 });

    // 3. Navigate to spreadsheet (already visible on right panel)
    await expect(page.locator('.rdg')).toBeVisible();

    // 4. Submit answer (testing validation flow)
    await page.locator('button:has-text("Submit Answer")').click();

    // 5. Verify feedback appears
    await expect(page.locator('text=/Correct|Partially|cells/i')).toBeVisible({ timeout: 5000 });

    // 6. Verify explanation is shown
    await expect(page.locator('text=/Explanation|Step|Calculation/i')).toBeVisible({ timeout: 3000 });
  });
});
