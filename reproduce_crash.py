import sys
import traceback
import os

# Ensure we can import from current directory
sys.path.append(os.getcwd())

try:
    from classify import classify
except Exception:
    print("Error importing classify:")
    traceback.print_exc()
    sys.exit(1)

# Test cases covers: Match Regex, LegacyCRM (LLM), No Regex match (BERT)
test_cases = [
    ("BillingSystem", "User 12345 logged in."),
    ("LegacyCRM", "Some log message to trigger LLM"),
    ("AnalyticsEngine", "Some unknown log message to trigger BERT")
]

print("Running classification test...")
try:
    result = classify(test_cases)
    print("Classification successful!")
    print("Result:", result)
except Exception:
    print("Crash detected during classification:")
    traceback.print_exc()
