'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        left: 20,
        bottom: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#374151',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '420px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            color: '#0c4a6e',
          },
          iconTheme: {
            primary: '#0ea5e9',
            secondary: '#f0f9ff',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: '#fef2f2',
            border: '1px solid #ef4444',
            color: '#991b1b',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
        },
        loading: {
          style: {
            background: '#f8fafc',
            border: '1px solid #64748b',
            color: '#334155',
          },
          iconTheme: {
            primary: '#64748b',
            secondary: '#f8fafc',
          },
        },
      }}
    />
  );
}