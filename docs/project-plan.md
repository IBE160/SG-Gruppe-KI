# Project Plan

## Fase 0

- [x] Brainstorming
  - [x] /analyst *brainstorm "Brainstorming & Feature Ideas"
    - [x] File : brainstorming.md
- [x] Research
  - [x] /analyst *research "Marketing analysis"
    - [x] File : market-research.md
- [x] Product Brief
   - [x] /analyst *product-brief "Read the brainstorming sessions the research session and the @proposal.md file, and create a product brief for the project."
   - [x] File : product-brief.md

## Fase 1

- [x] Planning
  - [x] /run-agent-task pm *prd
    - [x] File : PRD.md
    - [x] File : epics.md
  - [x] /run-agent-task pm *validate-prd
      - [x] File : validation-report-PRD.md
  - [x] /run-agent-task ux-designer *create-ux-design {prompt / user-input-file}
    - [x] File : ux-design-specification.md
    - [x] File : ux-color-themes.html
    - [x] File : ux-design-directions.html
  - [x] /run-agent-task ux-designer *validate-ux-design {prompt / user-input-file}
    - [x] File : validation-report-ux-design.md
  - [x] /run-agent-task tea *framework {prompt / user-input-file}
  - [x] /run-agent-task tea *ci {prompt / user-input-file}
  - [x] /run-agent-task tea *test-design {prompt / user-input-file}
    - [x] File : master-test-plan.md

## Fase 2

- [x] Solutioning
  - [x] /run-agent-task architect *architecture {prompt / user-input-file}
    - [x] File : architecture.md
  - [x] /run-agent-task architect *validate-architecture {prompt / user-input-file}
    - [x] File : validation-report-architecture.md

## Fase 3

- [x] Implementation
  - [x] /run-agent-task sm *sprint-planning {prompt / user-input-file}
  - foreach epic in sprint planning:
    - [x] File : sprint-status.md
  - [x] /run-agent-task sm epic-tech-content {prompt / user-input-file}
    - [x] File : tech-spec-epic-1.md
    - [x] File : tech-spec-epic-2.md
    - [x] File : tech-spec-epic-3.md
  - [x] /run-agent-task sm validate-epic-tech-content {prompt / user-input-file}
    - [x] File : validation-report-tech-spec-epic-1.md
    - [x] File : validation-report-tech-spec-epic-2.md
    - [x] File : validation-report-tech-spec-epic-3.md

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
