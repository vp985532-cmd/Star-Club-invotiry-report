
import React, { useState, useEffect } from 'react';

const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPlatformGuide, setShowPlatformGuide] = useState<null | 'ios' | 'desktop'>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
      return;
    }

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isMac = /Macintosh/.test(ua);
    const isWindows = /Windows/.test(ua);

    if (isIOS) {
      setShowPlatformGuide('ios');
    } else if (isMac || isWindows) {
      setShowPlatformGuide('desktop');
    } else {
      alert("Click the three dots (⋮) in your browser and select 'Install App' or 'Add to Home Screen'");
    }
  };

  if (isStandalone) return null;

  return (
    <div className="p-4 space-y-3">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-inner">
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 text-center">App Installation</p>
        <button
          onClick={handleInstallClick}
          className="w-full flex flex-col items-center justify-center gap-1 bg-white text-indigo-700 px-4 py-3 rounded-xl font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-95 border-2 border-indigo-200"
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-download animate-bounce"></i>
            <span>DOWNLOAD APP ICON</span>
          </div>
          <span className="text-[9px] text-gray-400 font-medium">For PC, Mac, iPhone & Android</span>
        </button>
      </div>

      {showPlatformGuide === 'ios' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center space-y-6 shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
              <i className="fas fa-mobile-screen text-3xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Install on iPhone</h3>
              <p className="text-sm text-gray-500 mt-2">To use Star Club like a real app:</p>
            </div>
            <div className="text-left space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex gap-3 items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                <p className="text-sm font-medium">Tap the <i className="fas fa-share-square text-indigo-500 mx-1"></i> Share button in Safari</p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                <p className="text-sm font-medium">Scroll down and tap <b>'Add to Home Screen'</b></p>
              </div>
            </div>
            <button 
              onClick={() => setShowPlatformGuide(null)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

      {showPlatformGuide === 'desktop' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border-4 border-indigo-500">
            <h3 className="text-2xl font-black text-gray-900">Install on Desktop</h3>
            <div className="flex justify-center gap-6 py-4">
                <div className="flex flex-col items-center gap-2">
                    <i className="fab fa-apple text-5xl text-gray-800"></i>
                    <span className="text-xs font-bold">MacBook</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <i className="fab fa-windows text-5xl text-blue-500"></i>
                    <span className="text-xs font-bold">PC / Windows</span>
                </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Look for the <b>Install Icon</b> (square with plus) in the top right of your browser's address bar. 
              Click it to add <b>Star Club</b> to your desktop or applications folder.
            </p>
            <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3">
                <i className="fas fa-info-circle text-indigo-500 text-xl"></i>
                <p className="text-xs text-indigo-800 text-left font-medium">This allows the app to work full-screen and offline without the browser address bar.</p>
            </div>
            <button 
              onClick={() => setShowPlatformGuide(null)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAInstaller;
