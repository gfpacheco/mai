from typing import List
from services.openai import get_chat_completion
import os


def answer_question(question: str, contexts: List[str]) -> str:
    """
    Takes in a question and a list of contexts and returns an answer.
    """

    contexts_string = "\n".join(contexts)

    messages = [
        {
            "role": "system",
            "content": f"""
            Given the information below, answer the user's question:

            {contexts_string}
            """,
        },
        {"role": "user", "content": question},
    ]

    # NOTE: Azure Open AI requires deployment id
    # Read environment variable - if not set - not used
    completion = get_chat_completion(
        messages,
        "gpt-3.5-turbo",  # use "gpt-4" for better results
        os.environ.get("OPENAI_METADATA_EXTRACTIONMODEL_DEPLOYMENTID")
    )

    return completion
