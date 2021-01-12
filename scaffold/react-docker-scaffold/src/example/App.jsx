import React from 'react'
import { Button } from 'antd'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="test">
        <Button type="primary">测试</Button>
        <style jsx>{`
          .test {
            color: #000;
          }
        `}</style>
      </div>
    )
  }
}

export default App