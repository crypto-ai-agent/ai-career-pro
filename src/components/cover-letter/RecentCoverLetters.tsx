import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download, History } from 'lucide-react';

// Mock data - replace with actual data from your database
const recentLetters = [
  {
    id: 1,
    title: 'Software Engineer at Google',
    company: 'Google',
    date: '2024-03-15',
  },
  {
    id: 2,
    title: 'Product Manager at Apple',
    company: 'Apple',
    date: '2024-03-14',
  },
  {
    id: 3,
    title: 'Frontend Developer at Meta',
    company: 'Meta',
    date: '2024-03-13',
  },
];

export function RecentCoverLetters() {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Cover Letters</h2>
        <Link
          to="/history"
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          <History className="w-4 h-4 mr-1" />
          View All History
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentLetters.map((letter) => (
          <div
            key={letter.id}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{letter.title}</h3>
                <p className="text-sm text-gray-500">{letter.company}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  {new Date(letter.date).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {/* Add download logic */}}
                  className="w-full flex items-center justify-center px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}