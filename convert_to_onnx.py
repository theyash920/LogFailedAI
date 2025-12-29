import sys
import os

# Force UTF-8 for Windows console output
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sentence_transformers import SentenceTransformer
import torch
import onnxruntime
from transformers import AutoTokenizer

def convert_to_onnx():
    print("Loading model...")
    model_name = 'all-MiniLM-L6-v2'
    model = SentenceTransformer(model_name)
    
    # Create models directory if it doesn't exist
    if not os.path.exists("models"):
        os.makedirs("models")
        
    print("Exporting to ONNX...")
    # Define dummy input
    sentences = ['This is a sample sentence']
    features = model.tokenize(sentences)
    
    # Export the transformer part of the model
    # We need to access the underlying transformer module
    transformer_model = model[0].auto_model
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/' + model_name)
    
    # Save tokenizer
    tokenizer.save_pretrained("models/tokenizer")
    
    # Export to ONNX
    dummy_input = tokenizer(sentences, return_tensors="pt", padding=True, truncation=True)
    
    torch.onnx.export(
        transformer_model,
        (dummy_input['input_ids'], dummy_input['attention_mask']),  # Input tuple
        "models/model.onnx",
        input_names=['input_ids', 'attention_mask'],
        output_names=['last_hidden_state'],
        dynamic_axes={
            'input_ids': {0: 'batch_size', 1: 'sequence_length'},
            'attention_mask': {0: 'batch_size', 1: 'sequence_length'},
            'last_hidden_state': {0: 'batch_size', 1: 'sequence_length'}
        },
        opset_version=14,
        do_constant_folding=True
    )
    
    print("Conversion complete! Model saved to models/model.onnx and tokenizer to models/tokenizer")

if __name__ == "__main__":
    convert_to_onnx()
