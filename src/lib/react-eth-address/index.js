/*
  Modified because propTypes requires to modifying babel and ejecting CRA
  Original by @rubentd https://github.com/rubentd/react-eth-address
*/

import React from 'react';
// import { bool, string } from 'prop-types';
import copy from 'copy-to-clipboard';
import CopyIcon from './CopyIcon';
// import { isAddress } from './util';
import './styles.css';

class EthAddress extends React.Component {
  /*
  static propTypes = {
    // eth address
    address: string,
    // compact mode shows first 4 and last 4 characters
    compact: bool,
    // enable or disable the ability to copy to clipboard
    copyToClipboard: bool,
    // make a link to etherscan
    etherscan: bool,
    // extra classes
    className: string,
  };
  */
  static defaultProps = {
    compact: true,
    copyToClipboard: true,
    etherscan: false,
    className: '',
  };

  constructor(){
    super();
    this.state = {
      showingCopied: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onClick = () => {
    const { copyToClipboard } = this.props;
    if (copyToClipboard) {
      copy(this.props.address);
      this.showCopied();
    }
  }

  showCopied = () => {
    this.setState({
      showingCopied: true,
    });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.hideCopied.bind(this), 1000)
  }

  hideCopied = () => {
    this.setState({
      showingCopied: false,
    });
  }

  render(){
    const {
      etherscan,
      compact,
      copyToClipboard,
      className,
    } = this.props;

    const { showingCopied } = this.state;

    const address = this.props.address.startsWith('0x') ? this.props.address : `0x${this.props.address}`;

    const displayAddress = compact ? (
      `${address.substr(0, 6)}....${address.substr(38, 42)}`
    ) : address;

    // if (!isAddress(address)) {
    //   return (
    //     <span
    //       className="eth-address error"
    //     >
    //       Invalid address.
    //     </span>
    //   );
    // }

    const classes = `eth-address ${className} ${copyToClipboard ? 'copy-enabled' : ''} ${showingCopied ? 'showing-copied' : ''}`;

    return etherscan ? (
      <a
        href={`https://etherscan.io/search?q=${address}`}
        target="_blank"
        className={classes}
      >
        { displayAddress }
      </a>
    ) : (
      <span
        className={classes}
        onClick={this.onClick}
      >
        { displayAddress } { copyToClipboard && <CopyIcon /> }
        {
          showingCopied && (
            <div className="sm-message">
              Copied!
            </div>
          )
        }
      </span>
    )
  }
}

export default EthAddress;
