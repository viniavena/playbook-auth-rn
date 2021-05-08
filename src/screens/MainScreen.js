import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as Linking from 'expo-linking';

import { useAuth } from '../context/auth';

export default function MainScreen() {
  const { user, signOut } = useAuth();

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

  return (
    <View style={styles.background}>
      <Text style={styles.playbookTitle}>Bem vindo, {user.name}</Text>
      <View>
        <Text style={styles.playbookSubTitle}>
          Parabéns, você conseguiu fazer a autenticação do seu App.
        </Text>
        <Text style={styles.playbookSubTitle}>
          Se esse tutorial te ajudou deixa uma estrela no repositório abaixo!
          Obrigado!
        </Text>
      </View>
      <Text
        style={{ color: 'white', textDecorationLine: 'underline', width: 150 }}
        onPress={() =>
          Linking.openURL('https://github.com/viniavena/playbook-auth-rn')
        }
      >
        Repositório no github
      </Text>
      <TouchableOpacity style={styles.containerSign} onPress={handleSignOut}>
        <Text style={styles.textSign}>SAIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginVertical: 10,
    textAlign: 'left',
  },
  containerSign: {
    marginTop: 50,
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
