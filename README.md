# CarinaChat

A chatbot application built with React (TypeScript + Tailwind CSS) on the frontend and Python (Flask) on the backend, connected to Azure OpenAI to generate responses.

---

## What it does

You type a question, it gets sent to a Flask server, Flask forwards it to Azure OpenAI, and the response comes back and appears in the chat.

The UI is a chat window with message bubbles, the bot messages are on the left, and the user messages are on the right. There is also a loading indicator while the response is being generated and a clear button to reset the conversation (the bonus challenges).

---

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS (Vite)
- **Backend:** Python + Flask
- **AI:** Azure OpenAI (GPT)
- **Testing:** pytest (backend)

---

## Project Structure

```
chatbot-app/
├── backend/
│   ├── app.py               # Flask server with /query endpoint
│   ├── test_app.py           # Backend tests (pytest)
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Template for environment variables
│
└── frontend/
    ├── src/
    │   ├── App.tsx           # Root component, manages message state
    │   ├── types.ts          # Shared TypeScript interfaces
    │   └── components/
    │       ├── Header.tsx    # App header with clear chat button
    │       └── ConvoWindow.tsx # Chat window with messages and input
    ├── vite.config.ts
    └── package.json
```

---

## Setup

### Prerequisites

- Node.js v18+
- Python 3.9+
- Azure OpenAI credentials (endpoint, API key, deployment name)

---

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder (use `.env.example` as a reference):

```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
```

Start the server:

```bash
python app.py
```

Runs on `http://localhost:5000`.

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## Running the app

You need two terminals running at the same time:

**Terminal 1 — backend:**

```bash
cd backend && source venv/bin/activate && python app.py
```

**Terminal 2 — frontend:**

```bash
cd frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Testing

The backend includes unit tests using pytest. The tests mock the Azure OpenAI API so no real credentials are needed to run them.

```bash
cd backend
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install pytest
pytest test_app.py -v
```

The tests cover:

- **Input validation:** empty questions, whitespace-only input, missing fields, invalid JSON
- **Successful queries:** valid questions return 200 with the AI's response, correct forwarding to Azure
- **HTTP methods:** only POST is accepted on `/query`, other methods return 405

---

## Features

- Chat interface with user and bot message bubbles
- "Thinking..." loading indicator while waiting for a response
- Clear chat button to reset the conversation
- Input validation: empty messages are rejected by the backend
- Enter to send, Shift+Enter for a new line
- Auto-scroll to the latest message
- Responsive layout (mobile and desktop)

---

## API

**`POST /query`**

Request body:

```json
{ "question": "What is machine learning?" }
```

Response:

```json
{ "response": "Machine learning is..." }
```

Returns `400` if the question is empty, `500` if the Azure call fails.
