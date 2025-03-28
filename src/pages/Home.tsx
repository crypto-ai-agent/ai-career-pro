import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/shared/SEOHead';
import { FileText, Mail, UserRound, MessageSquareText, Sparkles, Target, Clock, Shield, Bot, Brain, Zap, Lock, Coins, Check, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function Home() {
  const { metadata } = useSEO();

  return (
    <div className="flex flex-col">
      <SEOHead
        title={metadata?.title || "AI Career Pro - AI-Powered Career Tools"}
        description={metadata?.description || "Advance your career with AI-powered tools for CV optimization, cover letters, and interview preparation"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Brain className="h-16 w-16 text-indigo-200" />
              <span className="text-2xl font-bold text-gray-400">×</span>
              <Coins className="h-16 w-16 text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Elevate Your Career with Crypto-AI-Agent Tools
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Experience the future of job searching with AI-powered tools and exclusive AGENT token benefits
            </p>
            <p className="text-lg text-indigo-200 mb-8">
              Save up to 25% on all services by paying with AGENT tokens
            </p>
            <Link
              to="/signup"
              className="relative z-10 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:text-lg"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 z-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
      </section>

      {/* AGENT Token Benefits */}
      <section className="py-12 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AGENT Token Benefits</h2>
            <p className="text-xl text-indigo-200">Unlock exclusive discounts and features with AGENT tokens</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
              <Coins className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pro Plan Discount</h3>
              <p className="text-indigo-200">Save 20% on Pro plans when paying with AGENT tokens</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Savings</h3>
              <p className="text-indigo-200">Get 25% off Enterprise plans with AGENT token payments</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
              <Brain className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Early Access</h3>
              <p className="text-indigo-200">Priority access to new features and AI tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our AI-Powered Services
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to land your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* CV Optimizer */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CV Optimizer</h3>
              <p className="text-gray-600 mb-4">
                Upload your CV and let our AI optimize it for your target job position.
              </p>
              <Link
                to="/tools/cv"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full transition-colors"
              >
                Optimize CV
              </Link>
            </div>

            {/* Cover Letter Generator */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cover Letter Generator</h3>
              <p className="text-gray-600 mb-4">
                Create personalized cover letters tailored to your target job position.
              </p>
              <Link
                to="/tools/cover-letter"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary w-full transition-colors"
              >
                Generate Letter
              </Link>
            </div>

            {/* Email Preparer */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquareText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Preparer</h3>
              <p className="text-gray-600 mb-4">
                Draft professional emails for job applications and follow-ups.
              </p>
              <Link
                to="/tools/email"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary w-full transition-colors"
              >
                Prepare Email
              </Link>
            </div>

            {/* Interview Coach */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <UserRound className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Coach</h3>
              <p className="text-gray-600 mb-4">
                Practice interviews with AI and get instant feedback on your responses.
              </p>
              <Link
                to="/tools/interview"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary w-full transition-colors"
              >
                Start Practice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-xl text-gray-400">Revolutionary features powered by Crypto-AI-Agent technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 border border-indigo-500/20">
              <Bot className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Automated Job Search AI Agent</h3>
              <p className="text-gray-400 mb-4">
                Experience hassle-free job hunting with our AI agent that automatically:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Analyzes your CV and extracts key information
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Finds matching jobs with high success probability
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Automatically applies with personalized applications
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 border border-indigo-500/20">
              <Brain className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Smart CV-Job Matching</h3>
              <p className="text-gray-400 mb-4">
                Advanced AI analysis to ensure your CV perfectly matches job requirements:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Real-time CV analysis against job descriptions
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Detailed match scoring and recommendations
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Automated optimization suggestions
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 border border-indigo-500/20">
              <UserRound className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">AI Voice Interview Training</h3>
              <p className="text-gray-400 mb-4">
                Practice interviews with advanced voice-enabled AI:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Natural voice conversations with AI
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Real-time feedback on responses
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Voice analysis for confidence and clarity
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 border border-indigo-500/20">
              <Lock className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-4">B2B AI Application Processing</h3>
              <p className="text-gray-400 mb-4">
                Secure and efficient AI-powered application processing for businesses:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Vision AI for secure CV processing
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Protection against AI-manipulated applications
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                  Automated candidate screening and ranking
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Learn More CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-300 mb-4">
            Ready to discover how AI can revolutionize your job search?
          </h3>
          <Link
            to="/coming-soon"
            className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
          >
            Explore Future Features
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AI Career Pro?
            </h2>
            <p className="text-xl text-gray-600">
              Powered by advanced AI to give you the competitive edge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Advanced AI technology that understands your needs and industry requirements
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized</h3>
              <p className="text-gray-600">
                Tailored content that matches your unique skills and career goals
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                Generate professional content in minutes, not hours
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Join the Future of Career Advancement
            </h2>
            <p className="text-xl text-indigo-200 mb-2">
              Powered by Crypto-AI-Agent Technology
            </p>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of professionals leveraging AI and blockchain technology for career success
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:text-lg"
            >
              Start Your AI-Powered Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}