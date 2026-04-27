from typing import List
import tiktoken

import re 

ENCODER = tiktoken.get_encoding("cl100k_base")

def is_bad_chunk(text):
    return (
        "arxiv" in text.lower() or
        "pp." in text.lower() or
        "et al" in text.lower()
    )

def clean_text(text): 
    # Fix hyphenated line breaks: "evalua- tion" → "evaluation"
    text = re.sub(r'(\w+)-\s+(\w+)', r'\1\2', text)

    # Add space between numbers and letters: "10GPT" → "10 GPT"
    text = re.sub(r'(\d)([A-Za-z])', r'\1 \2', text)

    # Add space between lowercase and uppercase: "Fig.11T5" → "Fig. 11 T5"
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)

    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def count_tokens(text) : 
    return len(ENCODER.encode(text))

def chunk_text(text, chunk_size=300, overlap=50) : 
    text = clean_text(text)
    chunks = []
    curr_chunk = []
    curr_tokens = 0

    #cleaning the sentences
    sentences = text.split(". ") 
    print("Number of sentences:", len(sentences))

    for sentence in sentences : 
        sentence = sentence.strip()
        if not sentence : 
            continue 

        #counting current sentence tokens 
        sentence_tokens = count_tokens(sentence)
        if (curr_tokens + sentence_tokens) > chunk_size : 
             #if its too much, start new chunk with overlap of last one, then add the current sentence
            #finalize lats chunk 
            chunk = ". ".join(curr_chunk).strip()
            if chunk : 
                chunks.append(chunk)

            #start new chunk with overlap 
            overlap_chunk = []
            overlap_tokens = 0 

            for s in reversed(curr_chunk) : 
                t = count_tokens(s)
                if overlap_tokens + t > overlap : 
                    break 

                overlap_chunk.insert(0, s)
                overlap_tokens += t 
                
            curr_chunk = overlap_chunk.copy()
            curr_tokens = overlap_tokens

        curr_tokens += sentence_tokens
        curr_chunk.append(sentence)

    if curr_chunk:
        chunks.append(". ".join(curr_chunk).strip())

    return chunks