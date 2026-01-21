import { Router } from 'express';
import { createSolicitacao } from '../services/solicitacaoService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { marca, modelo, codigoFipe, anos, email } = req.body;

    if (!marca || !modelo || !codigoFipe || !anos || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const id = await createSolicitacao({
      marca,
      modelo,
      codigoFipe,
      anos,
      email,
    });

    res.status(201).json({ id, message: 'Solicitacao created' });
  } catch (error) {
    console.error('Error creating solicitacao:', error);
    res.status(500).json({ error: 'Failed to create solicitacao' });
  }
});

export default router;
