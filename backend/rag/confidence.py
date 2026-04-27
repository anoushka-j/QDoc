def compute_confidence(matches):
    if not matches:
        return 0.0
    
    top_score = matches[0]["score"]
    return round(top_score, 2)