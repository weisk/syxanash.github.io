import React, { Component } from 'react';
import {
  Cutout, Button, Progress, Anchor,
} from 'react95';
import ReactMarkdown from 'react-markdown/with-html';

import Util from '../Util';
import configUrls from '../../resources/config-urls.json';
import './Blog.css';

import hyperlinkIcon from '../../resources/icons/hyperlink.gif';
import questionIcon from '../../resources/icons/question-mark.gif';
import blogIcon from '../../resources/icons/blog.gif';

class BlogHeader extends Component {
  render = () => (
    <span>
      <img src={ blogIcon } alt='main logo' style={ { height: '15px' } }/> Simone's Blog
    </span>
  )
}

class BlogBody extends Component {
  constructor(props) {
    super(props);

    this.loaderInterval = undefined;
    this.hopeTimeout = undefined;

    this.state = {
      loaderInteger: 0,
      postLoaded: undefined,
      backendResponse: undefined,
      postDate: new Date(),
      headerText: 'LOADING POST...',
    };
  }

  componentDidMount = () => {
    this.loaderInterval = setInterval(this.increaseLoader, 20);

    fetch(`${configUrls.backendUrl}/blogpost`)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          postLoaded: true,
          backendResponse: data.post_content,
          postDate: new Date(data.published_date),
        });
      }).catch((errorObject) => {
        this.setState({
          postLoaded: false,
          backendResponse: errorObject,
        });
      });
  }

  componentWillUnmount = () => {
    if (this.loaderInterval !== undefined) {
      clearInterval(this.loaderInterval);
    }

    if (this.hopeTimeout !== undefined) {
      clearTimeout(this.hopeTimeout);
    }
  }

  startDecreaseLoader = () => {
    this.setState({ headerText: 'LOADING ABORTED' });
    this.loaderInterval = setInterval(this.decreaseLoader, 5);
  }

  increaseLoader = () => {
    const { loaderInteger, postLoaded } = this.state;

    const percentageStop = postLoaded === undefined ? 99 : 80;

    if (loaderInteger < percentageStop) {
      this.setState({ loaderInteger: loaderInteger + 1 });
    } else {
      clearInterval(this.loaderInterval);
      if (!postLoaded && postLoaded !== undefined) {
        this.hopeTimeout = setTimeout(this.startDecreaseLoader, 1500);
      }
    }
  }

  decreaseLoader = () => {
    const { loaderInteger } = this.state;

    if (loaderInteger > 0) {
      this.setState({ loaderInteger: loaderInteger - 1 });
    } else {
      clearInterval(this.loaderInterval);
    }
  }

  render = () => {
    const { openWindow, isWindowOpened } = this.props;
    const {
      backendResponse, postDate, postLoaded, loaderInteger, headerText,
    } = this.state;

    if (postLoaded === undefined) {
      return (
        <div style={ { textAlign: 'center' } }>
          <h2 style={ { marginTop: '0' } }>{ headerText }</h2>
          <Progress percent={ loaderInteger } shadow={ false } />
        </div>
      );
    }

    if (!postLoaded) {
      return (
        <React.Fragment>
          <div style={ { textAlign: 'center' } }>
            <h2 style={ { marginTop: '0' } }>{ headerText }</h2>
            <Progress percent={ loaderInteger } shadow={ false } />
          </div>
          <Cutout style={ { display: loaderInteger === 0 ? 'block' : 'none', backgroundColor: 'white', marginTop: '20px' } }>
            <div style={ { padding: '15px' } }>
              <p>Error: { backendResponse.message } <Anchor href={ `${configUrls.repositoryUrl}/blob/development/src/components/windows/Blog.js` } target="_blank">@ Blog.js</Anchor></p>
              <br />
            </div>
          </Cutout>
        </React.Fragment>
      );
    }

    return (<React.Fragment>
      <Cutout className='blog-cutout'>
        <div className='document-style'>
          <ReactMarkdown source={ backendResponse } escapeHtml={ false } />
        </div>
        <div style={ {
          fontWeight: 'bold',
          padding: '15px',
          paddingTop: '0px',
          textAlign: 'right',
        } }><i>
            <span>Posted on { postDate.toDateString() }</span>
          </i>
        </div>
      </Cutout>
      <Cutout className='blog-footer-cut-out'>
        <div className='blog-footer-buttons' style={ { float: 'right' } }>
          <Button fullWidth active={ isWindowOpened('blogpopup') } onClick={ () => openWindow('blogpopup', true) }>
            <figcaption><b>What is this</b></figcaption>
            <img src={ questionIcon } className='small-icon' alt="question mark"/>
          </Button>
        </div>
        <div className='blog-footer-buttons' style={ { float: 'left' } }>
          <Button fullWidth onClick={ () => Util.openWebsiteURL({ url: `${configUrls.backendUrl}/rss.xml` }) }>
            <img src={ hyperlinkIcon } className='small-icon' alt="hyperlink icon"/>
            <figcaption>Feed RSS</figcaption>
          </Button>
        </div>
      </Cutout>
    </React.Fragment>);
  }
}

export { BlogHeader, BlogBody };
