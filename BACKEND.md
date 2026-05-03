# DU App — Documentação de Backend

> Referência para desenvolvimento da API em Python com base no frontend React Native + Expo Router.

---

## Visão geral

O DU é uma plataforma de caronas universitárias. Os principais fluxos são:

1. **Cadastro** — 7 etapas coletando dados do usuário
2. **Perfil** — cidade, instituição e preferências pessoais
3. **Buscar carona** — lista motoristas, filtra e solicita
4. **Oferecer carona** — 6 etapas publicando uma oferta
5. **Rastreamento** — acompanha a corrida em tempo real
6. **Avaliação** — após chegada, avalia o motorista
7. **Chat** — mensagens entre passageiro e motorista
8. **Histórico** — caronas realizadas como passageiro ou motorista

---

## Modelos de dados

### User
```python
class User:
    id: str
    nome: str
    apelido: str
    email: str
    celular: str                        # somente dígitos, 10-11 chars
    senha_hash: str
    data_nascimento: date               # validar idade mínima de 16 anos
    tratamento: str                     # 'Sr' | 'Sra' | 'Prefiro não falar'
    cidade: str
    instituicao: str
    foto: str                           # URL
    preferencias: list[str]             # ex: ['🎵 Música', '💻 Tecnologia']
    curiosidade: str | None
    musica: str | None                  # artista/música favorita
    nivel: str                          # 'Bronze' | 'Prata' | 'Ouro' (default: 'Bronze')
    criado_em: datetime
```

### Motorista (oferta de carona)
```python
class Oferta:
    id: str
    motorista_id: str                   # FK → User
    cnh: str
    carro_marca: str
    carro_modelo: str
    carro_cor: str
    origem: str
    destino: str
    datas: list[date]                   # máx 10 datas, nos próximos 30 dias
    vagas: int                          # 1–6
    valor: Decimal                      # > 0
    apenas_mulheres: bool               # derivado: motorista.tratamento == 'Sra'
    ativa: bool
    criado_em: datetime
```

### Carona (solicitação)
```python
class Carona:
    id: str
    oferta_id: str                      # FK → Oferta
    passageiro_id: str                  # FK → User
    data: date
    status: str                         # 'pendente' | 'confirmada' | 'em_andamento' | 'concluida' | 'cancelada'
    criado_em: datetime
```

### Avaliacao
```python
class Avaliacao:
    id: str
    carona_id: str                      # FK → Carona
    avaliador_id: str                   # FK → User
    avaliado_id: str                    # FK → User
    nota: int                           # 1–5
    comentario: str | None              # máx 200 chars
    criado_em: datetime
```

### Historico (view/derivado)
```python
class HistoricoItem:
    id: str
    tipo: str                           # 'passageiro' | 'motorista'
    outro_nome: str                     # nome do motorista ou passageiro
    destino: str
    valor: Decimal
    avaliacao: int                      # nota recebida nessa corrida
```

### Conversa
```python
class Conversa:
    id: str
    carona_id: str                      # FK → Carona
    usuario_a_id: str                   # FK → User
    usuario_b_id: str                   # FK → User
    ultima_mensagem: str
    ultima_mensagem_em: datetime
```

### Mensagem
```python
class Mensagem:
    id: str
    conversa_id: str                    # FK → Conversa
    remetente_id: str                   # FK → User
    texto: str                          # máx 500 chars
    enviado_em: datetime
```

---

## Endpoints

### Autenticação

#### `POST /auth/verificar-convite`
Valida o código de convite antes de iniciar o cadastro.

**Body:**
```json
{ "codigo": "DU-2024" }
```

**Response 200:**
```json
{ "valido": true }
```

---

#### `POST /auth/cadastro`
Cria o usuário após todas as etapas do formulário.

**Body:**
```json
{
  "nome": "Maju Silva",
  "apelido": "Maju",
  "celular": "11999999999",
  "email": "maju@usp.br",
  "tratamento": "Sra",
  "data_nascimento": "2000-05-15",
  "senha": "minhasenha123",
  "codigo_verificacao": "123456"
}
```

**Validações:**
- `celular`: 10–11 dígitos (somente números)
- `email`: formato válido
- `tratamento`: enum `['Sr', 'Sra', 'Prefiro não falar']`
- `data_nascimento`: idade mínima 16 anos
- `senha`: mínimo 6 caracteres
- `codigo_verificacao`: código enviado por SMS/email

**Response 201:**
```json
{
  "access_token": "...",
  "user": { "id": "...", "nome": "Maju Silva", ... }
}
```

---

#### `POST /auth/login`
```json
{ "email": "maju@usp.br", "senha": "minhasenha123" }
```

**Response 200:**
```json
{ "access_token": "...", "user": { ... } }
```

---

#### `POST /auth/enviar-codigo`
Envia código de verificação por SMS/email durante o cadastro.

```json
{ "celular": "11999999999", "email": "maju@usp.br" }
```

---

### Usuário

#### `GET /users/me`
Retorna dados completos do usuário autenticado.

