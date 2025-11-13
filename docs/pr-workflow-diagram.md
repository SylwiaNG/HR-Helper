# PR Validation Workflow - Diagram

## Workflow Flow

```mermaid
graph TD
    A[Pull Request do master/main] --> B{PR Created/Updated}
    B --> C[Code Quality Check]
    
    C --> D{ESLint Pass?}
    D -->|Yes| E[TypeScript Check]
    D -->|No| F[❌ Fail - Stop]
    
    E --> G{TypeScript Pass?}
    G -->|Yes| H[✅ Code Quality Success]
    G -->|No| F
    
    H --> I[Unit Tests]
    
    I --> J[Run Jest Tests]
    J --> K{Tests Pass?}
    K -->|Yes| L[Generate Coverage]
    K -->|No| M[❌ Unit Tests Fail]
    
    L --> N[Upload Coverage Artifact]
    N --> O[Comment Coverage on PR]
    O --> P[✅ Unit Tests Success]
    
    P --> Q{Changed files in src/ or tests/e2e/?}
    Q -->|Yes| R[E2E Tests]
    Q -->|No| S[⏭️ Skip E2E Tests]
    
    R --> T[Install Playwright]
    T --> U[Setup Test Environment]
    U --> V[Build Application]
    V --> W[Run E2E Tests]
    W --> X{E2E Pass?}
    X -->|Yes| Y[✅ E2E Success]
    X -->|No| Z[❌ E2E Fail - Continue]
    
    Y --> AA[Upload Playwright Report]
    Z --> AA
    S --> BB[Validation Summary]
    P --> BB
    AA --> BB
    M --> BB
    
    BB --> CC{All Required Pass?}
    CC -->|Yes| DD[✅ Post Success Comment]
    CC -->|No| EE[❌ Post Failure Comment]
    
    DD --> FF[✅ PR Ready for Review]
    EE --> GG[❌ PR Needs Fixes]
```

## Job Dependencies

```mermaid
graph LR
    A[Code Quality] --> B[Unit Tests]
    B --> C[E2E Tests - Optional]
    A --> D[Validation Summary]
    B --> D
    C --> D
```

## Timeline Example (Successful PR)

```mermaid
gantt
    title PR Validation Timeline
    dateFormat  ss
    section Code Quality
    Checkout & Setup           :a1, 00, 30s
    NPM Install                :a2, after a1, 60s
    ESLint                     :a3, after a2, 20s
    TypeScript Check           :a4, after a3, 15s
    
    section Unit Tests
    Checkout & Setup           :b1, after a4, 30s
    NPM Install                :b2, after b1, 60s
    Run Tests                  :b3, after b2, 90s
    Generate Coverage          :b4, after b3, 10s
    Upload Artifacts           :b5, after b4, 15s
    
    section E2E Tests
    Checkout & Setup           :c1, after b5, 30s
    NPM Install                :c2, after c1, 60s
    Install Playwright         :c3, after c2, 45s
    Build App                  :c4, after c3, 120s
    Run E2E Tests              :c5, after c4, 180s
    Upload Reports             :c6, after c5, 20s
    
    section Summary
    Check Results              :d1, after c6, 10s
    Post Comments              :d2, after d1, 15s
```

## Decision Tree

```mermaid
flowchart TD
    Start([PR Created]) --> Check1{Code Quality?}
    Check1 -->|Pass| Check2{Unit Tests?}
    Check1 -->|Fail| End1([❌ BLOCK MERGE])
    
    Check2 -->|Pass| Check3{Files Changed?}
    Check2 -->|Fail| End1
    
    Check3 -->|src/ or tests/e2e/| E2E[Run E2E Tests]
    Check3 -->|Other files| Summary[Validation Summary]
    
    E2E --> Check4{E2E Pass?}
    Check4 -->|Pass| Summary
    Check4 -->|Fail| Warning[⚠️ Warning - Continue]
    Warning --> Summary
    
    Summary --> Final{All Required Pass?}
    Final -->|Yes| End2([✅ ALLOW MERGE])
    Final -->|No| End1
```

## Status Badge States

```mermaid
stateDiagram-v2
    [*] --> Pending: PR Created
    Pending --> Running: Workflow Started
    Running --> CodeQuality: Job 1
    
    CodeQuality --> Success1: ✅ Pass
    CodeQuality --> Failed: ❌ Fail
    
    Success1 --> UnitTests: Job 2
    UnitTests --> Success2: ✅ Pass
    UnitTests --> Failed
    
    Success2 --> E2E_Check: Conditional
    E2E_Check --> E2E: Run E2E
    E2E_Check --> Summary: Skip E2E
    
    E2E --> Success3: ✅ Pass
    E2E --> Warning: ⚠️ Fail (Continue)
    
    Success3 --> Summary
    Warning --> Summary
    
    Summary --> AllPassed: ✅ All Required Pass
    Summary --> Failed: ❌ Any Required Fail
    
    AllPassed --> [*]: Ready to Merge
    Failed --> [*]: Blocked
```

## Artifact Flow

```mermaid
flowchart LR
    A[Unit Tests Job] --> B[Generate Coverage]
    B --> C[coverage/]
    C --> D[Upload Artifact]
    D --> E[Downloadable for 7 days]
    
    F[E2E Tests Job] --> G[Run Playwright]
    G --> H1[playwright-report/]
    G --> H2[test-results/]
    H1 --> I[Upload Artifacts]
    H2 --> I
    I --> J[Downloadable for 7 days]
    
    B --> K[Coverage Summary JSON]
    K --> L[Parse in Summary Job]
    L --> M[Comment on PR]
```

## Notification Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GitHub as GitHub
    participant Workflow as PR Validation
    participant Checks as Status Checks
    
    Dev->>GitHub: Push to PR branch
    GitHub->>Workflow: Trigger workflow
    
    Workflow->>Checks: Update: Code Quality Running
    Workflow->>Checks: Update: Code Quality ✅
    
    Workflow->>Checks: Update: Unit Tests Running
    Workflow->>Checks: Update: Unit Tests ✅
    Workflow->>GitHub: Comment: Coverage Report
    
    Workflow->>Checks: Update: E2E Tests Running
    Workflow->>Checks: Update: E2E Tests ✅
    
    Workflow->>Checks: Update: Summary ✅
    Workflow->>GitHub: Comment: All Checks Passed
    
    GitHub->>Dev: Notification: PR Ready
```

---

## Legend

### Status Indicators
- ✅ Success (green)
- ❌ Failure (red)
- ⏭️ Skipped (gray)
- ⚠️ Warning (yellow)
- 🔄 Running (blue)

### Job Types
- **Required Jobs**: Must pass for merge
  - Code Quality
  - Unit Tests
  - Validation Summary

- **Optional Jobs**: Can fail without blocking
  - E2E Tests (conditional)

### Timing Estimates
- Code Quality: ~2 min
- Unit Tests: ~3 min
- E2E Tests: ~6 min
- Summary: ~30 sec

**Total (with E2E): ~11 min**  
**Total (without E2E): ~5 min**

---

*Diagrams generated with Mermaid syntax*
