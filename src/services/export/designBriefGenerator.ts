import { ProjectSchema, DesignIntentData } from '../../types/project';
import { createDefaultDesignIntent } from '../storage/projectIO';

export function generateDesignBriefMarkdown(project: ProjectSchema): string {
  const meta = project.project;
  const design: DesignIntentData = project.designIntent || createDefaultDesignIntent();

  const forbiddenStr = design.antiPatterns.forbidden.map((f) => `- ${f}`).join('\n');
  const criteriaStr = design.visualAcceptanceCriteria.criteria.map((c) => `- [ ] ${c}`).join('\n');
  const philosophyStr = design.interaction.philosophy.join(', ');
  const a11yStr = design.accessibility.requirements.map((r) => `- ${r}`).join('\n');

  let referencesBlock = '_No visual references attached._';
  if (design.visualReferences && design.visualReferences.length > 0) {
    referencesBlock = design.visualReferences
      .map((ref, idx) => {
        const borrow = ref.whatToBorrow?.length ? ref.whatToBorrow.join(', ') : 'None';
        const notCopy = ref.whatNotToCopy?.length ? ref.whatNotToCopy.join(', ') : 'None';
        const obs = ref.analysis
          ? `\n  - **Layout**: ${ref.analysis.layout || 'N/A'}\n  - **Density**: ${ref.analysis.density || 'N/A'}\n  - **Typography**: ${ref.analysis.typography || 'N/A'}\n  - **Hierarchy**: ${ref.analysis.hierarchy || 'N/A'}`
          : '';
        return `### Reference ${idx + 1}: ${ref.title}\n- **Notes**: ${ref.notes || 'N/A'}\n- **What to Borrow**: ${borrow}\n- **What NOT to Copy**: ${notCopy}${obs}`;
      })
      .join('\n\n');
  }

  return `# DESIGN INTENT BRIEF: ${meta.name}

> Concise, implementation-oriented design rationale for autonomous coding agents.
> Project Type: ${design.projectType === 'existing_project' ? `Existing Project (${design.existingProjectAction || 'Refine Identity'})` : 'New Product Build'}

---

## 1. DESIGN NORTH STAR
> **${design.northStar?.statement || 'Technical, calm, information-dense, and precise.'}**

## 2. VISUAL DIRECTION
- **Direction**: ${design.visualDirection.direction}
- **Rationale**: ${design.visualDirection.rationale}

## 3. VISUAL METAPHOR
- **Real-World Reference**: ${design.visualMetaphor.metaphor}
- **Impact on Layout & Components**: ${design.visualMetaphor.impact}

## 4. VISUAL REFERENCES & PRINCIPLES
${referencesBlock}

## 5. LAYOUT STRATEGY
- **Container & Grid**: ${design.layoutStrategy.containerWidth || 'Max-width 1280px'} | ${design.layoutStrategy.gridAndColumns || '2-column split'}
- **Primary Focal Point**: ${design.layoutStrategy.focalPoint || 'Primary calculated output'}
- **Desktop Layout**: ${design.layoutStrategy.desktop}
- **Mobile Layout**: ${design.layoutStrategy.mobile}
- **Whitespace Philosophy**: ${design.layoutStrategy.whitespacePhilosophy || 'Intentional around primary content, minimal between related controls'}

## 6. TYPOGRAPHY DIRECTION
- **Display Typography**: ${design.typography.display || 'Clean geometric sans'}
- **Body Typography**: ${design.typography.body || 'Neutral system sans'}
- **Numeric & Data Typography**: ${design.typography.numericData || 'Tabular monospace'}
- **Communication Style**: ${design.typography.communicationStyle}
- **Hierarchy Details**: ${design.typography.details}
${design.typography.monospaceUsage ? `- **Monospace Rule**: ${design.typography.monospaceUsage}` : ''}

## 7. COLOR DIRECTION
- **Primary Role**: ${design.color.primaryRole}
- **Accent Role**: ${design.color.accentRole}
- **Surface Character**: ${design.color.surfaceCharacter}
- **Contrast Expectations**: ${design.color.contrastExpectations}

## 8. COMPONENT CHARACTER
- **General Styling**: ${design.components.generalCharacter}
- **Borders & Radius**: ${design.components.borderTreatment || 'Subtle 1px border'} | Radius: ${design.components.radius || 'Rounded-lg'}
- **Shadows**: ${design.components.shadows || 'Minimal elevation'}
- **Cards**: ${design.components.cards || 'Use sparingly; avoid card soup.'}
- **Buttons**: ${design.components.buttons || 'Primary action visually dominates secondary utility controls.'}
- **Inputs**: ${design.components.inputs || 'Utility controls with explicit state feedback.'}
- **Icons**: ${design.components.icons || 'Functional only; no decorative icon spam.'}

## 9. INTERACTION CHARACTER
- **Philosophy**: ${philosophyStr}
- **Motion Intensity**: ${design.interaction.motionIntensity || 'Subtle & instantaneous (<150ms)'}
- **Motion & State Feedback**: ${design.interaction.motionAndStates}

## 10. DENSITY
- **Overall Level**: ${design.density.level.toUpperCase()}
- **Specific Density Rules**: ${design.density.rules}

## 11. RESPONSIVE BEHAVIOR
- **Breakpoint Behavior**: ${design.responsiveIntent.breakpointRules}
- **Mobile Priority**: ${design.responsiveIntent.mobilePriority}

## 12. ACCESSIBILITY INTENT
${a11yStr}

## 13. ANTI-PATTERNS (MUST NOT APPEAR)
${forbiddenStr}
${design.antiPatterns.overcorrectionWarning ? `\n> **Overcorrection Warning**: ${design.antiPatterns.overcorrectionWarning}` : ''}

## 14. VISUAL ACCEPTANCE CRITERIA
${criteriaStr}
`;
}
