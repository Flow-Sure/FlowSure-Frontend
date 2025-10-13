# Component Usage Examples

## Flo Mascot

```tsx
import { FloMascot } from '@/components/flo-mascot';

// Basic usage
<FloMascot state="idle" />

// With custom message
<FloMascot state="success" message="Transaction completed!" />

// All states
<FloMascot state="idle" />      // Default blue wave
<FloMascot state="froth" />     // Purple bubbles
<FloMascot state="dapper" />    // Sports theme
<FloMascot state="success" />   // Success emoji
<FloMascot state="retry" />     // Retry animation
<FloMascot state="compensated" /> // Celebration
```

## Mascot Store

```tsx
import { useMascotStore } from '@/store/mascot-store';

function MyComponent() {
  const { state, message, setState } = useMascotStore();
  
  // Change mascot state
  const handleSuccess = () => {
    setState('success', 'Your transaction succeeded!');
  };
  
  return <button onClick={handleSuccess}>Complete</button>;
}
```

## Wallet Store

```tsx
import { useWalletStore } from '@/store/wallet-store';

function MyComponent() {
  const { user, setUser, logout } = useWalletStore();
  
  if (!user.loggedIn) {
    return <div>Please connect wallet</div>;
  }
  
  return <div>Connected: {user.addr}</div>;
}
```

## API Client

```tsx
import { frothApi, dapperApi, metricsApi } from '@/lib/api-client';
import { useQuery, useMutation } from '@tanstack/react-query';

function StakingComponent() {
  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ['froth-price'],
    queryFn: () => frothApi.getPrice(),
  });
  
  // Mutate data
  const stakeMutation = useMutation({
    mutationFn: (amount: number) => frothApi.stake(address, amount),
    onSuccess: () => {
      toast.success('Staked successfully!');
    },
  });
  
  return (
    <button onClick={() => stakeMutation.mutate(100)}>
      Stake 100 FROTH
    </button>
  );
}
```

## Flow Integration

```tsx
import { fcl } from '@/lib/flow-config';

// Connect wallet
async function connectWallet() {
  await fcl.authenticate();
}

// Disconnect wallet
async function disconnectWallet() {
  await fcl.unauthenticate();
}

// Subscribe to user
fcl.currentUser.subscribe((user) => {
  console.log('User:', user.addr, user.loggedIn);
});

// Execute transaction
async function executeTransaction() {
  const txId = await fcl.mutate({
    cadence: `
      transaction {
        execute {
          log("Hello Flow!")
        }
      }
    `,
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    authorizations: [fcl.currentUser],
  });
  
  const tx = await fcl.tx(txId).onceSealed();
  console.log('Transaction sealed:', tx);
}
```

## Navigation

```tsx
import { Navigation } from '@/components/navigation';

// Used in layout
<Navigation />
```

## Main Layout

```tsx
import { MainLayout } from '@/components/main-layout';

function MyPage() {
  return (
    <MainLayout>
      <h1>My Page Content</h1>
    </MainLayout>
  );
}
```

## UI Components

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Button

```tsx
import { Button } from '@/components/ui/button';

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Input

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</div>
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

### Toast Notifications

```tsx
import { toast } from 'sonner';

// Success
toast.success('Operation successful!');

// Error
toast.error('Something went wrong');

// Info
toast.info('Information message');

// Warning
toast.warning('Warning message');

// With description
toast.success('Success', {
  description: 'Your changes have been saved',
});
```

### Dialog

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

### Progress

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={60} />
```

## Icons

```tsx
import { Shield, Coins, Wallet, FileCheck, ArrowRightLeft } from 'lucide-react';

<Shield className="h-4 w-4" />
<Coins className="h-6 w-6 text-primary" />
<Wallet className="h-8 w-8 text-muted-foreground" />
```

## Responsive Grid

```tsx
// 1 column on mobile, 2 on tablet, 4 on desktop
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
  <Card>Card 4</Card>
</div>
```

## Styling Utilities

```tsx
// Spacing
className="space-y-4"  // Vertical spacing
className="gap-4"      // Grid/flex gap

// Text
className="text-sm text-muted-foreground"
className="text-2xl font-bold"

// Layout
className="flex items-center justify-between"
className="container mx-auto px-4 py-8"

// Responsive
className="hidden md:flex"  // Hide on mobile, show on tablet+
className="w-full md:w-1/2" // Full width on mobile, half on tablet+
```
