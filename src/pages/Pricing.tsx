import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SEOHead } from '../components/shared/SEOHead';
import { useSEO } from '../hooks/useSEO';
import { Check, Sparkles, Zap, Star, Package, Coins, Calculator, ArrowRight, FileText, Mail, MessageSquareText, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../services/payment';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ErrorAlert } from '../components/shared/ErrorAlert';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import type { ServiceConfig } from '../services/services';

export function Pricing() {
  const { metadata } = useSEO();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showAgentDiscounts, setShowAgentDiscounts] = useState(true);
  const { addToast } = useToast();

  const debouncedServices = useDebounce(services, 300);

  const handleCheckout = useCallback(async (plan: 'pro' | 'enterprise') => {
    if (!user) {
      addToast('error', 'Please sign in to subscribe');
      navigate('/login', { state: { from: location } });
      return;
    }

    setCheckoutLoading(true);
    try {
      const priceId = STRIPE_CONFIG.PRICES.PACKAGE[plan.toUpperCase()][billingCycle.toUpperCase()];
      await createCheckoutSession(user.id, priceId);
    } catch (error) {
      console.error('Checkout error:', error);
      addToast('error', 'Failed to start checkout process');
    } finally {
      setCheckoutLoading(false);
    }
  }, [user, billingCycle, addToast, navigate, location]);

  useEffect(() => {
    loadServices();

    // Subscribe to service changes
    const subscription = supabase
      .channel('service_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_configs'
        },
        () => {
          loadServices();
          addToast('info', 'Service configurations updated');
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatPrice = (price: number) => {
    return (Math.round(price * 100) / 100).toFixed(2);
  };

  const calculatePackagePrice = (services: ServiceConfig[], tier: 'pro' | 'enterprise') => {
    const monthlyPrice = services.reduce((total, service) => 
      total + service.pricing[tier].price, 0
    );
    const discount = tier === 'pro' ? 0.8 : 0.75; // 20% for pro, 25% for enterprise
    const finalPrice = monthlyPrice * discount;
    return billingCycle === 'yearly' 
      ? formatPrice(finalPrice * 0.9) // Additional 10% off for yearly
      : formatPrice(finalPrice);
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_configs')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load service information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={metadata?.title || "Package Deals - AI Career Pro"}
        description={metadata?.description || "Save up to 25% with our comprehensive AI career tool packages"}
        keywords={metadata?.keywords}
        ogTitle={metadata?.og_title}
        ogDescription={metadata?.og_description}
        ogImage={metadata?.og_image}
        canonicalUrl={metadata?.canonical_url}
        path="/package-deals"
      />
      <PageHeader
        title={
          <div className="flex items-center justify-center space-x-3">
            <Package className="h-10 w-10 text-yellow-500" />
            <span>AI Career Pro Packages</span>
          </div>
        }
        description="Bundle our AI tools and save up to 25%"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Value Proposition */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 mb-4">
            <Coins className="h-5 w-5 mr-2" />
            Save More with AGENT Tokens
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose How You Want to Save
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get individual services or bundle them together for maximum value
          </p>
        </div>

        {/* Package vs Individual Comparison */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Package className="h-8 w-8 text-yellow-600 mr-3" />
                <h3 className="text-xl font-semibold">Package Deals</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Save up to 25% compared to individual services</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Access all tools under one subscription</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Additional 10% off with yearly billing</span>
                </li>
              </ul>
              <div className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded-lg">
                Perfect for comprehensive job search campaigns
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Calculator className="h-8 w-8 text-yellow-600 mr-3" />
                <h3 className="text-xl font-semibold">Individual Services</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Pay only for what you need</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Flexible service-specific plans</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Upgrade or downgrade anytime</span>
                </li>
              </ul>
              <div className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded-lg">
                Great for focused, single-tool needs
              </div>
            </div>
          </div>
        </div>

        {/* Individual Services Overview */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Individual Service Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                name: 'CV Optimizer',
                price: 9.99,
                link: '/services/cv'
              },
              {
                icon: MessageSquareText,
                name: 'Cover Letter Generator',
                price: 7.99,
                link: '/services/cover-letter'
              },
              {
                icon: Mail,
                name: 'Email Preparer',
                price: 5.99,
                link: '/services/email'
              },
              {
                icon: UserRound,
                name: 'Interview Coach',
                price: 12.99,
                link: '/services/interview'
              }
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <Icon className="h-8 w-8 text-yellow-600 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    ${service.price}
                    <span className="text-sm text-gray-500 font-normal">/mo</span>
                  </p>
                  <Link
                    to={service.link}
                    className="inline-flex items-center text-yellow-600 hover:text-yellow-700"
                  >
                    View Plans
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        {/* AGENT Token Info */}
        {showAgentDiscounts && (
          <div className="mb-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative">
              <div className="flex items-center mb-4">
                <Coins className="h-8 w-8 mr-3" />
                <h3 className="text-2xl font-bold">AGENT Token Benefits</h3>
              </div>
            <p className="mb-4">
              Pay with AGENT tokens and unlock exclusive savings on all our services:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">20%</div>
                <p className="font-medium">Off Pro Plans</p>
                <p className="text-yellow-100 text-sm mt-2">Individual or Package</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">25%</div>
                <p className="font-medium">Off Enterprise Plans</p>
                <p className="text-yellow-100 text-sm mt-2">Our Best Value</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">10%</div>
                <p className="font-medium">Additional Savings</p>
                <p className="text-yellow-100 text-sm mt-2">With Annual Billing</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-yellow-100">
              <a href="#" className="underline">Learn more about AGENT tokens</a>
            </p>
            </div>
          </div>
        )}
        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded transition-colors',
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded transition-colors',
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              Yearly
            </button>
          </div>
          {billingCycle === 'yearly' && (
            <span className="ml-2 text-sm text-green-600">Save 10% with annual billing</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Package */}
          <Card>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Package</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {debouncedServices.map(service => (
                  <li key={service.id} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    {service.pricing.free.limits.monthly === -1 
                      ? `Unlimited ${service.name}`
                      : `${service.pricing.free.limits.monthly}x ${service.name}/month`}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </Card>

          {/* Pro Package */}
          <Card className="relative ring-2 ring-yellow-500 transform hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-bl-lg">
              Best Value
            </div>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro Package</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${calculatePackagePrice(debouncedServices, 'pro')}
                </span>
                <span className="text-gray-500">/month</span>
                <p className="text-sm text-green-600 mt-1">
                  Save {billingCycle === 'yearly' ? '30%' : '20%'} vs individual plans
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {debouncedServices.map(service => (
                  <li key={service.id} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    {service.pricing.pro.limits.monthly === -1 
                      ? `Unlimited ${service.name}`
                      : `${service.pricing.pro.limits.monthly}x ${service.name}/month`}
                  </li>
                ))}
                <li className="flex items-center text-gray-600 font-medium">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  Priority Support
                </li>
              </ul>
              <Button
                onClick={() => handleCheckout('pro')}
                isLoading={checkoutLoading}
                className="w-full"
              >
                Subscribe Now
              </Button>
            </div>
          </Card>

          {/* Enterprise Package */}
          <Card>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Package</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${calculatePackagePrice(debouncedServices, 'enterprise')}
                </span>
                <span className="text-gray-500">/month</span>
                <p className="text-sm text-green-600 mt-1">
                  Save {billingCycle === 'yearly' ? '35%' : '25%'} vs individual plans
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {debouncedServices.map(service => (
                  <li key={service.id} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Unlimited {service.name}
                  </li>
                ))}
                <li className="flex items-center text-gray-600 font-medium">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  Custom Branding
                </li>
                <li className="flex items-center text-gray-600 font-medium">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  API Access
                </li>
                <li className="flex items-center text-gray-600 font-medium">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  Dedicated Account Manager
                </li>
              </ul>
              <Button
                onClick={() => handleCheckout('enterprise')}
                isLoading={checkoutLoading}
                className="w-full"
              >
                Subscribe Now
              </Button>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and AGENT tokens. Save up to 25% by paying with AGENT tokens!"
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all paid plans come with a 14-day free trial. No credit card required."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. No questions asked."
              },
              {
                q: "What's the difference between packages and individual plans?",
                a: "Packages bundle all services together at a discount, while individual plans let you subscribe to specific tools you need."
              },
              {
                q: "How do AGENT token discounts work?",
                a: "Pay with AGENT tokens to get 20% off Pro plans and 25% off Enterprise plans, plus an additional 10% off for annual billing."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl opacity-10 blur-2xl" />
          <div className="relative bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative px-6 py-12 md:px-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Job Search?
              </h2>
              <p className="text-xl text-yellow-100 mb-8 max-w-3xl mx-auto">
                Get access to all our premium features and save up to 25% with our package deals.
                <br />
                <span className="text-white font-medium">Plus, save an additional 10% with annual billing!</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-yellow-600 bg-white hover:bg-yellow-50 transition-colors"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-white border-2 border-white hover:bg-white/10 transition-colors"
                >
                  Learn About AGENT Tokens
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}