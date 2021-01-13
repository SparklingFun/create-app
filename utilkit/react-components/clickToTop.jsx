import React from 'react'

class ClickToTop extends React.Component {
  constructor() {
    super()
    this.state = {
      showBtn: false,
      scrollListener: null
    }
  }

  componentDidMount() {
    this.setState({
      scrollListener: window.addEventListener('scroll', () => {
        let oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          this.setState({
            showBtn: true
          })
        } else {
          this.setState({
            showBtn: false
          })
        }
      })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.state.scrollListener)
    this.setState({
      scrollListener: null
    })
  }

  _clickToTop() {
    scroll(0, 0)
  }

  render() {
    return (
      <div className="hidden md:block fixed bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-100 linear cursor-pointer _tool-click_to_top" onClick={this._clickToTop} style={{display: this.state.showBtn ? 'block' : 'none'}} data-spk="tool-clicktop">
        <img src="/icons/click-to-top.svg" className="block content-center" />
      </div>
    )
  }
}

export default ClickToTop