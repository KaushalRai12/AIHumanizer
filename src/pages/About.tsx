import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-8 text-center">About AI Humanizer</h1>
          
          <div className="space-y-8">
            <section className="bg-gray-800 rounded-lg p-6 animate-fade-in-up animation-delay-200">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-300">
                At AI Humanizer, we're dedicated to bridging the gap between artificial intelligence and human communication. 
                Our mission is to make AI-generated content more natural, engaging, and relatable while maintaining its 
                effectiveness and purpose.
              </p>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 animate-fade-in-up animation-delay-300">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <p className="text-gray-300 mb-4">
                Our advanced AI technology analyzes your text and applies sophisticated natural language processing 
                techniques to make it sound more human-like. We focus on:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Natural language patterns and flow</li>
                <li>Contextual understanding and adaptation</li>
                <li>Emotional intelligence and tone adjustment</li>
                <li>Cultural and linguistic nuances</li>
              </ul>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 animate-fade-in-up animation-delay-400">
              <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
              <p className="text-gray-300">
                Built on state-of-the-art machine learning models, our platform continuously learns and improves 
                from user interactions and feedback. We combine multiple AI techniques to ensure the highest 
                quality humanization of your content.
              </p>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 animate-fade-in-up animation-delay-500">
              <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
              <p className="text-gray-300">
                We take your privacy seriously. All text processing is done securely, and we never store your 
                content permanently. Your data is encrypted during transmission and processing.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 