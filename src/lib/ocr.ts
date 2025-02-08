import { createWorker } from 'tesseract.js';
import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client with error handling
const hf = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN || '');

// Timeout promise for API calls
const timeout = (ms: number) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Request timeout')), ms)
);

// Retry function for API calls
async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  retries = 2,
  timeoutMs = 5000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await Promise.race([fn(), timeout(timeoutMs)]);
      return result as T;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('All retries failed');
}

export interface ExtractedReceipt {
  vendor: string;
  amount: number;
  date: string;
  category: string;
  fullText: string;
  description?: string;
  projectCode?: string;
}

const CATEGORIES = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Equipment',
  'Software',
  'Other',
];

const COMMON_RECEIPT_WORDS = [
  'receipt',
  'invoice',
  'total',
  'subtotal',
  'tax',
  'date',
  'payment',
  'amount',
  'paid',
  'thank you',
];

const AMOUNT_KEYWORDS = [
  'total',
  'amount',
  'payment',
  'balance',
  'due',
  'paid',
  'charge',
  'sum',
];

const DATE_KEYWORDS = [
  'date',
  'dated',
  'issued',
  'purchased',
  'transaction',
  'invoice',
  'receipt',
  'order',
  'payment',
  'sale'
];

// Simple rule-based category detection
function detectCategoryFromText(text: string): string {
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes('flight') || lowercaseText.includes('hotel') || lowercaseText.includes('taxi')) {
    return 'Travel';
  }
  if (lowercaseText.includes('restaurant') || lowercaseText.includes('cafe') || lowercaseText.includes('food')) {
    return 'Meals';
  }
  if (lowercaseText.includes('paper') || lowercaseText.includes('pen') || lowercaseText.includes('staples')) {
    return 'Office Supplies';
  }
  if (lowercaseText.includes('laptop') || lowercaseText.includes('monitor') || lowercaseText.includes('hardware')) {
    return 'Equipment';
  }
  if (lowercaseText.includes('software') || lowercaseText.includes('subscription') || lowercaseText.includes('license')) {
    return 'Software';
  }
  
  return 'Other';
}

// Extract vendor name using simple text analysis
function extractVendorFromText(text: string): string {
  const lines = text.split('\n');
  const potentialVendors = lines.slice(0, 3).filter(line => {
    const lower = line.toLowerCase().trim();
    return (
      line.length > 0 &&
      !COMMON_RECEIPT_WORDS.some(word => lower.includes(word)) &&
      !/^\d/.test(line) && // Skip lines starting with numbers
      !/total|amount|tax|date/i.test(line) // Skip common receipt headers
    );
  });

  return potentialVendors[0]?.trim() || 'Unknown Vendor';
}

function extractAmount(text: string): number {
  const lines = text.split('\n');
  const amounts: { value: number; weight: number }[] = [];

  // First pass: Find all numbers that look like amounts
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const amountMatches = line.match(/\$?\s*(\d+,?\d*\.?\d+)/g);

    if (amountMatches) {
      amountMatches.forEach(match => {
        const value = parseFloat(match.replace(/[$,]/g, ''));
        let weight = 0;

        // Increase weight based on context
        if (AMOUNT_KEYWORDS.some(keyword => line.includes(keyword))) {
          weight += 3;
        }
        if (line.includes('total')) {
          weight += 2;
        }
        if (value > 0 && value < 1000000) { // Reasonable amount range
          weight += 1;
        }
        if (line.includes('tax') || line.includes('subtotal')) {
          weight -= 1;
        }

        amounts.push({ value, weight });
      });
    }
  }

  // Sort by weight and value (higher values are more likely to be totals)
  amounts.sort((a, b) => b.weight - a.weight || b.value - a.value);
  return amounts[0]?.value || 0;
}

export function extractDate(text: string): string | null {
  const lines = text.split('\n');
  for (const line of lines) {
    const date = findDatesInLine(line);
    if (date) {
      console.log('Found date in line:', line, 'Extracted date:', date);
      return date;
    }
  }
  console.warn('No valid date found in text');
  return null;
}

