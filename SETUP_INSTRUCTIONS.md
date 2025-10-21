# FlowSure Frontend - Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install the new `@radix-ui/react-scroll-area` package needed for the calendar view.

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## New Features

### Scheduled Transfers
Navigate to `/schedule` to access the new scheduled transfers feature:
- Visual calendar view
- Schedule protected FLOW transfers
- Automatic execution at scheduled time
- Track transfer status

---

## Updated Navigation

The navigation has been simplified:
1. **Dashboard** - Overview of protected transactions
2. **Schedule Transfer** - NEW! Calendar-based scheduling
3. **Insure Now** - Protect immediate transfers
4. **Staking** - FLOW staking and auto-compound

**Removed:**
- Dapper Protection (not working on testnet)
- FROTH Staking (simplified to single staking system)

---

## Environment Variables

Make sure your `.env.local` file has:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Update this to point to your backend API.

---

## Backend Requirements

The scheduled transfers feature requires backend API endpoints. See:
- `SCHEDULED_TRANSFERS_BACKEND.md` - Detailed backend implementation guide
- `SCHEDULED_TRANSFERS_SUMMARY.md` - Quick overview

---

## File Structure

New files added:
```
src/
├── lib/api/
│   └── scheduled-transfers.ts          # API client
├── components/
│   ├── calendar-view.tsx               # Calendar component
│   ├── schedule-transfer-form.tsx      # Form component
│   ├── pages/
│   │   └── scheduled-transfers-page.tsx # Main page
│   └── ui/
│       └── scroll-area.tsx             # UI component
└── app/
    └── schedule/
        └── page.tsx                    # Route
```

---

## Testing

1. **Without Backend:**
   - Calendar will be empty
   - Form will work but submissions will fail
   - Good for UI/UX testing

2. **With Backend:**
   - Full functionality
   - Create, view, cancel scheduled transfers
   - See automatic execution

---

## Troubleshooting

### "Cannot find module @radix-ui/react-scroll-area"
Run: `npm install`

### Calendar not showing transfers
Check:
1. Backend API is running
2. API_URL is correct in `.env.local`
3. User wallet is connected
4. Check browser console for errors

### Form submission fails
Check:
1. Backend `/api/scheduled-transfers` endpoint exists
2. CORS is configured on backend
3. Request payload matches expected format

---

## Next Steps

1. Install dependencies: `npm install`
2. Start frontend: `npm run dev`
3. Implement backend (see `SCHEDULED_TRANSFERS_BACKEND.md`)
4. Test end-to-end flow
5. Deploy!
