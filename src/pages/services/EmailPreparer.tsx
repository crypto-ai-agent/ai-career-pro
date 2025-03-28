import React from 'react';
import { Mail, Check, Sparkles, Target, Clock, ArrowRight, MessageSquare, Send, Zap, BarChart } from 'lucide-react';
import { SEOHead } from '../../components/shared/SEOHead';
import { useSEO } from '../../hooks/useSEO';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { SERVICE_PLANS } from '../../lib/constants';

export function EmailPreparerService() {
  const plans = SERVICE_PLANS.email_preparer;

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Email Preparer - AI Career Pro"}
        description={metadata?.description || "Craft professional emails for job applications and follow-ups"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/services/email"
      />
      <PageHeader
        title="Email Preparer"
        description="Craft professional emails that get responses"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Animated Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl opacity-50" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-blue-100">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700">
                  <Send className="h-5 w-5 mr-2" />
                  72% Response Rate
                </div>
                <div className="flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                  <Clock className="h-5 w-5 mr-2" />
                  2 Min Generation
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Professional Emails <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                  That Get Responses
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Our AI crafts compelling emails for every professional scenario, from job applications to follow-ups, ensuring you make the right impression.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools/email"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 transition-all"
                >
                  Write Professional Email
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
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl opacity-10 blur-2xl" />
              <div className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-teal-600 mr-2" />
                    <span className="font-medium text-gray-900">Email Preview</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Sparkles className="h-4 w-4 mr-1 text-teal-600" />
                    AI Writing...
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-teal-600">
                      <Target className="h-4 w-4 mr-1" />
                      <span>Perfect Match</span>
                    </div>
                    <span className="text-green-600 font-medium">95% Professional</span>
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
              icon: MessageSquare,
              title: 'Context-Aware Writing',
              description: 'Our AI understands the context and purpose of your email to craft the perfect message.',
              stat: '95% Professionalism Score'
            },
            {
              icon: Target,
              title: 'Perfect Tone Matching',
              description: 'Automatically adjusts the tone to match your recipient and purpose perfectly.',
              stat: '92% Tone Accuracy'
            },
            {
              icon: Zap,
              title: 'Smart Follow-ups',
              description: 'Get AI-powered suggestions for follow-up timing and content optimization.',
              stat: '3x Response Rate'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <Icon className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-semibold text-teal-600">
                  {feature.stat}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl p-12 mb-16 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real Results</h2>
            <p className="text-xl text-teal-100">Our users achieve remarkable success with AI-crafted emails</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">72%</div>
              <div className="text-teal-100">Response Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">89%</div>
              <div className="text-teal-100">Positive Feedback</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">2.5x</div>
              <div className="text-teal-100">Faster Responses</div>
            </div>
          </div>
        </div>

        {/* Email Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Perfect Emails for Every Situation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: 'Job Application',
                description: 'Stand out with compelling application emails'
              },
              {
                type: 'Interview Follow-up',
                description: 'Keep momentum after interviews'
              },
              {
                type: 'Networking',
                description: 'Build professional relationships'
              },
              {
                type: 'Thank You Notes',
                description: 'Show appreciation professionally'
              }
            ].map((emailType, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {emailType.type}
                </h3>
                <p className="text-gray-600">
                  {emailType.description}
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
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl opacity-10 blur-2xl" />
          <div className="relative bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative px-6 py-12 md:px-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Write Emails That Get Results?
              </h2>
              <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
                Join thousands of professionals who write effective emails with our AI assistant.
                <br />
                <span className="text-yellow-300">Save up to 25% by paying with AGENT tokens!</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/tools/email"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 transition-colors"
                >
                  Write Professional Email
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