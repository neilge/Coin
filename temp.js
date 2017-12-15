class SearchPage extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      'totalUsdBalance': 0,
      'BTC': {},
      'ETH': {},
      'USD': {}
    };
  }

  componentDidMount() {
    const geminiApiCaller = new GeminiApiCaller(config.geminiApiKey, config.secret);
    geminiApiCaller.getAvailableBalance().then(balances => {
      console.log(balances);
      let promises = [];
      let totalUsdBalance = 0;
      balances.forEach(balance => {
        if (balance.currency == 'USD') {
          let usd = {
            available: parseFloat(balance.available)
          };
          totalUsdBalance += usd.available;
          this.setState({
            'USD': usd
          });
        } else {
          promises.push(geminiApiCaller.getTickerBySymbol(config.currency2symbolMap[balance.currency])
            .then(price => {
              this.setState({
                [balance.currency]: {
                  available: balance.available,
                  last: price.last,
                  total: parseFloat(balance.available) * parseFloat(price.last)
                }
              });
              return this.state[balance.currency].total;
            }));
        }
      });
      Promise.all(promises).then(([btc, eth]) => {
        totalUsdBalance = totalUsdBalance + btc + eth;
        this.setState({
          totalUsdBalance: totalUsdBalance
        });
      }).catch(err => console.error(err));
    });
  }

  render() {
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.welcome}>
    //       Total: {this.state.totalUsdBalance}
    //     </Text>
    //     <Text style={styles.instructions}>
    //       USD available: {this.state.USD.available}
    //     </Text>
    //     <Text style={styles.instructions}>
    //       ETH available: {this.state.ETH.available} / last price: {this.state.ETH.last} / total: {this.state.ETH.total}
    //     </Text>
    //     <Text style={styles.instructions}>
    //       BTC available: {this.state.BTC.available} / last price: {this.state.BTC.last} / total: {this.state.BTC.total}
    //     </Text>
    //   </View>
    // );
    return <Text style={styles.description}>Search for houses to buy!</Text>;
  }
}
