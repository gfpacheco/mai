import { useMutation } from '@tanstack/react-query';

import { askQuestion, AskQuestionResponse } from '../lib/api';

export function useAskQuestion() {
  const { mutate, isLoading, error, data } = useMutation<
    AskQuestionResponse,
    Error,
    string
  >(askQuestion);

  return {
    askQuestion(question: string) {
      mutate(question);
    },
    isAskingQuestion: isLoading,
    askQuestionError: error,
    answer: data?.answer,
  };
}
