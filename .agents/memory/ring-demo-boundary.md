---
name: Ring demo boundary
description: Product constraints for the Society Gate Helper's Ring simulator and any future live integration.
---

Society Gate Helper demonstrates visitor approval and logging through a signed simulator. Do not imply that the demo is connected to physical Ring hardware, that its normalized event shape is the official Ring webhook format, or that resident approval unlocks a gate.

**Why:** The project brief describes Ring developer verification and US-based hardware testing as timeline risks, and explicitly notes there is no access-control API.

**How to apply:** Keep the guard's human decision in the workflow. Before a live Ring integration, confirm the official payload and signature format and configure a developer-approved webhook secret.
