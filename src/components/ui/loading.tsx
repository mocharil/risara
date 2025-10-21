// src/components/ui/loading.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface LoadingProps {
  variant?: 'pulse' | 'shimmer' | 'bounce' | 'spin' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
}

export function Loading({
  variant = 'pulse',
  size = 'md',
  message = 'Loading...',
  fullScreen = true
}: LoadingProps) {

  const sizeClasses = {
    sm: 'w-24 h-12',
    md: 'w-40 h-20',
    lg: 'w-56 h-28',
    xl: 'w-72 h-36'
  };

  const renderLoading = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`relative ${sizeClasses[size]}`}>
              <div className="absolute inset-0 animate-ping opacity-75 bg-blue-400 rounded-lg blur-xl"></div>
              <Image
                src="/risara.png"
                alt="RISARA"
                width={288}
                height={144}
                className="relative z-10 animate-pulse"
                priority
              />
            </div>
            {message && (
              <p className="text-gray-600 text-lg font-medium animate-pulse">
                {message}
              </p>
            )}
          </div>
        );

      case 'shimmer':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
              <Image
                src="/risara.png"
                alt="RISARA"
                width={288}
                height={144}
                className="relative z-10"
                priority
              />
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            {message && (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-gray-600 text-lg font-medium">{message}</p>
              </div>
            )}
          </div>
        );

      case 'bounce':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`relative ${sizeClasses[size]}`}>
              <Image
                src="/risara.png"
                alt="RISARA"
                width={288}
                height={144}
                className="animate-bounce"
                priority
              />
            </div>
            {message && (
              <p className="text-gray-600 text-lg font-medium">{message}</p>
            )}
          </div>
        );

      case 'spin':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`relative ${sizeClasses[size]}`}>
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/risara.png"
                  alt="RISARA"
                  width={200}
                  height={100}
                  className="w-3/4 h-auto"
                  priority
                />
              </div>
            </div>
            {message && (
              <p className="text-gray-600 text-lg font-medium">{message}</p>
            )}
          </div>
        );

      case 'glow':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`relative ${sizeClasses[size]}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg blur-2xl opacity-75 animate-pulse"></div>
              <div className="relative bg-white rounded-lg p-4 shadow-2xl">
                <Image
                  src="/risara.png"
                  alt="RISARA"
                  width={288}
                  height={144}
                  className="relative z-10"
                  priority
                />
              </div>
            </div>
            {message && (
              <p className="text-gray-600 text-lg font-medium animate-pulse">
                {message}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const content = renderLoading();

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-8">
      {content}
    </div>
  );
}

// Loading dengan progress bar
interface LoadingWithProgressProps {
  progress?: number;
  message?: string;
}

export function LoadingWithProgress({
  progress = 0,
  message = 'Loading...'
}: LoadingWithProgressProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative w-56 h-28">
          <div className="absolute inset-0 animate-ping opacity-20 bg-blue-400 rounded-lg blur-xl"></div>
          <Image
            src="/risara.png"
            alt="RISARA"
            width={224}
            height={112}
            className="relative z-10"
            priority
          />
        </div>

        <div className="w-64 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">{message}</span>
            <span className="text-blue-600 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Spinner kecil untuk inline loading
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`}></div>
  );
}
