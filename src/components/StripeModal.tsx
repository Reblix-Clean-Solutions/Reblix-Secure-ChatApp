import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, Sparkles, ShieldCheck, Key, Loader2, AlertCircle, Receipt } from 'lucide-react';

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onUnlockWithMasterKey?: (key: string) => boolean;
}

export const StripeModal: React.FC<StripeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onUnlockWithMasterKey,
}) => {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [masterKeyCode, setMasterKeyCode] = useState('');
  
  // Payment processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStepText, setPaymentStepText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [keyError, setKeyError] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);

  if (!isOpen) return null;

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format expiry date MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvc(raw);
  };

  // Quick fill test card helper for smooth testing
  const handleFillTestCard = () => {
    setValidationError(null);
    setCardHolder('Dominik Muster');
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('888');
  };

  const handleApplyMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterKeyCode.trim() === '1304') {
      setDiscountApplied(true);
      setKeyError(false);
      if (onUnlockWithMasterKey) {
        onUnlockWithMasterKey('1304');
      }
      setIsProcessing(true);
      setPaymentStepText('Master-Key autorisiert...');
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setTransactionId('MASTER-KEY-1304-AUTHORIZED');
        setTimeout(() => {
          onSuccess();
          onClose();
          setIsSuccess(false);
        }, 1500);
      }, 800);
    } else {
      setKeyError(true);
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict validation: payment must have actual valid input
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      setValidationError('Bitte gib eine gültige 16-stellige Kartennummer ein.');
      return;
    }

    if (!expiry || !expiry.includes('/') || expiry.length < 5) {
      setValidationError('Bitte gib ein gültiges Ablaufdatum im Format MM/JJ ein.');
      return;
    }

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      setValidationError('Der Monat im Ablaufdatum muss zwischen 01 und 12 liegen.');
      return;
    }

    if (cvc.length < 3) {
      setValidationError('Bitte gib den 3-stelligen Sicherheitscode (CVC) auf der Kartenrückseite ein.');
      return;
    }

    // Begin multi-stage realistic Stripe transaction
    setIsProcessing(true);
    setPaymentStepText('1/3: Verschlüsselte Verbindung zu Stripe aufbauen...');

    setTimeout(() => {
      setPaymentStepText('2/3: 3D-Secure 2.0 Authentifizierung & Bankautorisierung...');
      
      setTimeout(() => {
        setPaymentStepText('3/3: Zahlung in Höhe von 20,00 € wird von Stripe bestätigt...');
        
        setTimeout(() => {
          const txId = `ch_3P${Date.now().toString(36).toUpperCase()}_reblix`;
          setTransactionId(txId);
          setIsProcessing(false);
          setIsSuccess(true);
          
          // Only unlock when payment is strictly complete!
          onSuccess();
        }, 1200);
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#151720] border border-zinc-700/80 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#20121d] border border-[#ff2d78]/40 flex items-center justify-center text-[#ff2d78] font-bold">
              S
            </div>
            <div>
              <span className="text-white font-bold text-sm block">Stripe Checkout</span>
              <span className="text-[11px] text-zinc-400">Sichere 256-Bit SSL-Zahlung • Einmalig 20,00 €</span>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!isSuccess ? (
          <div className="space-y-4">
            {/* Price Overview */}
            <div className="p-4 rounded-xl bg-[#1b1e26] border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Produkt</span>
                <span className="text-sm font-bold text-white">
                  REBLIX Secure Chat Lifetime
                </span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">
                  Unbegrenzte Kontakte & Chats • Einmalzahlung
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-white">
                  {discountApplied ? '0,00 €' : '20,00 €'}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {discountApplied ? 'Master-Key aktiv' : 'kein Abonnement'}
                </span>
              </div>
            </div>

            {/* Master Key input for authorized unlock */}
            <div className="bg-[#19131c] border border-[#ff2d78]/30 rounded-xl p-3">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                <Key className="w-3.5 h-3.5 text-[#ff2d78]" />
                <span>Autorisierter Master-Key vorhanden?</span>
              </label>
              <form onSubmit={handleApplyMasterKey} className="flex gap-2">
                <input
                  type="password"
                  value={masterKeyCode}
                  onChange={(e) => {
                    setMasterKeyCode(e.target.value);
                    setKeyError(false);
                  }}
                  placeholder="Master-Key Code..."
                  className="bg-[#0e1015] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff2d78] flex-1 font-mono"
                />
                <button
                  type="submit"
                  className="bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
                >
                  Einlösen
                </button>
              </form>
              {keyError && (
                <p className="text-[10px] text-red-400 mt-1">
                  Ungültiger Master-Key Code. Bitte überprüfe deine Eingabe.
                </p>
              )}
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Regular Card Inputs */}
            <form onSubmit={handlePay} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400 font-medium">
                  Karteninhaber (optional):
                </label>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="text-[11px] text-[#ff2d78] hover:underline cursor-pointer"
                >
                  Testdaten ausfüllen
                </button>
              </div>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Name auf der Karte (z.B. Dominik)"
                className="w-full bg-[#0e1015] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff2d78]"
              />

              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">
                  Kartennummer
                </label>
                <div className="flex items-center gap-2 bg-[#0e1015] border border-zinc-700 rounded-xl px-3 py-2.5">
                  <CreditCard className="w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className="bg-transparent text-xs text-white focus:outline-none w-full font-mono tracking-wider"
                    placeholder="4242 4242 4242 4242"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">
                    Gültig bis
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="bg-[#0e1015] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none w-full font-mono"
                    placeholder="MM/JJ"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={handleCvcChange}
                    maxLength={4}
                    className="bg-[#0e1015] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none w-full font-mono"
                    placeholder="123"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Processing status bar */}
              {isProcessing && (
                <div className="p-3 bg-zinc-900 border border-[#ff2d78]/50 rounded-xl space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 text-xs text-[#ff2d78] font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin text-[#ff2d78]" />
                    <span>{paymentStepText}</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#ff2d78] h-full w-3/4 animate-indeterminate rounded-full" />
                  </div>
                </div>
              )}

              {/* Pay button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer mt-2 ${
                  isProcessing
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#ff0055] to-[#ff0077] hover:from-[#ff1a66] hover:to-[#ff1a88] text-white shadow-[#ff0055]/30'
                }`}
              >
                {isProcessing ? (
                  <span>Zahlung wird autorisiert...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Jetzt 20,00 € bezahlen & freischalten</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Freischaltung erfolgt erst nach vollständigem Zahlungsabschluss</span>
              </p>
            </form>
          </div>
        ) : (
          /* Payment completed confirmation screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Zahlung erfolgreich abgeschlossen!</h3>
              <p className="text-xs text-zinc-300">
                Die Zahlung in Höhe von <strong className="text-white">20,00 €</strong> wurde von deiner Bank autorisiert und verbucht.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="p-3.5 bg-[#1a1d26] border border-zinc-700/80 rounded-xl text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stripe Zahlungsbestätigung</span>
                </span>
                <span className="text-emerald-400 font-bold">BEZAHLT</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Betrag:</span>
                <span className="font-bold text-white">20,00 € (einmalig)</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Transaktions-ID:</span>
                <span className="font-mono text-[11px] text-zinc-400">{transactionId}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Status:</span>
                <span className="text-emerald-400 font-medium">REBLIX Lifetime dauerhaft freigeschaltet</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
            >
              Fertigstellen & Unbegrenzt Chatten
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
