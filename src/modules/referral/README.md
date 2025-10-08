# Referral System

A comprehensive referral system implementation for the crypto project with points-based rewards.

## Features

- **Referral Code Management**: Generate and manage referral codes
- **Points Rewards**: Award points for deposits, balance milestones, and referrals
- **Statistics Tracking**: Track referral performance and earnings
- **Real-time Updates**: React Query integration for real-time data
- **Type Safety**: Full TypeScript support with comprehensive types

## Quick Start

### 1. Basic Usage

```tsx
import { useReferralLogic } from '@/modules/referral';

function MyComponent() {
  const { awardDepositPoints, awardBalanceMilestone, awardReferralBonus } = useReferralLogic();

  // Award points after deposit
  const handleDeposit = async (amount: number) => {
    await awardDepositPoints('user-id', amount);
  };

  // Award points for balance milestone
  const handleMilestone = async (balance: number) => {
    await awardBalanceMilestone('user-id', balance);
  };

  // Award points for referral bonus
  const handleReferral = async (count: number) => {
    await awardReferralBonus('user-id', count);
  };
}
```

### 2. Using Individual Hooks

```tsx
import { 
  useReferralProfile, 
  useReferralStats, 
  useReferralCode,
  useReferralHistory 
} from '@/modules/referral';

function ReferralDashboard() {
  const { data: profile } = useReferralProfile();
  const { data: stats } = useReferralStats();
  const { data: code } = useReferralCode();
  const { data: history } = useReferralHistory();

  return (
    <div>
      <h2>Your Referral Code: {code?.referralCode}</h2>
      <p>Total Referrals: {stats?.totalReferrals}</p>
      <p>Total Earnings: ${stats?.totalEarnings}</p>
    </div>
  );
}
```

### 3. Using Components

```tsx
import { 
  ReferralCodeDisplay, 
  ReferralStats, 
  ReferralInput 
} from '@/modules/referral';

function ReferralPage() {
  return (
    <div className="space-y-6">
      <ReferralCodeDisplay />
      <ReferralStats />
      <ReferralInput onSuccess={() => console.log('Code applied!')} />
    </div>
  );
}
```

## API Integration

The referral system integrates with the following API endpoints:

### Core Endpoints

- `GET /referral/profile` - Get user's referral profile
- `GET /referral/stats` - Get referral statistics
- `GET /referral/code` - Get referral code and URL
- `GET /referral/history` - Get referral history
- `POST /referral/create-code` - Create new referral code
- `POST /referral/apply` - Apply referral code

### Points Rewards Endpoints

- `POST /points/reward/deposit` - Award deposit points
- `POST /points/reward/balance` - Award balance milestone points
- `POST /points/reward/referrals` - Award referral bonus points

## Service Functions

### Core Functions

```typescript
// Award points for deposit
await referralService.awardDepositPoints({
  userId: 'user-id',
  depositedUsd: 100
});

// Award points for balance milestone
await referralService.awardBalanceMilestone({
  userId: 'user-id',
  currentBalanceUsd: 1000
});

// Award points for referral bonus
await referralService.awardReferralBonus({
  userId: 'user-id',
  totalSuccessfulReferrals: 5
});
```

## Types

### Main Types

```typescript
interface ReferralUser {
  id: string;
  tagName: string;
  walletAddress: string;
  points: number;
  referralCode: string;
  totalSuccessfulReferrals: number;
  totalReferralEarnings: number;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

interface ReferralReward {
  awarded: number;
  type: 'deposit' | 'balance' | 'referral';
  timestamp: string;
}
```

## Integration Examples

### Wallet Integration

```tsx
// In your wallet component
import { useReferralLogic } from '@/modules/referral';

function WalletComponent() {
  const { awardDepositPoints, awardBalanceMilestone } = useReferralLogic();

  const handleDeposit = async (amount: number) => {
    // Your existing deposit logic
    await depositFunds(amount);
    
    // Award referral points
    await awardDepositPoints(user.id, amount);
  };

  const handleBalanceUpdate = async (newBalance: number) => {
    // Check for milestones (e.g., $1000, $5000, $10000)
    if (newBalance >= 1000 && newBalance < 1001) {
      await awardBalanceMilestone(user.id, newBalance);
    }
  };
}
```

### Registration Flow

```tsx
// In your registration component
import { ReferralInput } from '@/modules/referral';

function RegistrationForm() {
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 && (
        <ReferralInput onSuccess={() => setStep(2)} />
      )}
      {step === 2 && (
        <div>Complete registration...</div>
      )}
    </div>
  );
}
```

## Error Handling

All hooks include error handling and loading states:

```tsx
const { data, isLoading, error } = useReferralStats();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <div>Stats: {data?.totalReferrals}</div>;
```

## Best Practices

1. **Always handle errors**: Use try-catch blocks when calling service functions
2. **Debounce calls**: The `useReferralLogic` hook includes built-in debouncing
3. **Invalidate queries**: Mutations automatically invalidate related queries
4. **Type safety**: Always use the provided TypeScript types
5. **Loading states**: Show loading indicators for better UX

## File Structure

```
src/modules/referral/
├── types/
│   └── index.ts                 # TypeScript interfaces
├── services/
│   └── referral.service.ts      # API service functions
├── hooks/
│   └── referral.tsx             # React hooks
├── components/
│   ├── referral-code-display.tsx
│   ├── referral-stats.tsx
│   ├── referral-input.tsx
│   └── referral-integration-example.tsx
├── index.ts                     # Main exports
└── README.md                    # This file
```
