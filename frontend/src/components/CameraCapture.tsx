import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const startCamera = useCallback(async () => {
    setError(null);
    setIsReady(false);
    
    // Hentikan stream yang sedang berjalan (jika ada)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true);
        };
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("Gagal mengakses kamera. Pastikan Anda memberi izin akses kamera dan menggunakan koneksi yang aman (HTTPS).");
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();

    // Cleanup: hentikan kamera saat komponen ditutup
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set ukuran canvas sama dengan resolusi video asli
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Tombol Tutup */}
      <button 
        type="button"
        onClick={onCancel}
        className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {error ? (
        <div className="p-6 text-center text-white">
          <p className="text-red-400 mb-4">{error}</p>
          <Button type="button" onClick={onCancel} variant="outline" className="text-black">
            Kembali
          </Button>
        </div>
      ) : (
        <>
          <div className="relative w-full h-full max-h-screen overflow-hidden flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            
            {/* Indikator Loading */}
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                Memulai Kamera...
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Kontrol Kamera di Bagian Bawah */}
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-8">
            <button 
              type="button"
              onClick={toggleCamera}
              className="p-3 bg-white/20 rounded-full text-white backdrop-blur-md"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            
            <button 
              type="button"
              onClick={handleCapture}
              disabled={!isReady}
              className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </button>
            
            <div className="w-12" /> {/* Spacer untuk menyeimbangkan layout */}
          </div>
        </>
      )}
    </div>
  );
}
