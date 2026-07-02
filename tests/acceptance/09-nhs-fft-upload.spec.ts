import { test, expect } from '@playwright/test';
import path from 'path';

async function goto(page: any, url: string) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
  await page.goto(baseUrl + url);
  await page.waitForLoadState('networkidle');
}

test.describe('NHS FFT Data Upload', () => {
  
  test('upload component is visible on Ingest tab', async ({ page }) => {
    await goto(page, '/');
    
    // Click on Ingest tab
    await page.click('button:has-text("Ingest")');
    
    // Check upload component is visible
    await expect(page.getByText('NHS FFT Data Upload')).toBeVisible();
    await expect(page.getByText('Upload NHS Friends and Family Test export files')).toBeVisible();
    await expect(page.getByText('Select NHS FFT File')).toBeVisible();
  });

  test('accepts CSV file upload and validates structure', async ({ page }) => {
    await goto(page, '/');
    await page.click('button:has-text("Ingest")');
    
    // Prepare file path
    const filePath = path.join(__dirname, '../../src/imports/sample_nhs_fft_data.csv');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    // Wait for processing
    await expect(page.getByText(/Processing.*\.csv/)).toBeVisible();
    
    // Check for success message
    await expect(page.getByText('Upload successful!')).toBeVisible({ timeout: 10000 });
    
    // Verify stats
    await expect(page.getByText(/\d+ records validated/)).toBeVisible();
  });

  test('detects and skips duplicate records', async ({ page }) => {
    await goto(page, '/');
    await page.click('button:has-text("Ingest")');
    
    const filePath = path.join(__dirname, '../../src/imports/sample_nhs_fft_data.csv');
    
    // Upload file first time
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    await expect(page.getByText('Upload successful!')).toBeVisible({ timeout: 10000 });
    
    // Import records
    await page.click('button:has-text("Import")');
    await expect(page.getByText(/Imported \d+ NHS FFT records/)).toBeVisible({ timeout: 5000 });
    
    // Upload same file again
    await page.click('button:has-text("Upload Another File")');
    await fileInput.setInputFiles(filePath);
    await expect(page.getByText('Upload successful!')).toBeVisible({ timeout: 10000 });
    
    // Import again - should detect duplicates
    await page.click('button:has-text("Import")');
    await expect(page.getByText('No new records to import')).toBeVisible({ timeout: 5000 });
  });

  test('validates required columns and shows errors', async ({ page }) => {
    await goto(page, '/');
    await page.click('button:has-text("Ingest")');
    
    // Create a temporary invalid CSV in memory by uploading via data URL
    const invalidCSV = 'Invalid Header,Another Header\nValue1,Value2\n';
    const blob = new Blob([invalidCSV], { type: 'text/csv' });
    const file = new File([blob], 'invalid.csv', { type: 'text/csv' });
    
    // Upload invalid file
    const fileInput = page.locator('input[type="file"]');
    const dataTransfer = await page.evaluateHandle((file) => {
      const dt = new DataTransfer();
      const f = new File([file], 'invalid.csv', { type: 'text/csv' });
      dt.items.add(f);
      return dt;
    }, invalidCSV);
    
    await fileInput.evaluate((input: HTMLInputElement, dataTransfer: DataTransfer) => {
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, dataTransfer);
    
    // Should show error about missing columns
    await expect(page.getByText(/Missing required columns/i)).toBeVisible({ timeout: 10000 });
  });

  test('validates Overall Experience values', async ({ page }) => {
    await goto(page, '/');
    await page.click('button:has-text("Ingest")');
    
    // Create CSV with invalid Overall Experience value
    const invalidCSV = `Trust Code,Trust Name,Ward Code,Ward Name,Service Type,Submission Date,Response Date,Overall Experience,Comments
RYJ,Test Trust,W01,Test Ward,Inpatient,2026-06-01,2026-05-28,INVALID_VALUE,Test comment
`;
    
    const dataTransfer = await page.evaluateHandle((csvContent) => {
      const dt = new DataTransfer();
      const file = new File([csvContent], 'invalid_experience.csv', { type: 'text/csv' });
      dt.items.add(file);
      return dt;
    }, invalidCSV);
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.evaluate((input: HTMLInputElement, dt: DataTransfer) => {
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, dataTransfer);
    
    // Should show validation error
    await expect(page.getByText(/Upload failed/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Invalid Overall Experience value/i)).toBeVisible();
  });

  test('displays record count after successful import', async ({ page }) => {
    await goto(page, '/');
    await page.click('button:has-text("Ingest")');
    
    const filePath = path.join(__dirname, '../../src/imports/sample_nhs_fft_data.csv');
    
    // Upload and import
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    await expect(page.getByText('Upload successful!')).toBeVisible({ timeout: 10000 });
    
    await page.click('button:has-text("Import")');
    await expect(page.getByText(/Imported.*NHS FFT records/)).toBeVisible({ timeout: 5000 });
    
    // Check database count is displayed
    await expect(page.getByText(/Total NHS FFT Records in Database/)).toBeVisible();
    await expect(page.getByText(/Covering.*trusts across.*wards/)).toBeVisible();
  });

  test('processing completes in under 5 minutes (performance requirement)', async ({ page }) => {
    await goto(page, '/');
    await page.click('button:has-text("Ingest")');
    
    const filePath = path.join(__dirname, '../../src/imports/sample_nhs_fft_data.csv');
    const startTime = Date.now();
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    // Wait for processing to complete
    await expect(page.getByText('Upload successful!')).toBeVisible({ timeout: 10000 });
    
    const processingTime = Date.now() - startTime;
    
    // Should complete in under 5 minutes (300000ms)
    // For sample file, should be much faster (< 10 seconds)
    expect(processingTime).toBeLessThan(300000);
    expect(processingTime).toBeLessThan(10000); // Sample file should process in < 10s
  });
});
