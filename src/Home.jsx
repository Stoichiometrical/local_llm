import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function MasterLandingPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://hips.hearstapps.com/hmg-prod/images/most-beautiful-places-america-palouse-1557772467.jpg"
          alt="Scenic landscape background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-2">
            <span className="text-blue-400">Master</span>
          </h1>
          <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Main headline */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your Personal AI Assistant, <span className="text-blue-400">Locally Powered</span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Experience powerful AI conversations with complete privacy.
          No data leaves your device. No subscriptions needed.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">100% Private</h3>
            <p className="text-gray-300">All processing happens locally. Your conversations never leave your device.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">Lightning Fast</h3>
            <p className="text-gray-300">Get instant responses without internet latency or connection issues.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">Always Available</h3>
            <p className="text-gray-300">Chat anytime, anywhere - even without an internet connection.</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="group bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-4 px-10 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto"
          onClick={() => window.location.href = '/chat'}
        >
          Start Chatting
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-6 text-sm text-gray-400 text-center w-full">
        <p>Developed by David Gondo</p>
      </div>
    </div>
  );
}