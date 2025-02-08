import sys
import json
import os

try:
    import pytesseract
    from PIL import Image
    print(json.dumps({
        "success": True,
        "data": {
            "tesseract_path": pytesseract.pytesseract.tesseract_cmd,
            "tesseract_exists": os.path.exists(pytesseract.pytesseract.tesseract_cmd),
            "python_path": sys.executable,
            "working_dir": os.getcwd()
        }
    }))
    sys.exit(0)
except Exception as e:
    print(json.dumps({
        "error": str(e)
    }))
    sys.exit(1) 