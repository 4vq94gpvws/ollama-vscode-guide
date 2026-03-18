import { LabResult } from '../types';

const statusColor = { normal: 'text-emerald-600', high: 'text-red-600', low: 'text-amber-600' };
const flagColor = { normal: '', high: 'bg-red-500', low: 'bg-amber-500' };

export default function LabTable({ lab, date }: { lab: LabResult[]; date: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
      <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Laboratoriumresultaten</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Bepaling', 'Uitslag', 'Eenheid', 'Referentie'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lab.map((l, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 text-gray-800">{l.test}</td>
                <td className={`px-4 py-3 font-semibold ${statusColor[l.status]}`}>
                  {l.value}
                  {l.status !== 'normal' && (
                    <span className={`inline-block w-2 h-2 rounded-full ml-1.5 ${flagColor[l.status]}`} />
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{l.unit}</td>
                <td className="px-4 py-3 text-gray-500">{l.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
