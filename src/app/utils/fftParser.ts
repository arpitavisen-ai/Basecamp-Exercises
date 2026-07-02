import * as XLSX from 'xlsx';

export interface FFTRecord {
  id: string;
  trustCode: string;
  trustName: string;
  wardCode: string;
  wardName: string;
  serviceType: string;
  submissionDate: string;
  responseDate: string;
  overallExperience: string;
  wouldRecommend?: string;
  comments?: string;
  age?: string;
  gender?: string;
  ethnicity?: string;
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

export interface ParseResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  duplicates: number;
  errors: ValidationError[];
  records?: FFTRecord[];
}

const REQUIRED_COLUMNS = [
  'Trust Code',
  'Trust Name',
  'Ward Code',
  'Ward Name',
  'Service Type',
  'Submission Date',
  'Response Date',
  'Overall Experience'
];

const VALID_RESPONSES = [
  'very good',
  'good',
  'neither good nor poor',
  'poor',
  'very poor',
  'don\'t know'
];

export async function parseFFTFile(file: File): Promise<ParseResult> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  if (!['csv', 'xlsx'].includes(fileExt || '')) {
    throw new Error('Invalid file type. Please upload a CSV or XLSX file.');
  }

  try {
    const data = await readFile(file, fileExt === 'xlsx');
    return validateAndParseData(data);
  } catch (error) {
    throw new Error(`File processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function readFile(file: File, isXLSX: boolean): Promise<string[][]> {
  if (isXLSX) {
    return readXLSXFile(file);
  } else {
    return readCSVFile(file);
  }
}

async function readXLSXFile(file: File): Promise<string[][]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  if (workbook.SheetNames.length === 0) {
    throw new Error('XLSX file contains no sheets');
  }

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false }) as string[][];
  
  if (data.length === 0) {
    throw new Error('XLSX file appears to be empty');
  }

  return data;
}

async function readCSVFile(file: File): Promise<string[][]> {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file appears to be empty');
  }

  return lines.map(line => parseCSVLine(line));
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values.map(v => v.replace(/^"|"$/g, ''));
}

function validateAndParseData(data: string[][]): ParseResult {
  if (data.length < 2) {
    throw new Error('File has no data rows');
  }

  const headers = data[0].map(h => (h || '').trim());
  
  // Validate required columns
  const missingColumns = REQUIRED_COLUMNS.filter(
    col => !headers.some(h => h.toLowerCase() === col.toLowerCase())
  );
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  const records: FFTRecord[] = [];
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  let duplicates = 0;

  // Process data rows
  for (let i = 1; i < data.length; i++) {
    const values = data[i];
    
    if (!values || values.length === 0 || values.every(v => !v || v.trim() === '')) {
      continue; // Skip empty rows
    }

    if (values.length !== headers.length) {
      errors.push({
        row: i + 1,
        column: 'all',
        message: `Expected ${headers.length} columns, found ${values.length}`
      });
      continue;
    }

    try {
      const record = mapToFFTRecord(headers, values, i + 1);
      
      // Check for duplicates using composite key
      const recordId = createRecordKey(record);
      
      if (seenIds.has(recordId)) {
        duplicates++;
        continue;
      }
      
      seenIds.add(recordId);
      records.push(record);
    } catch (error) {
      errors.push({
        row: i + 1,
        column: 'validation',
        message: error instanceof Error ? error.message : 'Invalid data format'
      });
    }
  }

  return {
    success: errors.length === 0,
    totalRows: data.length - 1,
    validRows: records.length,
    duplicates,
    errors: errors.slice(0, 10), // Limit to first 10 errors for display
    records
  };
}

function mapToFFTRecord(headers: string[], values: string[], rowNumber: number): FFTRecord {
  const getVal = (colName: string): string => {
    const index = headers.findIndex(h => h.toLowerCase() === colName.toLowerCase());
    return index >= 0 && values[index] ? values[index].trim() : '';
  };

  const trustCode = getVal('Trust Code');
  const wardCode = getVal('Ward Code');
  const submissionDate = getVal('Submission Date');
  const responseDate = getVal('Response Date');
  const overallExperience = getVal('Overall Experience');

  // Validate required fields
  if (!trustCode) throw new Error('Trust Code is required');
  if (!wardCode) throw new Error('Ward Code is required');
  if (!responseDate) throw new Error('Response Date is required');
  if (!overallExperience) throw new Error('Overall Experience is required');

  // Validate overall experience value
  if (!VALID_RESPONSES.includes(overallExperience.toLowerCase())) {
    throw new Error(
      `Invalid Overall Experience value: "${overallExperience}". Must be one of: ${VALID_RESPONSES.join(', ')}`
    );
  }

  // Validate date format (basic check for YYYY-MM-DD or DD/MM/YYYY)
  const datePattern = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
  if (responseDate && !datePattern.test(responseDate)) {
    throw new Error(`Invalid Response Date format: "${responseDate}". Expected YYYY-MM-DD or DD/MM/YYYY`);
  }

  return {
    id: generateRecordId(trustCode, wardCode, responseDate),
    trustCode,
    trustName: getVal('Trust Name'),
    wardCode,
    wardName: getVal('Ward Name'),
    serviceType: getVal('Service Type'),
    submissionDate,
    responseDate,
    overallExperience,
    wouldRecommend: getVal('Would Recommend'),
    comments: getVal('Comments'),
    age: getVal('Age'),
    gender: getVal('Gender'),
    ethnicity: getVal('Ethnicity')
  };
}

function createRecordKey(record: FFTRecord): string {
  // Create a composite key to detect duplicates
  return `${record.trustCode}|${record.wardCode}|${record.responseDate}|${record.overallExperience}|${record.comments || ''}`;
}

function generateRecordId(trustCode: string, wardCode: string, responseDate: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${trustCode}-${wardCode}-${responseDate}-${timestamp}-${random}`;
}
