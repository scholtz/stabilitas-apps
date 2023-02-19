interface IAMMOracleConfigurationItem {
  appAMM: number; // AMM app id
  pimarySide: string; // A or B
  baseAsset: number; // usually USDC asset id
  stAsset: number; // stabilitas asset
}
interface IAMMOracleConfiguration {
  oracleFeedAppId: number;
  items: IAMMOracleConfigurationItem[];
}
export default IAMMOracleConfiguration;
