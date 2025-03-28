import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/shared/SEOHead';
import { useSEO } from '../hooks/useSEO'; 
import { ServiceCard } from '../components/services/ServiceCard';
import { ServiceFeatures } from '../components/services/ServiceFeatures';
import { ServiceCTA } from '../components/services/ServiceCTA';
import { PageHeader } from '../components/layout/PageHeader';
import { FileText, Mail, MessageSquareText, UserRound, Check, Brain, Target, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export function Services() {
  const { metadata } = useSEO();

  const services = [
    {
      icon: FileText,
      name: "CV Optimizer",
      description: "Transform your CV with AI-powered optimization that gets you noticed by recruiters and ATS systems.",
      benefits: [
        "ATS-optimized formatting",
        "Industry-specific keyword optimization",
        "Achievement quantification",
        "Skills gap analysis"
      ],
      stats: {
        successRate: "85%",
        timesSaved: "3.5x",
        interviews: "+60%"
      }
    },
    {
      icon: MessageSquareText,
      name: "Cover Letter Generator",
      description: "Create compelling, personalized cover letters that showcase your unique value proposition.",
      benefits: [
        "Company research integration",
        "Role-specific customization",
        "Achievement highlighting",
        "Tone optimization"
      ],
      stats: {
        personalization: "100%",
        timesSaved: "4x",
        responses: "+75%"
      }
    },
    {
      icon: Mail,
      name: "Email Preparer",
      description: "Draft professional emails that get responses, from initial outreach to follow-ups.",
      benefits: [
        "Context-aware templates",
        "Professional tone adjustment",
        "Follow-up scheduling",
        "Response optimization"
      ],
      stats: {
        responseRate: "72%",
        timesSaved: "2.5x",
        engagement: "+45%"
      }
    },
    {
      icon: UserRound,
      name: "Interview Coach",
      description: "Practice with AI-powered mock interviews and get instant feedback to improve your performance.",
      benefits: [
        "Industry-specific questions",
        "Real-time feedback",
        "Body language tips",
        "Answer structure guidance"
      ],
      stats: {
        confidence: "+90%",
        preparation: "4.8/5",
        success: "+65%"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Our Services - AI Career Pro"}
        description={metadata?.description || "Explore our comprehensive suite of AI-powered career advancement tools"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/services"
      />

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900" />
          <div className="absolute inset-y-0 right-0 w-1/2">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0L100 0L50 100L0 100L0 0Z"
                fill="url(#gradient)"
                fillOpacity="0.1"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7E22CE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-800 text-indigo-200 mb-6">
                <Brain className="h-5 w-5 mr-2" />
                Powered by Crypto-AI-Agent Technology
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transform Your <br />
                Career Journey
              </h1>
              <p className="text-xl text-indigo-200 mb-8">
                Our comprehensive suite of AI tools works together to give you the competitive edge in your job search.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10"
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 grid grid-cols-2 gap-6">
                {[
                  { icon: FileText, label: 'CV Optimizer', color: 'bg-blue-500' },
                  { icon: MessageSquareText, label: 'Cover Letters', color: 'bg-purple-500' },
                  { icon: Mail, label: 'Email Preparer', color: 'bg-green-500' },
                  { icon: UserRound, label: 'Interview Coach', color: 'bg-red-500' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`${item.color} bg-opacity-20 backdrop-blur-lg rounded-xl p-6 transform hover:-translate-y-1 transition-transform`}
                    >
                      <Icon className="h-8 w-8 text-white mb-3" />
                      <p className="text-white font-medium">{item.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all hover:shadow-lg">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 ml-4">{service.name}</h2>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits:</h3>
                    <ul className="space-y-3">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(service.stats).map(([key, value], i) => (
                      <div key={i} className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-xl font-bold text-indigo-600">{value}</div>
                        <div className="text-sm text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      to={`/services/${service.name.toLowerCase().replace(' ', '-')}`}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Learn More
                    </Link>
                    <Link
                      to={`/tools/${service.name.toLowerCase().replace(' ', '-')}`}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Try Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integration Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Seamless Integration for Maximum Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Synergy</h3>
              <p className="text-gray-600">
                Our tools work together, sharing insights to create a cohesive job application strategy
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Targeted Approach</h3>
              <p className="text-gray-600">
                Each tool adapts to your specific industry and role requirements
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get professional-quality outputs in minutes, not hours
              </p>
            </div>
          </div>
        </div>

        {/* AGENT Token Benefits */}
        <div className="mt-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl text-white p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Save with AGENT Tokens</h2>
            <p className="text-xl text-indigo-100">
              Use AGENT tokens for payments and unlock exclusive benefits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Pro Plan Discount</h3>
              <p className="text-indigo-100">Save 20% on all Pro plans when paying with AGENT tokens</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise Savings</h3>
              <p className="text-indigo-100">Get 25% off Enterprise plans with AGENT token payments</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who have transformed their job search with our AI tools
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}