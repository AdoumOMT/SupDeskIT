import os
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ml_model/priorite_classifier.pkl')
model = joblib.load(MODEL_PATH)

PRIORITES = ['basse', 'moyenne', 'haute']

def predict_priorite(description):
    prediction = model.predict([description])[0]
    
    if prediction not in PRIORITES:
        return 'moyenne' 

    return prediction