export interface Webhook {
  id: string;
  name: string;
  url: string;
  event: string;
  description: string;
  headers: Record<string, string>;
  active: boolean;
  last_triggered?: string;
  last_status?: 'success' | 'error';
}

export interface WebhookTestResult {
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: any;
  };
  response: {
    status: number;
    statusText: string;
    body: any;
  };
}