import { CodeExample } from '../types';

export const SHAPESHIFTER_EXAMPLES: CodeExample[] = [
  {
    id: 'dynamic-getattr',
    title: 'The Shapeshifter Class (__getattr__)',
    subtitle: 'Dynamic method synthesis upon attribute lookup',
    category: 'getattr',
    categoryName: '__getattr__ Hook',
    description: 'When an attribute or method is not found in instance or class __dict__, Python invokes __getattr__. The Shapeshifter class intercepts missing attributes and dynamically synthesizes callable methods on the fly.',
    code: `import types

class Shapeshifter:
    """
    A class that dynamic synthesizes methods on-the-fly 
    when an accessed attribute does not exist.
    """
    def __init__(self, name="Core"):
        self.name = name
        self.transformation_history = []
        self._custom_skills = {}

    def __getattr__(self, attr_name):
        # Intercept method calls matching transform_* or compute_*
        if attr_name.startswith("transform_to_"):
            target_form = attr_name.replace("transform_to_", "")
            
            # Synthesize dynamic method
            def dynamic_transform(self_ref, *args, **kwargs):
                self_ref.transformation_history.append(target_form)
                return f"[{self_ref.name}] Shifted form into: {target_form.upper()} with args={args}"
            
            # Bind method dynamically to instance using types.MethodType
            bound_method = types.MethodType(dynamic_transform, self)
            setattr(self, attr_name, bound_method)  # Cache for future calls
            return bound_method

        if attr_name.startswith("get_property_"):
            prop = attr_name.replace("get_property_", "")
            return lambda: f"Property '{prop}' retrieved dynamically from {self.name}"

        raise AttributeError(f"'Shapeshifter' object has no attribute '{attr_name}'")

# Usage Example
hero = Shapeshifter("Proteus")

# First call triggers __getattr__ and synthesizes the method
print(hero.transform_to_dragon("fire_breath"))

# Subsequent call accesses cached method directly from instance __dict__
print(hero.transform_to_dragon("ice_breath"))
print(hero.transformation_history)`,
    defaultInvocations: [
      'hero.transform_to_dragon("fire_breath")',
      'hero.transform_to_phoenix("solar_flare")',
      'hero.get_property_energy()',
      'hero.transform_to_dragon("ice_breath")',
      'hero.non_existent_method()'
    ],
    initialState: {
      className: 'Shapeshifter',
      instanceDict: {
        'name': 'Proteus',
        'transformation_history': [],
        '_custom_skills': {}
      },
      classDict: {
        '__init__': '<function Shapeshifter.__init__>',
        '__getattr__': '<function Shapeshifter.__getattr__>'
      },
      mro: ['Shapeshifter', 'object'],
      dynamicMethods: []
    }
  },
  {
    id: 'method-type-binding',
    title: 'Dynamic Method Binding (types.MethodType)',
    subtitle: 'Attaching functions to instances as true bound methods',
    category: 'method_type',
    categoryName: 'Method Binding',
    description: 'In Python, assigning a standalone function directly to an instance creates a plain function attribute, NOT a bound method. `types.MethodType(func, instance)` wraps the function so `self` is passed automatically.',
    code: `import types

def laser_beam_ability(self, power=100):
    return f"⚡ {self.name} fired laser beam with power {power}!"

def shield_boost_ability(self, duration=10):
    self.shield_level = getattr(self, 'shield_level', 0) + duration * 5
    return f"🛡️ {self.name} boosted shield to {self.shield_level}"

class DynamicEntity:
    def __init__(self, name):
        self.name = name

    def attach_ability(self, method_name, func):
        # Attach function as a true bound method to this specific instance
        bound_method = types.MethodType(func, self)
        setattr(self, method_name, bound_method)
        return f"Attached {method_name} to {self.name}"

# Usage
mech = DynamicEntity("Apex-01")
mech.attach_ability("fire_laser", laser_beam_ability)
mech.attach_ability("activate_shield", shield_boost_ability)

print(mech.fire_laser(250))
print(mech.activate_shield(15))`,
    defaultInvocations: [
      'mech.fire_laser(250)',
      'mech.activate_shield(15)',
      'mech.fire_laser(500)'
    ],
    initialState: {
      className: 'DynamicEntity',
      instanceDict: {
        'name': 'Apex-01'
      },
      classDict: {
        '__init__': '<function DynamicEntity.__init__>',
        'attach_ability': '<function DynamicEntity.attach_ability>'
      },
      mro: ['DynamicEntity', 'object'],
      dynamicMethods: []
    }
  },
  {
    id: 'metaclass-builder',
    title: 'Metaclass Transformation (type)',
    subtitle: 'Modifying class creation behavior at load time',
    category: 'metaclass',
    categoryName: 'Metaclass Magic',
    description: 'Metaclasses are the "classes of classes". By creating a subclass of `type`, you can intercept, modify, or inject methods into class definitions before instances are ever created.',
    code: `class AutoLoggerMeta(type):
    """
    A metaclass that automatically wraps all public class methods
    with execution logging logic.
    """
    def __new__(mcs, name, bases, namespace):
        new_namespace = {}
        for attr_name, attr_value in namespace.items():
            if callable(attr_value) and not attr_name.startswith("__"):
                # Wrap public method
                def create_logged_method(func, fname):
                    def logged(self, *args, **kwargs):
                        print(f"[META-LOG] Entering method: {fname}")
                        res = func(self, *args, **kwargs)
                        print(f"[META-LOG] Exiting method: {fname}")
                        return res
                    return logged
                new_namespace[attr_name] = create_logged_method(attr_value, attr_name)
            else:
                new_namespace[attr_name] = attr_value
                
        return super().__new__(mcs, name, bases, new_namespace)

class ManagedProcess(metaclass=AutoLoggerMeta):
    def initialize(self, config_id):
        return f"Process initialized with config #{config_id}"

    def execute_payload(self, data):
        return f"Executed payload: len={len(data)}"

proc = ManagedProcess()
print(proc.initialize(404))
print(proc.execute_payload("test_data"))`,
    defaultInvocations: [
      'proc.initialize(404)',
      'proc.execute_payload("test_data")'
    ],
    initialState: {
      className: 'ManagedProcess',
      instanceDict: {},
      classDict: {
        'initialize': '<wrapped_function initialize>',
        'execute_payload': '<wrapped_function execute_payload>'
      },
      mro: ['ManagedProcess', 'object'],
      dynamicMethods: []
    }
  },
  {
    id: 'getattribute-interceptor',
    title: 'Strict Attribute Interception (__getattribute__)',
    subtitle: 'Unconditional interception for all attribute lookups',
    category: 'getattribute',
    categoryName: '__getattribute__',
    description: 'Unlike `__getattr__` which is only called when an attribute is missing, `__getattribute__` is called unconditionally for EVERY single attribute access. Extreme caution is required to prevent infinite recursion.',
    code: `class AuditedObject:
    def __init__(self, real_value):
        # We use object.__setattr__ to bypass our own __setattr__ if needed
        object.__setattr__(self, "_access_count", 0)
        object.__setattr__(self, "real_value", real_value)

    def __getattribute__(self, item):
        # MUST use object.__getattribute__ to avoid infinite recursion!
        count = object.__getattribute__(self, "_access_count")
        object.__setattr__(self, "_access_count", count + 1)
        
        print(f"[AUDIT] Reading attribute '{item}' (Access #{count + 1})")
        return object.__getattribute__(self, item)

obj = AuditedObject("Secret Data")
print(obj.real_value)
print(f"Total accesses recorded: {obj._access_count}")`,
    defaultInvocations: [
      'obj.real_value',
      'obj._access_count'
    ],
    initialState: {
      className: 'AuditedObject',
      instanceDict: {
        '_access_count': 0,
        'real_value': 'Secret Data'
      },
      classDict: {
        '__init__': '<function AuditedObject.__init__>',
        '__getattribute__': '<function AuditedObject.__getattribute__>'
      },
      mro: ['AuditedObject', 'object'],
      dynamicMethods: []
    }
  }
];
