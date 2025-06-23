import { useEffect } from 'react';
import AltairChart from './AltairChart';
import { createRoot } from 'react-dom/client';

export default function AltairRenderer() {
  useEffect(() => {
    // Find all altair chart placeholders and render them
    const renderCharts = () => {
      const charts = document.querySelectorAll('[data-altair="true"]');
      
      charts.forEach((chartElement) => {
        // Skip if already rendered
        if (chartElement.querySelector('.altair-rendered')) {
          return;
        }

        let spec: object | null = null;
        const specAttr = chartElement.getAttribute('data-altair-spec');
        const srcAttr = chartElement.getAttribute('data-altair-src');
        const widthAttr = chartElement.getAttribute('data-width');
        const heightAttr = chartElement.getAttribute('data-height');

        if (specAttr) {
          try {
            // Unescape the HTML entities
            const unescapedSpec = specAttr
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&#x26;quot;/g, '"')
              .replace(/&#x26;#x26;quot;/g, '"');
            
            spec = JSON.parse(unescapedSpec);
          } catch (error) {
            console.error('Failed to parse Altair spec:', error);
            console.error('Spec attribute was:', specAttr.substring(0, 200) + '...');
            return;
          }
        } else if (srcAttr) {
          // For now, we'll handle inline specs. External file loading can be added later
          console.warn('External Altair chart files not yet supported');
          return;
        }

        if (!spec) {
          console.error('No chart specification found');
          return;
        }

        // Create a container for the React component
        const container = document.createElement('div');
        container.className = 'altair-rendered';
        
        // Clear the placeholder content and append the container
        chartElement.innerHTML = '';
        chartElement.appendChild(container);

        // Render the AltairChart component
        const root = createRoot(container);
        root.render(
          <AltairChart 
            spec={spec}
            width={widthAttr ? parseInt(widthAttr) : undefined}
            height={heightAttr ? parseInt(heightAttr) : undefined}
          />
        );
      });
    };

    // Initial render
    renderCharts();

    // Re-render on content changes (useful for dynamic content)
    const observer = new MutationObserver((mutations) => {
      let shouldRender = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          if (addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node as Element).querySelector('[data-altair="true"]')
          )) {
            shouldRender = true;
          }
        }
      });
      
      if (shouldRender) {
        setTimeout(renderCharts, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything itself
}