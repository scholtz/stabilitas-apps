interface IConfiguration {
  period: number; // check the ecb data each n MILI seconds
  tokensAppId: number; // app which created all currency tokens
  oracleFeedAppId: number; // app in which price feed from ECB is stored
}
export default IConfiguration;