**Response:**
```json
{
  "id": "u001",
  "nome": "Maju Silva",
  "apelido": "Maju",
  "cidade": "São Paulo",
  "instituicao": "USP",
  "foto": "https://...",
  "tratamento": "Sra",
  "preferencias": ["🎵 Música", "💻 Tecnologia"],
  "curiosidade": "Já morei em 4 cidades diferentes...",
  "musica": "Djavan",
  "nivel": "Bronze",
  "total_caronas": 12,
  "avaliacao_media": 4.9
}
```

---

#### `PATCH /users/me`
Atualiza perfil do usuário (cidade, instituição, foto, preferências).

**Body (todos opcionais):**
```json
{
  "cidade": "São Paulo",
  "instituicao": "USP",
  "foto": "https://...",
  "preferencias": ["🎵 Música"],
  "curiosidade": "...",
  "musica": "The Beatles"
}
```

---

### Ofertas (motorista)

#### `POST /ofertas`
Publica uma oferta de carona. Autenticação obrigatória.

**Body:**
```json
{
  "cnh": "12345678900",
  "carro_marca": "Fiat",
  "carro_modelo": "Argo",
  "carro_cor": "Prata",
  "origem": "Rua das Flores, 100 — Mooca",
  "destino": "USP Leste — Av. Aricanduva",
  "datas": ["2025-05-10", "2025-05-12", "2025-05-14"],
  "vagas": 3,
  "valor": "8.00"
}
```

**Validações:**
- `datas`: mínimo 1, máximo 10, dentro dos próximos 30 dias
- `vagas`: entre 1 e 6
- `valor`: maior que 0
- `apenas_mulheres`: calculado automaticamente se `motorista.tratamento == 'Sra'`

**Response 201:**
```json
{ "id": "oferta_001", "ativa": true, ... }
```

---

#### `GET /ofertas`
Lista ofertas disponíveis para o usuário buscar carona.

**Query params:**
```
?q=USP              # busca por nome do motorista ou destino (OR, case-insensitive)
?apenas_mulheres=true  # filtra ofertas de motoristas com tratamento='Sra'
                       # (só retornar esse filtro se user.tratamento == 'Sra')
```

**Response:**
```json
[
  {
    "id": "m001",
    "motorista": {
      "id": "u_carlos",
      "nome": "Carlos Silva",
      "foto": "https://...",
      "avaliacao_media": 4.8,
      "tratamento": "Sr",
      "verificado": true
    },
    "destino": "USP Leste",
    "valor": 8.00,
    "vagas_disponiveis": 2,
    "vagas_total": 3,
    "horario_saida": "07:45"
  }
]
```

---

#### `GET /ofertas/minhas`
Ofertas publicadas pelo usuário autenticado (histórico como motorista).

---

#### `DELETE /ofertas/{id}`
Cancela/desativa uma oferta.

---

### Caronas (passageiro)

#### `POST /caronas`
Solicita uma vaga em uma oferta.

```json
{
  "oferta_id": "m001",
  "data": "2025-05-10"
}
```

**Validação backend:**
- Se oferta tem `apenas_mulheres=true`, verificar que `passageiro.tratamento == 'Sra'`
- Verificar se há vagas disponíveis na data

---

#### `GET /caronas/ativa`
Retorna a carona atual em andamento (se houver), usada para popular a tela de tracking.

**Response:**
```json
{
  "id": "carona_001",
  "status": "em_andamento",
  "motorista": {
    "nome": "Carlos Silva",
    "foto": "https://...",
    "avaliacao_media": 4.8
  },
  "destino": "USP Leste",
  "valor": 8.00,
  "minutos_restantes": 9
}
```

---

#### `PATCH /caronas/{id}/status`
Atualiza status da carona (motorista ou sistema).

```json
{ "status": "concluida" }
```

---

### Avaliações

#### `POST /avaliacoes`
Envia avaliação após conclusão da carona.

```json
{
  "carona_id": "carona_001",
  "avaliado_id": "u_carlos",
  "nota": 5,
  "comentario": "Ótimo motorista, muito pontual!"
}
```

**Validações:**
- `nota`: inteiro entre 1 e 5
- `comentario`: máx 200 chars, opcional
- Uma avaliação por carona por usuário

---

### Histórico

#### `GET /historico`
Retorna histórico de caronas do usuário (como passageiro e motorista).

**Response:**
```json
[
  {
    "id": "h001",
    "tipo": "passageiro",
    "outro_nome": "Carlos Silva",
    "destino": "USP Leste",
    "valor": 8.00,
    "avaliacao": 5
  },
  {
    "id": "h002",
    "tipo": "motorista",
    "outro_nome": "Bia Ferreira",
    "destino": "FATEC SP",
    "valor": 6.50,
    "avaliacao": 4
  }
]
```

---

### Chat

#### `GET /conversas`
Lista todas as conversas do usuário autenticado.

**Response:**
```json
[
  {
    "id": "c001",
    "contato": {
      "nome": "Carlos Silva",
      "foto": "https://..."
    },
    "ultima_mensagem": "Estarei lá em 5 min!",
    "ultima_mensagem_em": "2025-05-03T08:32:00Z"
  }
]
```

