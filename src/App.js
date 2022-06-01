import './App.css'
import "antd/dist/antd.css"
import { Form, Input, Button } from 'antd'
import { useState, useEffect } from 'react'
import { connect, keyStores, Contract, WalletConnection } from 'near-api-js'
import config from './config.json'

function App() {
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const [account, setAccount] = useState({})
  const [contract, setContract]  = useState({})
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getValidKey = (keys) => {
    if (keys?.length === 0) {
      console.log("No signing keys found in local storage!")
      return null
    }

  }

  const getAccount = async () => {
    const config = {
      networkId: "testnet",
      keyStore: keyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    }

    const near = await connect(config)
    const acc = await near.account("bluxue2.testnet")
    setAccount(acc)

    // create wallet connection
    const wallet = new WalletConnection(near);

    // redirects user to wallet to authorize your dApp
    // this creates an access key that will be stored in the browser's local storage
    // access key can then be used to connect to NEAR and sign transactions via keyStore
    if (keyStore.localStorage.length === 0) signIn(wallet)
  }

  const signIn = (wallet) => {
    wallet.requestSignIn(
      "bluxue2.testnet",
      "Hello World App",
      "http://localhost:3000",
      "http://localhost:3000"
    );
  };

  useEffect(() => {getAccount()}, [])

  useEffect(() => {
    const methodOptions = {
      viewMethods: ['get_message'],
      changeMethods: ['set_name']
    }

    setContract(new Contract(
      account,
      'bluxue2.testnet',
      methodOptions
    ))
  }, [account])


  const onSubmit = async (value) => {
    setIsLoading(true)
    await contract.set_name({ name: value?.name })
    const response = await contract.get_message()
    console.log(response)
    setMessage(response)
    setIsLoading(false)
  }

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
            <h1>Loading...</h1>
            : <h1>{message}</h1>
        }
      </div>
    </div>
  );
}

export default App;
