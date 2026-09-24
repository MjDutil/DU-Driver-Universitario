<p align="center">
  <img src="assets/DU.png" alt="Logo do DU" width="110" />
</p>

<h1 align="center">DU — Driver Universitário</h1>

<p align="center">
  <strong>Caronas entre universitários, de estudante para estudante.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white" alt="Expo 54" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black" alt="React Native 0.81" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Zustand-5-FF0381" alt="Zustand 5" />
</p>

---

## 💡 Sobre o projeto

Oi! Eu sou a Maju e o **DU** é um app que eu desenvolvi para um projeto de disciplina da faculdade.

A ideia veio de uma coisa que todo universitário conhece: chegar na faculdade é caro, demorado e, muitas vezes, inseguro. Enquanto isso, tem muita gente indo para o mesmo campus, no mesmo horário, com lugar sobrando no carro. O DU conecta essas pessoas: quem dirige oferece a carona, quem precisa encontra alguém **da própria instituição** para dividir o caminho e o custo.

Esta versão é o **frontend completo** do app, com todas as telas e fluxos funcionando sobre dados simulados. O backend ainda não existe; deixei a especificação dele pronta em [BACKEND.md](BACKEND.md).

## ✨ Funcionalidades

- 🎟️ **Cadastro em 7 etapas**: começa por um código de convite e segue com nome, apelido, contato, tratamento, data de nascimento e senha
- 🙋‍♀️ **Perfil**: cidade, instituição e interesses (música, tecnologia…) para quebrar o gelo na viagem
- 🔎 **Buscar carona**: lista de motoristas com avaliação, trajeto e preço
- 🚗 **Oferecer carona em 6 etapas**: CNH, dados e cor do carro, rota, datas, vagas e valor
- 📍 **Acompanhar a corrida**: tela de rastreamento com mapa animado
- ⭐ **Avaliação**: ao chegar, a passageira ou o passageiro avalia a pessoa que dirigiu
- 💬 **Chat** entre passageiros e motorista
- 🕓 **Histórico** de caronas, como passageira(o) ou como motorista

### 💗 Pensado para a segurança das mulheres

Usuárias que escolhem o tratamento **"Sra"** podem filtrar para ver **apenas motoristas mulheres**. Quando uma motorista publica uma oferta, a carona é sugerida de preferência para passageiras. Para mim essa foi uma das partes mais importantes do projeto.

## 🛠️ Tecnologias

| Tecnologia | Para que usei |
|---|---|
| **Expo 54** + **React Native 0.81** | Base do app mobile, rodando em iOS, Android e navegador |
| **Expo Router** | Navegação baseada em arquivos: cada arquivo em `app/` é uma tela |
| **TypeScript** (modo `strict`) | Tipagem de telas, estado e dados |
| **Zustand** | Estado global e rascunhos dos formulários de várias etapas |
| **Plus Jakarta Sans** + **DM Sans** | Tipografia (títulos e texto) |

## 🚀 Como rodar

**Pré-requisitos:** Node.js 18+ e npm. Para testar no celular, instale o app [Expo Go](https://expo.dev/go).

```bash
git clone https://github.com/MjDutil/DU-Driver-Universitario.git
cd DU-Driver-Universitario
npm install
```

E então escolha onde abrir:

```bash
npm run web      # no navegador → http://localhost:8081
npm start        # no celular: escaneie o QR code com o Expo Go
npm run ios      # simulador iOS (precisa do Xcode)
npm run android  # emulador Android (precisa do Android Studio)
```

> 📌 O arquivo `.npmrc` (`legacy-peer-deps=true`) é necessário para resolver conflitos de dependências do React 19. Não apague!

> 👀 O app abre com uma usuária já logada. Para ver o fluxo de cadastro desde o início, mude `isAuthenticated` para `false` em `src/store/useAppStore.ts`.

## 🗂️ Estrutura

```
app/                 # telas (Expo Router)
├── (auth)/          # cadastro em 7 etapas
├── (profile)/       # configuração do perfil
├── (tabs)/          # abas: buscar, chat, histórico, perfil
├── offer/           # oferecer carona em 6 etapas
├── ride/            # rastreamento e avaliação
└── chat/[id].tsx    # conversa individual
src/
├── components/      # botões, inputs, cards, avatar, splash animada…
├── store/           # estado global (Zustand)
├── mocks/           # dados simulados
└── theme/tokens.ts  # cores, tipografia e espaçamentos
```

## 📚 Decisões e aprendizados

- **Rotas como arquivos.** Com o Expo Router, a estrutura de pastas *é* a navegação, e os grupos `(auth)`, `(tabs)` e `(profile)` separam bem cada fluxo.
- **Formulários longos sem dor de cabeça.** Cadastro e oferta de carona têm várias etapas. Guardar o rascunho em stores do Zustand (`useAuthStore`, `useOfferStore`) deixou cada tela simples e independente.
- **Design tokens desde o começo.** Todas as cores, fontes e espaçamentos saem de `src/theme/tokens.ts`, o que manteve o visual consistente (e o rosa `#FF0381` em todo lugar 💗).
- **Adaptar quando a biblioteca não coopera.** O `react-native-maps` não funciona no Expo Go, então fiz a tela de rastreamento com um mapa simulado usando a API `Animated`.
- **Detalhes contam.** A tela de abertura animada foi feita só com `Animated`, sem nenhuma biblioteca extra.

## 🔭 Próximos passos

- [ ] Backend em Python seguindo a especificação em [BACKEND.md](BACKEND.md)
- [ ] Geolocalização real com `expo-location`
- [ ] Autocomplete de endereços com Google Places
- [ ] Notificações de carona confirmada e de mensagens novas

---

<p align="center">
  Feito com 💗 por <strong>Maria Julia Dutil</strong>
</p>
