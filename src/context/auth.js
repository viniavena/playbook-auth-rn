import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    async function loadStorageData() {
      setSignInLoading(true);
      const [user, token] = await AsyncStorage.multiGet([
        '@app-playbook-auth:user',
        '@app-playbook-auth:token',
      ]);

      if (token[1] && user[1]) {
        setToken(token[1]);
        setUser(JSON.parse(user[1]));
      }
      setSignInLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async (userInfo, password, setLoading) => {
    setLoading(true);
    try {
      let data = {
        email: userInfo,
        password,
      };

      const response = await api.post('/login', data);
      const { token, User } = response.data;

      showMessage({
        message: 'Login efetuado com sucesso',
        description: `Parabéns, você conseguiu fazer a autenticação!`,
        type: 'success',
        icon: 'success',
        duration: 4000,
      });
      await AsyncStorage.multiSet([
        ['@app-catadores:token', token],
        ['@app-catadores:user', JSON.stringify(user)],
      ]);
      setUser(User);
      setToken(token);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data);
      showMessage({
        message: 'Erro ao entrar no aplicativo',
        description: 'Endereço de email ou senha incorretos',
        type: 'danger',
        icon: 'danger',
      });
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@app-playbook-auth:token',
      '@app-playbook-auth:user',
    ]);
    setToken('');
    setUser({});

    AsyncStorage.clear().then(() => {
      setUser(null);
    });

    showMessage({
      message: 'Logout efetuado com sucesso',
      description: 'Até logo!',
      type: 'success',
      icon: 'success',
      duration: 2000,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signOut, setUser, signInLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
