/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import config from './config';
import GeminiApiCaller from './apiCallers/GeminiApiCaller';
import SearchPage from './SearchPage';
import {
  StyleSheet,
  NavigatorIOS,
} from 'react-native';

export default class App extends Component<{}> {

  componentDidMount() {
    const geminiApiCaller = new GeminiApiCaller(config.geminiApiKey, config.secret);
    geminiApiCaller.getAvailableBalance().then(balances => {
      console.log(balances);
    });
    geminiApiCaller.getTickerBySymbol('ethusd').then(ticker => {
      console.log(ticker);
    });
  }

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Property Finder',
          component: SearchPage,
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
    marginTop: 65,
  },
  container: {
    flex: 1,
  },
});
