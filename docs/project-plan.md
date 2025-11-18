# Project Plan

## Fase 0

- [x] Brainstorming
  - [x] /analyst *brainstorm "Brainstorming & Feature Ideas"
    - [x] File : bmm-brainstorming-session-2025-10-27.md
- [x] Research
  - [x] /analyst *research "Marketing analysis"
    - [x] File : market-research-2025-10-27.md
- [x] Product Brief
   - [x] /analyst *product-brief "Read the brainstorming sessions the research session and the @proposal.md file, and create a product brief for the project."
   - [x] File : product-brief-ibe160-2025-10-30.md

## Fase 1

- [x] Planning
  - [x] /run-agent-task pm *prd
    - [x] File : bmm-PRD.md
  - [x] /run-agent-task pm *validate-prd
      - [x] File : validation-report-2025-11-16.md
  - [x] /run-agent-task ux-designer *create-ux-design {prompt / user-input-file}
    - [x] File : ux-design-specification.md
  - [x] /run-agent-task ux-designer *validate-ux-design {prompt / user-input-file}
    - [x] File : validation-report-2025-11-16.md
  - [x] /run-agent-task tea *framework {prompt / user-input-file}
  - [] /run-agent-task tea *ci {prompt / user-input-file}
  - [] /run-agent-task tea *test-design {prompt / user-input-file}

## Fase 2

- [x] Solutioning
  - [x] /run-agent-task architect *architecture {prompt / user-input-file}
  - [x] /run-agent-task architect *validate-architecture {prompt / user-input-file}

## Fase 3

- [ ] Implementation
  - [ ] /run-agent-task sm *sprint-planning {prompt / user-input-file}
  - foreach epic in sprint planning:
    - [ ] /run-agent-task sm epic-tech-content {prompt / user-input-file}
    - [ ] /run-agent-task sm validate-epic-tech-content {prompt / user-input-file}
    - foreach story in epic:
      - [ ] /run-agent-task sm *create-story {prompt / user-input-file}
      - [ ] /run-agent-task sm *validate-create-story {prompt / user-input-file}
      - [ ] /run-agent-task sm *story-context {prompt / user-input-file}
      - [ ] /run-agent-task sm *validate-story-context {prompt / user-input-file}
      - [ ] /run-agent-task tea *validate-story-ready {prompt / user-input-file}
      - [ ] /run-agent-task dev *implement-story {prompt / user-input-file}
      - [ ] /run-agent-task dev *validate-story {prompt / user-input-file}
      - [ ] /run-agent-task tea *automate {prompt / user-input-file}
      - [ ] /run-agent-task tea *test-review {prompt / user-input-file}
    - [ ] /run-agent-task sm *retrospective {prompt / user-input-file}
