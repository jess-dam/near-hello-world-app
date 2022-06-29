import './App.css'
import "antd/dist/antd.css"
import { Form, Input, Button } from 'antd'
import { useState, useEffect } from 'react'
import { connect, keyStores, Contract, WalletConnection } from 'near-api-js'
import config from './config.json'


function App() {
  const CALLBACK_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_CALLBACK_URL : process.env.REACT_APP_PROD_CALLBACK_URL
  const DEV_NEAR_KEY_LABEL = /near-api-js:keystore:.*\.testnet:testnet/
  const PROD_NEAR_KEY_LABEL = /nearlib:keystore:.*\.testnet:default/

  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const [wallet, setWallet] = useState({})
  const [contract, setContract]  = useState({})
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const hasValidKey = () => {
    for (let i = 0; i < localStorage.length; ++i ) {
      if ((localStorage.key(i).match(DEV_NEAR_KEY_LABEL) || localStorage.key(i).match(PROD_NEAR_KEY_LABEL))
        && localStorage.getItem(localStorage.key(i))) {
        return true
      }
    }

    return false;
  }

  const getWallet = async () => {
    const connectionConfig = {
      networkId: config.DOMAIN,
      keyStore: keyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    }

    const near = await connect(connectionConfig)

    // create wallet connection
    const walletConnection = new WalletConnection(near);
    setWallet(walletConnection)

    // redirects user to wallet to authorize your dApp
    // this creates an access key that will be stored in the browser's local storage
    // access key can then be used to connect to NEAR and sign transactions via keyStore
    if (!hasValidKey())
      signIn(walletConnection)
  }

  const signIn = async (wallet) => {
    await wallet.requestSignIn(
      config.CONTRACT_PATH,
      "Hello World App",
      CALLBACK_URL,
      CALLBACK_URL
    );
  };

  const getContract = () => {
    const methodOptions = {
      viewMethods: ['get_message'],
      changeMethods: ['set_name'],
      sender: wallet.account()
    }

    setContract(new Contract(
      wallet?.account(),
      config.CONTRACT_PATH,
      methodOptions
    ))
  }

  const onSubmit = async (value) => {
    setIsLoading(true)
    await contract.set_name({ name: value?.name })
    const response = await contract.get_message()
    setMessage(response)
    setIsLoading(false)
  }

  useEffect(() => {getWallet()}, [])
  useEffect(() => {if (Object.entries(wallet).length > 0) getContract()}, [wallet])

  return (
    <div className="App"
      style={{
        width: '100%',
        padding: '100px',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div style={{ width: '70%', alignSelf: 'center' }}>
        <h1>Welcome!</h1>
        <br/>
        <Form
          name='nameForm'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onSubmit}>
          <Form.Item
            name='name'
            label='Enter your name here'
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input style={{ width : 'cal(100% - 500px)' }} />
          </Form.Item>
          <Button type="primary" htmlType={onSubmit}>Get My Message</Button>
        </Form>
      </div>

      <div style={{ width: '200px', alignSelf: 'center', paddingTop: '50px' }} >
        {
          isLoading ?
            <h1>Retrieving your message...</h1>
            : <h1>{message}</h1>
        }
      </div>
    </div>
  );
}

export default App;
