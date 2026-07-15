require('dotenv').config();
const { sendGeminiAssistantMessage } = require('./src/controllers/geminiService');
(async () => {
  const city = {
    name: 'Manali',
    state: 'Himachal Pradesh',
    description: 'A test city for Gemini API validation.',
    history: 'Historical background.',
    culture: 'Local culture details.',
    bestTimeToVisit: 'October to March',
    localFood: ['Siddu', 'Thukpa'],
    languages: ['Hindi', 'English'],
    festivals: ['Winter Carnival'],
  };
  const conversation = [
    { role: 'user', content: 'Hello', timestamp: new Date() },
  ];
  try {
    const result = await sendGeminiAssistantMessage({
      model: 'gemini-2.5-flash',
      city,
      conversation,
      message: 'What are the best places to visit in Manali?'
    });
    console.log('success', result);
  } catch (err) {
    console.error('error name', err.name);
    console.error('error message', err.message);
    console.error('error stack', err.stack);
    console.error('error keys', Object.keys(err));
    console.error('error raw', err);
  }
})();
