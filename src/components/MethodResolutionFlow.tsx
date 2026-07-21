import React from 'react';
import { AttributeAccessStep } from '../types';
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, Database, Layers, PlayCircle, HelpCircle } from 'lucide-react';

interface MethodResolutionFlowProps {
  steps: AttributeAccessStep[];
  activeStepIndex: number;
  onSelectStep?: (index: number) => void;
  targetExpression?: string;
}

export const MethodResolutionFlow: React.FC<MethodResolutionFlowProps> = ({
  steps,
  activeStepIndex,
  onSelectStep,
  targetExpression
}) => {
  const getPhaseIcon = (phase: AttributeAccessStep['phase']) => {
    switch (phase) {
      case 'check_instance':
        return <Database className="w-4 h-4 text-[#66FCF1]" />;
      case 'check_class_dict':
        return <Layers className="w-4 h-4 text-[#45A29E]" />;
      case 'fallback_getattr':
        return <Sparkles className="w-4 h-4 text-[#C592FF]" />;
      case 'return_value':
        return <CheckCircle2 className="w-4 h-4 text-[#66FCF1]" />;
      case 'attribute_error':
        return <AlertCircle className="w-4 h-4 text-[#F43F5E]" />;
      default:
        return <PlayCircle className="w-4 h-4 text-[#FFC66D]" />;
    }
  };

  const getStatusBadge = (status: AttributeAccessStep['status']) => {
    switch (status) {
      case 'hit':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/30">HIT (Found)</span>;
      case 'bypassed':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#1F2833]/50 text-[#C5C6C7]/60 border border-[#1F2833]">MISS (Proceed)</span>;
      case 'passed':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#C592FF]/10 text-[#C592FF] border border-[#C592FF]/30">SYNTHESIZED</span>;
      case 'failed':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/30">RAISED ERROR</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0F1014] border border-[#1F2833] rounded-lg p-5 shadow-2xl text-[#C5C6C7]">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1F2833]">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#66FCF1]" />
            Python Attribute & Method Lookup Pipeline
          </h3>
          <p className="text-xs text-[#45A29E] mt-1 font-mono">
            Exact resolution order followed by Python when executing <code className="text-[#66FCF1] bg-[#0A0A0B] px-1.5 py-0.5 rounded border border-[#1F2833]">{targetExpression || 'obj.attr'}</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isHit = step.status === 'hit' || step.status === 'passed';
          
          return (
            <button
              key={idx}
              onClick={() => onSelectStep?.(idx)}
              className={`p-3 rounded border text-left transition-all relative group flex flex-col justify-between ${
                isActive
                  ? 'border-[#66FCF1] bg-[#1B1D24] shadow-lg shadow-[#66FCF1]/10 ring-1 ring-[#66FCF1]'
                  : isHit
                  ? 'border-[#45A29E]/60 bg-[#1B1D24]/60 hover:border-[#66FCF1]'
                  : 'border-[#1F2833] bg-[#0A0A0B] hover:border-[#45A29E]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-mono font-bold text-[#45A29E]">STEP 0{step.stepNumber}</span>
                {getPhaseIcon(step.phase)}
              </div>
              <div className="text-xs font-mono font-medium text-white line-clamp-1 mb-2">
                {step.target}
              </div>
              <div>
                {getStatusBadge(step.status)}
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-[#1F2833]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {steps[activeStepIndex] && (
        <div className="bg-[#0A0A0B] border border-[#1F2833] rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#66FCF1] font-bold">
              Step {steps[activeStepIndex].stepNumber}: {steps[activeStepIndex].target}
            </span>
            {getStatusBadge(steps[activeStepIndex].status)}
          </div>
          <p className="text-xs text-[#C5C6C7] leading-relaxed mb-3">
            {steps[activeStepIndex].description}
          </p>
          {steps[activeStepIndex].codeHighlight && (
            <div className="bg-[#1B1D24] border border-[#1F2833] rounded p-2.5 text-xs font-mono text-[#66FCF1] overflow-x-auto">
              <code>{steps[activeStepIndex].codeHighlight}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
