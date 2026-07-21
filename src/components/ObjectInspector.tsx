import React from 'react';
import { Database, Layers, GitCommit, Sparkles, Check, Cpu } from 'lucide-react';

interface ObjectInspectorProps {
  className: string;
  instanceDict: Record<string, any>;
  classDict: Record<string, any>;
  mro: string[];
  dynamicMethods: Array<{ name: string; args: string[]; isDynamic: boolean }>;
}

export const ObjectInspector: React.FC<ObjectInspectorProps> = ({
  className,
  instanceDict,
  classDict,
  mro,
  dynamicMethods
}) => {
  return (
    <div className="bg-[#0F1014] border border-[#1F2833] rounded-lg p-5 shadow-2xl text-[#C5C6C7] flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#1F2833] pb-3">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#66FCF1]" />
          Runtime Object & Memory Inspector
        </h3>
        <span className="text-xs font-mono bg-[#1B1D24] text-[#66FCF1] border border-[#1F2833] px-2.5 py-1 rounded">
          {className} Instance
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instance __dict__ */}
        <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-4">
          <div className="flex items-center justify-between mb-3 border-b border-[#1F2833] pb-2">
            <span className="text-xs font-mono font-bold text-[#66FCF1] flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#45A29E]" />
              instance.__dict__
            </span>
            <span className="text-[10px] bg-[#1B1D24] text-[#45A29E] border border-[#1F2833] px-2 py-0.5 rounded font-mono">
              {Object.keys(instanceDict).length} attributes
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs pr-1">
            {Object.keys(instanceDict).length === 0 ? (
              <p className="text-[#C5C6C7]/40 italic text-center py-4">__dict__ is empty</p>
            ) : (
              Object.entries(instanceDict).map(([key, val]) => (
                <div key={key} className="flex items-start justify-between bg-[#1B1D24] border border-[#1F2833] rounded px-2.5 py-1.5">
                  <span className="text-[#66FCF1] font-semibold">{key}:</span>
                  <span className="text-[#C5C6C7] text-right truncate max-w-[180px]" title={JSON.stringify(val)}>
                    {typeof val === 'string' && val.startsWith('<bound') ? (
                      <span className="text-[#C592FF] font-medium">{val}</span>
                    ) : (
                      JSON.stringify(val)
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Class __dict__ */}
        <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-4">
          <div className="flex items-center justify-between mb-3 border-b border-[#1F2833] pb-2">
            <span className="text-xs font-mono font-bold text-[#45A29E] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#45A29E]" />
              {className}.__dict__
            </span>
            <span className="text-[10px] bg-[#1B1D24] text-[#45A29E] border border-[#1F2833] px-2 py-0.5 rounded font-mono">
              Class Methods
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs pr-1">
            {Object.entries(classDict).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between bg-[#1B1D24] border border-[#1F2833] rounded px-2.5 py-1.5">
                <span className="text-[#45A29E] font-semibold">{key}:</span>
                <span className="text-[#C5C6C7]/70 text-xs truncate max-w-[160px]">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Methods & Cache Status */}
      <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-4">
        <div className="flex items-center justify-between mb-3 border-b border-[#1F2833] pb-2">
          <span className="text-xs font-mono font-bold text-[#C592FF] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C592FF]" />
            Dynamic Synthesized Methods Cache
          </span>
          <span className="text-[10px] bg-[#1B1D24] text-[#C592FF] border border-[#1F2833] px-2 py-0.5 rounded font-mono">
            {dynamicMethods.length} Methods Generated
          </span>
        </div>

        {dynamicMethods.length === 0 ? (
          <p className="text-[#C5C6C7]/40 text-xs italic text-center py-3">
            No dynamic methods have been generated yet. Execute a dynamic expression like <code className="text-[#66FCF1]">hero.transform_to_dragon("fire_breath")</code> to synthesize one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dynamicMethods.map((method) => (
              <div key={method.name} className="flex items-center justify-between bg-[#1B1D24] border border-[#C592FF]/30 rounded p-2 text-xs">
                <div className="flex items-center gap-1.5 font-mono">
                  <Check className="w-3.5 h-3.5 text-[#C592FF]" />
                  <span className="text-[#66FCF1] font-bold">{method.name}</span>
                  <span className="text-[#C5C6C7]/60 text-[11px]">({method.args.join(', ')})</span>
                </div>
                <span className="text-[10px] bg-[#C592FF]/20 text-[#C592FF] px-1.5 py-0.5 rounded border border-[#C592FF]/40 font-mono">
                  Cached in __dict__
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Method Resolution Order (MRO) */}
      <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-3">
        <span className="text-xs font-mono font-bold text-[#45A29E] block mb-2 flex items-center gap-1.5 uppercase tracking-wider">
          <GitCommit className="w-4 h-4 text-[#66FCF1]" />
          Method Resolution Order ({className}.mro()):
        </span>
        <div className="flex items-center gap-2 overflow-x-auto py-1 font-mono text-xs">
          {mro.map((cls, idx) => (
            <React.Fragment key={cls}>
              <span className="bg-[#1B1D24] border border-[#1F2833] text-[#66FCF1] px-2.5 py-1 rounded font-semibold whitespace-nowrap">
                {cls}
              </span>
              {idx < mro.length - 1 && <span className="text-[#45A29E] font-bold">&rarr;</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
