import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import api from '../../services/api';
import { Product } from '../../types';
import { RootStackParamList } from '../../routes';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

// 📐 Cálculo para o Grid responsivo
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const CARD_MARGIN = 8;
// (Largura da tela - margens laterais - espaço entre cards) / número de colunas
const CARD_WIDTH = (width - 32 - (CARD_MARGIN * 2)) / COLUMN_COUNT;

export function Home() {
  const navigation = useNavigation<NavigationProps>();
  const isFocused = useIsFocused();
  
  const [listData, setListData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setListData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
      activeOpacity={0.9}
      onPress={() => handleOpenDetails(item)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>
          {Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
          
          // --- MÁGICA DO GRID ---
          numColumns={COLUMN_COUNT}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          
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
    backgroundColor: '#F0F2F5', // Fundo cinza claro moderno
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between', // Espalha os cards
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    // Sombras suaves (Android + iOS)
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#EEE',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#00B37E', // Verde destaque
    fontWeight: 'bold',
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
    elevation: 6,
    shadowColor: '#00B37E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: -4,
  }
});