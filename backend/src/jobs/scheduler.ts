import cron from 'node-cron';
import { processPendingSolicitacoes } from '../services/solicitacaoService.js';
import { processEmailQueue } from '../services/emailService.js';
import { db } from '../config/firebase.js';
import { Timestamp } from 'firebase-admin/firestore';

export function startScheduler(): void {
  const frequencyHours = parseInt(process.env.SCRAPING_FREQUENCY_HOURS || '12', 10);

  // Process solicitacoes - configurable frequency
  const cronExpression = `0 */${frequencyHours} * * *`;
  cron.schedule(cronExpression, async () => {
    console.log(`[${new Date().toISOString()}] Running solicitacoes job...`);
    try {
      await processPendingSolicitacoes();
      await updateLastExecution();
    } catch (error) {
      console.error('Error in solicitacoes job:', error);
    }
  });

  // Process email queue - every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Processing email queue...`);
    try {
      await processEmailQueue();
    } catch (error) {
      console.error('Error in email job:', error);
    }
  });

  console.log(`Scheduler started: solicitacoes every ${frequencyHours}h, emails every 5min`);
}

async function updateLastExecution(): Promise<void> {
  await db.collection('configuracoes').doc('scraping').set({
    ultimaExecucao: Timestamp.now(),
    frequenciaHoras: parseInt(process.env.SCRAPING_FREQUENCY_HOURS || '12', 10),
    ativo: true,
  }, { merge: true });
}
