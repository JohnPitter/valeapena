import sgMail from '@sendgrid/mail';
import { db } from '../config/firebase.js';
import { Timestamp } from 'firebase-admin/firestore';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailData {
  para: string;
  tipo: 'carro_disponivel';
  dados: {
    marca: string;
    modelo: string;
    url: string;
  };
}

export async function queueEmail(data: EmailData): Promise<string> {
  const docRef = await db.collection('emails_queue').add({
    ...data,
    status: 'pendente',
    tentativas: 0,
    criadoEm: Timestamp.now(),
    enviadoEm: null,
  });
  return docRef.id;
}

export async function processEmailQueue(): Promise<void> {
  const snapshot = await db.collection('emails_queue')
    .where('status', '==', 'pendente')
    .where('tentativas', '<', 3)
    .limit(10)
    .get();

  console.log(`Processing ${snapshot.size} pending emails...`);

  for (const doc of snapshot.docs) {
    const email = doc.data();

    try {
      await sendEmail(email.para, email.tipo, email.dados);

      await doc.ref.update({
        status: 'enviado',
        enviadoEm: Timestamp.now(),
      });

      console.log(`Email sent to ${email.para}`);
    } catch (error) {
      console.error(`Error sending email to ${email.para}:`, error);

      const newTentativas = (email.tentativas || 0) + 1;
      await doc.ref.update({
        tentativas: newTentativas,
        status: newTentativas >= 3 ? 'erro' : 'pendente',
      });
    }
  }
}

async function sendEmail(
  to: string,
  tipo: string,
  dados: { marca: string; modelo: string; url: string }
): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`[DEV] Would send email to ${to}:`, dados);
    return;
  }

  const msg = {
    to,
    from: 'noreply@valeapena.com.br',
    subject: 'Seu carro está disponível no Vale a Pena!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Vale a Pena?</h1>
        <p>Olá!</p>
        <p>O <strong>${dados.marca} ${dados.modelo}</strong> que você solicitou já está disponível em nosso site.</p>
        <p>
          <a href="${dados.url}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Ver Carro
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
          Equipe Vale a Pena
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}
