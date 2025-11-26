import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MOCK_PRODUCTS } from '../../services/mockData';

export function AddProduct() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  function handleSave() {
    if (!name || !price || !image) {
      Alert.alert('Erro', 'Preencha pelo menos nome, preço e imagem!');
      return;
    }

    // Cria um novo objeto de produto
    const newProduct = {
      id: String(new Date().getTime()), // Gera um ID único baseado no tempo
      name,
      price: parseFloat(price.replace(',', '.')), // Garante que vira número
      image,
      description
    };

    // ADICIONA NA LISTA MOCKADA (Gambiarra temporária até ter Back-end)
    MOCK_PRODUCTS.push(newProduct);

    Alert.alert('Sucesso', 'Produto cadastrado!');
    navigation.goBack(); // Volta para a Home
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

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});