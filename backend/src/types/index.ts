import { Timestamp } from 'firebase-admin/firestore';

export interface Carro {
  id?: string;
  marca: string;
  modelo: string;
  codigoFipe: string;
  anos: number[];
  specs: CarroSpecs;
  imagemUrl: string;
  fipe: FipeRange;
  buscas: number;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

export interface CarroSpecs {
  motor: string;
  combustivel: string;
  cambio: string;
  potencia: string;
}

export interface FipeRange {
  min: number;
  max: number;
}

export interface Peca {
  id?: string;
  nome: string;
  precoMin: number;
  precoMax: number;
  links: PecaLink[];
  atualizadoEm: Timestamp;
}

export interface PecaLink {
  site: 'mercadolivre' | 'olx' | 'icarros';
  url: string;
  preco: number;
}

export interface Solicitacao {
  id?: string;
  marca: string;
  modelo: string;
  codigoFipe: string;
  anos: number[];
  email: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  criadoEm: Timestamp;
  processadoEm: Timestamp | null;
  carroId: string | null;
}

export interface ScrapedPeca {
  nome: string;
  preco: number;
  url: string;
}
