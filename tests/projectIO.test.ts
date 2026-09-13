import { describe, it, expect } from 'vitest';
import { createDefaultProject, exportProjectToJSON, parseProjectJSON } from '../src/services/storage/projectIO';

describe('Project IO & Serialization', () => {
  it('creates a valid default project schema', () => {
    const proj = createDefaultProject('Test Proj', 'Test Description');
    expect(proj.schemaVersion).toBe(1);
    expect(proj.project.name).toBe('Test Proj');
    expect(proj.nodes.length).toBeGreaterThan(0);
  });

  it('serializes and deserializes project correctly', () => {
    const proj = createDefaultProject('Roundtrip App');
    const jsonStr = exportProjectToJSON(proj);
    const parsed = parseProjectJSON(jsonStr);

    expect(parsed.project.name).toBe(proj.project.name);
    expect(parsed.nodes.length).toBe(proj.nodes.length);
    expect(parsed.schemaVersion).toBe(1);
  });

  it('throws helpful error on invalid JSON', () => {
    expect(() => parseProjectJSON('not valid json')).toThrow('Invalid JSON format');
    expect(() => parseProjectJSON('{"random": 123}')).toThrow('Missing project metadata');
  });
});
