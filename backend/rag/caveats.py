def generate_caveat(matches, confidence):
    if not matches:
        return "No relevant information found in the document."

    if confidence < 0.4:
        return "Low confidence — the retrieved passages are only weakly related. The document may use different terminology or may not directly answer this question."

    if len(matches) >= 2:
        if abs(matches[0]["score"] - matches[1]["score"]) < 0.05: 
            return "Many possible sources"

        if len(matches) < 2:
            return "Limited evidence — answer is based on minimal context."

    return None