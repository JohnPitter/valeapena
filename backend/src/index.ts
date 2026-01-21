import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './config/firebase';
import fipeRoutes from './routes/fipe';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/fipe', fipeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
