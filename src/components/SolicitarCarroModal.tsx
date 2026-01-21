'use client';

import { useState, useEffect } from 'react';

interface FipeMarca {
  codigo: string;
  nome: string;
}

interface FipeModelo {
  codigo: number;
  nome: string;
}

interface FipeAno {
  codigo: string;
  nome: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SolicitarCarroModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [marcas, setMarcas] = useState<FipeMarca[]>([]);
  const [modelos, setModelos] = useState<FipeModelo[]>([]);
  const [anos, setAnos] = useState<FipeAno[]>([]);

  const [selectedMarca, setSelectedMarca] = useState<FipeMarca | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<FipeModelo | null>(null);
  const [selectedAnos, setSelectedAnos] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && marcas.length === 0) {
      fetchMarcas();
    }
  }, [isOpen]);

  const fetchMarcas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/fipe/marcas`);
      const data = await res.json();
      setMarcas(data);
    } catch (error) {
      console.error('Error fetching marcas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModelos = async (marcaId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/fipe/marcas/${marcaId}/modelos`);
      const data = await res.json();
      setModelos(data.modelos || []);
    } catch (error) {
      console.error('Error fetching modelos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnos = async (marcaId: string, modeloId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/fipe/marcas/${marcaId}/modelos/${modeloId}/anos`);
      const data = await res.json();
      setAnos(data);
    } catch (error) {
      console.error('Error fetching anos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarcaSelect = (marca: FipeMarca) => {
    setSelectedMarca(marca);
    setSelectedModelo(null);
    setSelectedAnos([]);
    fetchModelos(marca.codigo);
    setStep(2);
  };

  const handleModeloSelect = (modelo: FipeModelo) => {
    setSelectedModelo(modelo);
    setSelectedAnos([]);
    if (selectedMarca) {
      fetchAnos(selectedMarca.codigo, modelo.codigo);
    }
    setStep(3);
  };

  const handleAnoToggle = (ano: string) => {
    setSelectedAnos(prev =>
      prev.includes(ano)
        ? prev.filter(a => a !== ano)
        : [...prev, ano]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMarca || !selectedModelo || selectedAnos.length === 0 || !email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/solicitacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: selectedMarca.nome,
          modelo: selectedModelo.nome,
          codigoFipe: `${selectedMarca.codigo}-${selectedModelo.codigo}`,
          anos: selectedAnos,
          email,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedMarca(null);
    setSelectedModelo(null);
    setSelectedAnos([]);
    setEmail('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {success ? 'Solicitacao Enviada!' : 'Solicitar Carro'}
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-white mb-2">Sua solicitacao foi registrada!</p>
              <p className="text-slate-400 text-sm">
                Voce recebera um email em <strong>{email}</strong> quando o carro estiver disponivel.
              </p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-slate-700'}`}
                  />
                ))}
              </div>

              {step === 1 && (
                <div>
                  <p className="text-slate-400 mb-4">Selecione a marca:</p>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {marcas.map(marca => (
                        <button
                          key={marca.codigo}
                          onClick={() => handleMarcaSelect(marca)}
                          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-white text-sm transition-colors"
                        >
                          {marca.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <button onClick={() => setStep(1)} className="text-blue-400 text-sm mb-4 hover:underline">
                    ← Voltar para marcas
                  </button>
                  <p className="text-slate-400 mb-4">
                    <strong className="text-white">{selectedMarca?.nome}</strong> - Selecione o modelo:
                  </p>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {modelos.map(modelo => (
                        <button
                          key={modelo.codigo}
                          onClick={() => handleModeloSelect(modelo)}
                          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-white text-sm transition-colors"
                        >
                          {modelo.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <button onClick={() => setStep(2)} className="text-blue-400 text-sm mb-4 hover:underline">
                    ← Voltar para modelos
                  </button>
                  <p className="text-slate-400 mb-4">
                    <strong className="text-white">{selectedMarca?.nome} {selectedModelo?.nome}</strong> - Selecione os anos:
                  </p>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {anos.map(ano => (
                        <button
                          key={ano.codigo}
                          onClick={() => handleAnoToggle(ano.codigo)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            selectedAnos.includes(ano.codigo)
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {ano.nome}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedAnos.length > 0 && (
                    <button
                      onClick={() => setStep(4)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Continuar
                    </button>
                  )}
                </div>
              )}

              {step === 4 && (
                <div>
                  <button onClick={() => setStep(3)} className="text-blue-400 text-sm mb-4 hover:underline">
                    ← Voltar para anos
                  </button>
                  <div className="bg-slate-700 rounded-lg p-4 mb-6">
                    <p className="text-white font-semibold">{selectedMarca?.nome} {selectedModelo?.nome}</p>
                    <p className="text-slate-400 text-sm">Anos: {selectedAnos.join(', ')}</p>
                  </div>
                  <label className="block text-slate-400 mb-2">Seu email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-6"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!email || isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Carro'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