---

#### `GET /conversas/{id}/mensagens`
Retorna todas as mensagens de uma conversa.

**Response:**
```json
[
  {
    "id": "msg001",
    "remetente_id": "u001",
    "texto": "Oi! Tudo bem?",
    "enviado_em": "2025-05-03T08:20:00Z",
    "minha": true
  }
]
```

---

#### `POST /conversas/{id}/mensagens`
Envia uma mensagem.

```json
{ "texto": "Pode me pegar às 8h?" }
```

**Validação:**
- `texto`: não vazio, máx 500 chars

**Response 201:**
```json
{
  "id": "msg_1234567890",
  "texto": "Pode me pegar às 8h?",
  "enviado_em": "2025-05-03T08:25:00Z",
  "minha": true
}
```

---

## Regras de negócio

### Filtro de tratamento (segurança de gênero)

- O campo `tratamento` é coletado no cadastro (`'Sr'`, `'Sra'`, `'Prefiro não falar'`)
- Ao publicar uma oferta, se `motorista.tratamento == 'Sra'`, a oferta recebe `apenas_mulheres = true` automaticamente
- Ao listar ofertas para um passageiro com `tratamento == 'Sra'`, o frontend pode enviar `?apenas_mulheres=true`
- O backend **deve validar** no `POST /caronas`: se a oferta tem `apenas_mulheres=true`, o passageiro deve ter `tratamento == 'Sra'`

### Cálculo de valor sugerido

```python
def sugerir_valor(vagas: int) -> Decimal:
    return Decimal(str(6 + vagas * 0.5))
```

### Nível do usuário

Atualmente mockado como `'Bronze'` para todos. A lógica futura pode usar o total de caronas:

```python
def calcular_nivel(total_caronas: int) -> str:
    if total_caronas >= 50:
        return 'Ouro'
    elif total_caronas >= 20:
        return 'Prata'
    return 'Bronze'
```

### Restrições de data na oferta

- Datas devem estar dentro dos próximos 30 dias a partir de hoje
- Máximo 10 datas por oferta
- Formato: `YYYY-MM-DD`

### Limite de vagas

- Mínimo: 1
- Máximo: 6

---

## Fluxos completos

### Cadastro (7 etapas no frontend)

```
1. Código de convite  → POST /auth/verificar-convite
2. Nome completo      → (acumulado no frontend)
3. Apelido            → (acumulado no frontend)
4. Celular + Email    → POST /auth/enviar-codigo
5. Tratamento         → (acumulado no frontend)
6. Data nascimento    → (acumulado no frontend)
7. Código + Senha     → POST /auth/cadastro  ← único POST de criação
```

### Oferecer carona (6 etapas)

```
1. CNH               → (acumulado)
2. Carro             → (acumulado)
3. Rota              → (acumulado)
4. Datas             → (acumulado)
5. Vagas             → (acumulado)
6. Valor             → POST /ofertas  ← único POST de publicação
```

### Solicitar → Rastrear → Avaliar

```
POST /caronas                      ← passageiro solicita
GET  /caronas/ativa                ← tracking em tempo real
PATCH /caronas/{id}/status         ← motorista marca como concluída
POST /avaliacoes                   ← passageiro avalia
```

---

## Autenticação

Usar **JWT Bearer Token** em todos os endpoints protegidos.

```
Authorization: Bearer <access_token>
```

Endpoints públicos (sem token):
- `POST /auth/verificar-convite`
- `POST /auth/enviar-codigo`
- `POST /auth/cadastro`
- `POST /auth/login`

---

## Stack sugerida (Python)

| Componente | Sugestão |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.x ou Tortoise ORM |
| Banco | PostgreSQL |
| Autenticação | python-jose (JWT) + passlib (bcrypt) |
| Validação | Pydantic v2 |
| Migrations | Alembic |
| WebSocket (chat) | FastAPI WebSocket ou Channels |
| Upload de foto | Cloudinary / S3 |

---

## Observações

- **Foto do usuário:** o frontend usa `https://i.pravatar.cc/150?u={email}` como fallback. O backend deve aceitar upload ou URL.
- **Horário de saída:** atualmente hardcoded como `"07:45"` no frontend. O backend deve incluir esse campo na oferta.
- **Vagas disponíveis:** o frontend exibe `"2 de 3"` hardcoded. O backend deve calcular `vagas_total - reservas_confirmadas`.
- **Verificação de CNH:** atualmente apenas valida não-vazio. O backend pode integrar com uma API de verificação real no futuro.
- **Código de convite:** atualmente qualquer código não-vazio passa. O backend deve gerenciar convites reais (tabela de convites, uso único).
- **Chat em tempo real:** o frontend usa lista estática. O backend deve implementar WebSocket ou polling para mensagens em tempo real.
- **Rastreamento:** o frontend usa posições mockadas animadas. O backend precisará de um sistema de geolocalização (ex: o motorista envia sua posição via WebSocket e o passageiro recebe).
