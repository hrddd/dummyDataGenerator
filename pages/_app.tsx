import App from 'next/app'
import React from 'react'
import withReduxStore, { Store } from '../lib/with-redux-store'
import { Provider } from 'react-redux'

interface Props {
  reduxStore: Store
}

class MyApp extends App<Props> {
  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
