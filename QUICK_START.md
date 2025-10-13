# FlowSure Frontend - Quick Start Guide

## ⚡ Quick Start (5 minutes)

### 1. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Navigate the App

- **Dashboard** (`/`) - View protections, retry queue, and claims
- **FROTH Staking** (`/froth`) - Stake tokens and view rewards
- **Dapper Protection** (`/dapper`) - Protect your NFTs
- **Insure Transaction** (`/insure`) - Create protected transactions

### 3. Connect Wallet

Click "Connect Wallet" in the navigation bar to connect your Flow wallet using FCL.

## 🎯 Key Features to Test

### Dashboard
1. View active protections
2. Monitor retry queue
3. Check compensation history
4. See vault statistics

### FROTH Staking
1. Switch between Stake/Unstake tabs
2. Enter amount and submit
3. View your discount tier
4. Check leaderboard rankings

### Dapper Protection
1. Connect wallet to view NFTs
2. Toggle protection on individual NFTs
3. View protection history
4. Monitor protected/unprotected counts

### Insure Transaction
1. Select action type (Swap/Mint/Transfer)
2. Enter transaction amount
3. See real-time fee calculation
4. View FROTH discount savings
5. Execute protected transaction

## 🤖 Flo Mascot

Watch the mascot change states:
- **Blue wave** 🌊 on Dashboard
- **Purple bubbles** 🫧 on FROTH page
- **Basketball** 🏀 on Dapper page
- Click mascot to toggle tooltip

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit
```

## 📱 Responsive Testing

Test on different screen sizes:
- **Mobile**: 375px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

All pages are fully responsive.

## 🎨 UI Components

The app uses shadcn/ui components:
- Buttons with variants (default, outline, ghost)
- Cards for content sections
- Inputs and forms
- Tabs for switching views
- Badges for status indicators
- Toast notifications (sonner)
- Dialogs for modals
- Avatars for NFT images
- Progress bars

## 🔌 API Integration Status

Currently using **mock data** for demonstration:
- ✅ API client configured
- ✅ All endpoints defined
- ✅ React Query hooks ready
- ⏳ Waiting for backend connection

To connect to real backend:
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure backend is running
3. API calls will automatically switch from mock to real data

## 🌊 Flow Blockchain

FCL is configured for Flow testnet:
- Access Node: `https://rest-testnet.onflow.org`
- Discovery: `https://fcl-discovery.onflow.org/testnet/authn`
- Contract addresses in `.env.local`

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear cache
```bash
rm -rf .next
npm run dev
```

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [Frontend PRD](./Frontend-PRD.md) - Full requirements
- [Development Summary](./DEVELOPMENT_SUMMARY.md) - Implementation details
- [README](./README.md) - Complete documentation

## 🎉 You're Ready!

The FlowSure frontend is fully functional with:
- ✅ 4 complete pages
- ✅ Wallet integration
- ✅ Interactive mascot
- ✅ Responsive design
- ✅ Modern UI/UX
- ✅ Ready for backend integration

Start the dev server and explore the app!
