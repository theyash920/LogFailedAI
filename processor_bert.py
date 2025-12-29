import onnxruntime as ort
from tokenizers import Tokenizer
import numpy as np
import joblib
import os

# Load the tokenizer
try:
    tokenizer = Tokenizer.from_file("models/tokenizer/tokenizer.json")
    tokenizer.enable_padding(pad_id=0, pad_token="[PAD]", length=None)
    tokenizer.enable_truncation(max_length=128) # Limit to 128 for speed/memory
except Exception as e:
    print(f"Warning: Tokenizer not found (run convert_to_onnx.py first): {e}")
    tokenizer = None

# Load the ONNX model
try:
    sess_options = ort.SessionOptions()
    sess_options.intra_op_num_threads = 1 # Limit threads for consistency/low usage
    model_session = ort.InferenceSession("models/model.onnx", sess_options)
except Exception as e:
    print(f"Warning: ONNX model not found (run convert_to_onnx.py first): {e}")
    model_session = None

try:
    model_classification = joblib.load("models/log_classifier.joblib")
except Exception as e:
    print(f"Warning: Classifier model not found: {e}")
    model_classification = None


def mean_pooling(model_output, attention_mask):
    """
    Mean Pooling - Take attention mask into account for correct averaging
    """
    token_embeddings = model_output[0] # First element of model_output contains all token embeddings
    
    # Expand attention_mask to match token_embeddings shape
    # attention_mask shape: [batch_size, seq_len] -> [batch_size, seq_len, 1]
    input_mask_expanded = np.expand_dims(attention_mask, axis=-1)
    
    # Broadcast to [batch_size, seq_len, hidden_size]
    input_mask_expanded = np.broadcast_to(input_mask_expanded, token_embeddings.shape)
    
    # Sum embeddings where mask is 1
    sum_embeddings = np.sum(token_embeddings * input_mask_expanded, axis=1)
    
    # Sum mask where mask is 1 (avoid division by zero with clip)
    sum_mask = np.clip(input_mask_expanded.sum(axis=1), a_min=1e-9, a_max=None)
    
    return sum_embeddings / sum_mask

def normalize(v):
    norm = np.linalg.norm(v, axis=1, keepdims=True)
    return v / np.clip(norm, a_min=1e-9, a_max=None)

def get_embeddings(texts):
    if tokenizer is None or model_session is None:
        raise RuntimeError("Model or tokenizer not loaded.")
        
    encoded = tokenizer.encode_batch(texts)
    
    # Prepare input for ONNX
    input_ids = np.array([e.ids for e in encoded], dtype=np.int64)
    attention_mask = np.array([e.attention_mask for e in encoded], dtype=np.int64)
    
    inputs = {
        'input_ids': input_ids,
        'attention_mask': attention_mask
    }
    
    # Run inference
    outputs = model_session.run(None, inputs)
    
    # Mean pooling
    sentence_embeddings = mean_pooling(outputs, attention_mask)
    
    # Normalize
    sentence_embeddings = normalize(sentence_embeddings)
    
    return sentence_embeddings

def classify_with_bert(log_message):
    if model_classification is None:
        return "Unclassified_NoModel"
        
    try:
        embeddings = get_embeddings([log_message])
        probabilities = model_classification.predict_proba(embeddings)[0]
        if max(probabilities) < 0.5:
            return "Unclassified"
        predicted_label = model_classification.predict(embeddings)[0]
        return predicted_label
    except Exception as e:
        print(f"Error in BERT classification: {e}")
        return "Unclassified_Error"


if __name__ == "__main__":
    logs = [
        "alpha.osapi_compute.wsgi.server - 12.10.11.1 - API returned 404 not found error",
        "GET /v2/3454/servers/detail HTTP/1.1 RCODE   404 len: 1583 time: 0.1878400",
        "System crashed due to drivers errors when restarting the server",
    ]
    for log in logs:
        label = classify_with_bert(log)
        print(log, "->", label)
