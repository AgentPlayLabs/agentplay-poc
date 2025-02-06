# AgentPlay

A powerful agent-based interface system for interactive applications.

## Project Structure

The project consists of the following main directories:

- `agent/`: Backend server implementation
- `client/`: Web-based user interface
- `chain/`: Chain-end processing components

## Getting Started

### Prerequisites

- Node.js (recommended version: 16+)
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Build the project:
```bash
pnpm build
```

### Configuration

1. Configure the environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Modify the `.env` file with your settings

2. Set up character configuration:
   - Edit the character configuration file in the `characters/` directory

### Running the Application

1. Start the server (with a single character):
```bash
pnpm start --characters="characters/cn_lao.character.json"

or

pnpm start --characters="characters/cn_trump.character.json,characters/cn_mabaoguo.character.json"
```



```

2. Launch the web interface:
```bash
pnpm run start:client
```

The application should now be running and accessible through your web browser.
