import { AzureOpenAI } from 'openai';
const advisorCreateMessage = async (openAIKey, threadId, message) => {
  try {
    const openai = new AzureOpenAI({
      apiKey: openAIKey,
      apiVersion: '2024-12-01-preview',
      dangerouslyAllowBrowser: true,
      endpoint: 'https://aesirxopenai.openai.azure.com',
    });

    const response = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    return response;
  } catch (error) {
    console.error('error', error);
  }
};

const advisorGetMessage = async (openAIKey, threadId) => {
  try {
    const openai = new AzureOpenAI({
      apiKey: openAIKey,
      apiVersion: '2024-12-01-preview',
      dangerouslyAllowBrowser: true,
      endpoint: 'https://aesirxopenai.openai.azure.com',
    });

    const response = await openai.beta.threads.messages.list(threadId);
    return response?.data;
  } catch (error) {
    console.error('error', error);
  }
};

const advisorCreateThread = async (openAIKey) => {
  try {
    const openai = new AzureOpenAI({
      apiKey: openAIKey,
      apiVersion: '2024-12-01-preview',
      dangerouslyAllowBrowser: true,
      endpoint: 'https://aesirxopenai.openai.azure.com',
    });

    const response = await openai.beta.threads.create();
    return response;
  } catch (error) {
    console.error('error', error);
  }
};

const advisorMessageStatus = async (openAIKey, threadId, runId) => {
  try {
    const openai = new AzureOpenAI({
      apiKey: openAIKey,
      apiVersion: '2024-12-01-preview',
      dangerouslyAllowBrowser: true,
      endpoint: 'https://aesirxopenai.openai.azure.com',
    });
    const response = await openai.beta.threads.runs.retrieve(runId, { thread_id: threadId });
    return response;
  } catch (error) {
    console.error('error', error);
  }
};

const advisorRunMessage = async (openAIKey, assistantID, threadId) => {
  try {
    const openai = new AzureOpenAI({
      apiKey: openAIKey,
      apiVersion: '2024-12-01-preview',
      dangerouslyAllowBrowser: true,
      endpoint: 'https://aesirxopenai.openai.azure.com',
    });
    const response = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantID,
    });
    return response;
  } catch (error) {
    console.error('error', error);
  }
};

const advisorUpdateThread = async (openAIKey, threadId, vectorStore) => {
  try {
    const openai = new AzureOpenAI({
      apiKey: openAIKey,
      apiVersion: '2024-12-01-preview',
      dangerouslyAllowBrowser: true,
      endpoint: 'https://aesirxopenai.openai.azure.com',
    });
    const response = await openai.beta.threads.update(threadId, {
      tool_resources: { file_search: { vector_store_ids: [vectorStore?.data?.id] } },
    });
    return response;
  } catch (error) {
    console.error('error', error);
  }
};

export {
  advisorCreateMessage,
  advisorGetMessage,
  advisorCreateThread,
  advisorMessageStatus,
  advisorRunMessage,
  advisorUpdateThread,
};
