# FlowSure Frontend

A Next.js 14 dashboard for FlowSure - Transaction Protection on Flow Blockchain.

## Features

- **Dashboard**: Monitor active protections, retry queue, claims, and vault stats
- **FROTH Staking**: Stake FROTH tokens to unlock insurance discounts and earn rewards
- **Dapper Protection**: Protect your valuable Dapper NFTs (NBA Top Shot, NFL All Day, Disney Pinnacle)
- **Insure Transaction**: Wrap transactions with automatic retry protection
- **Flo Mascot**: Interactive mascot with context-aware states and animations

## Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Blockchain**: @onflow/fcl
- **State Management**: Zustand + React Query
- **Animation**: Framer Motion
- **API Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FROTH_REWARDS_ADDRESS=0x8401ed4fc6788c8a
NEXT_PUBLIC_DAPPER_PROTECTION_ADDRESS=0x8401ed4fc6788c8a
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard
│   ├── froth/             # FROTH Staking page
│   ├── dapper/            # Dapper Protection page
│   └── insure/            # Insure Transaction page
├── components/
│   ├── pages/             # Page components
│   ├── ui/                # shadcn/ui components
│   ├── navigation.tsx     # Main navigation
│   ├── main-layout.tsx    # Layout wrapper
│   └── flo-mascot.tsx     # Flo mascot component
├── lib/
│   ├── flow-config.ts     # Flow blockchain configuration
│   ├── api-client.ts      # API client with endpoints
│   └── utils.ts           # Utility functions
└── store/
    ├── wallet-store.ts    # Wallet state management
    └── mascot-store.ts    # Mascot state management
```

## Pages

### Dashboard (`/`)
- Active protections list
- Retry queue with countdown timers
- Claims/compensations history
- Vault overview stats

### FROTH Staking (`/froth`)
- Stake/unstake FROTH tokens
- View rewards and discount tier
- Leaderboard of top stakers
- Real-time FROTH price

### Dapper Protection (`/dapper`)
- Connect Dapper wallet
- NFT grid (NBA Top Shot, NFL All Day, Disney Pinnacle)
- Toggle protection per NFT
- Protection history

### Insure Transaction (`/insure`)
- Action type selector (Swap/Mint/Transfer)
- Insurance parameters form
- Fee calculator with FROTH discount
- Execute protected transaction

## Flo Mascot States

The Flo mascot changes appearance based on context:

1. **Idle** 🌊 - Default floating animation
2. **Froth** 🫧 - Purple/bubbly on FROTH page
3. **Dapper** 🏀 - Sports theme on Dapper page
4. **Success** 😎 - Transaction succeeded
5. **Retry** 😰 - Transaction retrying
6. **Compensated** 🥳 - User received compensation

## API Integration

The app integrates with the FlowSure backend via REST API:

### FROTH Endpoints
- `GET /api/froth/price` - Get FROTH price
- `POST /api/froth/stake` - Stake FROTH
- `POST /api/froth/unstake` - Unstake FROTH
- `GET /api/froth/staker/:address` - Get staker info
- `GET /api/froth/leaderboard` - Get leaderboard

### Dapper Endpoints
- `GET /api/dapper/assets/:address` - Get user's NFTs
- `POST /api/dapper/insure` - Insure NFT
- `GET /api/dapper/history/:address` - Get protection history

### Metrics Endpoints
- `GET /api/metrics/staking` - Staking metrics
- `GET /api/metrics/protection` - Protection metrics
- `GET /api/metrics/vault` - Vault metrics

## Flow Wallet Integration

The app uses FCL (Flow Client Library) for wallet connection:

```typescript
import { fcl } from '@/lib/flow-config';

// Connect wallet
await fcl.authenticate();

// Disconnect wallet
await fcl.unauthenticate();

// Get current user
fcl.currentUser.subscribe((user) => {
  console.log(user.addr, user.loggedIn);
});
```

## Build & Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
```bash
vercel deploy
```

## Development Notes

- Mock data is used for demonstration until backend is connected
- All API calls are ready to be connected to the backend
- Flow blockchain integration is configured for testnet
- Responsive design works on mobile, tablet, and desktop

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details
