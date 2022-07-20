// import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useEthersContext } from 'eth-hooks/context';
import { useAppContracts } from '~~/config/contractContext';
import { BigNumber } from 'ethers';
import { toDecimals } from '~~/helpers/math-utils';
import { WrapType } from '.';
import { useContractExistsAtAddress } from 'eth-hooks';
import { getContractERC20 } from '~~/helpers/contract';
import { WrapInput } from '../wrapInput/wrapinput';

export const Wrap = ({ vestedAdress, underlyingTokenAddress }: WrapType) => {
  const [state, setState] = useState({
    underlyingAmount: '',
    address: '',
  });

  const ethersContext = useEthersContext();
  const vestedERC20 = useAppContracts('VestedERC20', ethersContext.chainId);
  const underlyingTokenERC20 = getContractERC20({ ethersContext, contractAddress: underlyingTokenAddress });

  const [isErcExist, _update, queryStatus] = useContractExistsAtAddress(underlyingTokenERC20);

  useEffect(() => {
    console.log('isErcExist', isErcExist);
    console.log('queryStatus', queryStatus);
  }, [isErcExist, queryStatus]);

  const handleWrap = useCallback(async () => {
    if (isErcExist && queryStatus === 'success') {
      const amount = BigNumber.from(toDecimals(state.underlyingAmount, 18));
      const r = await underlyingTokenERC20.approve(vestedAdress, amount);
      await r?.wait(); // TODO we should handle errors/cancel before try wrap.
      await vestedERC20?.attach(vestedAdress).wrap(amount, state.address);
    } else {
      console.log('Do something if it not exist, or not found if without internet'); // TODO: Replace for propper Logger.
    }
  }, [isErcExist, queryStatus, state.address, state.underlyingAmount, underlyingTokenERC20, vestedERC20, vestedAdress]);

  return (
    <div>
      {/* <input
        type="text"
        name="amount"
        placeholder="Amount"
        className="block w-full px-2 py-2 mt-4 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onChange={(e: any) => setState((prev: any) => ({ ...prev, underlyingAmount: e.target.value }))}
      /> */}
      <WrapInput
        accountBalance={BigNumber.from('10000000000000000000')}
        token={{ decimals: 18, name: 'Fel', symbol: 'FEL' }}
      />
      <input
        type="text"
        name="address"
        placeholder="Receipt Address (0x00...)"
        className="block w-full px-2 py-2 mt-4 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onChange={(e: any) => setState((prev: any) => ({ ...prev, address: e.target.value }))}
      />

      <div className="mt-4">
        <button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleWrap}
          className="px-3 py-2 font-semibold text-white bg-black pointer-events-auto rounded-md text-[0.8125rem] leading-5 hover:bg-gray-500">
          Wrap
        </button>
      </div>
    </div>
  );
};
