import React from 'react';
import { BrainCircuit, Users, Target, Award, Globe, Code, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/shared/SEOHead';
import { useSEO } from '../hooks/useSEO';
import { PageHeader } from '../components/layout/PageHeader';

function About() {
  const { metadata } = useSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "About Us - AI Career Pro"}
        description={metadata?.description || "Learn about our mission to revolutionize career advancement with AI"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/about"
      />
      <PageHeader
        title="About AI Career Pro"
        description="Empowering careers through AI innovation"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <BrainCircuit className="h-16 w-16 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-400">×</span>
            <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16L16 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            At AI Career Pro, a venture of the crypto-ai-agent ecosystem, we're revolutionizing 
            the job search process through cutting-edge AI technology. As part of a fully automated, 
            AI Agent-powered company, we leverage advanced artificial intelligence to empower job 
            seekers with intelligent tools that enhance their career opportunities.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
            <div className="text-gray-600">Users Helped</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
            <div className="text-gray-600">AI Support</div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-First</h3>
              <p className="text-gray-600">
                As part of the crypto-ai-agent ecosystem, we embrace full AI automation in everything we do.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Users className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User-Focused</h3>
              <p className="text-gray-600">
                We put our users first, designing intuitive tools that make the job search process easier and more effective.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Target className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our AI technology to provide cutting-edge career advancement solutions.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Award className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every tool and feature we develop, ensuring the highest quality results.
              </p>
            </div>
          </div>
        </div>
        
        {/* AI Integration Section */}
        <div className="mb-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Part of the Crypto-AI-Agent Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Autonomous AI Operations</h3>
              <p className="text-indigo-100">
                AI Career Pro is a fully autonomous venture, where every aspect from marketing to 
                development is handled by advanced AI agents. This ensures consistent, high-quality 
                service delivery and continuous improvement of our platform.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Blockchain Integration</h3>
              <p className="text-indigo-100">
                Leveraging the power of blockchain technology through our parent company, 
                we ensure transparency, security, and decentralized governance in our operations.
              </p>
            </div>
          </div>
        </div>

        {/* AGENT Token Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">AGENT Token Integration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pay with AGENT Token</h3>
              <p className="text-gray-600 mb-6">
                Use AGENT tokens for all AI Career Pro services and enjoy exclusive benefits:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Special discounts on all services</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Priority access to new features</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Exclusive AI agent customization options</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainable Ecosystem</h3>
              <p className="text-gray-600 mb-6">
                The AGENT token powers a sustainable ecosystem through:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Revenue from AI microservices allocated to staking rewards</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Treasury management and strategic investments</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Community-driven initiatives and partnerships</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">About AGENT Token</h3>
            <p className="mb-6">
              AGENT token is a revolutionary multi-chain cryptocurrency that powers an ecosystem of AI-driven 
              services and applications. Unlike other AI-related tokens, our ecosystem features actual working 
              AI agents that provide real services, with multiple operational platforms working 24/7.
            </p>
            <a
              href="#" // TODO: Replace with actual Crypto-AI-Agent website URL
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More About AGENT Token
            </a>
          </div>
        </div>

        {/* Technology Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Code className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced AI</h3>
              <p className="text-gray-600">
                Powered by state-of-the-art language models and machine learning algorithms.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Globe className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Supporting job seekers across multiple languages and regions.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Sparkles className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Features</h3>
              <p className="text-gray-600">
                Intelligent tools that learn and adapt to provide personalized career guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { About }