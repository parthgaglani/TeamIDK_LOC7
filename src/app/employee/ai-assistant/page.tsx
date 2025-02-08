'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsSend, BsRobot, BsPerson, BsLightning, BsInfoCircle } from 'react-icons/bs';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
      content: "Hello! I'm your AI expense assistant. How can I help you today?",
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
    if (!content.trim()) return;

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'assistant',
        content: getAIResponse(content.trim()),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    // Simulate AI responses based on keywords
    if (question.toLowerCase().includes('meal')) {
      return 'The daily meal expense limit is $50 per person for business meals. For team events, please get pre-approval for groups larger than 5 people.';
    }
    if (question.toLowerCase().includes('reject')) {
      return 'To correct a rejected expense report:\n1. Go to the rejected report in your expense history\n2. Review the rejection comments\n3. Make the necessary corrections\n4. Resubmit with additional documentation if required';
    }
    if (question.toLowerCase().includes('receipt')) {
      return 'For travel expenses, you need to provide:\n- Flight/train tickets and boarding passes\n- Hotel bills\n- Transportation receipts (taxi, rental car)\n- Itemized receipts for meals over $25';
    }
    if (question.toLowerCase().includes('approval')) {
      return 'Expense reports are typically reviewed within 2-3 business days. Urgent requests can be flagged for priority processing.';
    }
    return 'I understand your question about expense policies. Could you please provide more specific details so I can give you the most accurate information?';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Expense Assistant</h1>
        <p className="text-gray-600">Get instant answers about expense policies and guidance</p>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Suggested Questions */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Suggested Questions</h2>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6">
          <div className="space-y-4">
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
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
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
                <BsRobot className="mr-2" />
                <span>AI is typing...</span>
                <span className="ml-2 animate-pulse">...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="flex items-center space-x-4"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about expense policies or get help with reports..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsSend />
            </button>
          </form>
        </div>
      </div>

      {/* Help Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <BsInfoCircle className="text-blue-600 mt-1 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Pro Tips</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• Ask specific questions about expense policies</li>
              <li>• Get help with rejected expense reports</li>
              <li>• Learn about required documentation</li>
              <li>• Understand expense limits and categories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 