import React from 'react';
import { Card } from '../ui/Card';

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and AGENT tokens. Using AGENT tokens provides additional discounts.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required for the trial period.'
  },
  {
    question: 'What happens if I reach my usage limit?',
    answer: 'You\'ll receive a notification when approaching your limit. You can upgrade your plan or wait for the next billing cycle.'
  },
  {
    question: 'How do AGENT token discounts work?',
    answer: 'When paying with AGENT tokens, you receive a 20% discount on Pro plans and a 25% discount on Enterprise plans.'
  }
];

export function PricingFAQ() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">
        Frequently Asked Questions
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600">
              {faq.answer}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}