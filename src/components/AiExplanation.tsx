import { PatientData } from '../types';
import MedicalText from './MedicalText';

const resultStyle = {
  good: { border: 'border-emerald-500', bg: 'bg-emerald-50', label: 'GOED', labelBg: 'bg-emerald-500' },
  attention: { border: 'border-amber-500', bg: 'bg-amber-50', label: 'AANDACHT', labelBg: 'bg-amber-500' },
  alert: { border: 'border-red-500', bg: 'bg-red-50', label: 'ACTIE NODIG', labelBg: 'bg-red-500' },
  info: { border: 'border-blue-500', bg: 'bg-blue-50', label: 'INFO', labelBg: 'bg-blue-500' },
};

export default function AiExplanation({ data }: { data: PatientData }) {
  const normalCount = data.lab.filter(l => l.status === 'normal').length;
  const abnormalCount = data.lab.length - normalCount;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5 animate-fadeIn">
      <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border-b border-blue-100">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">MB</div>
        <div>
          <h3 className="font-semibold text-blue-800">MedBegrip AI</h3>
          <span className="text-xs text-gray-500">Uitleg voor {data.name}</span>
        </div>
      </div>

      <div className="p-5">
        <p className="font-semibold text-gray-800 mb-4">{data.ai.greeting}</p>

        <div className="flex gap-4 mb-5 flex-wrap">
          {[
            { dot: 'bg-emerald-500', text: `${normalCount} normaal` },
            { dot: 'bg-amber-500', text: `${abnormalCount} afwijkend` },
            { dot: 'bg-blue-500', text: `${data.lab.length} tests totaal` },
          ].map(s => (
            <div key={s.text} className="flex items-center gap-1.5 text-sm text-gray-500">
              <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              {s.text}
            </div>
          ))}
        </div>

        {data.ai.results.map((r, i) => {
          const s = resultStyle[r.type];
          return (
            <div key={i} className={`mb-4 p-4 rounded-lg border-l-4 ${s.border} ${s.bg}`}>
              <div className="font-bold text-sm mb-1">
                <span className={`inline-block text-white text-xs font-bold uppercase px-2 py-0.5 rounded mr-2 ${s.labelBg}`}>{s.label}</span>
                {r.title}
              </div>
              <div className="text-xs text-gray-500 mb-2">{r.value}</div>
              <div className="text-sm leading-relaxed text-gray-700"><MedicalText text={r.explain} /></div>
            </div>
          );
        })}

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 mt-2">
          <h4 className="font-semibold text-blue-800 mb-2">Samenvatting</h4>
          <p className="text-sm leading-relaxed text-gray-700 mb-3"><MedicalText text={data.ai.summary} /></p>
          <div className="border-t border-blue-200 pt-3">
            <h4 className="font-semibold text-blue-800 mb-2">Wat kunt u doen?</h4>
            {data.ai.actions.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2 text-sm text-gray-700">
                <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
