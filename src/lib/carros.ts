import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  increment,
  updateDoc
} from 'firebase/firestore';
import { Carro, CarroComPecas, Peca } from '@/types';

export async function getCarrosPopulares(limitCount: number = 8): Promise<Carro[]> {
  const q = query(
    collection(db, 'carros'),
    orderBy('buscas', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Carro));
}

export async function searchCarros(searchTerm: string): Promise<Carro[]> {
  const carrosRef = collection(db, 'carros');
  const snapshot = await getDocs(carrosRef);

  const searchLower = searchTerm.toLowerCase();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Carro))
    .filter(carro =>
      carro.marca.toLowerCase().includes(searchLower) ||
      carro.modelo.toLowerCase().includes(searchLower) ||
      `${carro.marca} ${carro.modelo}`.toLowerCase().includes(searchLower)
    )
    .slice(0, 10);
}

export async function getCarroBySlug(marca: string, modelo: string): Promise<CarroComPecas | null> {
  const carrosRef = collection(db, 'carros');
  const snapshot = await getDocs(carrosRef);

  const carroDoc = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.marca.toLowerCase().replace(/[^a-z0-9]/g, '-') === marca &&
           data.modelo.toLowerCase().replace(/[^a-z0-9]/g, '-') === modelo;
  });

  if (!carroDoc) return null;

  const carro = { id: carroDoc.id, ...carroDoc.data() } as Carro;

  const pecasSnapshot = await getDocs(collection(db, 'carros', carroDoc.id, 'pecas'));
  const pecas = pecasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Peca));

  return { ...carro, pecas };
}

export async function incrementBuscas(carroId: string): Promise<void> {
  const carroRef = doc(db, 'carros', carroId);
  await updateDoc(carroRef, {
    buscas: increment(1)
  });
}
