import pytest
from unittest.mock import patch, MagicMock
from app import app


@pytest.fixture
def client():
    """
    This function sets up a Flask test client for each test
    Requests are simulated in memory, no real server is started.
    """

    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


# --------------------- INPUT VALIDATION TESTS --------------------------------
def test_empty_question_returns_400(client):
    """
    GIVEN: the /query endpoint
    WHEN:  a POST request is sent with an empty question string
    THEN:  the response should be 400 with "Please ask a question!"

    """
    response = client.post("/query", json={"question": ""})
    assert response.status_code == 400
    assert response.get_json()["response"] == "Please ask a question!"


def test_whitespace_returns_400(client):
    """
    GIVEN: the /query endpoint
    WHEN:  a POST request is sent with only whitespace as a question
    THEN:  the response should be 400 with "Please ask a question!"

    """
    response = client.post("/query", json={"question": "  "})
    assert response.status_code == 400
    assert response.get_json()["response"] == "Please ask a question!"


def test_missing_question_field_returns_400(client):
    """
    GIVEN: the /query endpoint
    WHEN:  a POST request is sent with JSON that has no "question" key
    THEN:  the response should be 400

    """
    response = client.post("/query", json={"not_question": "hello"})
    assert response.status_code == 400


def test_invalid_json_body_returns_400(client):
    """
    GIVEN: the /query endpoint
    WHEN:  a POST request is sent with a non-JSON body
    THEN:  the response should be 400 with "Invalid request body."
    """
    response = client.post(
        "/query",
        data="this is not json",
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.get_json()["response"] == "Invalid request body."


def test_no_body_at_all_returns_400(client):
    """
    GIVEN: the /query endpoint
    WHEN:  a POST request is sent with no body
    THEN:  the response should be 400
    """
    response = client.post("/query")
    assert response.status_code == 400


# ----------------------SUCCESSFUL QUERIES TESTS ------------------------------
@patch("app.client")
def test_valid_question_returns_200_with_response(mock_openai, client):
    """
    GIVEN: a working Azure OpenAI connection (mocked)
    WHEN:  a valid question is sent to /query
    THEN:  the response should be 200 with the AI's answer
    """
    mock_completion = MagicMock()
    mock_completion.choices = [
        MagicMock(message=MagicMock(content="Paris is the capital of France."))
    ]
    mock_openai.chat.completions.create.return_value = mock_completion

    response = client.post(
        "/query", json={"question": "What is the capital of France?"}
    )

    assert response.status_code == 200
    assert response.get_json()["response"] == "Paris is the capital of France."


@patch("app.client")
def test_response_content_type_is_json(mock_openai, client):
    """
    GIVEN: a working Azure OpenAI connection (mocked)
    WHEN:  a valid question is sent to /query
    THEN:  the response Content-Type should be application/json
    """
    mock_completion = MagicMock()
    mock_completion.choices = [MagicMock(message=MagicMock(content="Test"))]
    mock_openai.chat.completions.create.return_value = mock_completion

    response = client.post("/query", json={"question": "Hello"})
    assert response.content_type == "application/json"


@patch("app.client")
def test_question_is_forwarded_to_azure_correctly(mock_openai, client):
    """
    GIVEN: a working Azure OpenAI connection (mocked)
    WHEN:  "Explain Python" is sent to /query
    THEN:  Azure should receive a system message + user message with
    "Explain Python"
    """
    mock_completion = MagicMock()
    mock_completion.choices = [MagicMock(message=MagicMock(content="Python is..."))]
    mock_openai.chat.completions.create.return_value = mock_completion

    client.post("/query", json={"question": "Explain Python"})

    call_args = mock_openai.chat.completions.create.call_args
    messages = call_args.kwargs["messages"]

    assert len(messages) == 2
    assert messages[0]["role"] == "system"
    assert messages[1]["role"] == "user"
    assert messages[1]["content"] == "Explain Python"


# --------------------- HTTP METHOD TESTS -------------------------------------


def test_get_request_returns_405(client):
    """
    GIVEN: the /query endpoint only accepts POST
    WHEN:  a GET request is sent
    THEN:  the response should be 405 Method Not Allowed
    """
    response = client.get("/query")
    assert response.status_code == 405


def test_put_request_returns_405(client):
    """
    GIVEN: the /query endpoint only accepts POST
    WHEN:  a PUT request is sent
    THEN:  the response should be 405 Method Not Allowed
    """
    response = client.put("/query", json={"question": "test"})
    assert response.status_code == 405


def test_delete_request_returns_405(client):
    """
    GIVEN: the /query endpoint only accepts POST
    WHEN:  a DELETE request is sent
    THEN:  the response should be 405 Method Not Allowed
    """
    response = client.delete("/query")
    assert response.status_code == 405
