export interface MethodDefinition {
  name: string;
  args: string[];
  docstring: string;
  sourceCode: string;
  isDynamic: boolean;
  generatedAtRuntime: boolean;
}

export interface AttributeAccessStep {
  stepNumber: number;
  phase: 'check_instance' | 'check_class_descriptors' | 'check_class_dict' | 'fallback_getattr' | 'return_value' | 'attribute_error';
  target: string;
  description: string;
  status: 'passed' | 'hit' | 'bypassed' | 'failed';
  codeHighlight?: string;
}

export interface InvocationTrace {
  id: string;
  timestamp: string;
  expression: string;
  result: string;
  steps: AttributeAccessStep[];
  dynamicMethodCreated?: string;
  objectDictSnapshot: Record<string, any>;
  classDictSnapshot: Record<string, any>;
}

export interface CodeExample {
  id: string;
  title: string;
  subtitle: string;
  category: 'getattr' | 'method_type' | 'metaclass' | 'getattribute' | 'descriptors';
  categoryName?: string;
  code: string;
  description: string;
  defaultInvocations: string[];
  initialState: {
    className: string;
    instanceDict: Record<string, any>;
    classDict: Record<string, any>;
    mro: string[];
    dynamicMethods: MethodDefinition[];
  };
}
