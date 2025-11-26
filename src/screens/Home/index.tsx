import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // <--- useIsFocused é importante!
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MOCK_PRODUCTS } from '../../services/mockData';
import { Product } from '../../types';
import { RootStackParamList } from '../../routes';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export function Home() {
  const navigation = useNavigation<NavigationProps>();
  const isFocused = useIsFocused(); // <--- Hook para saber se a tela está focada
  
  // Estado local para forçar a lista a atualizar quando voltamos da tela de cadastro
  const [listData, setListData] = useState<Product[]>(MOCK_PRODUCTS);

  // Sempre que a tela ganhar foco (você voltar pra ela), atualiza a lista
  useEffect(() => {
    if (isFocused) {
      setListData([...MOCK_PRODUCTS]); // Cria uma cópia para o React perceber a mudança
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
      <FlatList
        data={listData} // Usamos o estado local agora
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Botão Flutuante (+) */}
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
    paddingBottom: 100, // Espaço extra para o botão não cobrir o último item
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
  // Estilos do Botão Flutuante
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
    marginTop: -2, // Ajuste visual pequeno
  }
});