import { Router } from 'express';
import { db } from '../config/firebase.js';
import { requireAdmin } from '../middleware/auth.js';
import { scrapePecasForCarro } from '../services/pecaService.js';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAdmin);

// Stats
router.get('/stats', async (req, res) => {
  try {
    const [carrosSnap, solicitacoesSnap, emailsSnap] = await Promise.all([
      db.collection('carros').count().get(),
      db.collection('solicitacoes').get(),
      db.collection('emails_queue').where('status', '==', 'pendente').count().get(),
    ]);

    const solicitacoes = solicitacoesSnap.docs;
    const pendentes = solicitacoes.filter(d => d.data().status === 'pendente').length;

    res.json({
      totalCarros: carrosSnap.data().count,
      totalSolicitacoes: solicitacoes.length,
      solicitacoesPendentes: pendentes,
      emailsNaFila: emailsSnap.data().count,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Carros
router.get('/carros', async (req, res) => {
  try {
    const snapshot = await db.collection('carros').orderBy('buscas', 'desc').get();
    const carros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ carros });
  } catch (error) {
    console.error('Error fetching carros:', error);
    res.status(500).json({ error: 'Failed to fetch carros' });
  }
});

router.get('/carros/:id', async (req, res) => {
  try {
    const doc = await db.collection('carros').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Carro not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching carro:', error);
    res.status(500).json({ error: 'Failed to fetch carro' });
  }
});

router.put('/carros/:id', async (req, res) => {
  try {
    const { imagemUrl, specs } = req.body;
    await db.collection('carros').doc(req.params.id).update({ imagemUrl, specs });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating carro:', error);
    res.status(500).json({ error: 'Failed to update carro' });
  }
});

router.delete('/carros/:id', async (req, res) => {
  try {
    await db.collection('carros').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting carro:', error);
    res.status(500).json({ error: 'Failed to delete carro' });
  }
});

router.post('/carros/:id/scrape', async (req, res) => {
  try {
    const doc = await db.collection('carros').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Carro not found' });
    }
    const carro = doc.data()!;

    // Run scraping in background
    scrapePecasForCarro(doc.id, carro.marca, carro.modelo).catch(console.error);

    res.json({ success: true, message: 'Scraping started' });
  } catch (error) {
    console.error('Error starting scrape:', error);
    res.status(500).json({ error: 'Failed to start scrape' });
  }
});

// Solicitacoes
router.get('/solicitacoes', async (req, res) => {
  try {
    const snapshot = await db.collection('solicitacoes').orderBy('criadoEm', 'desc').get();
    const solicitacoes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        criadoEm: data.criadoEm?.toDate?.()?.toISOString() || data.criadoEm,
      };
    });
    res.json({ solicitacoes });
  } catch (error) {
    console.error('Error fetching solicitacoes:', error);
    res.status(500).json({ error: 'Failed to fetch solicitacoes' });
  }
});

router.post('/solicitacoes/:id/process', async (req, res) => {
  try {
    await db.collection('solicitacoes').doc(req.params.id).update({ status: 'processando' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing solicitacao:', error);
    res.status(500).json({ error: 'Failed to process solicitacao' });
  }
});

// Emails
router.get('/emails', async (req, res) => {
  try {
    const snapshot = await db.collection('emails_queue').orderBy('criadoEm', 'desc').limit(100).get();
    const emails = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        criadoEm: data.criadoEm?.toDate?.()?.toISOString() || data.criadoEm,
      };
    });
    res.json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

router.post('/emails/:id/retry', async (req, res) => {
  try {
    await db.collection('emails_queue').doc(req.params.id).update({
      status: 'pendente',
      tentativas: 0,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error retrying email:', error);
    res.status(500).json({ error: 'Failed to retry email' });
  }
});

export default router;
