import React from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { copyToClipboard } from './copy';

class ShareComponent extends React.Component {
    constructor() {
        super();
        this.shareRef = React.createRef();
        this.state = {
            shortUrl: "",
            qrcode: "",
            showShare: false
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside)
        // 基于短链接服务生成短链
        axios.get('https://arcto.xyz/create?url=' + encodeURIComponent(window.location.href)).then(
            data => {
                if(data.data.data.code === -1) throw new Error(data.data.data.data.msg);
                // 正常情况均会返回URL（无论新的或是已存在的）
                QRCode.toDataURL('https://arcto.xyz/s/' + data.data.data.data.short).then(
                    url => {
                        this.setState({
                            qrcode: url
                        })
                    }
                ).catch(err => {
                    console.log('QRCode fail.')
                    console.error(err)
                })
                this.setState({
                    shortUrl: 'https://arcto.xyz/s/' + data.data.data.data.short
                });
            }
        ).catch(e => {
            throw new Error(e)
        })
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    }

    clickSwitchShare() {
        this.setState({
            showShare: !this.state.showShare
        })
    }

    // Click outside Handler
    handleClickOutside = (e) => {
      if(!this.shareRef.current.contains(e.target)) {
        this.setState({
            showShare: false
        })
      }
    }

    render() {
        return (
            <aside className="_tool-share" ref={this.shareRef}>
                <span onClick={this.clickSwitchShare.bind(this)} className="share-text"><i className="_icon-share _icon-share-style" data-spk="post-content-share"></i>分享</span>
                <div className={this.state.showShare ? 'share-box share-box-visible' : 'share-box share-box-hidden'}>
                    {
                        this.state.qrcode ? 
                        <><img src={this.state.qrcode} className={this.state.showShare ? '' : 'display-none'} />
                        <p onClick={copyToClipboard.bind(this, this.state.shortUrl)} className={this.state.showShare ? '' : 'display-none'}>复制链接</p></> : <p>当前站点不在白名单内！</p>
                    }
                </div>
            </aside>
        )
    }
}

export default ShareComponent;