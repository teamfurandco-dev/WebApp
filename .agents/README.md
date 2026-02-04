# .agents Directory

This directory contains AI agent configuration and project context for consistent behavior across multiple AI assistants.

## Structure

```
.agents/
├── rules/           # AI behavior and state configuration
│   ├── rules.json   # Agent behavior rules and guidelines
│   └── state.json   # Project state and configuration
└── context/         # Project context documentation
    ├── design.md    # Design system and visual guidelines
    ├── glossary.md  # Domain terminology and concepts
    └── tech.md      # Technology stack and standards
```

## Purpose

This centralized configuration ensures:
- **Consistent AI behavior** across different agents
- **Shared project context** for better understanding
- **Single source of truth** for rules and guidelines
- **Easier maintenance** with organized structure

## Usage

AI agents automatically read these files to understand:
- Project tech stack and architecture
- Design principles and standards
- Domain-specific terminology
- Behavioral guidelines and preferences

## Migration Note

This structure replaces the previous `kiro/` and `.kiro/` directories, consolidating all AI configuration into a single, well-organized location.
