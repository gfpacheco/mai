from services.openai import get_chat_completion
import json
import os


def extract_query_from_question(query: str) -> str:
    messages = [
        {
            "role": "system",
            "content": f"""
            Given a question from a user, try to extract the following metadata:
            - search_term: string

            Respond with a JSON containing the extracted metadata in key value pairs.
            """,
        },
        {"role": "user", "content": query},
    ]

    # NOTE: Azure Open AI requires deployment id
    # Read environment variable - if not set - not used
    completion = get_chat_completion(
        messages,
        "gpt-3.5-turbo",  # use "gpt-4" for better results
        os.environ.get("OPENAI_METADATA_EXTRACTIONMODEL_DEPLOYMENTID"),
        0,
    )

    try:
        response = json.loads(completion)
        return response["search_term"]
    except:
        return completion
