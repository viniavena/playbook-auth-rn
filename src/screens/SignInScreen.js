import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';

import { useAuth } from '../context/auth';

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Entre com um endereço de e-mail válido')
      .required('Endereço de e-mail obrigatório'),
    password: yup
      .string()
      .min(6, ({ min }) => 'A senha deve ter no mínimo 6 caracteres')
      .required('Senha obrigatória'),
  });
  return (
    <View style={styles.background}>
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={styles.playbookTitle}>
          Playbook Autenticação React Native
        </Text>
        <Text style={styles.playbookSubTitle}>
          Entre com o usuário e senha:
        </Text>
        <Text style={styles.userAndPass}>joao@email.com</Text>
        <Text style={styles.userAndPass}>larica123</Text>
      </View>

      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={values => {
          console.log(values),
            signIn(values.email, values.password, setLoading);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          touched,
        }) => (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
            }}
          >
            <TextInput
              style={
                errors.email && touched.email
                  ? styles.errorInput
                  : styles.inputLogIn
              }
              placeholder="E-mail"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={
                errors.password && touched.password
                  ? styles.errorInput
                  : styles.inputLogIn
              }
              placeholder="Senha"
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />

            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={styles.containerSign}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              {loading ? (
                <ActivityIndicator size="small" color={'white'} />
              ) : (
                <Text style={styles.textSign}>ENTRAR</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f3833f',
  },
  playbookTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  playbookSubTitle: {
    fontSize: 20,
    paddingTop: 10,
  },
  userAndPass: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
  },
  inputLogIn: {
    width: 250,
    height: 50,
    backgroundColor: '#ffffff50',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  errorInput: {
    width: 250,
    height: 50,
    backgroundColor: '#ffffff50',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderColor: '#e33',
    color: '#e33',
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: '#e334',
  },
  errorText: {
    color: '#e33',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  containerSign: {
    borderRadius: 5,
    width: 250,
    height: 50,
    backgroundColor: '#ffffff50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
