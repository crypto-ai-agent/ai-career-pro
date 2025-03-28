import React from 'react';
import { FileText, Check, Target, BarChart, Sparkles, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/shared/SEOHead';
import { useSEO } from '../../hooks/useSEO';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { SERVICE_PLANS } from '../../lib/constants';

export function CVOptimizerService() {
  const plans = SERVICE_PLANS.cv_optimizer;

  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "CV Optimizer - AI Career Pro"}
        description={metadata?.description || "Transform your CV with AI-powered optimization and get more interviews"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/services/cv"
      />
      <PageHeader
        title="CV Optimizer"
        description="Transform your CV with AI-powered optimization"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Hero Section */}
        <div className="relative mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <Target className="h-5 w-5 mr-2" />
                85% Higher Interview Rate
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your CV, <br />
                <span className="text-indigo-600">Optimized by AI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Our AI analyzes your CV against thousands of successful applications to ensure it stands out to both recruiters and ATS systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools/cv"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Optimize My CV
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl opacity-10 blur-2xl" />
              <div className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-indigo-600 mr-2" />
                    <span className="font-medium text-gray-900">resume.pdf</span>
                  </div>
                  <span className="text-sm text-gray-500">Optimizing...</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="h-2 bg-gray-100 rounded">
                    <div className="h-2 bg-indigo-600 rounded w-3/4 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-8 bg-gray-50 rounded animate-pulse" />
                    <div className="h-8 bg-gray-50 rounded animate-pulse" />
                    <div className="h-8 bg-gray-50 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">ATS Score</span>
                  <span className="font-medium text-green-600">92%</span>
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
              title: 'ATS-Optimized Format',
              description: 'Our AI ensures your CV passes through Applicant Tracking Systems with optimized keywords and formatting that gets you noticed.',
              stat: '92% ATS Success Rate'
            },
            {
              icon: BarChart,
              title: 'Data-Driven Insights',
              description: 'Leverage insights from thousands of successful CVs in your industry to highlight what matters most to employers.',
              stat: '85% Interview Rate'
            },
            {
              icon: Sparkles,
              title: 'Smart Achievement Analysis',
              description: 'AI-powered analysis helps quantify your achievements and present them in the most impactful way possible.',
              stat: '3x More Responses'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <Icon className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-semibold text-indigo-600">
                  {feature.stat}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: 'Upload Your CV',
                  description: 'Upload your current CV in any format'
                },
                {
                  step: 2,
                  title: 'AI Analysis',
                  description: 'Our AI analyzes your CV against industry standards'
                },
                {
                  step: 3,
                  title: 'Optimization',
                  description: 'Get specific suggestions for improvement'
                },
                {
                  step: 4,
                  title: 'Download & Apply',
                  description: 'Get your optimized CV ready for applications'
                }
              ].map((step, index) => (
                <div key={index} className="relative bg-white rounded-lg p-6 text-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl opacity-10 blur-2xl" />
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative px-6 py-12 md:px-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Stand Out?
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                Join thousands of professionals who have improved their job search success with our CV optimizer.
                <br />
                <span className="text-yellow-300">Save up to 25% by paying with AGENT tokens!</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/tools/cv"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                >
                  Optimize My CV Now
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