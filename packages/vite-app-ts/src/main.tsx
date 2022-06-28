import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Main } from '@1hive/1hive-ui';

import { useEthersContext } from 'eth-hooks/context';
import { asEthersAdaptor } from 'eth-hooks/functions';

import { useBurnerFallback } from '~~/components/main/hooks/useBurnerFallback';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { BURNER_FALLBACK_ENABLED } from '~~/config/appConfig';
import { useConnectAppContracts, useLoadAppContracts } from '~~/config/contractContext';

import Home from './pages/home';
import FaqView from './pages/faq';
import { DollarOutlined, HomeOutlined, PlusOutlined, QuestionCircleOutlined, RetweetOutlined } from '@ant-design/icons';
import { truncateAddress } from './helpers';
import { Add } from './components/modals';
import { useState } from 'react';
import { DownArrowIcon, UpArrowIcon } from './components/accordion';
import { getNetworkNameByChainID } from './models/constants/networks';
import { Modal, Popover } from 'antd';

import './styles/app.less';
import StreamsPack from './pages/streamspack';
import MyStreams from './pages/mystreams';

export enum RoutesPath {
  HOME = '/',
  MY_STREAMS = '/mystreams',
  STREAMS_PACK = '/streamspack',
  FAQ = '/faq',
}

const MainApp = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isWalletModal, setIsWalletModal] = useState(false);
  const scaffoldAppProviders = useScaffoldAppProviders();
  const ethersContext = useEthersContext();

  useBurnerFallback(scaffoldAppProviders, BURNER_FALLBACK_ENABLED);

  useLoadAppContracts();

  useConnectAppContracts(asEthersAdaptor(ethersContext));

  return (
    <Main layout={false} scrollView={false}>
      <main>
        <header>
          <div className="flex items-center gap-8">
            <a href="/">
              <h1 className="mb-0 text-2xl font-bold">Streaming Bee</h1>
            </a>
            <div className="relative flex items-center gap-6">
              <div>
                <button
                  className="flex items-center px-3 py-2  font-semibold text-white bg-green-600 pointer-events-auto rounded-md text-[0.8125rem] leading-5 hover:bg-green-500 gap-2"
                  onClick={() => setIsAddModalVisible(!isAddModalVisible)}>
                  <PlusOutlined />
                  Add
                </button>
              </div>
            </div>
          </div>

          <Modal visible={isAddModalVisible} footer={null} onCancel={() => setIsAddModalVisible(false)}>
            <p className="mb-4 text-base font-bold">Creating new Vesting</p>
            <Add />
          </Modal>

          <div className="relative">
            {ethersContext.account ? (
              <div className="flex flex-col">
                <Popover
                  content={
                    <>
                      <p className="mb-4 text-base font-bold">Disconnect wallet</p>
                      <button
                        onClick={() => ethersContext.disconnectModal()}
                        className="px-3 py-2 font-semibold text-white bg-black pointer-events-auto rounded-md text-[0.8125rem] leading-5 hover:bg-gray-500">
                        Disconnect wallet
                      </button>
                    </>
                  }
                  trigger="click"
                  visible={isWalletModal}
                  onVisibleChange={() => setIsWalletModal(!isWalletModal)}>
                  <div className="flex items-center justify-center text-right cursor-pointer gap-6 hover:text-gray-600">
                    <div>
                      <p className="font-bold text-black">
                        Personal Wallet{' '}
                        <p className="text-sm font-bold ">{getNetworkNameByChainID(ethersContext.chainId)}</p>
                      </p>
                      <p className="text-xs">{truncateAddress(ethersContext.account)}</p>
                    </div>
                    {!isWalletModal ? <DownArrowIcon /> : <UpArrowIcon />}
                  </div>
                </Popover>
              </div>
            ) : (
              <button
                className="px-3 py-2 ml-8 font-semibold text-white bg-indigo-600 pointer-events-auto rounded-md text-[0.8125rem] leading-5 hover:bg-indigo-500"
                onClick={() => scaffoldAppProviders.createLoginConnector()}>
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        <nav>
          <ul>
            <li className="py-6 text-center">
              <a href={RoutesPath.HOME} className="text-xl text-black">
                <HomeOutlined />
              </a>
            </li>
            <li className="py-6 text-center">
              <a href={RoutesPath.MY_STREAMS} className="text-xl text-black">
                <RetweetOutlined />
              </a>
            </li>
            <li className="py-6 text-center">
              <a href={RoutesPath.STREAMS_PACK} className="text-xl text-black">
                <DollarOutlined />
              </a>
            </li>
            <li className="py-6 text-center">
              <a href={RoutesPath.FAQ} className="text-xl text-black">
                <QuestionCircleOutlined />
              </a>
            </li>
          </ul>
        </nav>

        <div className="content">
          <BrowserRouter>
            <Switch>
              <Route exact path={RoutesPath.HOME}>
                <Home />
              </Route>
              <Route exact path={RoutesPath.MY_STREAMS}>
                <MyStreams />
              </Route>
              <Route exact path={RoutesPath.STREAMS_PACK}>
                <StreamsPack />
              </Route>
              <Route exact path={RoutesPath.FAQ}>
                <FaqView />
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      </main>
    </Main>
  );
};

export default MainApp;
