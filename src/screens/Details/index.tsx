import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Product } from '../../types';
import api from '../../services/api';
import { RootStackParamList } from '../../routes';

type DetailsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export function Details() {
  const route = useRoute();
  const navigation = useNavigation<DetailsScreenProp>();
  const isFocused = useIsFocused();

  const { product: initialProduct } = route.params as { product: Product };
  const [data, setData] = useState<Product>(initialProduct);
  const [loading, setLoading] = useState(false);

  async function loadProduct() {
    try {
      const response = await api.get(`/products/${initialProduct.id}`);
      setData(response.data);
    } catch (error) {
      console.log("Erro ao atualizar detalhes");
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadProduct();
    }
  }, [isFocused]);

  function handleDelete() {
    const confirmDelete = async () => {
      try {
        setLoading(true);
        await api.delete(`/products/${data.id}`); 
        if (Platform.OS === 'web') {
          alert("Sucesso: Produto removido!");
        } else {
          Alert.alert("Sucesso", "Produto removido!");
        }
        navigation.goBack(); 
      } catch (error) {
        alert("Erro ao apagar.");
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Tem certeza que deseja apagar este produto?")) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Remover Produto",
        "Tem certeza que deseja apagar este produto?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sim, apagar", style: "destructive", onPress: confirmDelete }
        ]
      );
    }
  }

  function handleEdit() {
    navigation.navigate('AddProduct', { productToEdit: data });
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header da Imagem */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: data.image || 'https://via.placeholder.com/300' }} 
            style={styles.image} 
            resizeMode="cover" 
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.price}>
              {Number(data.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
          
          <View style={styles.divider} />

          <Text style={styles.aboutTitle}>Descrição</Text>
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
             <ActivityIndicator color="#FFF" size="small" />
          ) : (
             <Text style={styles.buttonText}>Excluir</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Fundo geral
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 24,
  },
  headerContent: {
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    color: '#00B37E',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 26,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 56,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2', 
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  editButton: {
    backgroundColor: '#00B37E',
  },
  buttonText: {
    color: '#DC2626', // Texto vermelho escuro
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});