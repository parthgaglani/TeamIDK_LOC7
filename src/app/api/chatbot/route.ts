import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

// Define submission guidelines
const SUBMISSION_GUIDELINES = {
  general: "Please ensure your receipts are legible and itemized. Each expense should be justified with a valid reason.",
  vendor: "Make sure to include the correct vendor name and categorize the expense accurately.",
  amount_limit: "Expenses exceeding $500 must be pre-approved by the department head."
};

// Category spending limits
const CATEGORY_LIMITS = {
  'Food': 500,
  'Accommodation': 1000,
  'Travel': 200,
  'Shopping': 300,
  'Miscellaneous': 150
};

// Helper function to get answer from receipts data using Hugging Face
async function getReceiptAnswer(question: string, context: string) {
  try {
    const result = await hf.questionAnswering({
      model: 'distilbert-base-cased-distilled-squad',
      inputs: {
        question,
        context
      }
    });
    return result.answer;
  } catch (error) {
    console.error('Error getting answer from model:', error);
    return null;
  }
}

// Helper function to get submission guidelines answer
function getSubmissionGuidelineAnswer(question: string): { answer: string; topic: string } | null {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('guideline') || questionLower.includes('policy')) {
    if (questionLower.includes('general')) {
      return {
        answer: SUBMISSION_GUIDELINES.general,
        topic: 'General Guidelines'
      };
    }
    if (questionLower.includes('vendor')) {
      return {
        answer: SUBMISSION_GUIDELINES.vendor,
        topic: 'Vendor Guidelines'
      };
    }
    if (questionLower.includes('amount') || questionLower.includes('limit')) {
      return {
        answer: SUBMISSION_GUIDELINES.amount_limit,
        topic: 'Amount Limits'
      };
    }
    return {
      answer: "For more details, please refer to the company submission guidelines document.",
      topic: 'Guidelines'
    };
  }

  // Check for category limit questions
  if (questionLower.includes('limit') || questionLower.includes('maximum')) {
    for (const [category, limit] of Object.entries(CATEGORY_LIMITS)) {
      if (questionLower.includes(category.toLowerCase())) {
        return {
          answer: `The spending limit for ${category} is $${limit}.`,
          topic: 'Category Limits'
        };
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { question, expenseContext } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'No question provided!' },
        { status: 400 }
      );
    }

    // First check if it's a guideline-related question
    const guidelineAnswer = getSubmissionGuidelineAnswer(question);
    if (guidelineAnswer) {
      return NextResponse.json(guidelineAnswer);
    }

    // If we have expense context, try to answer based on that
    if (expenseContext) {
      const answer = await getReceiptAnswer(question, expenseContext);
      if (answer) {
        return NextResponse.json({
          answer,
          topic: 'Expense Report'
        });
      }
    }

    // Default response for unknown questions
    return NextResponse.json({
      answer: "I can help you with questions about expense guidelines and your expense reports. Could you please be more specific?",
      topic: 'General'
    });

  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 