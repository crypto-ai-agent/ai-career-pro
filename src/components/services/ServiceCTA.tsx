import React from 'react';
import { Link } from 'react-router-dom';

export function ServiceCTA() {
  return (
    <div className="mt-16 bg-indigo-600 rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-12 md:px-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Accelerate Your Career?
        </h2>
        <p className="text-indigo-100 mb-8 max-w-3xl mx-auto">
          Get access to all our premium features and take your job search to the next level.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:text-lg"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
}