'use client';

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

interface LayoutComponent extends React.FC<LayoutProps> {
  Header: React.FC<{ children: ReactNode }>;
  Main: React.FC<{ children: ReactNode }>;
  Footer: React.FC<{ children: ReactNode }>;
}

const LayoutRoot: React.FC<LayoutProps> = ({ children }) => {
  return <div className="relative bg-background flex flex-col">{children}</div>;
};

const LayoutHeader: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <header className="flex-shrink-0">{children}</header>;
};

const LayoutMain: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto h-[calc(100vh-112px)] my-16 p-4 space-y-4">
      {children}
    </main>
  );
};

const LayoutFooter: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <footer className="flex-shrink-0">{children}</footer>;
};

export const Layout = LayoutRoot as LayoutComponent;
Layout.Header = LayoutHeader;
Layout.Main = LayoutMain;
Layout.Footer = LayoutFooter;
