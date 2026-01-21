export interface Carro {
  id: string;
  marca: string;
  modelo: string;
  anos: number[];
  specs: CarroSpecs;
  imagemUrl: string;
  fipe: FipeRange;
  buscas: number;
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
  id: string;
  nome: string;
  precoMin: number;
  precoMax: number;
  links: PecaLink[];
  atualizadoEm: Date;
}

export interface PecaLink {
  site: 'mercadolivre' | 'autozone' | 'olx';
  url: string;
  preco: number;
}

export interface CarroComPecas extends Carro {
  pecas: Peca[];
}
