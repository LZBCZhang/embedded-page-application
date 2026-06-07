import { http, HttpResponse } from 'msw';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const mockPreferences = {
  data: [
    {
      id: 'purpose-marketing',
      label: 'Marketing Communications',
      description: 'Receive personalised offers, promotions and news about our products.',
      status: 'CONFIRMED',
      version: 1,
      purposeType: 'marketing',
      communicationPreferences: [
        {
          id: 'pref-email-marketing',
          name: 'Email',
          type: 'email',
          options: [{ id: 'opt-email-marketing', type: 'newsletter', consented: true }],
        },
        {
          id: 'pref-sms-marketing',
          name: 'SMS',
          type: 'sms',
          options: [{ id: 'opt-sms-marketing', type: 'promotional', consented: false }],
        },
        {
          id: 'pref-push-marketing',
          name: 'Push Notification',
          type: 'push',
          options: [{ id: 'opt-push-marketing', type: 'promotional', consented: true }],
        },
      ],
      otherPreferences: [],
    },
    {
      id: 'purpose-product',
      label: 'Product Updates',
      description: 'Stay informed about new features, release notes and service changes.',
      status: 'CONFIRMED',
      version: 1,
      purposeType: 'product',
      communicationPreferences: [
        {
          id: 'pref-email-product',
          name: 'Email',
          type: 'email',
          options: [{ id: 'opt-email-product', type: 'product-update', consented: true }],
        },
        {
          id: 'pref-sms-product',
          name: 'SMS',
          type: 'sms',
          options: [{ id: 'opt-sms-product', type: 'product-update', consented: true }],
        },
      ],
      otherPreferences: [],
    },
    {
      id: 'purpose-research',
      label: 'Research & Surveys',
      description: 'Help us improve by participating in surveys and user research sessions.',
      status: 'WITHDRAWN',
      version: 1,
      purposeType: 'research',
      communicationPreferences: [
        {
          id: 'pref-email-research',
          name: 'Email',
          type: 'email',
          options: [{ id: 'opt-email-research', type: 'survey', consented: false }],
        },
        {
          id: 'pref-push-research',
          name: 'Push Notification',
          type: 'push',
          options: [{ id: 'opt-push-research', type: 'survey', consented: false }],
        },
      ],
      otherPreferences: [],
    },
  ],
};

export const handlers = [
  http.post(`${API_BASE}/api/consent/user-consents`, () => {
    return HttpResponse.json(mockPreferences, { status: 200 });
  }),

  http.post(`${API_BASE}/api/consent/update-user-consents`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];