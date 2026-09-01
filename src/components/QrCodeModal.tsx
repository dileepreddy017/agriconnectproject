import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, QrCode as QrIcon, Download, Share2, Check, Sparkles, Sprout, Truck } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  value: string;
  type?: 'PRODUCT' | 'ORDER' | 'UPI' | 'FARM';
  meta?: {
    name?: string;
    id?: string;
    price?: number;
    location?: string;
    status?: string;
  };
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  value,
  type = 'PRODUCT',
  meta
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && value) {
      QRCode.toDataURL(value, {
        width: 320,
        margin: 2,
        color: {
          dark: '#17351f',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      })
        .then((url: string) => setDataUrl(url))
        .catch((err: any) => console.error('QR generation error:', err));
    }
  }, [isOpen, value]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `agriconnect-qr-${type.toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up text-center">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#17351f] to-[#1f4a2b] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#ffd45c] text-[#19351e] flex items-center justify-center font-bold">
              <QrIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">{title}</h3>
              <p className="text-[10px] text-[#c9e8ca]">{subtitle || 'Scan with camera to view live'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Display */}
        <div className="p-6 space-y-4">
          <div className="bg-[#f6faf5] p-4 rounded-2xl border-2 border-dashed border-[#b3dab0] flex flex-col items-center justify-center relative group">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="QR Code"
                className="w-56 h-56 object-contain rounded-xl shadow-xs bg-white p-2"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-gray-400">
                Generating QR Code...
              </div>
            )}

            {/* Central Badge Overlay */}
            <div className="mt-2 text-xs font-bold text-[#176b3a] flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#cbe4c7] shadow-xs">
              {type === 'PRODUCT' && <Sprout className="w-3.5 h-3.5 text-[#176b3a]" />}
              {type === 'ORDER' && <Truck className="w-3.5 h-3.5 text-[#176b3a]" />}
              <span className="font-mono">{meta?.id || value}</span>
            </div>
          </div>

          {/* Meta Details */}
          {meta && (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-left space-y-1">
              {meta.name && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Item:</span>
                  <span className="font-bold text-gray-900 truncate max-w-[180px]">{meta.name}</span>
                </div>
              )}
              {meta.price !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Amount:</span>
                  <span className="font-extrabold text-[#176b3a]">₹{meta.price}</span>
                </div>
              )}
              {meta.location && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Location:</span>
                  <span className="text-gray-700 truncate max-w-[180px]">{meta.location}</span>
                </div>
              )}
              {meta.status && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Status:</span>
                  <span className="font-bold text-[#176b3a] uppercase text-[10px]">{meta.status}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Value'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2 px-3 rounded-xl bg-[#176b3a] hover:bg-[#12552e] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
