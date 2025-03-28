import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../../config/constants';

export const handlers = [
  // Auth handlers
  http.post('/auth/login', async () => {
    return HttpResponse.json({ token: 'mock-token' });
  }),
  
  // API handlers
  http.post(API_ENDPOINTS.COVER_LETTER, async () => {
    return HttpResponse.json({ 
      output: 'Generated cover letter content' 
    });
  }),
  
  // Add more handlers as needed
];