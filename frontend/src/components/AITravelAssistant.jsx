import React, { useState, useEffect, useRef } from 'react';
import { recommendationAPI } from '../services/api';

const AITravelAssistant = ({ cityId, cityName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    '🗺️ What are the best places to visit?',
    '💎 Tell me about hidden gems',
    '📅 Can you suggest a 2-day itinerary?',
    '💰 How much budget should I plan?',
    '🍽️ What are the famous foods here?',
    '🛡️ Safety tips for travelers',
    '🌤️ What\'s the weather like?',
    '🚗 Nearby restaurants?',
  ];

  useEffect(() => {
    fetchChatHistory();
  }, [cityId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await recommendationAPI.getChatHistory(cityId);
      setMessages(response.data.conversation || []);
    } catch (err) {
      console.log('No previous chat found, starting fresh');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setLoading(true);
    setError(null);

    try {
      const response = await recommendationAPI.chatWithAssistant(userMessage, cityId);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.response, timestamp: new Date() },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get response');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">🤖 AI Travel Assistant</h2>
        <p className="text-gray-600">Ask anything about {cityName}. I'm here to help plan your perfect trip!</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-96">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-center">
                Start a conversation by asking about {cityName}!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-xs mt-2 block opacity-70">
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-3">
            <p className="text-sm text-red-600">⚠️ {error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about your trip..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="mt-8">
          <p className="text-center text-gray-600 mb-4 font-semibold">Try asking about:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => sendMessage(question)}
                className="bg-gradient-to-br from-indigo-50 to-blue-50 text-gray-700 px-4 py-3 rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition font-medium text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> I can help with travel planning, local recommendations, budgeting,
          weather, safety tips, and much more!
        </p>
      </div>
    </div>
  );
};

export default AITravelAssistant;
