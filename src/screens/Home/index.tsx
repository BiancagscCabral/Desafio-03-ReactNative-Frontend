import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import api from '../../services/api'; // <--- Importamos a API
import { Product } from '../../types';
import { RootStackParamList } from '../../routes';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export function Home() {
  const navigation = useNavigation<NavigationProps>();
  const isFocused = useIsFocused();
  
  const [listData, setListData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para buscar dados do Back-end
  async function loadProducts() {
    try {
      setLoading(true);
      const response = await api.get('/products'); // Chama a rota /products
      setListData(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos do servidor.');
    } finally {
      setLoading(false);
    }
  }

  // Busca sempre que a tela ganha foco
  useEffect(() => {
    if (isFocused) {
      loadProducts();
    }
  }, [isFocused]);

  function handleOpenDetails(item: Product) {
    navigation.navigate('Details', { product: item });
  }

  function handleAddProduct() {
    navigation.navigate('AddProduct');
  }

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => handleOpenDetails(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00B37E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Pull to Refresh (arrastar pra baixo pra atualizar)
          onRefresh={loadProducts}
          refreshing={loading}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddProduct}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#00B37E',
    fontWeight: 'bold',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00B37E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: -2,
  }
});