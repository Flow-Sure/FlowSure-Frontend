# FlowSure Frontend - Quick Implementation Guide

## 🎯 Overview
Build a Next.js 14 dashboard with TypeScript, TailwindCSS, and shadcn/ui that integrates with FlowSure backend and Flow blockchain.

## 📦 Tech Stack
- **Framework**: Next.js 14 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Blockchain**: @onflow/fcl
- **State**: Zustand + React Query
- **Animation**: Framer Motion
- **API**: Axios

## 🏗️ Pages

### 1. Dashboard (`/`)
- Active protections list
- Retry queue with countdown timers
- Claims/compensations history
- Vault overview stats

### 2. FROTH Staking (`/froth`)
- Stake/unstake form
- Rewards card (balance, discount, savings)
- Leaderboard of top stakers
- FROTH price display

### 3. Dapper Protection (`/dapper`)
- Connect Dapper wallet
- NFT grid (NBA Top Shot, NFL All Day, Disney Pinnacle)
- Protection toggle per NFT
- Protection history

### 4. Insure Transaction (`/insure`)
- Action type selector (Swap/Mint/Transfer)
- Insurance parameters form
- Fee calculator with FROTH discount
- Execute protected transaction

## 🔌 Backend Integration

### API Endpoints
```typescript
// FROTH
GET  /api/froth/price
POST /api/froth/stake
POST /api/froth/unstake
GET  /api/froth/staker/:address
GET  /api/froth/leaderboard

// Dapper
GET  /api/dapper/assets/:address
POST /api/dapper/insure
GET  /api/dapper/history/:address

// Metrics
GET  /api/metrics/staking
GET  /api/metrics/protection
GET  /api/metrics/vault
```

## 🧠 Flo Mascot States

### Visual States
1. **Idle** - Default floating animation
2. **Froth** (Purple/Bubbly) - On FROTH page
3. **Dapper** (Sports Jersey) - On Dapper page
4. **Success** 😎 - Transaction succeeded
5. **Retry** 😰 - Transaction retrying
6. **Compensated** 🥳 - User received compensation

### Implementation
```tsx
<FloMascot 
  state="froth" 
  message="Stake FROTH to unlock discounts! 🪙"
/>
```

## 🔐 Flow Wallet Integration

```typescript
import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  '0xFrothRewards': '0x8401ed4fc6788c8a',
  '0xDapperProtection': '0x8401ed4fc6788c8a',
});

// Connect wallet
await fcl.authenticate();

// Execute transaction
const txId = await fcl.mutate({
  cadence: TRANSACTION_CODE,
  args: (arg, t) => [...],
  proposer: fcl.currentUser,
  payer: fcl.currentUser,
  authorizations: [fcl.currentUser],
});
```

## ✅ Deliverables Checklist

### Core Features
- [ ] Wallet connection (Flow + Dapper)
- [ ] Dashboard with 4 sections
- [ ] FROTH staking interface
- [ ] Dapper NFT protection
- [ ] Transaction wrapping
- [ ] Real-time retry queue
- [ ] Compensation tracking

### Flo Mascot
- [ ] 5 visual states
- [ ] Smooth transitions
- [ ] Contextual messages
- [ ] Auto-hide tooltips

### UI/UX
- [ ] Mobile responsive
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Dark mode support

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FROTH_REWARDS_ADDRESS=0x8401ed4fc6788c8a
NEXT_PUBLIC_DAPPER_PROTECTION_ADDRESS=0x8401ed4fc6788c8a
```

## 🚀 Quick Start

```bash
npx create-next-app@latest flowsure-frontend --typescript --tailwind --app
cd flowsure-frontend
npm install @onflow/fcl zustand @tanstack/react-query axios framer-motion
npx shadcn-ui@latest init
npm run dev
```

For complete implementation details, see full Frontend-PRD.md
