import React from 'react';
import { BookOpen, ShieldCheck, Zap, Layers } from 'lucide-react';

export const TheoryGuide: React.FC = () => {
  return (
    <div className="bg-[#0F1014] border border-[#1F2833] rounded-lg p-6 shadow-2xl text-[#C5C6C7] space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2 tracking-wide">
          <BookOpen className="w-6 h-6 text-[#66FCF1]" />
          Python Metaprogramming Architecture & Mechanics
        </h2>
        <p className="text-xs text-[#C5C6C7]/80 leading-relaxed font-sans">
          Metaprogramming refers to the ability of code to inspect, manipulate, create, or alter other code at runtime. In Python, objects are dynamic dictionary structures wrapped in descriptor protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Concepts */}
        <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-5">
          <h3 className="text-sm font-semibold text-[#66FCF1] flex items-center gap-2 mb-3 tracking-wide">
            <Zap className="w-4 h-4 text-[#66FCF1]" />
            1. The __getattr__ vs __getattribute__ Dichotomy
          </h3>
          <ul className="space-y-3 text-xs text-[#C5C6C7]/90 leading-relaxed">
            <li className="bg-[#1B1D24] p-3 rounded border border-[#1F2833]">
              <strong className="text-[#66FCF1] font-mono block mb-1">__getattr__(self, name)</strong>
              Only invoked as a <em>fallback mechanism</em> when <code>name</code> is not present in the instance dictionary (<code>self.__dict__</code>) or class hierarchy. This makes it ideal for dynamic method synthesis and object proxies.
            </li>
            <li className="bg-[#1B1D24] p-3 rounded border border-[#1F2833]">
              <strong className="text-[#FFC66D] font-mono block mb-1">__getattribute__(self, name)</strong>
              Invoked <em>unconditionally</em> for every single attribute access. It sits at the lowest level of object lookup. Accessing attributes inside <code>__getattribute__</code> directly can cause infinite recursion unless <code>object.__getattribute__(self, name)</code> is used.
            </li>
          </ul>
        </div>

        {/* Dynamic Method Binding */}
        <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-5">
          <h3 className="text-sm font-semibold text-[#C592FF] flex items-center gap-2 mb-3 tracking-wide">
            <Layers className="w-4 h-4 text-[#C592FF]" />
            2. Bound Methods vs Standalone Functions
          </h3>
          <div className="text-xs text-[#C5C6C7]/90 space-y-3 leading-relaxed">
            <p>
              When a function is defined inside a class, Python uses descriptor protocol (<code>__get__</code>) to automatically bind the instance to the function, passing it as <code>self</code>.
            </p>
            <div className="bg-[#1B1D24] p-3 rounded border border-[#1F2833] font-mono text-[11px]">
              <span className="text-[#45A29E]/60"># Plain attachment (Requires self explicitly):</span>
              <br />
              <code className="text-[#F43F5E]">obj.func = my_func  # obj.func(10) &rarr; TypeError!</code>
              <br /><br />
              <span className="text-[#45A29E]/60"># Proper Method Binding:</span>
              <br />
              <code className="text-[#66FCF1]">obj.func = types.MethodType(my_func, obj)</code>
            </div>
          </div>
        </div>
      </div>

      {/* Security and Best Practices */}
      <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-5">
        <h3 className="text-sm font-semibold text-[#66FCF1] flex items-center gap-2 mb-3 tracking-wide">
          <ShieldCheck className="w-4 h-4 text-[#66FCF1]" />
          Safe Metaprogramming Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#1B1D24] p-3 rounded border border-[#1F2833]">
            <strong className="text-[#66FCF1] font-mono block mb-1">1. Cache Synthesized Methods</strong>
            Once a dynamic method is created in <code>__getattr__</code>, store it in <code>self.__dict__</code> via <code>setattr</code>. Future calls bypass <code>__getattr__</code> and achieve maximum execution speed.
          </div>
          <div className="bg-[#1B1D24] p-3 rounded border border-[#1F2833]">
            <strong className="text-[#66FCF1] font-mono block mb-1">2. Always Raise AttributeError</strong>
            If an attribute pattern does not match expected criteria in <code>__getattr__</code>, always raise <code>AttributeError</code> so standard Python tools (like <code>hasattr</code> or pickle) work correctly.
          </div>
          <div className="bg-[#1B1D24] p-3 rounded border border-[#1F2833]">
            <strong className="text-[#66FCF1] font-mono block mb-1">3. Avoid Unbounded Creation</strong>
            Validate attribute names against safe prefix rules to prevent accidental memory consumption or unintended execution paths.
          </div>
        </div>
      </div>
    </div>
  );
};
