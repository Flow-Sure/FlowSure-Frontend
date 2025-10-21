import * as fcl from '@onflow/fcl';

/**
 * User signs this transaction to authorize the backend service account
 * to execute scheduled transfers on their behalf
 */
export const authorizeScheduledTransfers = async (
  maxAmountPerTransfer: number,
  expiryDays: number = 365
): Promise<string> => {
  const serviceAccountAddress = process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_ADDRESS;
  
  if (!serviceAccountAddress) {
    throw new Error('Service account address not configured');
  }

  const transaction = `
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from 0x7e60df042a9c0868
    
    transaction(serviceAccount: Address, maxAmount: UFix64, expiryTimestamp: UFix64) {
      
      prepare(signer: auth(SaveValue, Capabilities, IssueStorageCapabilityController) &Account) {
        // Create a capability that allows the service account to withdraw from user's vault
        let vaultCap = signer.capabilities.storage.issue<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
          /storage/flowTokenVault
        )
        
        // Publish the capability at a unique path for the service account
        let capPath = PublicPath(identifier: "scheduledTransferAuth_".concat(signer.address.toString()))!
        signer.capabilities.publish(vaultCap, at: capPath)
        
        log("Scheduled transfer authorization granted")
        log("Service account: ".concat(serviceAccount.toString()))
        log("Max amount: ".concat(maxAmount.toString()))
        log("Expires: ".concat(expiryTimestamp.toString()))
      }
    }
  `;

  try {
    const expiryTimestamp = Math.floor(Date.now() / 1000) + (expiryDays * 24 * 60 * 60);
    
    const transactionId = await fcl.mutate({
      cadence: transaction,
      args: (arg, t) => [
        arg(serviceAccountAddress, t.Address),
        arg(maxAmountPerTransfer.toFixed(8), t.UFix64),
        arg(expiryTimestamp.toFixed(8), t.UFix64)
      ],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 9999
    });

    await fcl.tx(transactionId).onceSealed();
    return transactionId;
  } catch (error: any) {
    console.error('Authorization failed:', error);
    throw new Error(error.message || 'Failed to authorize scheduled transfers');
  }
};

/**
 * Check if user has authorized scheduled transfers
 */
export const checkAuthorization = async (userAddress: string): Promise<boolean> => {
  try {
    const script = `
      import FungibleToken from 0x9a0766d93b6608b7
      import FlowToken from 0x7e60df042a9c0868
      
      access(all) fun main(userAddress: Address): Bool {
        let account = getAccount(userAddress)
        let capPath = PublicPath(identifier: "scheduledTransferAuth_".concat(userAddress.toString()))!
        
        let cap = account.capabilities.get<auth(FungibleToken.Withdraw) &FlowToken.Vault>(capPath)
        return cap != nil && cap!.check()
      }
    `;

    const result = await fcl.query({
      cadence: script,
      args: (arg, t) => [arg(userAddress, t.Address)]
    });

    return result as boolean;
  } catch (error) {
    console.error('Failed to check authorization:', error);
    return false;
  }
};

/**
 * Revoke scheduled transfer authorization
 */
export const revokeAuthorization = async (): Promise<string> => {
  const transaction = `
    transaction() {
      prepare(signer: auth(UnpublishCapability) &Account) {
        let capPath = PublicPath(identifier: "scheduledTransferAuth_".concat(signer.address.toString()))!
        signer.capabilities.unpublish(capPath)
        
        log("Scheduled transfer authorization revoked")
      }
    }
  `;

  try {
    const transactionId = await fcl.mutate({
      cadence: transaction,
      args: () => [],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 9999
    });

    await fcl.tx(transactionId).onceSealed();
    return transactionId;
  } catch (error: any) {
    console.error('Revocation failed:', error);
    throw new Error(error.message || 'Failed to revoke authorization');
  }
};
