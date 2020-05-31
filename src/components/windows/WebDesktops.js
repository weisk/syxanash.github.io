import React, { Component } from 'react';

import {
  Cutout, Toolbar, Button, Fieldset,
} from 'react95';

import './WebDesktops.css';
import remoteDesktops from '../../resources/remote-desktops.json';
import computerIcon from '../../resources/icons/remote.gif';
import mainWindowIcon from '../../resources/icons/inceputer.gif';

class WebDesktopsHeader extends Component {
  render = () => (
    <span>
      <img src={ mainWindowIcon } alt='remote desktops icon' style={ { height: '15px' } }/> Web Desktops
    </span>
  )
}

class WebDesktopsBody extends Component {
  state = {
    httpsOnlyEnabled: false,
  }

  renderSingleComputerIcon = ({ url, name }) => (
    <React.Fragment>
      <div className='computer-icon'>
        <img style={ { height: '65px' } } src={ computerIcon } alt='single desktop icon' />
      </div>
      <div className='website-favicon'>
        <img style={ { height: '25px' } } src={ `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}` } alt='computer icon' />
      </div>
      <div className='website-name'>
        { name }
      </div>
    </React.Fragment>
  )

  filterURLByHTTPS = (url) => {
    const { httpsOnlyEnabled } = this.state;

    if (httpsOnlyEnabled) {
      return url.match(/^(https):\/\//g) !== null;
    }

    return true;
  }

  openRandomURL = () => {
    const linksList = remoteDesktops.filter(website => this.filterURLByHTTPS(website.url))
      .map(website => website.url);

    const randomLink = Object.keys(linksList).map(e => linksList[e])[
      Math.floor(Math.random() * Object.keys(linksList).map(e => linksList[e]).length)
    ];
    this.openWebsiteURL({ url: randomLink });
  }

  openWebsiteURL = ({ url }) => {
    window.open(url, '_blank');
  }

  toggleHTTPSFilter = () => {
    const { httpsOnlyEnabled } = this.state;
    this.setState({ httpsOnlyEnabled: !httpsOnlyEnabled });
  }

  renderAllIcons = () => {
    const desktopIcons = remoteDesktops.filter(website => this.filterURLByHTTPS(website.url))
      .map(website => (<div
        className='single-icon'
        key={ `icon_${website.name}` }
        onClick={ () => this.openWebsiteURL(website) }>
        { this.renderSingleComputerIcon(website) }
      </div>));

    return desktopIcons;
  }

  render = () => {
    const { httpsOnlyEnabled } = this.state;

    return (
      <div>
        <div className='toolbar-container'>
          <Toolbar>
            <Button onClick={ this.openRandomURL } variant="menu">Random</Button>
            <Button onClick={ this.toggleHTTPSFilter } active={ httpsOnlyEnabled } variant="menu">HTTPS Only</Button>
            <Button onClick={ () => this.openWebsiteURL({ url: 'https://github.com/syxanash/awesome-web-desktops' }) } variant="menu">Contribute</Button>
          </Toolbar>
        </div>
        <div style={ { paddingBottom: '10px' } }>
          <Fieldset>
            If you are a fan of websites, web apps and portfolios which
            resemble desktop graphical user interfaces here is a curated list
          </Fieldset>
        </div>
        <Cutout className='awesome-gui-cutoutbg'>
          <div className='awesome-gui-icons-container'>
            {this.renderAllIcons()}
          </div>
        </Cutout>
      </div>
    );
  }
}

export { WebDesktopsHeader, WebDesktopsBody };