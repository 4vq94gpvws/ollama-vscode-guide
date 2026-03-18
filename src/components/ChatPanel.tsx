import { useState, useRef, useEffect } from 'react';
import { PatientData } from '../types';

interface Message { role: 'bot' | 'user'; text: string; }

function findAnswer(data: PatientData, question: string): string | null {
  const q = question.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const qa of data.chatQA) {
    const score = qa.keywords.filter(kw => q.includes(kw.toLowerCase())).length;
    if (score > 0 && (!best || score > best.score)) best = { score, answer: qa.answer };
  }
  return best?.answer ?? null;
}

export default function ChatPanel({ data }: { data: PatientData }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Heeft u vragen over uw uitslagen? Stel ze hieronder, of klik op een van de voorgestelde vragen.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = (question: string) => {
    if (!question.trim()) return;
    setMessages(m => [...m, { role: 'user', text: question }]);
    setInput('');
    setShowSuggestions(false);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const answer = findAnswer(data, question);
      setMessages(m => [...m, {
        role: 'bot',
        text: answer ?? 'Ik kan deze vraag helaas niet beantwoorden op basis van uw uitslagen. Voor specifieke medische vragen raad ik u aan contact op te nemen met uw huisarts of specialist.'
      }]);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-5">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 border-b border-blue-100">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">MB</div>
        <div>
          <h3 className="font-semibold text-blue-800 text-sm">Stel een vraag over uw uitslagen</h3>
          <span className="text-xs text-gray-500">MedBegrip beantwoordt uw vragen in begrijpelijke taal</span>
        </div>
      </div>

      <div className="mx-3 my-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 leading-relaxed">
        <strong>Let op:</strong> MedBegrip geeft uitleg bij uw uitslagen, maar stelt geen diagnoses en vervangt niet het gesprek met uw arts.
      </div>

      <div className="px-4 py-3 max-h-80 overflow-y-auto min-h-20">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 mb-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${m.role === 'bot' ? 'bg-blue-600' : 'bg-emerald-500'}`}>
              {m.role === 'bot' ? 'MB' : 'U'}
            </div>
            <div className={`max-w-xs px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${m.role === 'bot' ? 'bg-gray-100 text-gray-800 rounded-bl-sm' : 'bg-blue-600 text-white rounded-br-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">MB</div>
            <div className="bg-gray-100 rounded-xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showSuggestions && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {data.chatQA.map((qa, i) => (
            <button key={i} onClick={() => send(qa.question)}
              className="px-3.5 py-1.5 border border-gray-200 rounded-full bg-white text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors">
              {qa.question}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50">
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Stel een vraag over uw uitslagen..."
          className="flex-1 px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white"
        />
        <button onClick={() => send(input)} disabled={!input.trim() || typing}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Verstuur
        </button>
      </div>
    </div>
  );
}
