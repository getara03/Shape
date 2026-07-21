import React, { useState } from 'react';
import { CodeExample, AttributeAccessStep, InvocationTrace } from '../types';
import { Play, RotateCcw, Terminal, Code2, Sparkles, AlertCircle } from 'lucide-react';

interface CodePlaygroundProps {
  example: CodeExample;
  onExecute: (expression: string) => void;
  invocationTraces: InvocationTrace[];
  onReset: () => void;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  example,
  onExecute,
  invocationTraces,
  onReset
}) => {
  const [customExpr, setCustomExpr] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customExpr.trim()) {
      onExecute(customExpr.trim());
      setCustomExpr('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Code View */}
      <div className="lg:col-span-7 bg-[#0F1014] border border-[#1F2833] rounded-lg p-5 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F2833]">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#66FCF1]" />
              <h3 className="font-semibold text-white tracking-wide">{example.title}</h3>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium bg-[#1B1D24] hover:bg-[#1F2833] text-[#C5C6C7] rounded border border-[#1F2833] hover:border-[#45A29E] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#45A29E]" />
              Reset State
            </button>
          </div>

          <p className="text-xs text-[#C5C6C7]/70 mb-4 leading-relaxed font-sans">
            {example.description}
          </p>

          <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-4 font-mono text-xs overflow-x-auto text-[#C5C6C7] leading-relaxed max-h-[480px]">
            <pre>
              <code>
                {example.code.split('\n').map((line, idx) => {
                  let lineClass = 'text-[#C5C6C7]';
                  if (line.trim().startsWith('#')) lineClass = 'text-[#45A29E]/60 italic';
                  else if (line.includes('class ') || line.includes('def ')) lineClass = 'text-[#C592FF] font-bold';
                  else if (line.includes('return') || line.includes('import')) lineClass = 'text-[#66FCF1]';
                  else if (line.includes('__getattr__') || line.includes('__getattribute__')) lineClass = 'text-[#66FCF1] font-bold bg-[#66FCF1]/10 px-1 rounded';

                  return (
                    <div key={idx} className="table-row">
                      <span className="table-cell pr-4 text-right text-[#1F2833] select-none text-[11px] font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`table-cell ${lineClass}`}>{line}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>

        {/* Quick Invocations */}
        <div className="mt-4 pt-4 border-t border-[#1F2833]">
          <span className="text-[10px] uppercase tracking-widest text-[#45A29E] font-mono block mb-2">
            Preset Interactive Test Expressions:
          </span>
          <div className="flex flex-wrap gap-2 mb-3">
            {example.defaultInvocations.map((expr) => (
              <button
                key={expr}
                onClick={() => onExecute(expr)}
                className="px-2.5 py-1.5 text-xs font-mono bg-[#1B1D24] hover:bg-[#1F2833] text-[#66FCF1] border border-[#1F2833] hover:border-[#66FCF1] rounded flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3 h-3 text-[#66FCF1] fill-[#66FCF1]" />
                {expr}
              </button>
            ))}
          </div>

          {/* Custom Expression Input */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customExpr}
              onChange={(e) => setCustomExpr(e.target.value)}
              placeholder="e.g. hero.transform_to_shadow('cloak')"
              className="flex-1 bg-[#0A0A0B] border border-[#1F2833] rounded px-3 py-1.5 text-xs font-mono text-[#C5C6C7] placeholder:text-[#C5C6C7]/30 focus:outline-none focus:border-[#66FCF1]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-transparent border border-[#66FCF1] text-[#66FCF1] text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-[#66FCF1] hover:text-[#0B0C10] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Run
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Execution Console & Logs */}
      <div className="lg:col-span-5 bg-[#0F1014] border border-[#1F2833] rounded-lg p-5 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F2833]">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#66FCF1]" />
            <h3 className="font-semibold text-white tracking-wide">Execution Console & Log</h3>
          </div>
          <span className="text-[10px] text-[#45A29E] font-mono uppercase tracking-widest">
            {invocationTraces.length} TRACE(S)
          </span>
        </div>

        <div className="flex-1 bg-[#0A0A0B] border border-[#1F2833] rounded p-3 font-mono text-xs overflow-y-auto space-y-3 max-h-[520px]">
          {invocationTraces.length === 0 ? (
            <div className="text-center py-12 text-[#C5C6C7]/40">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#45A29E]" />
              <p className="text-xs">No expressions executed yet.</p>
              <p className="text-[11px] text-[#45A29E]/60 mt-1">
                Click one of the preset test expressions to observe dynamic method dispatch!
              </p>
            </div>
          ) : (
            invocationTraces.map((trace) => (
              <div key={trace.id} className="bg-[#1B1D24] border border-[#1F2833] rounded p-3">
                <div className="flex items-center justify-between border-b border-[#1F2833] pb-1.5 mb-2">
                  <span className="text-[#66FCF1] font-bold">{trace.expression}</span>
                  <span className="text-[10px] text-[#45A29E]">{trace.timestamp}</span>
                </div>

                <div className="text-[#C5C6C7] text-xs mb-2 bg-[#0A0A0B] p-2 rounded border border-[#1F2833]">
                  <span className="text-[#45A29E] block text-[10px] uppercase font-mono font-semibold mb-0.5">Returned Output:</span>
                  <span className={trace.result.includes('AttributeError') ? 'text-[#F43F5E]' : 'text-[#66FCF1]'}>
                    {trace.result}
                  </span>
                </div>

                {trace.dynamicMethodCreated && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#C592FF] bg-[#C592FF]/10 border border-[#C592FF]/30 rounded px-2 py-1">
                    <Sparkles className="w-3 h-3 text-[#C592FF]" />
                    Dynamic Method Created: <code className="font-bold">{trace.dynamicMethodCreated}</code>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
