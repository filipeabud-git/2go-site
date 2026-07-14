"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, QrCode, Clipboard, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ isOpen, onClose, destinationName, itinerarySlug, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'card'
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes for PIX

  useEffect(() => {
    let interval;
    if (isOpen && paymentMethod === 'pix' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, paymentMethod, timer]);

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    const pixKey = "00020101021226840014br.gov.bcb.pix2562pix.2go.travel/pay/itinerary-" + itinerarySlug;
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment authorization
    setTimeout(() => {
      setLoading(false);
      
      // Save purchase persistence to localStorage
      if (typeof window !== 'undefined') {
        const purchased = JSON.parse(localStorage.getItem('purchased_roteiros') || '[]');
        if (!purchased.includes(itinerarySlug)) {
          purchased.push(itinerarySlug);
          localStorage.setItem('purchased_roteiros', JSON.stringify(purchased));
        }
      }

      // Play confetti animation
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#081B6B', '#F47A20', '#96AB21']
      });

      onSuccess(itinerarySlug);
      onClose();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[3000] flex items-center justify-center p-4 animate-fade-in text-left"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-border-gray max-w-[500px] w-full p-6 sm:p-8 rounded-[28px] flex flex-col shadow-2xl animate-fade-in-up text-brand-navy max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-text-muted hover:text-brand-navy transition-colors p-1 cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="bg-brand-green/10 text-brand-green text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded-full w-fit mb-3 block">
            PAGAMENTO SEGURO
          </span>
          <h3 className="font-headers text-xl sm:text-2xl font-black">
            Desbloquear Roteiro Completo
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Tenha acesso permanente a todos os dias, horários e rotas estruturadas de curadoria local para <span className="font-bold text-brand-navy">{destinationName}</span>.
          </p>
        </div>

        {/* Price Tag */}
        <div className="bg-bg-light border border-border-gray p-4 rounded-2xl flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Valor de Liberação</span>
            <span className="font-headers text-2xl font-black text-brand-navy">R$ 19,90</span>
          </div>
          <span className="text-[10px] text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Taxa única, sem mensalidades
          </span>
        </div>

        {/* Payment Methods Tab */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-bg-light border border-border-gray rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('pix')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              paymentMethod === 'pix' 
                ? 'bg-white text-brand-navy shadow-xs border border-border-gray/30' 
                : 'text-text-muted hover:text-brand-navy'
            }`}
          >
            <QrCode className="w-4 h-4 text-brand-green" /> PIX Instantâneo
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              paymentMethod === 'card' 
                ? 'bg-white text-brand-navy shadow-xs border border-border-gray/30' 
                : 'text-text-muted hover:text-brand-navy'
            }`}
          >
            <CreditCard className="w-4 h-4 text-brand-orange" /> Cartão de Crédito
          </button>
        </div>

        {/* Payment Forms */}
        {paymentMethod === 'pix' ? (
          /* PIX Section */
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-white border border-border-gray rounded-2xl shadow-sm">
              {/* Mock QR Code Container */}
              <div className="w-40 h-40 bg-[#FAF9F6] flex items-center justify-center border border-border-gray/50 rounded-xl relative overflow-hidden">
                <QrCode className="w-32 h-32 text-brand-navy opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-green font-bold text-xs">2GO</div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-[10px] text-text-muted">
                Escaneie o QR Code acima ou use a chave Copia e Cola abaixo. O roteiro será liberado imediatamente após a confirmação.
              </p>
              <div className="text-[11px] font-mono text-brand-green bg-brand-green/5 border border-brand-green/10 rounded-lg p-2.5 mt-2 flex items-center justify-between gap-2 text-left">
                <span className="truncate max-w-[280px]">00020101021226840014br.gov.bcb.pix2562pix.2go.travel/pay...</span>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="p-1.5 rounded bg-white border border-border-gray hover:bg-bg-light transition-all cursor-pointer shrink-0"
                  title="Copiar código"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> : <Clipboard className="w-3.5 h-3.5 text-brand-navy" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full mt-2 bg-[#FAF9F6] border border-border-gray px-4 py-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">Aguardando pagamento...</span>
              <span className="font-mono text-xs font-bold text-brand-orange">{formatTimer(timer)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn btn-secondary w-full py-3.5 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs mt-2 shadow-md shadow-brand-orange/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processando Pagamento...
                </>
              ) : (
                <>
                  Confirmar Pagamento Simulado &rarr;
                </>
              )}
            </button>
          </div>
        ) : (
          /* Credit Card Form */
          <form onSubmit={handlePayment} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label htmlFor="card-number" className="text-[10px] font-bold font-headers text-brand-navy uppercase tracking-wider">
                Número do Cartão
              </label>
              <input
                type="text"
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                className="w-full px-4 py-2.5 rounded-xl border border-border-gray bg-bg-light text-brand-navy focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 transition-all text-xs font-mono"
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="card-name" className="text-[10px] font-bold font-headers text-brand-navy uppercase tracking-wider">
                Nome Impresso no Cartão
              </label>
              <input
                type="text"
                id="card-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl border border-border-gray bg-bg-light text-brand-navy focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 transition-all text-xs"
                placeholder="NOME DO TITULAR"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="card-expiry" className="text-[10px] font-bold font-headers text-brand-navy uppercase tracking-wider">
                  Validade (MM/AA)
                </label>
                <input
                  type="text"
                  id="card-expiry"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-gray bg-bg-light text-brand-navy focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 transition-all text-xs font-mono"
                  placeholder="MM/AA"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="card-cvv" className="text-[10px] font-bold font-headers text-brand-navy uppercase tracking-wider">
                  Código CVV
                </label>
                <input
                  type="password"
                  id="card-cvv"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-gray bg-bg-light text-brand-navy focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 transition-all text-xs font-mono"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary w-full py-3.5 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs mt-2 shadow-md shadow-brand-orange/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Autorizando Cartão...
                </>
              ) : (
                <>
                  Pagar R$ 19,90 &rarr;
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Footer */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border-gray/50 text-[10px] text-text-muted justify-center">
          <ShieldCheck className="w-4 h-4 text-brand-green" />
          <span>Pagamento processado de forma segura e criptografada SSL.</span>
        </div>

      </div>
    </div>
  );
}
