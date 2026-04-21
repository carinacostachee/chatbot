from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-06-01",
)

deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")


@app.route("/query", methods=["POST"])
def query():
    # first we read the question from the request body
    user_request = request.get_json()
    user_question = user_request.get("question", "").strip()
    # we then need to make sure that the question is not empty
    if not user_question:
        return jsonify({"response": "Please ask a question!"}), 400
    # now we can send the question to the Azure OpenAI API and get the response
    try:
        completion = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": "You are a helpful assistant"},
                {"role": "user", "content": user_question},
            ],
            max_tokens=500,
        )
        response = completion.choices[0].message.content
        return jsonify({"response": response})
    except Exception as e:
        return (
            jsonify({"response": f"Error: {str(e)}"}),
            500,
        )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
