import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'FlowSure',
  'app.detail.icon': 'https://flowsure.app/logo.png',
  '0xFrothRewards': process.env.NEXT_PUBLIC_FROTH_REWARDS_ADDRESS || '0x8401ed4fc6788c8a',
  '0xDapperProtection': process.env.NEXT_PUBLIC_DAPPER_PROTECTION_ADDRESS || '0x8401ed4fc6788c8a',
});

export { fcl };
