# Quantum-AI Citations (enforced: Roadmap T6.4)

Every advantage / speedup / "quantum X beats classical" claim in
`quantum-course/lessons/` needs one row here. No citation → reword to
heuristic or remove. Recheck on the quarterly audit.

| Claim (lesson section) | Primary source | Status | Last checked |
|---|---|---|---|
| QML overview; what is plausibly useful vs hype | Biamonte et al., "Quantum machine learning", Nature 549, 195–202 (2017) — review | contested / evolving | 2026-09 |
| Quantum kernels / feature maps | Havlíček et al., "Supervised learning with quantum-enhanced feature spaces", Nature 567, 209–212 (2019); Schuld & Killoran, PRL 122, 040504 (2019) | proven on small demos; advantage contested | 2026-09 |
| QNN trainability limits | McClean et al., "Barren plateaus…", Nature Commun 9, 4812 (2018); Cerezo et al., Nature Commun 12, 1791 (2021) | established limitation | 2026-09 |
| NISQ-era framing (why claims are qualified) | Preskill, "Quantum Computing in the NISQ era and beyond", Quantum 2, 79 (2018) | established context | 2026-09 |
| Qiskit 1.x APIs (`qiskit_aer`, SamplerV2, no `execute`) | IBM Quantum docs (docs.quantum.ibm.com) + Qiskit 1.0 release notes | current API | 2026-09 |
| Annealing does NOT guarantee global optima | Lesson states heuristic framing; see D-Wave docs (annealing is heuristic sampling, no optimality guarantee) | established | 2026-09 |
| Textbook foundations (qubit, gates, measurement) | Nielsen & Chuang, Quantum Computation and Quantum Information, Cambridge Univ. Press | established | 2026-09 |

Rule: a new "quantum advantage" claim ships only with a paper link + status.
