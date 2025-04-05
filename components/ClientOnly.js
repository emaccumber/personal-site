import { useEffect, useState } from 'react';

export default function ClientOnly({ children, placeholder }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return placeholder || null;
  }

  return children;
}