import { Router } from 'express';
import axios from 'axios';

const router = Router();
const FIPE_BASE = 'https://parallelum.com.br/fipe/api/v1/carros';

router.get('/marcas', async (req, res) => {
  try {
    const { data } = await axios.get(`${FIPE_BASE}/marcas`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching marcas:', error);
    res.status(500).json({ error: 'Failed to fetch marcas' });
  }
});

router.get('/marcas/:marcaId/modelos', async (req, res) => {
  try {
    const { marcaId } = req.params;
    const { data } = await axios.get(`${FIPE_BASE}/marcas/${marcaId}/modelos`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching modelos:', error);
    res.status(500).json({ error: 'Failed to fetch modelos' });
  }
});

router.get('/marcas/:marcaId/modelos/:modeloId/anos', async (req, res) => {
  try {
    const { marcaId, modeloId } = req.params;
    const { data } = await axios.get(`${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching anos:', error);
    res.status(500).json({ error: 'Failed to fetch anos' });
  }
});

router.get('/marcas/:marcaId/modelos/:modeloId/anos/:anoId', async (req, res) => {
  try {
    const { marcaId, modeloId, anoId } = req.params;
    const { data } = await axios.get(`${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching preco:', error);
    res.status(500).json({ error: 'Failed to fetch preco' });
  }
});

export default router;
