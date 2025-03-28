import React from 'react';
import { SEOHead } from '../components/shared/SEOHead';
import { useSEO } from '../hooks/useSEO';
import { Bot, Brain, UserRound, Lock, Check, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';

export function ComingSoon() {
  const { metadata } = useSEO();

  const features = [
    {
      icon: Bot,
      title: "Automated Job Search AI Agent",
      description: "Let our AI agents handle your entire job search process automatically. Simply provide your CV and job preferences, and our AI will find matching positions, create personalized applications, and submit them on your behalf.",
      benefits: [
        "Save countless hours on job searching",
        "Get matched with highly relevant positions",
        "Automated application process",
        "Higher success rate through AI-optimized applications"
      ],
      eta: "Q2 2024"
    },
    {
      icon: Brain,
      title: "Smart CV-Job Matching",
      description: "Advanced AI analysis ensures your CV perfectly aligns with job requirements, maximizing your chances of success.",
      benefits: [
        "Real-time CV analysis against job descriptions",
        "Detailed match scoring",
        "Specific improvement recommendations",
        "Industry-specific keyword optimization"
      ],
      eta: "Q2 2024"
    },
    {
      icon: UserRound,
      title: "AI Voice Interview Training",
      description: "Practice interviews through natural voice conversations with our AI, receiving real-time feedback on your responses and communication style.",
      benefits: [
        "Natural voice interaction with AI",
        "Instant feedback on responses",
        "Voice analysis for tone and confidence",
        "Industry-specific interview scenarios"
      ],
      eta: "Q3 2024"
    },
    {
      icon: Lock,
      title: "B2B AI Application Processing",
      description: "Revolutionary secure application processing system using Vision AI to protect against AI-manipulated applications while streamlining the hiring process.",
      benefits: [
        "Secure CV processing through Vision AI",
        "Protection against AI-manipulated applications",
        "Automated candidate screening",
        "Significant time and cost savings"
      ],
      eta: "Q3 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Coming Soon - AI Career Pro"}
        description={metadata?.description || "Discover our upcoming AI-powered features revolutionizing the job search process"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/coming-soon"
      />
      
      <PageHeader
        title="The Future of Job Search"
        description="Groundbreaking features powered by Crypto-AI-Agent technology"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-600 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Revolutionizing Career Advancement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our upcoming features leverage cutting-edge AI and blockchain technology to make job searching effortless and more successful than ever before.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Coming {feature.eta}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>

                <h4 className="font-medium text-gray-900 mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Early Access Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Want Early Access?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Join our waitlist to be among the first to experience these revolutionary features and receive exclusive AGENT token benefits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}