import React from 'react';
import { MessageSquareText, Check, Sparkles, Target, Clock, ArrowRight, Star, Zap } from 'lucide-react';
import { SEOHead } from '../../components/shared/SEOHead';
import { useSEO } from '../../hooks/useSEO';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { SERVICE_PLANS } from '../../lib/constants';

export function CoverLetterService() {
  const plans = SERVICE_PLANS.cover_letter;

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Cover Letter Generator - AI Career Pro"}
        description={metadata?.description || "Create compelling cover letters in minutes with our AI-powered generator"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/services/cover-letter"
      />
      <PageHeader
        title="Cover Letter Generator"
        description="Create compelling cover letters in minutes"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Split Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl opacity-50" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-indigo-100">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700">
                  <Star className="h-5 w-5 mr-2" />
                  75% Higher Response Rate
                </div>
                <div className="flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                  <Clock className="h-5 w-5 mr-2" />
                  5 Min Generation
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Craft the Perfect <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Cover Letter
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Our AI analyzes job descriptions and your experience to create compelling, personalized cover letters that showcase your unique value proposition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools/cover-letter"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Generate Cover Letter
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
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl opacity-10 blur-2xl" />
              <div className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <MessageSquareText className="h-6 w-6 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-900">Cover Letter Preview</span>
                  </div>
                  <span className="text-sm text-gray-500">Generating...</span>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-purple-600">
                      <Sparkles className="h-4 w-4 mr-1" />
                      <span>AI Optimized</span>
                    </div>
                    <span className="text-green-600 font-medium">98% Match</span>
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
              icon: Target,
              title: 'Perfect Job Matching',
              description: 'Our AI analyzes job descriptions to highlight your most relevant experiences and skills.',
              stat: '98% Match Rate'
            },
            {
              icon: Sparkles,
              title: 'Dynamic Personalization',
              description: 'Every cover letter is uniquely crafted to showcase your value to each specific employer.',
              stat: '100% Unique Content'
            },
            {
              icon: Clock,
              title: 'Time-Saving Magic',
              description: 'Generate professional, tailored cover letters in minutes instead of hours.',
              stat: '4x Faster'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <Icon className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-semibold text-purple-600">
                  {feature.stat}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-12 mb-16 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Proven Results</h2>
            <p className="text-xl text-purple-100">Our AI-powered cover letters get real results</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">75%</div>
              <div className="text-purple-100">Higher Response Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">92%</div>
              <div className="text-purple-100">Interview Success</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-purple-100">User Rating</div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Four Steps to the Perfect Cover Letter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Details',
                description: 'Provide job and company information'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes the job requirements'
              },
              {
                step: '03',
                title: 'Generation',
                description: 'Create a tailored cover letter'
              },
              {
                step: '04',
                title: 'Review & Send',
                description: 'Make final edits and apply'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                  <div className="inline-block text-2xl font-bold text-purple-600 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-purple-600" />
                  </div>
                )}
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl opacity-10 blur-2xl" />
          <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative px-6 py-12 md:px-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Make a Great First Impression?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                Join thousands of job seekers who have landed their dream jobs with our cover letters.
                <br />
                <span className="text-yellow-300">Save up to 25% by paying with AGENT tokens!</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/tools/cover-letter"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 transition-colors"
                >
                  Create My Cover Letter
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