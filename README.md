# POR FAVOR ME LEIA, ME LEIA POR FAVOR(pode ser só uma passada de olho)!!!

## VEJA TAMBEM O ARQUIVO backend.md PODE SER Q TE AJUDE

Guia para rodar o frontend do projeto localmente.

---

## Pré-requisitos

- **Node.js** 18 ou superior
- **npm** 9+ ou **Yarn** 1.22+
- **Expo Go** instalado no celular (iOS ou Android) — [expo.dev/go](https://expo.dev/go)
- Para rodar no browser: nenhum app adicional necessário

---

## Instalação

```bash
# 1. Entre na pasta do projeto
cd du-app

# 2. Instale as dependências
npm install
# ou
yarn install
```

> **Importante:** o projeto usa `legacy-peer-deps=true` no `.npmrc` para contornar conflitos de peer dependencies do React 19. Não remova esse arquivo.

---

## Rodando o projeto

### No celular (Expo Go) — recomendado

```bash
npm start
# ou
yarn start
```

Abre o Expo Dev Server. Escaneie o QR code com o app **Expo Go** no celular (Android) ou pela câmera (iOS).

### No browser (web)

```bash
npm run web
# ou
yarn web
# ou, após npm start, pressione W no terminal
```

Abre em `http://localhost:8081` no navegador padrão.

### No simulador iOS (requer Xcode)

```bash
npm run ios
```

### No emulador Android (requer Android Studio)

```bash
npm run android
```

---

## Estrutura do projeto

```
du-app/
├── app/                        # Telas (Expo Router — file-based routing)
│   ├── _layout.tsx             # Layout raiz + carregamento de fontes
│   ├── index.tsx               # Redirect inicial (auth ou tabs)
│   ├── (auth)/                 # Fluxo de cadastro (7 etapas)
│   │   ├── invite.tsx          # Step 1 — código de convite
│   │   ├── name.tsx            # Step 2 — nome completo
│   │   ├── nickname.tsx        # Step 3 — apelido
│   │   ├── contact.tsx         # Step 4 — celular e e-mail
│   │   ├── treatment.tsx       # Step 5 — tratamento (Sr/Sra)
│   │   ├── birthdate.tsx       # Step 6 — data de nascimento
│   │   └── password.tsx        # Step 7 — verificação e senha
│   ├── (profile)/              # Fluxo de configuração de perfil
│   │   ├── setup.tsx           # Cidade e instituição
│   │   ├── preferences.tsx     # Interesses e preferências
│   │   └── done.tsx            # Conclusão do perfil
│   ├── (tabs)/                 # Abas principais (após login)
│   │   ├── index.tsx           # Buscar motoristas
│   │   ├── chat.tsx            # Lista de conversas
│   │   ├── history.tsx         # Histórico de caronas
│   │   └── profile.tsx         # Perfil do usuário
│   ├── chat/
│   │   └── [id].tsx            # Chat individual
│   ├── offer/                  # Fluxo de oferta de carona (6 etapas)
│   │   ├── driver-data.tsx     # Step 1 — CNH
│   │   ├── car-data.tsx        # Step 2 — dados do carro
│   │   ├── color-picker.tsx    # Seletor de cor do carro
│   │   ├── route.tsx           # Step 3 — origem e destino
│   │   ├── dates.tsx           # Step 4 — datas disponíveis
│   │   ├── passengers.tsx      # Step 5 — número de vagas
│   │   └── price.tsx           # Step 6 — valor e publicação
│   └── ride/
│       ├── tracking.tsx        # Rastreamento da corrida em tempo real
│       └── finish.tsx          # Finalização + avaliação
│
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── AuthLayout.tsx      # Layout padrão com progress bar
│   │   ├── Avatar.tsx          # Foto de perfil com fallback de iniciais
│   │   ├── Badge.tsx           # Pill colorido (default/success/warning/error)
│   │   ├── Button.tsx          # Botão (primary/outline/ghost)
│   │   ├── DriverCard.tsx      # Card de motorista na listagem
│   │   ├── Input.tsx           # Campo de texto com label e erro
│   │   └── StarRating.tsx      # Avaliação em estrelas (★/☆)
│   ├── mocks/
│   │   └── data.ts             # Dados mockados + tipos TypeScript
│   ├── store/
│   │   ├── useAppStore.ts      # Estado global do usuário autenticado (Zustand)
│   │   ├── useAuthStore.ts     # Draft do cadastro (Zustand)
│   │   └── useOfferStore.ts    # Draft da oferta de carona (Zustand)
│   └── theme/
│       └── tokens.ts           # Design tokens (cores, tipografia, espaçamentos)
│
├── assets/                     # Imagens e ícones estáticos
├── app.json                    # Configuração Expo
├── package.json
├── tsconfig.json
├── .npmrc                      # legacy-peer-deps=true
├── SETUP.md                    # Este arquivo
└── BACKEND.md                  # Documentação para o backend
```

---

## Stack e principais dependências

| Pacote | Versão | Função |
|---|---|---|
| `expo` | ~54.0 | Base do projeto (managed workflow) |
| `expo-router` | ~6.0 | Roteamento baseado em arquivos |
| `react-native` | 0.81.5 | Framework mobile |
| `react` | 19.1.0 | UI library |
| `zustand` | ^5.0 | Gerenciamento de estado global |
| `react-native-safe-area-context` | ~5.6 | Área segura em iOS/Android |
| `react-native-screens` | ~4.16 | Otimização de navegação |
| `@expo/vector-icons` | ^15.1 | Ícones (Feather, AntDesign, etc.) |
| `expo-font` | ~14.0 | Carregamento de fontes customizadas |
| `@expo-google-fonts/plus-jakarta-sans` | ^0.4 | Fonte heading |
| `@expo-google-fonts/dm-sans` | ^0.4 | Fonte body |
| `react-native-web` | ^0.21 | Suporte ao browser |
| `typescript` | ~5.9 | Tipagem estática |

---

## Dados mockados

Todo o conteúdo do app é mockado em `src/mocks/data.ts`. Não há chamadas de API reais — o estado fica em memória via Zustand e é resetado ao recarregar o app.

**Usuário logado por padrão:**
- Nome: Maju Silva
- Instituição: USP
- Tratamento: Sra

Para testar o app como usuário não autenticado, altere `useAppStore.ts` e defina `isAuthenticated: false`.

---

## Tipagem

O projeto usa TypeScript com `strict: true`. Para verificar erros de tipo:

```bash
npx tsc --noEmit
```

---

## Observações importantes

- **`react-native-maps`** está listado no `package.json` mas **não é usado** — foi removido por incompatibilidade com o Expo Go (managed workflow). O mapa na tela de rastreamento é simulado com `Animated` e `View`.
- **`react-native-google-places-autocomplete`** também está instalado mas ainda não integrado nas telas de endereço.
- **`expo-location`** está instalado para uso futuro com geolocalização real.
- O app roda em **modo portrait** apenas (`orientation: portrait` no `app.json`).
- A **New Architecture** do React Native está habilitada (`newArchEnabled: true`).
