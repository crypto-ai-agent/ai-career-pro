import React from 'react';
import { UserRound, Check, Sparkles, Target, Clock, ArrowRight, MessageSquare, Brain, Zap, BarChart, Mic, Video } from 'lucide-react';
import { SEOHead } from '../../components/shared/SEOHead';
import { useSEO } from '../../hooks/useSEO';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { SERVICE_PLANS } from '../../lib/constants';

export function InterviewCoachService() {
  const plans = SERVICE_PLANS.interview_coach;

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Interview Coach - AI Career Pro"}
        description={metadata?.description || "Practice interviews with AI feedback and improve your interview skills"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/services/interview"
      />
      <PageHeader
        title="Interview Coach"
        description="Practice and perfect your interview skills"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl opacity-50" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-orange-100">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700">
                  <Brain className="h-5 w-5 mr-2" />
                  AI-Powered Practice
                </div>
                <div className="flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700">
                  <Target className="h-5 w-5 mr-2" />
                  90% Success Rate
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Master Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                  Interview Skills
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Practice with our AI interview coach and get instant, personalized feedback to improve your performance and confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools/interview"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all"
                >
                  Start Practice Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl opacity-10 blur-2xl" />
              <div className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Video className="h-6 w-6 text-orange-600 mr-2" />
                    <span className="font-medium text-gray-900">Interview Session</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mic className="h-4 w-4 mr-1 text-red-500 animate-pulse" />
                    Recording...
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium mb-2">Question:</p>
                    <p className="text-gray-600">Tell me about a challenging project you've worked on.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-500">Analyzing response in real-time...</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-orange-600">Clarity</div>
                      <div className="text-gray-600">92%</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">Structure</div>
                      <div className="text-gray-600">88%</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">Impact</div>
                      <div className="text-gray-600">95%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Brain,
              title: 'AI-Powered Analysis',
              description: 'Advanced AI provides detailed feedback on your responses, body language, and communication style.',
              stat: '98% Accuracy Rate'
            },
            {
              icon: Target,
              title: 'Role-Specific Training',
              description: 'Practice with questions tailored to your industry, role, and experience level.',
              stat: '10,000+ Questions'
            },
            {
              icon: BarChart,
              title: 'Performance Tracking',
              description: 'Monitor your progress with detailed analytics and improvement suggestions.',
              stat: '45% Improvement'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <Icon className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-semibold text-orange-600">
                  {feature.stat}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-12 mb-16 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Interview Success Stories</h2>
            <p className="text-xl text-orange-100">See how our users ace their interviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">90%</div>
              <div className="text-orange-100">Success Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">45%</div>
              <div className="text-orange-100">Confidence Boost</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">2x</div>
              <div className="text-orange-100">Offer Rate</div>
            </div>
          </div>
        </div>

        {/* Interview Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Comprehensive Interview Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: 'Behavioral',
                description: 'Master STAR method responses'
              },
              {
                type: 'Technical',
                description: 'Practice role-specific skills'
              },
              {
                type: 'Leadership',
                description: 'Demonstrate management abilities'
              },
              {
                type: 'Situational',
                description: 'Handle challenging scenarios'
              }
            ].map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.type} Interviews
                </h3>
                <p className="text-gray-600">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(plans).map(([type, plan]) => (
            <div
              key={type}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.price === 0 ? "/signup" : "/pricing"}
                  className="block w-full text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {plan.price === 0 ? 'Get Started Free' : 'View Pricing'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl opacity-10 blur-2xl" />
          <div className="relative bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative px-6 py-12 md:px-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Ace Your Interviews?
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                Join thousands of professionals who have improved their interview skills with our AI coach.
                <br />
                <span className="text-yellow-300">Save up to 25% by paying with AGENT tokens!</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/tools/interview"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors"
                >
                  Start Practice Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-white border-2 border-white hover:bg-white/10 transition-colors"
                >
                  View Pricing Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}