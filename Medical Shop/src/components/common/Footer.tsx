import React from 'react';
import { HeartPulse, ShieldCheck, Truck, Lock, PhoneCall, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Medicines</h4>
              <p className="text-xs text-slate-400">Directly sourced from licensed labs</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Express Delivery</h4>
              <p className="text-xs text-slate-400">2-Hour temperature-controlled rush</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">HIPAA & GDPR Compliant</h4>
              <p className="text-xs text-slate-400">256-bit encrypted health data</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Licensed Pharmacists</h4>
              <p className="text-xs text-slate-400">Every prescription verified by doctor/RPh</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                Smart<span className="text-blue-400">Pharma</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              SmartPharma is a digital pharmacy delivering healthcare precision, instant AI prescription transcription, safe pharmacist dispensation, and verified cold-chain therapeutics.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>State Licensed Pharmacy License #PH-2026-991823</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Patient Services</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors">
                  Buy Medicines
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('prescriptions')} className="hover:text-white transition-colors">
                  AI Prescription Upload
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('orders')} className="hover:text-white transition-colors">
                  Track Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('refills')} className="hover:text-white transition-colors">
                  Auto-Refill Program
                </button>
              </li>
            </ul>
          </div>

          {/* Therapeutic Areas */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Categories</h5>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView('shop')}>Cardiology & BP</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView('shop')}>Diabetes & Metabolism</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView('shop')}>Antibiotics & Infections</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView('shop')}>Vitamins & Supplements</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView('shop')}>Respiratory & Asthma</li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">24/7 Helpline</h5>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-white font-bold">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>+1 (800) 555-PHARMA</span>
              </div>
              <p className="text-xs text-slate-400">
                Call our licensed clinical pharmacists anytime for dosage guidance or drug interaction questions.
              </p>
              <div className="pt-2">
                <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700">
                  Mon – Sun: 24 Hours Open
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SmartPharma Health Inc. All rights reserved. FDA & DEA Compliant Operations.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Dispensation</span>
            <span className="hover:text-slate-300 cursor-pointer">Prescription Regulations</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
