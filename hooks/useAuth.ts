import { useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
};

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  // Dummy effect to simulate a logged in user (replace with real auth logic)
  useEffect(() => {
    // Simulate user authentication after a delay
    const timer = setTimeout(() => {
      setUser({ id: '123', name: 'John Doe' });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return { user };
}
