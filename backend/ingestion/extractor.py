import PyPDF2
import re
import PyPDF2
from io import BytesIO


import PyPDF2
from io import BytesIO

def extract_from_text(file_bytes): 
    reader = PyPDF2.PdfReader(BytesIO(file_bytes))  # ✅ fix

    pdf_text = ""

    for page in reader.pages:
        text = page.extract_text()
        if text:
            pdf_text += text + " "

    return pdf_text