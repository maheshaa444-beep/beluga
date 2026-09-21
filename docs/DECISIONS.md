# Architecture Decisions & Placeholder Documentation

## Phase 3: AI Matching Engine Placeholder

### Context
In Phase 3 of Prospect Map, company scoring and tier placement must be tailored per product (*Harbor Payroll*, *Lineage MES*, *Nimbus Shield*, *Obsidian Cost Cloud*). 

### Decision
To keep Phase 3 UI responsive, fully deterministic, and decoupled from external provider availability, we implement a local deterministic matching engine (`DeterministicMatchingService` in `features/matching/service.ts`).

### Scoring & Tier Threshold Rules
1. **Deterministic PRNG**: Seeded using `(productId, companyId)` to guarantee identical scores across sessions without random state shifts.
2. **Product Profile Alignment**:
   - **Harbor Payroll**: Favors IT & Software Services, Staffing, Enterprise HR, Financial Services.
   - **Lineage MES**: Favors Manufacturing & Engineering, Automotive Components, Aerospace & Defense.
   - **Nimbus Shield**: Favors Security, Infrastructure, Cloud Services, Enterprise Electronics.
   - **Obsidian Cost Cloud**: Favors SaaS, Cloud Infrastructure, Mid-Market Tech, IT Services.
3. **Thresholds**:
   - **High Priority**: Score >= 75 (Emerald `#10b981`)
   - **Mid Priority**: Score 50 - 74 (Amber `#f59e0b`)
   - **Least Priority**: Score < 50 (Slate `#64748b`)

### Future AI Integration Path
In Phase 4/5, `MatchRepository` will be extended to invoke background AI jobs (`lib/agents` & `lib/llm`) to generate real-time vector embeddings, pitch briefs, and live company intelligence. The contract defined in `features/matching/repository.ts` remains identical.
