import './App.css'
import "antd/dist/antd.css"
import { Form, Input, Button } from 'antd'
import { useState, useEffect } from 'react'
import { connect, keyStores, Contract } from 'near-api-js'
import { ACCOUNT_ID } from './config.json'

function App() {
  const [account, setAccount] = useState({})
  const [contract, setContract]  = useState({})
  const [message, setMessage] = useState('')

  const getAccount = async () => {
    const config = {
      networkId: "testnet",
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    }

    const near = await connect(config)
    const acc = await near.account("bluxue2.testnet")
    setAccount(acc)
  }

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
    console.log(value)
    setMessage(value?.name)

    const response = await contract.get_message()
    console.log(response)
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
      <h1 style={{ width: '200px', alignSelf: 'center', padding: '50px' }} >{message}</h1>
    </div>
  );
}

export default App;
