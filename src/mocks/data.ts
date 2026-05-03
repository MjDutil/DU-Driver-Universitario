export type Tratamento = 'Sr' | 'Sra' | 'Prefiro não falar';

export type MockUser = {
  id: string;
  nome: string;
  apelido: string;
  cidade: string;
  instituicao: string;
  foto: string;
  preferencias?: string[];
  curiosidade?: string;
  musica?: string;
  tratamento?: Tratamento;
};

export type MockMotorista = {
  id: string;
  nome: string;
  foto: string;
  avaliacao: number;
  destino: string;
  valor: number;
  tratamento?: Tratamento;
};

export type MockHistoricoItem = {
  id: string;
  tipo: 'passageiro' | 'motorista';
  outro: string;
  destino: string;
  valor: number;
  avaliacao: number;
};

export type MockConversa = {
  id: string;
  nome: string;
  ultimaMensagem: string;
  horario: string;
  foto: string;
};

export const mockUser: MockUser = {
  id: 'u001',
  nome: 'Maju Silva',
  apelido: 'Maju',
  cidade: 'São Paulo',
  instituicao: 'USP',
  foto: 'https://i.pravatar.cc/150?img=47',
  tratamento: 'Sra',
};

export const mockMotoristas: MockMotorista[] = [
  {
    id: 'm001',
    nome: 'Carlos Silva',
    foto: 'https://i.pravatar.cc/150?img=12',
    avaliacao: 4.8,
    destino: 'USP Leste',
    valor: 8.0,
    tratamento: 'Sr',
  },
  {
    id: 'm002',
    nome: 'Ana Souza',
    foto: 'https://i.pravatar.cc/150?img=32',
    avaliacao: 3,
    destino: 'FATEC SP',
    valor: 6.5,
    tratamento: 'Sra',
  },
  {
    id: 'm003',
    nome: 'Pedro Alves',
    foto: 'https://i.pravatar.cc/150?img=8',
    avaliacao: 4,
    destino: 'USP Butantã',
    valor: 9.0,
    tratamento: 'Sr',
  },
  {
    id: 'm004',
    nome: 'Mariana Lima',
    foto: 'https://i.pravatar.cc/150?img=31',
    avaliacao: 5.0,
    destino: 'FFLCH — Cidade Universitária',
    valor: 7.5,
    tratamento: 'Sra',
  },
];

export const mockHistorico: MockHistoricoItem[] = [
  {
    id: 'h001',
    tipo: 'passageiro',
    outro: 'Carlos Silva',
    destino: 'USP Leste',
    valor: 8.0,
    avaliacao: 5,
  },
  {
    id: 'h002',
    tipo: 'motorista',
    outro: 'Bia Ferreira',
    destino: 'FATEC SP',
    valor: 6.5,
    avaliacao: 4,
  },
  {
    id: 'h003',
    tipo: 'passageiro',
    outro: 'Ana Souza',
    destino: 'USP Butantã',
    valor: 7.5,
    avaliacao: 5,
  },
];

export const mockConversas: MockConversa[] = [
  {
    id: 'c001',
    nome: 'Carlos Silva',
    ultimaMensagem: 'Estarei lá em 5 min!',
    horario: '08:32',
    foto: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'c002',
    nome: 'Ana Souza',
    ultimaMensagem: 'Combinado, te vejo lá.',
    horario: '07:15',
    foto: 'https://i.pravatar.cc/150?img=32',
  },
];

export const mockMensagens: { id: string; conversaId: string; texto: string; minha: boolean; horario: string }[] = [
  { id: 'msg001', conversaId: 'c001', texto: 'Oi! Tudo bem?', minha: true, horario: '08:20' },
  { id: 'msg002', conversaId: 'c001', texto: 'Tudo sim! Você vai hoje?', minha: false, horario: '08:22' },
  { id: 'msg003', conversaId: 'c001', texto: 'Sim! Pode me pegar às 8h?', minha: true, horario: '08:25' },
  { id: 'msg004', conversaId: 'c001', texto: 'Estarei lá em 5 min!', minha: false, horario: '08:32' },
];
