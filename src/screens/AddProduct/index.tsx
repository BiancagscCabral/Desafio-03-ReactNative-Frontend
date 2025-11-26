import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import api from '../../services/api';

type AddProductRouteProp = RouteProp<RootStackParamList, 'AddProduct'>;

export function AddProduct() {
  const navigation = useNavigation();
  const route = useRoute<AddProductRouteProp>();
  
  // Verifica se recebemos um produto para editar
  const productToEdit = route.params?.productToEdit;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Se for edição, preenche os campos assim que a tela abre
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(String(productToEdit.price));
      setImage(productToEdit.image || '');
      setDescription(productToEdit.description || '');
    }
  }, [productToEdit]);

  async function handleSave() {
    if (!name || !price) {
      Alert.alert('Erro', 'Preencha nome e preço!');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        name,
        price: parseFloat(price.replace(',', '.')),
        image,
        description
      };

      if (productToEdit) {
        // --- MODO EDIÇÃO (PUT) ---
        await api.put(`/products/${productToEdit.id}`, productData);
        Alert.alert('Sucesso', 'Produto atualizado!');
      } else {
        // --- MODO CADASTRO (POST) ---
        await api.post('/products', productData);
        Alert.alert('Sucesso', 'Produto cadastrado!');
      }

      navigation.goBack(); 
      // Dica: Se veio da tela de detalhes, talvez precise voltar duas vezes ou resetar a navegação, 
      // mas o goBack resolve o básico.

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {productToEdit ? 'Editar Produto' : 'Novo Produto'}
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput 
          style={styles.input} 
          value={name} onChangeText={setName} 
        />

        <Text style={styles.label}>Preço</Text>
        <TextInput 
          style={styles.input} 
          value={price} onChangeText={setPrice} 
          keyboardType="numeric"
        />

        <Text style={styles.label}>URL da Imagem</Text>
        <TextInput 
          style={styles.input} 
          value={image} onChangeText={setImage} 
          autoCapitalize="none"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={description} onChangeText={setDescription}
          multiline numberOfLines={4}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <Text style={styles.buttonText}>
              {productToEdit ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: '#FAFAFA' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#00B37E', padding: 16, borderRadius: 8, alignItems: 'center', height: 56, justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});