import React, { createContext, useContext, useState } from 'react';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://placeimg.com/100/100/people',
};

const AuthContext = createContext({
  user: mockUser,
  updateUser: (data: Partial<typeof mockUser> & { currentPassword?: string; newPassword?: string }) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(mockUser);
  const updateUser = (data: Partial<typeof mockUser> & { currentPassword?: string; newPassword?: string }) => {
    // For mock purposes, simply merge the new data into the current user.
    setUser(prevUser => ({ ...prevUser, ...data }));
    console.log('Updated user data:', { ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
