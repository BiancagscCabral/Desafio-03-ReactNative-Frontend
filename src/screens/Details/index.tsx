import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // <--- Import Novo

import { Product } from '../../types';
import api from '../../services/api';
import { RootStackParamList } from '../../routes'; // <--- Import Novo

// Define o tipo da navegação para o TypeScript não reclamar
type DetailsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export function Details() {
  const route = useRoute();
  const navigation = useNavigation<DetailsScreenProp>(); // <--- Usando o tipo aqui
  const [loading, setLoading] = useState(false);

  const { product } = route.params as { product: Product };

  // Função para EXCLUIR
  function handleDelete() {
    Alert.alert(
      "Remover Produto",
      "Tem certeza que deseja apagar este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, apagar", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete(`/products/${product.id}`); 
              Alert.alert("Sucesso", "Produto removido!");
              navigation.goBack(); 
            } catch (error) {
              Alert.alert("Erro", "Não foi possível apagar o produto.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  }

  // Função para EDITAR (Agora funciona!)
  function handleEdit() {
    // Envia o produto atual para a tela de cadastro preencher os campos
    navigation.navigate('AddProduct', { productToEdit: product });
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        ) : null}
        
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>
            {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
          
          <Text style={styles.aboutTitle}>Sobre o produto</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {/* Botão de Editar */}
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        {/* Botão de Excluir */}
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDelete}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#FFF" />
          ) : (
             <Text style={styles.buttonText}>Excluir Produto</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 22,
    color: '#00B37E',
    fontWeight: 'bold',
    marginTop: 8,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#DC1637',
  },
  editButton: {
    backgroundColor: '#E1E1E6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  }
});