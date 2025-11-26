import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api'; // Importamos a API

export function AddProduct() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);  

  async function handleSave() {
    if (!name || !price || !image) {
      Alert.alert('Erro', 'Preencha pelo menos nome, preço e imagem!');
      return;
    }

    try {
      setLoading(true);

      // Envia os dados para o Back-end
      await api.post('/products', {
        name,
        price: parseFloat(price.replace(',', '.')), // Converte "10,50" para 10.50
        image,
        description
      });

      Alert.alert('Sucesso', 'Produto cadastrado!');
      navigation.goBack(); // Volta para a Home (que vai atualizar sozinha)

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Novo Produto</Text>

        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Tênis Nike"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: 299.90"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>URL da Imagem</Text>
        <TextInput 
          style={styles.input} 
          placeholder="https://..."
          autoCapitalize="none"
          value={image}
          onChangeText={setImage}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Detalhes do produto..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.5 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>CADASTRAR</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00B37E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    height: 56,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});