// .claude/schemas/spec-schemas.ts
import { z } from 'zod';

// Mock data structure schemas
const MockRequestSchema = z.record(z.any());
const MockResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

const MockScenarioSchema = z.object({
  request: MockRequestSchema.optional(),
  response: MockResponseSchema,
});

const MockFeatureSchema = z.record(MockScenarioSchema);
const MocksSchema = z.record(MockFeatureSchema);

// System setup schema
const SystemSchema = z.object({
  complete: z.boolean(),
  packages: z.array(z.string()).optional(),
  commands: z.array(z.string()).optional(),
  files: z.record(z.string()).optional(), // filename -> content
  env_vars: z.record(z.string()).optional(), // .env additions
});

// API endpoint schema
const ApiEndpointSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string(),
  mock: z.string(), // Reference to mock object path like "user.create"
});

// APIs section schema
const ApisSchema = z.object({
  complete: z.boolean(),
  endpoints: z.array(ApiEndpointSchema),
  tests: z.array(z.string()), // Test descriptions
});

// UI scenario schema
const UiScenarioSchema = z.object({
  name: z.string(),
  data: z.string().optional(), // Reference to mock data like "user.create.request"
  action: z.string().optional(), // User action like "click button"
  expect: z.string(), // Expected outcome
});

// UI section schema
const UiSchema = z.object({
  complete: z.boolean(),
  url: z.string(),
  scenarios: z.array(UiScenarioSchema),
  components: z.array(z.string()),
});

// Main spec schema
export const SpecSchema = z.object({
  id: z.number(),
  title: z.string(),
  why: z.string(),
  depends: z.array(z.number()).optional(),
  notes: z.string().optional(),
  system: SystemSchema.optional(),
  mocks: MocksSchema.optional(),
  apis: ApisSchema.optional(),
  ui: UiSchema.optional(),
}).refine(
  (data) => data.system || data.mocks || data.apis || data.ui,
  { 
    message: "At least one of system, mocks, apis, or ui must be specified",
    path: ["root"]
  }
);

// Type exports for use in agents
export type Spec = z.infer<typeof SpecSchema>;
export type SystemSection = z.infer<typeof SystemSchema>;
export type MockScenario = z.infer<typeof MockScenarioSchema>;
export type ApiEndpoint = z.infer<typeof ApiEndpointSchema>;
export type UiScenario = z.infer<typeof UiScenarioSchema>;

// Validation helper function
export function validateSpec(specData: unknown): { success: true; data: Spec } | { success: false; error: string } {
  try {
    const validated = SpecSchema.parse(specData);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}

// Helper to extract spec completion status
export function getSpecProgress(spec: Spec): {
  total: number;
  complete: number;
  sections: { name: string; complete: boolean }[];
} {
  const sections = [];
  
  if (spec.system) sections.push({ name: 'system', complete: spec.system.complete });
  if (spec.mocks) sections.push({ name: 'mocks', complete: true }); // Mocks don't have completion status
  if (spec.apis) sections.push({ name: 'apis', complete: spec.apis.complete });
  if (spec.ui) sections.push({ name: 'ui', complete: spec.ui.complete });
  
  const complete = sections.filter(s => s.complete).length;
  
  return {
    total: sections.length,
    complete,
    sections
  };
}