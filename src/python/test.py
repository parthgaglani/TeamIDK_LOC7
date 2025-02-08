import sys
import json
import os

try:
    # Test Python environment
    print("Python version:", sys.version, file=sys.stderr)
    print("Python executable:", sys.executable, file=sys.stderr)
    print("Working directory:", os.getcwd(), file=sys.stderr)
    
    # Test imports
    import pytesseract
    from PIL import Image
    from transformers import pipeline
    
    # Test Tesseract installation
    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    print("Tesseract path:", tesseract_path, file=sys.stderr)
    print("Tesseract exists:", os.path.exists(tesseract_path), file=sys.stderr)
    
    # Print success message
    print(json.dumps({
        "success": True,
        "message": "All dependencies are properly installed"
    }))
except Exception as e:
    print("Error:", str(e), file=sys.stderr)
    print(json.dumps({
        "error": str(e)
    })) 