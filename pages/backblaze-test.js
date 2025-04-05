import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getImageUrl, getB2Url } from '@/lib/backblaze';

export default function BackblazeTest() {
  const [testResults, setTestResults] = useState([]);
  const [customPath, setCustomPath] = useState('/images/featured.jpg');
  const [customUrl, setCustomUrl] = useState('');

  // Test paths to check
  const testPaths = [
    '/images/featured.jpg',
    '/images/photographs/rabat/1.jpg',
    '/images/photographs/rabat/cover.jpg',
    '/videos/films/16mm-project/clip1.mp4',
  ];

  useEffect(() => {
    // Run tests when component mounts
    const results = testPaths.map(path => {
      const url = getB2Url(path);
      return { path, url, exists: null };
    });
    
    setTestResults(results);
    
    // Check if URLs are accessible
    results.forEach((result, index) => {
      checkUrlExists(result.url).then(exists => {
        setTestResults(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], exists };
          return updated;
        });
      });
    });
  }, []);

  // Function to check if a URL exists
  const checkUrlExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking URL:', url, error);
      return false;
    }
  };

  // Handle custom path test
  const handleCustomTest = async () => {
    const url = getB2Url(customPath);
    setCustomUrl(url);
    const exists = await checkUrlExists(url);
    setTestResults(prev => [
      ...prev,
      { path: customPath, url, exists }
    ]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <Head>
        <title>Backblaze Integration Test</title>
      </Head>

      <h1>Backblaze Integration Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment</h2>
        <p><strong>B2_BUCKET_URL:</strong> {process.env.NEXT_PUBLIC_B2_BUCKET_URL || 'Not set'}</p>
        <p><strong>USE_LOCAL_MEDIA:</strong> {process.env.NEXT_PUBLIC_USE_LOCAL_MEDIA || 'Not set'}</p>
        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'Not set'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Test Custom Path</h2>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            type="text"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            style={{ flex: 1, padding: '8px', marginRight: '10px' }}
            placeholder="Enter path to test (e.g., /images/featured.jpg)"
          />
          <button 
            onClick={handleCustomTest}
            style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Test
          </button>
        </div>
        {customUrl && (
          <div>
            <p><strong>Generated URL:</strong> <a href={customUrl} target="_blank" rel="noopener noreferrer">{customUrl}</a></p>
          </div>
        )}
      </div>

      <h2>Test Results</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Path</th>
            <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Generated URL</th>
            <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Exists</th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((result, index) => (
            <tr key={index}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{result.path}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a>
              </td>
              <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                {result.exists === null ? (
                  'Checking...'
                ) : result.exists ? (
                  <span style={{ color: 'green' }}>✓</span>
                ) : (
                  <span style={{ color: 'red' }}>✗</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '30px' }}>
        <h2>Troubleshooting</h2>
        <ol>
          <li>Make sure your Backblaze B2 bucket exists and is publicly accessible</li>
          <li>Verify that the bucket name in your .env.local file is correct</li>
          <li>Ensure that files have been uploaded to Backblaze with the same path structure as your local public directory</li>
          <li>Check that CORS is properly configured on your Backblaze bucket if you're experiencing CORS errors</li>
        </ol>
      </div>
    </div>
  );
}
