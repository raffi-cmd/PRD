import { describe, it, expect } from 'vitest';
import { createDefaultProject, exportProjectToJSON, parseProjectJSON } from '../src/services/storage/projectIO';

describe('Project IO & Serialization', () => {
  it('creates a valid default project schema with design intent', () => {
    const proj = createDefaultProject('Test Proj', 'Test Description');
    expect(proj.schemaVersion).toBe(2);
    expect(proj.project.name).toBe('Test Proj');
    expect(proj.nodes.length).toBeGreaterThan(0);
    expect(proj.designIntent).toBeDefined();
    expect(proj.designIntent?.northStar.statement).toContain('Technical');
    expect(proj.designIntent?.visualReferences.length).toBeGreaterThan(0);
  });

  it('serializes and deserializes project correctly', () => {
    const proj = createDefaultProject('Roundtrip App');
    const jsonStr = exportProjectToJSON(proj);
    const parsed = parseProjectJSON(jsonStr);

    expect(parsed.project.name).toBe(proj.project.name);
    expect(parsed.nodes.length).toBe(proj.nodes.length);
    expect(parsed.schemaVersion).toBe(2);
    expect(parsed.designIntent).toBeDefined();
    expect(parsed.designIntent?.northStar.statement).toBe(proj.designIntent?.northStar.statement);
  });

  it('migrates legacy schema v1 projects to schema v2 with default design intent', () => {
    const legacyV1Json = JSON.stringify({
      schemaVersion: 1,
      project: { id: 'p1', name: 'Legacy App', version: 1, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
      nodes: [],
      edges: [],
      settings: { autoSave: true, snapToGrid: true, theme: 'dark', aiConfig: { provider: 'gemini', apiKey: '', model: 'gemini-3.7-flash', temperature: 0.4 } }
    });
    const migrated = parseProjectJSON(legacyV1Json);

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.designIntent).toBeDefined();
    expect(migrated.designIntent?.northStar.statement).toBeDefined();
    expect(migrated.designIntent?.visualReferences).toBeDefined();
  });

  it('throws helpful error on invalid JSON', () => {
    expect(() => parseProjectJSON('not valid json')).toThrow('Invalid JSON format');
    expect(() => parseProjectJSON('{"random": 123}')).toThrow('Missing project metadata');
  });
});
