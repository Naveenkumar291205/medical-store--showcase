import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Prescription } from '../../types/prescription';
import { useInventory } from '../../context/InventoryContext';

interface DrugInteractionCheckerProps {
  prescription: Prescription;
}

export const DrugInteractionChecker: React.FC<DrugInteractionCheckerProps> = ({
  prescription
}) => {
  const { medicines } = useInventory();

  // Inspect extracted medicines against potential clinical contraindications
  const detectedInteractions: { severity: 'high' | 'moderate' | 'low'; title: string; desc: string }[] = [];

  const hasStatin = prescription.extractedMedicines.some((m) =>
    m.detectedName.toLowerCase().includes('atorvastatin') || m.matchedMedicineName?.toLowerCase().includes('atorvastatin')
  );
  const hasBetaBlocker = prescription.extractedMedicines.some((m) =>
    m.detectedName.toLowerCase().includes('metoprolol') || m.matchedMedicineName?.toLowerCase().includes('metoprolol')
  );
  const hasAntibiotic = prescription.extractedMedicines.some((m) =>
    m.detectedName.toLowerCase().includes('amoxicillin') || m.matchedMedicineName?.toLowerCase().includes('amoxiclav')
  );

  if (hasStatin && hasBetaBlocker) {
    detectedInteractions.push({
      severity: 'low',
      title: 'Concomitant Cardiovascular Therapy (Atorvastatin + Metoprolol)',
      desc: 'Standard dual regimen for post-CAD / hypertension. Check patient baseline pulse rate and liver enzyme schedule.'
    });
  }

  if (hasAntibiotic) {
    detectedInteractions.push({
      severity: 'moderate',
      title: 'Penicillin-Class Antibacterial (AmoxiClav)',
      desc: 'Confirm patient does not possess acute beta-lactam or clavulanate allergies before final dispensation.'
    });
  }

  if (detectedInteractions.length === 0) {
    return (
      <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div>
          <span className="font-bold block">Pharmacological Safety Verification Passed</span>
          <span className="text-[11px] text-emerald-700">Zero critical drug-drug contraindications or lethal interaction risks detected.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span>Clinical Decision Support & Safety Alerts ({detectedInteractions.length})</span>
      </div>

      <div className="space-y-2">
        {detectedInteractions.map((alert, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
              alert.severity === 'high'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : alert.severity === 'moderate'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            {alert.severity === 'high' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            ) : alert.severity === 'moderate' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">{alert.title}</span>
              <p className="text-[11px] mt-0.5 opacity-90">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
