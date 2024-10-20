'use client';

import * as React from 'react';

type TokenContext = {
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
};

const TokenContext = React.createContext<TokenContext>({
  token: '',
  setToken: () => null,
  removeToken: () => null,
});

export const useTokenContext = () => React.useContext(TokenContext);

export const TokenContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = React.useState('');

  const setTokenFn = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const removeTokenFn = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <TokenContext.Provider
      value={{ token, setToken: setTokenFn, removeToken: removeTokenFn }}
    >
      {children}
    </TokenContext.Provider>
  );
};
