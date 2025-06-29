import React, { useEffect, useRef } from 'react';

interface AltairChartProps {
  spec: object | string;
  width?: number;
  height?: number;
  className?: string;
}

declare global {
  interface Window {
    vegaEmbed: any;
  }
}

export default function AltairChart({ spec, width, height, className }: AltairChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || typeof window === 'undefined' || !window.vegaEmbed) {
      // Vega-Embed not loaded yet, will retry in a moment
      if (typeof window !== 'undefined' && !window.vegaEmbed) {
        setTimeout(() => {
          if (window.vegaEmbed && chartRef.current) {
            // Force re-render by calling this effect again
            const event = new Event('vegaLoaded');
            window.dispatchEvent(event);
          }
        }, 100);
      }
      return;
    }

    let chartSpec: object;

    // Handle both JSON string and object specs
    if (typeof spec === 'string') {
      try {
        chartSpec = JSON.parse(spec);
      } catch (error) {
        console.error('Failed to parse Altair chart spec:', error);
        return;
      }
    } else {
      chartSpec = spec;
    }

    // Apply width and height with mobile responsiveness
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    chartSpec = {
      ...chartSpec,
      width: width || (isMobile ? Math.min(window.innerWidth - 40, 600) : 'container'),
      height: height || (chartSpec as any).height || (isMobile ? 250 : 300),
    };

    // Vega-Embed options
    const embedOptions = {
      actions: false, // Remove all action buttons
      theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
      scaleFactor: Math.max(window.devicePixelRatio || 2, 2), // Ensure at least 2x scaling
      renderer: 'svg' // Use SVG for crisp rendering instead of canvas
    };

    // Embed the chart
    window.vegaEmbed(chartRef.current, chartSpec, embedOptions)
      .catch((error: any) => {
        console.error('Failed to embed Altair chart:', error);
      });

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = '';
      }
    };
  }, [spec, width, height]);

  // Re-render when dark mode changes
  useEffect(() => {
    const handleThemeChange = () => {
      // Small delay to ensure the class change has been applied
      setTimeout(() => {
        if (chartRef.current && window.vegaEmbed) {
          const embedOptions = {
            actions: false, // Remove all action buttons
            theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
            scaleFactor: Math.max(window.devicePixelRatio || 2, 2), // Ensure at least 2x scaling
            renderer: 'svg' // Use SVG for crisp rendering instead of canvas
          };

          let chartSpec: object;
          if (typeof spec === 'string') {
            try {
              chartSpec = JSON.parse(spec);
            } catch (error) {
              return;
            }
          } else {
            chartSpec = spec;
          }

          // Apply width and height with mobile responsiveness
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          chartSpec = {
            ...chartSpec,
            width: width || (isMobile ? Math.min(window.innerWidth - 40, 600) : 'container'),
            height: height || (chartSpec as any).height || (isMobile ? 250 : 300),
          };

          window.vegaEmbed(chartRef.current, chartSpec, embedOptions);
        }
      }, 100);
    };

    // Listen for dark mode toggle
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => observer.disconnect();
  }, [spec, width, height]);

  return (
    <div 
      ref={chartRef} 
      className={className}
      style={{ 
        width: '100%', 
        minHeight: height || 300,
        margin: '20px 0',
        display: 'block',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    />
  );
}