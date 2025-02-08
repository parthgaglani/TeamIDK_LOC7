import sys
import json
import pytesseract
from PIL import Image
from transformers import pipeline
import re
from datetime import datetime
import os
import traceback
import subprocess

def verify_tesseract_installation():
    """Verify that Tesseract is properly installed and accessible."""
    try:
        # Check if tesseract executable exists
        tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        if not os.path.exists(tesseract_path):
            return False, f"Tesseract executable not found at {tesseract_path}"

        # Try to run tesseract version command
        try:
            subprocess.run([tesseract_path, '--version'], 
                         capture_output=True, 
                         check=True)
            return True, "Tesseract is properly installed"
        except subprocess.CalledProcessError as e:
            return False, f"Failed to run Tesseract: {str(e)}"
    except Exception as e:
        return False, f"Error checking Tesseract installation: {str(e)}"

# Verify Tesseract installation before proceeding
tesseract_ok, tesseract_message = verify_tesseract_installation()
if not tesseract_ok:
    print(json.dumps({
        "error": f"Tesseract OCR is not properly installed: {tesseract_message}. Please install Tesseract OCR from https://github.com/UB-Mannheim/tesseract/wiki"
    }))
    sys.exit(1)

# Configure Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_receipt(image_path):
    """Extract text from receipt image using OCR."""
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
            
        print(f"Processing image: {image_path}", file=sys.stderr)
        print(f"Current working directory: {os.getcwd()}", file=sys.stderr)
        print(f"Image exists: {os.path.exists(image_path)}", file=sys.stderr)
        print(f"Image size: {os.path.getsize(image_path)} bytes", file=sys.stderr)
        
        image = Image.open(image_path)
        print(f"Image opened successfully. Size: {image.size}, Mode: {image.mode}", file=sys.stderr)
        
        # Convert image to RGB if necessary
        if image.mode != 'RGB':
            print(f"Converting image from {image.mode} to RGB", file=sys.stderr)
            image = image.convert('RGB')
            
        text = pytesseract.image_to_string(image)
        print(f"Extracted text length: {len(text)}", file=sys.stderr)
        print(f"First 100 characters: {text[:100]}", file=sys.stderr)
        return text.strip()
    except Exception as e:
        print(f"Error in extract_text_from_receipt: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        raise

def extract_amount(text):
    """Extract total amount from receipt text."""
    try:
        # Look for common patterns of total amount
        patterns = [
            # Standard total patterns
            r'TOTAL\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'Total\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'AMOUNT\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'Amount\s*[\$£€]?\s*(\d+[.,]?\d*)',
            # Balance and due patterns
            r'Balance\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'BALANCE\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'Due\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'DUE\s*[\$£€]?\s*(\d+[.,]?\d*)',
            # Currency symbol patterns
            r'[\$£€]\s*(\d+[.,]?\d*)',
            r'(\d+[.,]?\d*)\s*[\$£€]',
            # Grand total patterns
            r'GRAND TOTAL\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'Grand Total\s*[\$£€]?\s*(\d+[.,]?\d*)',
            # Subtotal patterns
            r'SUBTOTAL\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'Sub Total\s*[\$£€]?\s*(\d+[.,]?\d*)',
            # Fallback patterns for just numbers
            r'^\s*[\$£€]?\s*(\d+[.,]?\d*)\s*$',  # Single number on a line
            r'[\$£€]?\s*(\d+[.,]?\d*)\s*$',      # Number at end of line
            r'TOTAL:?\s*[\$£€]?\s*(\d+[.,]?\d*)',
            r'Total:?\s*[\$£€]?\s*(\d+[.,]?\d*)',
        ]
        
        print(f"Searching for amount in text: {text[:100]}...", file=sys.stderr)
        print(f"Full text: {text}", file=sys.stderr)  # Print full text for debugging
        
        # First try to find amounts with specific keywords
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
            if matches:
                # Replace comma with period for proper float conversion
                amount_str = matches[-1].replace(',', '.')
                # Remove any non-numeric characters except decimal point
                amount_str = ''.join(c for c in amount_str if c.isdigit() or c == '.')
                amount = float(amount_str)
                print(f"Found amount: {amount} using pattern: {pattern}", file=sys.stderr)
                return amount
        
        # If no amount found with keywords, look for currency symbols with numbers
        lines = text.split('\n')
        for line in lines:
            if '$' in line:
                # Extract all numbers from lines containing currency symbols
                numbers = re.findall(r'[\$£€]?\s*(\d+[.,]?\d*)', line)
                if numbers:
                    amount_str = numbers[-1].replace(',', '.')
                    amount_str = ''.join(c for c in amount_str if c.isdigit() or c == '.')
                    amount = float(amount_str)
                    print(f"Found amount from currency line: {amount}", file=sys.stderr)
                    return amount
        
        print("No amount found in text", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error in extract_amount: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        return None

def extract_date(text):
    """Extract date from receipt text."""
    try:
        # Common date formats
        date_patterns = [
            r'\d{2}/\d{2}/\d{4}',
            r'\d{2}-\d{2}-\d{4}',
            r'\d{4}/\d{2}/\d{2}',
            r'\d{4}-\d{2}-\d{2}'
        ]
        
        print(f"Searching for date in text", file=sys.stderr)
        
        for pattern in date_patterns:
            matches = re.findall(pattern, text)
            if matches:
                try:
                    date_str = matches[0]
                    if re.match(r'\d{4}', date_str):  # If year is first
                        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                    else:
                        date_obj = datetime.strptime(date_str, '%d/%m/%Y')
                    result = date_obj.strftime('%Y-%m-%d')
                    print(f"Found date: {result}", file=sys.stderr)
                    return result
                except ValueError:
                    continue
        
        print("No date found in text", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error in extract_date: {str(e)}", file=sys.stderr)
        return None

def extract_merchant(text):
    """Extract merchant name from receipt text."""
    try:
        lines = text.split('\n')
        print(f"Searching for merchant in first 3 lines", file=sys.stderr)
        
        for line in lines[:3]:
            if line.strip() and not any(char.isdigit() for char in line):
                print(f"Found merchant: {line.strip()}", file=sys.stderr)
                return line.strip()
        
        print("No merchant found in text", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error in extract_merchant: {str(e)}", file=sys.stderr)
        return None

def categorize_expense(text):
    """Categorize the expense using zero-shot classification."""
    try:
        print("Initializing zero-shot classifier", file=sys.stderr)
        classifier = pipeline('zero-shot-classification', 
                            model='facebook/bart-large-mnli',
                            device=-1)  # Use CPU
        
        # Update categories to match the company policy
        categories = [
            'Meals & Dining',
            'Travel (Flights)',
            'Accommodation',
            'Local Transport',
            'Office Supplies',
            'Client Entertainment'
        ]
        
        print("Running classification", file=sys.stderr)
        result = classifier(text, candidate_labels=categories)
        category = result['labels'][0]
        confidence = result['scores'][0]
        
        print(f"Category: {category}, Confidence: {confidence}", file=sys.stderr)
        return category, confidence
    except Exception as e:
        print(f"Error in categorize_expense: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        return "Other", 0.5

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Please provide the path to the receipt image"
        }))
        sys.exit(1)

    image_path = sys.argv[1]
    print(f"Starting processing for image: {image_path}", file=sys.stderr)
    print(f"Current working directory: {os.getcwd()}", file=sys.stderr)
    print(f"Image exists: {os.path.exists(image_path)}", file=sys.stderr)
    
    try:
        # Extract text from receipt
        text = extract_text_from_receipt(image_path)
        if not text:
            raise ValueError("No text could be extracted from the image")
        
        # Clean up the extracted text
        text = text.replace('\n\n', '\n').strip()
        
        # Extract information
        amount = extract_amount(text)
        date = extract_date(text)
        merchant = extract_merchant(text)
        category, confidence = categorize_expense(text)
        
        # Prepare response
        result = {
            "success": True,
            "data": {
                "text": text,
                "amount": amount,
                "date": date,
                "merchant": merchant,
                "category": category,
                "confidence_score": confidence
            }
        }
        
        print("Processing completed successfully", file=sys.stderr)
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        error_message = f"Failed to process receipt: {str(e)}\n{traceback.format_exc()}"
        print(error_message, file=sys.stderr)
        print(json.dumps({
            "error": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main() 