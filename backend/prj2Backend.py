import joblib
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import sys
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')

def preprocess_function(text):
    # Tokenization
    tokens = word_tokenize(text.lower())

    # Remove punctuation
    tokens = [token for token in tokens if token not in string.punctuation]

    # Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(token) for token in tokens]

    # Join tokens back into a single string
    preprocessed_text = ' '.join(tokens)

    return preprocessed_text

def predict(text):
    # Load the trained model and vectorizer
    model = joblib.load('trained_model.pkl')
    vectorizer = joblib.load('vectorizer.pkl')

    # Preprocess the text
    text_cleaned = preprocess_function(text)

    # Vectorize the preprocessed text
    text_vectorized = vectorizer.transform([text_cleaned])

    prediction = model.predict(text_vectorized)

    # Return the prediction result
    if prediction[0] == 1:
        return "The sentence indicates the person might be depressed."
    else:
        return "The sentence does not indicate depression."

# Accept text input from command line arguments
if __name__ == "__main__":
    text = sys.argv[1]
    result = predict(text)
    print(result)
