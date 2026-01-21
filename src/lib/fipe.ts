const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

export interface FipeMarca {
  codigo: string;
  nome: string;
}

export interface FipeModelo {
  codigo: number;
  nome: string;
}

export interface FipeAno {
  codigo: string;
  nome: string;
}

export interface FipePreco {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
}

export async function getMarcas(): Promise<FipeMarca[]> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas`);
  return res.json();
}

export async function getModelos(marcaCodigo: string): Promise<{ modelos: FipeModelo[] }> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas/${marcaCodigo}/modelos`);
  return res.json();
}

export async function getAnos(marcaCodigo: string, modeloCodigo: number): Promise<FipeAno[]> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`);
  return res.json();
}

export async function getPreco(marcaCodigo: string, modeloCodigo: number, anoCodigo: string): Promise<FipePreco> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}`);
  return res.json();
}
