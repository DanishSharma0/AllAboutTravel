const { GoogleGenerativeAI, GoogleGenerativeAIError, GoogleGenerativeAIFetchError } = require('@google/generative-ai');

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in the environment.');
  }
  return new GoogleGenerativeAI(apiKey);
};

const geminiClient = getGeminiClient();

const createAssistantPrompt = ({ city, conversation, message }) => {
  const cityDetails = [
    `City Information for ${city.name}, ${city.state}, India:`,
    city.description ? `Description: ${city.description}` : null,
    city.history ? `History: ${city.history}` : null,
    city.culture ? `Culture: ${city.culture}` : null,
    city.bestTimeToVisit ? `Best Time to Visit: ${city.bestTimeToVisit}` : null,
    city.localFood?.length ? `Local Food: ${city.localFood.join(', ')}` : null,
    city.languages?.length ? `Languages: ${city.languages.join(', ')}` : null,
    city.festivals?.length ? `Festivals: ${city.festivals.join(', ')}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const historyText = conversation
    .map((item) => `${item.role === 'assistant' ? 'Assistant' : 'User'}: ${item.content}`)
    .join('\n');

  return {
    systemInstruction: `You are a helpful travel assistant for ${city.name}, ${city.state}, India. Provide concise, accurate travel guidance and itinerary advice.`,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${cityDetails}\n\nConversation history:\n${historyText}\nUser: ${message}`,
          },
        ],
      },
    ],
  };
};

const sendGeminiAssistantMessage = async ({ model, city, conversation, message }) => {
  if (!geminiClient) {
    throw new Error('Gemini client not configured. Please set GEMINI_API_KEY.');
  }

  const assistantModel = model || process.env.AI_MODEL?.trim() || 'gemini-2.5-flash';
  const generativeModel = geminiClient.getGenerativeModel({ model: assistantModel });
  const prompt = createAssistantPrompt({ city, conversation, message });

  const result = await generativeModel.generateContent({
    systemInstruction: prompt.systemInstruction,
    contents: prompt.contents,
    generationConfig: {
      temperature: 0.7,
      candidateCount: 1,
      maxOutputTokens: 512,
    },
  });

  if (!result?.response?.candidates?.length) {
    throw new Error('Gemini returned no valid response candidates.');
  }

  const firstCandidate = result.response.candidates[0];
  const assistantText = firstCandidate?.content?.parts?.map((part) => part.text || '').join('') || '';

  return {
    assistantText: assistantText.trim() || 'I apologize, I could not process your request.',
    rawResponse: result.response,
  };
};

module.exports = {
  createAssistantPrompt,
  sendGeminiAssistantMessage,
};
