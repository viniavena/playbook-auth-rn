# Playbook Auth RN

# Introdução:

Esse documento visa ensinar o processo de autenticação em uma aplicação React Native. Para isso, vamos utilizar um aplicativo de exemplo dessa funcionalidade, o qual pode ser encontrado na conta da expo da Fluxo, chamado de playbook-auth-rn.

O código dessa aplicação pode ser encontrada no repositório linkado abaixo, contudo não é indicado a cópia desse, e sim o entendimento do seu funcionamento.

Link para o repositório do github: 

[viniavena/playbook-auth-rn](https://github.com/viniavena/playbook-auth-rn)

## Instalação das libs:

Inicialmente nós devemos instalar algumas libs que serão necessárias/sugeridas para o desenvolvimento dessa funcionalidade. São essas:

- axios:
    - cliente HTTP baseado em Promises para fazer requisições.

```bash
yarn add axios
```

- AsyncStorage (community packages):
    - storage assíncrono e persistente, utilizado para guardarmos o token do usuário já logado
    - utiliza-se o community package visto que o do próprio RN foi descontinuado

```bash
yarn add @react-native-async-storage/async-storage
```

- Flash Message (recomendado):
    - notificação interna customizável para darmos alguns retornos ao usuário

```bash
yarn add react-native-flash-message
```

- Formik e Yup (recomendado):
    - criação e validação de formulários

    ```bash
    yarn add formik
    yarn add yup 
    ```

- Navigation:

```bash
yarn add @react-navigation/native
yarn add @react-navigation/stack
```

- Alguns outros módulos (recomendados):

```bash
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

## Criação dos arquivos:

Nesse momento, devemos criar as pastas e arquivos utilizados para esse código.

![Playbook%20Auth%20RN%206dc43acec2aa457196fb105028cb3795/Captura_de_Tela_2021-05-08_as_14.46.28.png](Playbook%20Auth%20RN%206dc43acec2aa457196fb105028cb3795/Captura_de_Tela_2021-05-08_as_14.46.28.png)

---

# Desenvolvimento:

## Services: api.js

- Nesse arquivo criamos a função api, um cliente HTTP do axios para podermos realizar as requisições.
- Definimos o base url, uma constante para o link url do servidor que utilizaremos
- Realizamos uma função assíncrona para tentarmos acessar um token salvo no Async Storage
- Caso tenha, configuramos o Authorization do header do JWT com o token salvo

```jsx
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://ddd-conhecimento.herokuapp.com',
// Alterar esse valor para o url do deploy do back
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('@app-playbook-auth:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## Context: auth.js

- Nesse arquivo vamos criar o componte Provider com o Context API
- O Context API fornece uma maneira de passar os dados de componentes sem ter que passar manualmente em todos os níveis. Tá, mas o que isso quer dizer? Observe a imagem:

![Playbook%20Auth%20RN%206dc43acec2aa457196fb105028cb3795/Untitled.png](Playbook%20Auth%20RN%206dc43acec2aa457196fb105028cb3795/Untitled.png)

- Assim, podemos acessar alguns dados por todos os componentes filhos englobados por esse Provider, no nosso caso:
    - token
    - user e setUser: state que guarda as informações do usuário
    - signIn: função para logar
    - signOut: função para deslogar
    - signInLoading: state de carregamento do login

- Primeiramente devemos fazer algumas importações:

```jsx
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
```

- Criamos a função do Provider:

```jsx
export const AuthProvider = ({ children }) => {
...
}
```

- Definimos alguns estados:

```jsx
const [user, setUser] = useState({});
const [token, setToken] = useState('');
const [signInLoading, setSignInLoading] = useState(true);
```

- Criamos um UseEffect:
    - Fazemos multiGet no Async para termos acesso aos valores

```jsx
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
```

- Definimos a função de Log In:
    - Passamos um valor de true para o estado de loading
    - Recebe os dados inseridos pelo usuário no login e o set do estado de carregamento
    - Tentamos fazer a requisição com o post na rota definida pelo Back End
    - Exibição das notificações de sucesso ou erro
    - setUser e setToken com os valores recebidos como resposta da requisição
    - Envio desses valores (multiSet) para o  AsyncStorage
    - Após finalizada a função, definimos o loading como falso

```jsx
const signIn = useCallback(
    async (userInfo, password, setLoading) => {
      setLoading(true);
      try {
        let data = {
          email: userInfo,
          password,
        };

// Aqui devemos adaptar a requisição ao que está definido na documentação 
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
          ['@app-playbook-auth:token', token],
          ['@app-playbook-auth:user', JSON.stringify(User)],
						// Geralmente o back utiliza user minúsculo, conferir a doc
        ]);
        setUser(User); 
						// Geralmente o back utiliza user minúsculo, conferir a doc
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
      };
    },[]
  );
```

- Definimos a função de Log Out: pelo qual limpamos os valores de user e token no storage

```jsx
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
```

- Retornamos o Componente do Provider:

```jsx
return (
    <AuthContext.Provider
      value={{ token, user, signIn, signOut, setUser, signInLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
```

- Exportamos um Hook para acessarmos os valores e funções do auth

```jsx
export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
```

## Routes: main.routes.js

- Importamos as rotas internas e externas e o useAuth
- Acessamos os valores do token e do estado de loading do auth

```jsx
const { loading, token } = useAuth();
```

- Fazemos um condicional para verificarmos se está em carregamento

```jsx
if (loading) {
    return null;
  }
```

- Retornamos qual rota o app deve serguir a partir da condição de ter ou não um token

```jsx
return token ? <PrivateRoutes /> : <SocialRoutes />;
```

## Página de Log In:

- Importamos o useAuth e acessamos a função de sign in desse:

```jsx
const { signIn } = useAuth();
```

- Definimos um estado de loading local na página

```jsx
const [loading, setLoading] = useState(false);
```

- Fazemos um handle, para quando pressionado o botão de login e caso os dados tenham sido preenchidos corretamente, faça a chamada da função de login com esses valores

```jsx
signIn(email, password, setLoading);
```

- É interessante, também, avisarmos ao usuário que estamos realizando o login, para isso, utilizamos o valor do estado de loading como uma condição para utilizarmos o ActivityIndicator dentro do botão

```jsx
{loading ? (
                <ActivityIndicator size="small" color={'white'} />
              ) : (
                <Text style={styles.textSign}>ENTRAR</Text>
              )}
```

## Páginas internas em que é interessante acessarmos valores do usuário:

- Importamos o useAuth
- Acessamos o valor do user

```jsx
const { user } = useAuth();
```

## Página em que há o botão de deslogar:

- Importamos o useAuth
- Acessamos a função de deslogar

```jsx
const { signOut } = useAuth();
```

- Uma função de handle para exibirmos um alerta de confirmação do usuário para efetuarmos o signOut:

```jsx
const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Você deseja sair?',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            return null;
          },
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            signOut();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };
```

## App.js:

- Importamos o FlashMessage

```jsx
import FlashMessage from 'react-native-flash-message';
```

- Importamos o componente de AuthProvider do nosso context

```jsx
<AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainRoutes />

        <FlashMessage
          floating={true}
          style={{ alignItems: 'center' }}
          titleStyle={{ fontWeight: 'bold' }}
        />
	   </NavigationContainer>
</AuthProvider>
```
