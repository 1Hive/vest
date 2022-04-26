import { contractsContextFactory } from 'eth-hooks/context';
import { contractConnectorConfig } from '~~/config/contractConnectorConfig';

/**
 * This file initalises the contractContextFactory and exports the types
 * 🙅🏽‍♂️ You don't need to change this file.
 */

/**
 * #### Summary
 * Call contractContextFactory with the `contractConnectorConfig` from `contractConnectorConfig.ts`
 *
 * ##### Notes
 * - This will create your ContractContext used by App.tsx
 * - This will create your hooks to access contracts
 * - The type is your contract connect config.
 */
export const {
  ContractsAppContext,
  useAppContractsActions,
  useAppContracts,
  useLoadAppContracts,
  useConnectAppContracts,
} = contractsContextFactory(contractConnectorConfig);