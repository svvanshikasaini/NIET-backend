import React from 'react';

export const metadata = {
  title: 'NIET Pharmacy Backend API',
  description: 'API Server for NIET Pharmacy Website and Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

