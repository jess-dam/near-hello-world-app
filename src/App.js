import './App.css';
import "antd/dist/antd.css";
import { Form, Input, Button } from 'antd';
import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('')

  const onSubmit = (value) => {
    console.log(value)
    setMessage(value?.name)
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
