import { db } from '../config/firebase.js';
import { Timestamp } from 'firebase-admin/firestore';
import { Solicitacao } from '../types/index.js';
import { carroExistsByFipe } from './carroService.js';
import { queueEmail } from './emailService.js';

export async function createSolicitacao(
  data: Omit<Solicitacao, 'id' | 'status' | 'criadoEm' | 'processadoEm' | 'carroId'>
): Promise<string> {
  const solicitacao: Omit<Solicitacao, 'id'> = {
    ...data,
    status: 'pendente',
    criadoEm: Timestamp.now(),
    processadoEm: null,
    carroId: null,
  };

  const docRef = await db.collection('solicitacoes').add(solicitacao);
  return docRef.id;
}

export async function processPendingSolicitacoes(): Promise<void> {
  const snapshot = await db.collection('solicitacoes')
    .where('status', '==', 'pendente')
    .limit(10)
    .get();

  console.log(`Processing ${snapshot.size} pending solicitacoes...`);

  for (const doc of snapshot.docs) {
    const solicitacao = { id: doc.id, ...doc.data() } as Solicitacao;

    try {
      await doc.ref.update({ status: 'processando' });

      // Check if car already exists
      const carroId = await carroExistsByFipe(solicitacao.codigoFipe);

      if (!carroId) {
        // Create new car from FIPE
        // Note: We need marcaId and modeloId which we don't store
        // For now, mark as error - we'll enhance this
        console.log(`Need to create car for ${solicitacao.marca} ${solicitacao.modelo}`);
        // carroId = await createCarroFromFipe(marcaId, modeloId, anos);
      }

      if (carroId) {
        await doc.ref.update({
          status: 'concluido',
          processadoEm: Timestamp.now(),
          carroId,
        });

        // Queue email notification
        await queueEmail({
          para: solicitacao.email,
          tipo: 'carro_disponivel',
          dados: {
            marca: solicitacao.marca,
            modelo: solicitacao.modelo,
            url: `https://valeapena.com.br/carro/${slugify(solicitacao.marca)}/${slugify(solicitacao.modelo)}`,
          },
        });

        console.log(`Completed solicitacao ${doc.id}`);
      }
    } catch (error) {
      console.error(`Error processing solicitacao ${doc.id}:`, error);
      await doc.ref.update({ status: 'erro' });
    }
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