function findDatesInLine(line: string): string | null {
  // Common date formats with DD/MM/YY(YY) prioritized
  const datePatterns = [
    // DD/MM/YY
    /(\d{1,2})[/-](\d{1,2})[/-](\d{2})\b/,
    // DD/MM/YYYY
    /(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/,
    // YYYY/MM/DD
    /(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b/
  ];

  for (const pattern of datePatterns) {
    const match = line.match(pattern);
    if (match) {
      const [fullMatch, part1, part2, part3] = match;
      console.log('Date pattern match:', { fullMatch, part1, part2, part3 });
      
      let day: number, month: number, year: number;
      
      if (part3.length === 2) {
        // DD/MM/YY format
        day = parseInt(part1, 10);
        month = parseInt(part2, 10);
        year = parseInt(part3, 10);
        // Convert 2-digit year to 4-digit
        year = year + (year >= 50 ? 1900 : 2000);
      } else if (part3.length === 4) {
        // DD/MM/YYYY format
        day = parseInt(part1, 10);
        month = parseInt(part2, 10);
        year = parseInt(part3, 10);
      } else {
        // YYYY/MM/DD format
        year = parseInt(part1, 10);
        month = parseInt(part2, 10);
        day = parseInt(part3, 10);
      }
      
      // Validate the date components
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
        // Return in a consistent format (DD/MM/YYYY)
        return `${day}/${month}/${year}`;
      }
    }
  }

  return null;
}

function generateDescription(text: string, vendor: string, category: string): string {
  const lines = text.split('\n');
  const relevantLines = lines.filter(line => {
    const lower = line.toLowerCase().trim();
    return (
      line.length > 0 &&
      !COMMON_RECEIPT_WORDS.some(word => lower.includes(word)) &&
      !/^\d/.test(line) && // Skip lines starting with numbers
      !/total|amount|tax|date/i.test(line) // Skip common receipt headers
    );
  });

  const items = relevantLines
    .slice(1, 4) // Skip vendor name (first line) and take next few lines
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (items.length > 0) {
    return `${category} expense at ${vendor}: ${items.join(', ')}`;
  }

  return `${category} expense at ${vendor}`;
}

export async function extractTextFromImage(imageFile: File): Promise<string> {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageFile);
    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from image');
  } finally {
    await worker.terminate();
  }
}

export async function processReceipt(file: File): Promise<ExtractedReceipt> {
  const worker = await createWorker('eng');
  let imageUrl: string | null = null;

  try {
    imageUrl = URL.createObjectURL(file);
    const { data: { text } } = await worker.recognize(imageUrl);
    
    // Extract basic information first
    const vendor = extractVendorFromText(text);
    const amount = extractAmount(text);
    const date = extractDate(text) || new Date().toISOString().split('T')[0];
    const category = detectCategoryFromText(text);
    const description = generateDescription(text, vendor, category);

    // Try AI enhancement only if basic extraction succeeded
    try {
      const [aiVendor, aiCategory] = await Promise.all([
        enhanceVendorWithAI(text, vendor),
        enhanceCategoryWithAI(text, category)
      ]);

      return {
        vendor: aiVendor || vendor,
        amount,
        date,
        category: aiCategory || category,
        description,
        fullText: text,
      };
    } catch (aiError) {
      console.warn('AI enhancement failed, using basic extraction:', aiError);
      return {
        vendor,
        amount,
        date,
        category,
        description,
        fullText: text,
      };
    }
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw new Error('Failed to process receipt');
  } finally {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    await worker.terminate();
  }
}

async function enhanceVendorWithAI(text: string, fallbackVendor: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_HF_TOKEN) {
    return fallbackVendor;
  }

  try {
    const result = await retryWithTimeout(async () => {
      const classification = await hf.textClassification({
        model: 'distilbert-base-uncased',
        inputs: text.split('\n').slice(0, 3).join(' '),
      });
      return classification;
    });

    if (result && (result as any).label) {
      return (result as any).label;
    }

    return fallbackVendor;
  } catch (error) {
    console.warn('AI vendor enhancement failed:', error);
    return fallbackVendor;
  }
}

async function enhanceCategoryWithAI(text: string, fallbackCategory: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_HF_TOKEN) {
    return fallbackCategory;
  }

  try {
    const result = await retryWithTimeout(async () => {
      const classification = await hf.textClassification({
        model: 'distilbert-base-uncased',
        inputs: text,
      });
      return classification;
    });

    if (result && (result as any).label) {
      const aiCategory = (result as any).label;
      return CATEGORIES.includes(aiCategory) ? aiCategory : fallbackCategory;
    }

    return fallbackCategory;
  } catch (error) {
    console.warn('AI category enhancement failed:', error);
    return fallbackCategory;
  }
} 