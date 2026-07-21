import React, { useState } from 'react';
import { SHAPESHIFTER_EXAMPLES } from './data/shapeshifterExamples';
import { AttributeAccessStep, InvocationTrace, MethodDefinition } from './types';
import { MethodResolutionFlow } from './components/MethodResolutionFlow';
import { ObjectInspector } from './components/ObjectInspector';
import { CodePlayground } from './components/CodePlayground';
import { TheoryGuide } from './components/TheoryGuide';
import { Sparkles, Terminal, Cpu, BookOpen, Layers, PlayCircle, Code } from 'lucide-react';

export default function App() {
  const [selectedExampleId, setSelectedExampleId] = useState(SHAPESHIFTER_EXAMPLES[0].id);
  const [activeTab, setActiveTab] = useState<'playground' | 'pipeline' | 'inspector' | 'theory'>('playground');

  const example = SHAPESHIFTER_EXAMPLES.find((e) => e.id === selectedExampleId) || SHAPESHIFTER_EXAMPLES[0];

  // Dynamic Runtime State
  const [instanceDict, setInstanceDict] = useState<Record<string, any>>(example.initialState.instanceDict);
  const [dynamicMethods, setDynamicMethods] = useState<MethodDefinition[]>([]);
  const [invocationTraces, setInvocationTraces] = useState<InvocationTrace[]>([]);
  const [activeResolutionSteps, setActiveResolutionSteps] = useState<AttributeAccessStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Reset example state
  const handleSelectExample = (id: string) => {
    setSelectedExampleId(id);
    const ex = SHAPESHIFTER_EXAMPLES.find((e) => e.id === id) || SHAPESHIFTER_EXAMPLES[0];
    setInstanceDict(ex.initialState.instanceDict);
    setDynamicMethods([]);
    setInvocationTraces([]);
    setActiveResolutionSteps([]);
    setActiveStepIndex(0);
  };

  const handleReset = () => {
    setInstanceDict(example.initialState.instanceDict);
    setDynamicMethods([]);
    setInvocationTraces([]);
    setActiveResolutionSteps([]);
    setActiveStepIndex(0);
  };

  // Dynamic Simulation Engine for Python Execution
  const handleExecuteExpression = (expression: string) => {
    const timestamp = new Date().toLocaleTimeString();
    let resultOutput = '';
    let steps: AttributeAccessStep[] = [];
    let dynamicCreated: string | undefined = undefined;

    // Evaluate expression type
    if (expression.includes('transform_to_')) {
      const match = expression.match(/transform_to_([a-zA-Z0-9_]+)\((.*)\)/);
      const targetForm = match ? match[1] : 'unknown';
      const args = match ? match[2] : '';

      const isCached = !!instanceDict[`transform_to_${targetForm}`];

      if (isCached) {
        steps = [
          {
            stepNumber: 1,
            phase: 'check_instance',
            target: 'instance.__dict__',
            description: `Attribute 'transform_to_${targetForm}' found in instance.__dict__! Bypassing __getattr__.`,
            status: 'hit',
            codeHighlight: `instance.__dict__["transform_to_${targetForm}"] -> <bound method>`
          },
          {
            stepNumber: 2,
            phase: 'return_value',
            target: 'Execute Bound Method',
            description: `Executed cached bound method directly from memory.`,
            status: 'hit',
            codeHighlight: `[${instanceDict.name || 'Proteus'}] Shifted form into: ${targetForm.toUpperCase()} with args=(${args})`
          }
        ];
        resultOutput = `[${instanceDict.name || 'Proteus'}] Shifted form into: ${targetForm.toUpperCase()} with args=(${args})`;
      } else {
        steps = [
          {
            stepNumber: 1,
            phase: 'check_instance',
            target: 'instance.__dict__',
            description: `Attribute 'transform_to_${targetForm}' NOT found in instance.__dict__.`,
            status: 'bypassed'
          },
          {
            stepNumber: 2,
            phase: 'check_class_dict',
            target: `${example.initialState.className}.__dict__`,
            description: `Attribute NOT found in class or parent classes (MRO).`,
            status: 'bypassed'
          },
          {
            stepNumber: 3,
            phase: 'fallback_getattr',
            target: '__getattr__ Hook Invoked',
            description: `Python invoked __getattr__('transform_to_${targetForm}'). Matched prefix 'transform_to_'. Dynamically synthesized method!`,
            status: 'passed',
            codeHighlight: `def dynamic_transform(self_ref, *args): ...\nbound_method = types.MethodType(dynamic_transform, self)\nsetattr(self, 'transform_to_${targetForm}', bound_method)`
          },
          {
            stepNumber: 4,
            phase: 'return_value',
            target: 'Bound Method Cached & Executed',
            description: `Successfully attached method to instance and executed.`,
            status: 'hit',
            codeHighlight: `[${instanceDict.name || 'Proteus'}] Shifted form into: ${targetForm.toUpperCase()} with args=(${args})`
          }
        ];

        resultOutput = `[${instanceDict.name || 'Proteus'}] Shifted form into: ${targetForm.toUpperCase()} with args=(${args})`;
        dynamicCreated = `transform_to_${targetForm}`;

        // Update Instance Dict & Dynamic Methods Cache
        setInstanceDict((prev) => ({
          ...prev,
          [`transform_to_${targetForm}`]: `<bound method Shapeshifter.transform_to_${targetForm} of <Shapeshifter object>>`,
          transformation_history: [...(prev.transformation_history || []), targetForm]
        }));

        setDynamicMethods((prev) => [
          ...prev,
          {
            name: `transform_to_${targetForm}`,
            args: ['*args'],
            docstring: `Dynamic transformation method to ${targetForm}`,
            sourceCode: `def dynamic_transform(self, *args):\n  return "[${instanceDict.name}] Shifted into ${targetForm}"`,
            isDynamic: true,
            generatedAtRuntime: true
          }
        ]);
      }
    } else if (expression.includes('get_property_')) {
      const propMatch = expression.match(/get_property_([a-zA-Z0-9_]+)\(\)/);
      const propName = propMatch ? propMatch[1] : 'energy';

      steps = [
        {
          stepNumber: 1,
          phase: 'check_instance',
          target: 'instance.__dict__',
          description: `Attribute 'get_property_${propName}' not found in instance.`,
          status: 'bypassed'
        },
        {
          stepNumber: 2,
          phase: 'fallback_getattr',
          target: '__getattr__ Invoked',
          description: `Synthesized property lambda getter for property '${propName}'.`,
          status: 'passed',
          codeHighlight: `return lambda: f"Property '${propName}' retrieved dynamically from {self.name}"`
        }
      ];

      resultOutput = `Property '${propName}' retrieved dynamically from ${instanceDict.name || 'Proteus'}`;
    } else if (expression.includes('fire_laser') || expression.includes('activate_shield')) {
      const isLaser = expression.includes('fire_laser');
      resultOutput = isLaser
        ? `⚡ ${instanceDict.name || 'Apex-01'} fired laser beam with power!`
        : `🛡️ ${instanceDict.name || 'Apex-01'} boosted shield level!`;

      steps = [
        {
          stepNumber: 1,
          phase: 'check_instance',
          target: 'instance.__dict__',
          description: `Found bound method dynamically attached via types.MethodType!`,
          status: 'hit',
          codeHighlight: `instance.__dict__["${isLaser ? 'fire_laser' : 'activate_shield'}"]`
        }
      ];
    } else {
      // Non-existent attribute
      steps = [
        {
          stepNumber: 1,
          phase: 'check_instance',
          target: 'instance.__dict__',
          description: `Attribute not in instance dictionary.`,
          status: 'bypassed'
        },
        {
          stepNumber: 2,
          phase: 'check_class_dict',
          target: `${example.initialState.className}.__dict__`,
          description: `Attribute not in class or parent MRO.`,
          status: 'bypassed'
        },
        {
          stepNumber: 3,
          phase: 'fallback_getattr',
          target: '__getattr__ Fallback',
          description: `No dynamic rule matched pattern in __getattr__. Raising AttributeError.`,
          status: 'failed',
          codeHighlight: `AttributeError: '${example.initialState.className}' object has no attribute '${expression}'`
        }
      ];
      resultOutput = `AttributeError: '${example.initialState.className}' object has no attribute '${expression}'`;
    }

    setActiveResolutionSteps(steps);
    setActiveStepIndex(0);

    const newTrace: InvocationTrace = {
      id: Math.random().toString(),
      timestamp,
      expression,
      result: resultOutput,
      steps,
      dynamicMethodCreated: dynamicCreated,
      objectDictSnapshot: { ...instanceDict },
      classDictSnapshot: { ...example.initialState.classDict }
    };

    setInvocationTraces((prev) => [newTrace, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#C5C6C7] font-sans selection:bg-[#66FCF1] selection:text-[#0B0C10] flex flex-col justify-between">
      {/* Header */}
      <header className="h-16 border-b border-[#1F2833] bg-[#0B0C10] sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#45A29E] rounded flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[#1B1B1B] rotate-45"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-[#66FCF1] uppercase leading-none">
              SHAPESHIFTER.v4
            </span>
            <span className="text-[10px] text-[#45A29E] font-mono mt-1">
              KERNEL: ACTIVE // MODE: ANALYTICS
            </span>
          </div>
        </div>

        {/* Example Selector & Security Info */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-tighter opacity-50">Security Protocol</span>
            <span className="text-xs text-[#66FCF1] font-mono">STRICT_CONSTRAINTS_ENABLED</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-[#1F2833]"></div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#45A29E] font-mono">Pattern:</span>
            <select
              value={selectedExampleId}
              onChange={(e) => handleSelectExample(e.target.value)}
              className="bg-[#1B1D24] border border-[#1F2833] rounded px-3 py-1.5 text-xs font-mono text-[#66FCF1] focus:outline-none focus:border-[#66FCF1] cursor-pointer"
            >
              {SHAPESHIFTER_EXAMPLES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 space-y-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1F2833] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t border-t border-x flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'playground'
                ? 'bg-[#0F1014] border-[#1F2833] text-[#66FCF1] border-b-2 border-b-[#66FCF1]'
                : 'bg-transparent border-transparent text-[#C5C6C7]/60 hover:text-[#C5C6C7]'
            }`}
          >
            <Code className="w-4 h-4 text-[#45A29E]" />
            Interactive Code & Execution
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t border-t border-x flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'bg-[#0F1014] border-[#1F2833] text-[#66FCF1] border-b-2 border-b-[#66FCF1]'
                : 'bg-transparent border-transparent text-[#C5C6C7]/60 hover:text-[#C5C6C7]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#45A29E]" />
            Lookup Resolution Pipeline
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t border-t border-x flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'inspector'
                ? 'bg-[#0F1014] border-[#1F2833] text-[#66FCF1] border-b-2 border-b-[#66FCF1]'
                : 'bg-transparent border-transparent text-[#C5C6C7]/60 hover:text-[#C5C6C7]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#45A29E]" />
            Object Memory & __dict__ Inspector
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t border-t border-x flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'theory'
                ? 'bg-[#0F1014] border-[#1F2833] text-[#66FCF1] border-b-2 border-b-[#66FCF1]'
                : 'bg-transparent border-transparent text-[#C5C6C7]/60 hover:text-[#C5C6C7]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#45A29E]" />
            Metaprogramming Architecture Guide
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'playground' && (
          <div className="space-y-6">
            <CodePlayground
              example={example}
              onExecute={handleExecuteExpression}
              invocationTraces={invocationTraces}
              onReset={handleReset}
            />

            {/* If there's an active lookup pipeline trace, display inline visual resolution */}
            {activeResolutionSteps.length > 0 && (
              <MethodResolutionFlow
                steps={activeResolutionSteps}
                activeStepIndex={activeStepIndex}
                onSelectStep={(idx) => setActiveStepIndex(idx)}
                targetExpression={invocationTraces[0]?.expression}
              />
            )}
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <MethodResolutionFlow
              steps={
                activeResolutionSteps.length > 0
                  ? activeResolutionSteps
                  : [
                      {
                        stepNumber: 1,
                        phase: 'check_instance',
                        target: 'instance.__dict__',
                        description: 'Python first checks if the requested attribute exists directly on the object instance dictionary.',
                        status: 'bypassed'
                      },
                      {
                        stepNumber: 2,
                        phase: 'check_class_dict',
                        target: 'Class & MRO Search',
                        description: 'If absent from instance, Python searches class attributes, data descriptors, and parent classes.',
                        status: 'bypassed'
                      },
                      {
                        stepNumber: 3,
                        phase: 'fallback_getattr',
                        target: '__getattr__ Hook',
                        description: 'If attribute is absent everywhere, Python invokes __getattr__ if defined on the class.',
                        status: 'passed',
                        codeHighlight: 'def __getattr__(self, name): return synthesized_method'
                      }
                    ]
              }
              activeStepIndex={activeStepIndex}
              onSelectStep={(idx) => setActiveStepIndex(idx)}
              targetExpression={invocationTraces[0]?.expression || 'hero.transform_to_dragon("fire")'}
            />
          </div>
        )}

        {activeTab === 'inspector' && (
          <ObjectInspector
            className={example.initialState.className}
            instanceDict={instanceDict}
            classDict={example.initialState.classDict}
            mro={example.initialState.mro}
            dynamicMethods={dynamicMethods}
          />
        )}

        {activeTab === 'theory' && <TheoryGuide />}
      </main>

      {/* Footer */}
      <footer className="h-12 bg-[#0F1014] border-t border-[#1F2833] flex items-center px-6 justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5C6C7]/70">
        <div>Core Instructions: <span className="text-[#66FCF1]">Validated</span></div>
        <div className="flex gap-6">
          <span>CPU: 12%</span>
          <span>MEM: 1.4GB</span>
          <span className="text-[#45A29E]">Status: Locked</span>
        </div>
      </footer>
    </div>
  );
}
