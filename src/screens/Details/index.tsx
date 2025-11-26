import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Product } from '../../types';
import api from '../../services/api';
import { RootStackParamList } from '../../routes';

type DetailsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export function Details() {
  const route = useRoute();
  const navigation = useNavigation<DetailsScreenProp>();
  const isFocused = useIsFocused(); // <--- IMPORTANTE: Saber se a tela está ativa

  // Recupera o produto inicial que veio da navegação
  const { product: initialProduct } = route.params as { product: Product };

  // Estado local para guardar os dados atualizados do produto
  const [data, setData] = useState<Product>(initialProduct);
  const [loading, setLoading] = useState(false);

  // --- 1. FUNÇÃO PARA RECARREGAR DADOS (Corrige o bug da edição) ---
  async function loadProduct() {
    try {
      // Chama o backend para pegar os dados mais recentes deste produto
      const response = await api.get(`/products/${initialProduct.id}`);
      setData(response.data);
      console.log("Detalhes atualizados com sucesso!");
    } catch (error) {
      console.log("Erro ao atualizar detalhes (talvez a rota GET /:id não exista no back?)");
    }
  }

  // Sempre que a tela ganhar foco, recarrega os dados
  useEffect(() => {
    if (isFocused) {
      loadProduct();
    }
  }, [isFocused]);

  // --- 2. FUNÇÃO PARA EXCLUIR COM LOGS (Para descobrir o erro) ---
  function handleDelete() {
    console.log("--- TENTATIVA DE EXCLUSÃO ---");
    console.log("ID do Produto:", data.id);

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
              console.log(`Enviando DELETE para: /products/${data.id}`);
              
              await api.delete(`/products/${data.id}`); 
              
              console.log("SUCESSO: Produto apagado!");
              Alert.alert("Sucesso", "Produto removido!");
              navigation.goBack(); 
            } catch (error: any) {
              console.log("ERRO AO APAGAR:", error);
              if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Dados:", error.response.data);
              }
              Alert.alert("Erro", "Não foi possível apagar. Veja o terminal.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  }

  // Função para EDITAR
  function handleEdit() {
    // Passamos o 'data' (estado atual), garantindo que enviamos a versão mais nova
    navigation.navigate('AddProduct', { productToEdit: data });
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {data.image ? (
            <Image source={{ uri: data.image }} style={styles.image} resizeMode="cover" />
        ) : null}
        
        <View style={styles.content}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.price}>
            {Number(data.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
          
          <Text style={styles.aboutTitle}>Sobre o produto</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300 },
  content: { padding: 24 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 22, color: '#00B37E', fontWeight: 'bold', marginTop: 8 },
  aboutTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 24, marginBottom: 8 },
  description: { fontSize: 16, color: '#666', lineHeight: 24 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1 },
  deleteButton: { backgroundColor: '#DC1637' },
  editButton: { backgroundColor: '#E1E1E6' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  editButtonText: { color: '#333', fontWeight: 'bold', fontSize: 14 }
});