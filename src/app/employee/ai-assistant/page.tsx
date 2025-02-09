'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsSend, BsRobot, BsPerson, BsLightning, BsInfoCircle } from 'react-icons/bs';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  topic?: string;
}

const suggestedQuestions = [
  'What are the daily meal expense limits?',
  'How do I correct a rejected expense report?',
  'What receipts are required for travel expenses?',
  'How long does expense approval usually take?',
] as const;

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm your AI expense assistant. I can help you with:\n\n• Expense submission guidelines\n• Category-specific requirements\n• Spending limits\n• General submission process\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: data.answer,
        topic: data.topic,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try asking your question again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">AI Expense Assistant</h1>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Suggested Questions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Suggested Questions</h2>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'assistant'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {message.type === 'assistant' ? <BsRobot /> : <BsPerson />}
                    </div>
                    <div
                      className={`mx-2 px-4 py-2 rounded-lg ${
                        message.type === 'assistant'
                          ? 'bg-gray-50 text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      {message.topic && (
                        <div className={`text-xs mt-1 ${
                          message.type === 'assistant' ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          Topic: {message.topic}
                        </div>
                      )}
                      <div
                        className={`text-xs mt-1 ${
                          message.type === 'assistant' ? 'text-gray-500' : 'text-blue-100'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-gray-500 text-sm"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-2">
                  <BsRobot className="text-blue-600" />
                </div>
                <span>AI is typing</span>
                <span className="ml-2 animate-pulse">...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex items-center space-x-3"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about expense policies or get help with reports..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !inputMessage.trim() || isTyping
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                <BsSend />
              </button>
            </form>
          </div>
        </div>

        {/* Help Tips */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start">
            <BsInfoCircle className="text-blue-600 mt-1 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Pro Tips</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Ask specific questions about expense policies</li>
                <li>• Get help with rejected expense reports</li>
                <li>• Learn about required documentation</li>
                <li>• Understand expense limits and categories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 