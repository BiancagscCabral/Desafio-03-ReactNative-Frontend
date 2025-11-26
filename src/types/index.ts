export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string; // Vamos usar URLs de imagens da internet por enquanto
}

export interface User {
  id: string;
  email: string;
  name: string;
}