import React from 'react';
import { useReferralLogic } from '@/modules/referral/hooks/referral';
import { useAuth } from '@/modules/auth/services/auth.service'; // Assuming you have auth context

/**
 * Example component showing how to integrate referral logic
 * This demonstrates how to use the referral hooks in your existing components
 */
export const ReferralIntegrationExample: React.FC = () => {
  const { awardDepositPoints, awardBalanceMilestone, awardReferralBonus, isProcessing } = useReferralLogic();
  // const { user } = useAuth(); // Get current user from auth context

  // Example: Award points when user makes a deposit
  const handleDepositComplete = async (depositedAmount: number) => {
    // const userId = user?.id; // Get from auth context
    const userId = 'example-user-id'; // Replace with actual user ID
    
    try {
      const result = await awardDepositPoints(userId, depositedAmount);
      console.log('Deposit points awarded:', result);
      // Show success notification to user
    } catch (error) {
      console.error('Failed to award deposit points:', error);
      // Show error notification to user
    }
  };

  // Example: Award points when user reaches balance milestone
  const handleBalanceMilestone = async (currentBalance: number) => {
    const userId = 'example-user-id'; // Replace with actual user ID
    
    try {
      const result = await awardBalanceMilestone(userId, currentBalance);
      console.log('Balance milestone points awarded:', result);
      // Show success notification to user
    } catch (error) {
      console.error('Failed to award balance milestone points:', error);
      // Show error notification to user
    }
  };

  // Example: Award points when referral count changes
  const handleReferralCountChange = async (totalReferrals: number) => {
    const userId = 'example-user-id'; // Replace with actual user ID
    
    try {
      const result = await awardReferralBonus(userId, totalReferrals);
      console.log('Referral bonus points awarded:', result);
      // Show success notification to user
    } catch (error) {
      console.error('Failed to award referral bonus points:', error);
      // Show error notification to user
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-muted">
      <h3 className="text-lg font-semibold mb-4">Referral Integration Example</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Usage Examples:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Call awardDepositPoints() after successful deposit</li>
            <li>• Call awardBalanceMilestone() when balance reaches milestones</li>
            <li>• Call awardReferralBonus() when referral count changes</li>
            <li>• All functions are debounced to prevent duplicate calls</li>
          </ul>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleDepositComplete(100)}
            disabled={isProcessing}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Deposit Points
          </button>
          <button
            onClick={() => handleBalanceMilestone(1000)}
            disabled={isProcessing}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Balance Milestone
          </button>
          <button
            onClick={() => handleReferralCountChange(5)}
            disabled={isProcessing}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Test Referral Bonus
          </button>
        </div>
        
        {isProcessing && (
          <p className="text-sm text-muted-foreground">Processing...</p>
        )}
      </div>
    </div>
  );
};
