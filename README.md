# Nexo - Frontend (Mobile) 

Aplicação móvel desenvolvida em React Native (Expo) para a gestão inteligente de catálogo de produtos. Este projeto compõe a interface do sistema **Nexo**, focada em usabilidade, design moderno e integração eficiente com API REST.

> **🔗 Conectado ao Back-end:** [Acesse o Repositório da API aqui](https://github.com/BiancagscCabral/Desafio03-ReactNative-Backend)

## 🚀 Funcionalidades

* **Vitrine (Home):** Listagem de produtos em formato de grade (Grid) responsiva e visualmente agradável.
* **Detalhes do Produto:** Visualização completa das informações com opções de gestão.
* **Gestão Completa (CRUD):**
    * **Criar:** Cadastro simples de novos produtos.
    * **Ler:** Atualização em tempo real da lista via API.
    * **Editar:** Formulário inteligente que reaproveita dados existentes.
    * **Excluir:** Remoção segura com alertas de confirmação (compatível com Web e Mobile).
* **Identidade Visual:** Design moderno com paleta de cores personalizada (Verde `#00B37E` e Cinza `#F0F2F5`).

## 🛠️ Tecnologias Utilizadas

* **React Native** (Framework principal)
* **Expo** (Plataforma de desenvolvimento)
* **TypeScript** (Tipagem estática e segurança)
* **Axios** (Cliente HTTP para consumo da API)
* **React Navigation** (Navegação entre telas)

## 📦 Como rodar o projeto

### Pré-requisitos
* Node.js instalado.
* Aplicativo **Expo Go** instalado no celular (ou emulador Android/iOS configurado).
* **Importante:** O Back-end deve estar a rodar na mesma rede Wi-Fi para que o celular consiga conectar.

### Passo a passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/BiancagscCabral/Desafio-03-ReactNative-Frontend.git](https://github.com/BiancagscCabral/Desafio-03-ReactNative-Frontend.git)
    cd Desafio-03-ReactNative-Frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o IP da API:**
    * Abra o arquivo `src/services/api.ts`.
    * Descubra o endereço IP da sua máquina na rede local (No terminal: `ipconfig` no Windows ou `ifconfig` no Mac/Linux).
    * Substitua a `baseURL` pelo seu IP (ex: `http://192.168.1.15:3333`).

4.  **Execute o projeto:**
    ```bash
    npx expo start
    ```

5.  **Abra no celular:**
    * Leia o QR Code exibido no terminal usando a câmera ou o app Expo Go.

---
Desenvolvido por **Bianca Guimarães**
