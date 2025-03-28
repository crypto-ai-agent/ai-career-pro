import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../lib/constants';

export const handlers = [
  // Cover Letter API
  http.post(API_ENDPOINTS.COVER_LETTER, async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      output: `Generated cover letter for ${data.jobTitle} at ${data.company}`
    });
  }),

  // CV API
  http.post(API_ENDPOINTS.CV, async ({ request }) => {
    const formData = await request.formData();
    return HttpResponse.json({
      output: `Optimized CV for ${formData.get('targetRole')} in ${formData.get('industry')}`
    });
  }),

  // Email API
  http.post(API_ENDPOINTS.EMAIL, async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      output: `Generated ${data.emailType} email for ${data.company}`
    });
  }),
];