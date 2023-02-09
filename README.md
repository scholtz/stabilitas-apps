# Stabilitas project

Stabilitas is a stablecoin project built on the Algorand blockchain. Stablecoins are cryptocurrencies that are designed to maintain a stable value, typically pegged to a stable asset such as the US dollar, Euro or Swiss frank. The idea behind Stabilitas is to provide a stable and secure digital asset that can be used for various purposes such as making purchases, remittances, and as a store of value.

Stabilitas aims to achieve stability by using a combination of smart contracts, algorithmic central bank-like management, and over-collateralization to maintain the value of the stablecoin. The project is built on the Algorand blockchain, which provides fast and secure transactions and smart contracts.

## Greenhouse Hack #3

This project has been fully created and Proof of concept developed at greenhouse hack 3 with bounty BYOP. 

Project web lauched at: https://stabilitas.finance/

- [Smart contracts - Pyteal,Teal,Typescript](https://github.com/scholtz/stabilitas-apps/)
- [Presentation web - Vue.JS](https://github.com/scholtz/stabilitas-web/)

### Folder structure

- [abi/stabilitas](https://github.com/scholtz/stabilitas-apps/tree/master/abi/stabilitas) - The ABI interface. Person can use it to connect his smart contract or see the swagger type docs at the dApp flow.
- [arc0003](https://github.com/scholtz/stabilitas-apps/tree/master/arc0003) - Arc 0003 token definitions, IPFS links
- [icons](https://github.com/scholtz/stabilitas-apps/tree/master/icons) - All Stabilitas tokens icons
- [onchain/build](https://github.com/scholtz/stabilitas-apps/tree/master/onchain/build) - The built TEAL code
- [onchain/contracts/tokens](https://github.com/scholtz/stabilitas-apps/tree/master/onchain/contracts/tokens) - The smart contract which holds the reserves of stabilitas tokens. Person can get from this contract the token id from the iso currency code.
- [onchain/contracts/reserve](https://github.com/scholtz/stabilitas-apps/tree/master/onchain/contracts/reserve) - The smart contract which holds USDc reserves deposited by minting (PyTEAL structured in folders)
- [src/interface](https://github.com/scholtz/stabilitas-apps/tree/master/src/interface) - Interfaces for TypeScript apps
- [src/txs](https://github.com/scholtz/stabilitas-apps/tree/master/src/txs) - TypeScript methods for getting native interaction with smart contracts
- [src/basicSig](https://github.com/scholtz/stabilitas-apps/tree/master/src/basicSig) - TypeScript methods for interaction with smart contract using the basic account
- [src/stabilitas](https://github.com/scholtz/stabilitas-apps/tree/master/src/stabilitas) - Helper functions for stabilitas deployment, working with ECB, ...
- [tests](https://github.com/scholtz/stabilitas-apps/tree/master/tests) - High test coverage
- [tests](https://github.com/scholtz/stabilitas-apps/tree/master/tests) - High test coverage using Jest
- [RootFolder](https://github.com/scholtz/stabilitas-apps) - Root folder contains bash scripts to run the oracle 24/7 and deployment helper scripts

## Description

The goal of blockchain technologies is to allow the efficient exchange of value. Blockchain technology allows the issuance of tokens which represent real world assets.
The ability to have stablecoins representing real currencies allows general users to use them to efficiently swap these tokens with real world assets in e-shops and crypto communities.
Project Stabilitas aims to tokenize real world assets such as USDc, EURc, or gold with smart contracts.
The cybersecurity offered by smart contracts ensures that there is no counterparty-risk and that the usage of the Stabilitas protocol is safe for general use.

## Goals of Stabilitas protocol

Provide a means for anyone to issue any amount asset-backed tokens at the market level
Create AMM pools and increase liquidity with increased usage
Provide a means for holders of the tokens to receive the currency from the reserve at the market level
Ensure that the protocol is resilient against market manipulation

## Dictionary

stCurrency is currency issued by Stabilitas protocol ie: stCHF, stUSD, stEUR, stCZK, stHUF
BaseCurrency is the DAO-approved deposit token, such as USDc, EURc. The BaseCurrency must not be a volatile asset such as bitcoin. The BaseCurrency must be fully backed by the underlying asset
Base points are standard financial expressions for the size of the fees. 1 basis point is 0,01%
How to achieve the goals?
The protocol is dependent on decentralized oracles who provide following price calculations:
CBPrice: BaseCurrency/stCurrency prices from official data sources, for example European Central Bank quotes
VWAPPrice: VWAP price of the AMM BaseCurrency/stCurrency pool is calculated by pool smart contract or by the oracle
CurrentPrice: Most recent price from AMM BaseCurrency/stCurrency pool
Additional variables manageable by the DAO are:
ProtocolFee: Protocol fees expressed in basis points (N\*0,01%)
LiquidityProgramFee: Fee expressed in basis points
NegativeFee: If the current price is better for the user then the quote from the central bank, then the user pays a negative fee. Negative fee is expressed in basis points
ExitFee: If a user wants to remove assets from the reserve, the exit fee may be applied
StopPriceTop: If the current market price is above the last central bank price, the protocol will not release any funds. (Funds may still be traded by the AMM)
StopPriceLow: If the current market price is below the last central bank price plus percentage, the protocol will not release any funds. (Funds may still be traded by the AMM)
Depending on the maturity of Stabilitas protocol, the free-market price discovery will be moved.
Examples of market simulation

BaseCurrency: USDc
stCurrency: stCZK
ProtocolFee: 0.01%
LiquidityProgramFee: 0,3%
NegativeFee: 0,3%
ExitFee: 0,1%
Stop price: 2%

Protocol maturity configuration:
CBPrice: 0%
VWAPPrice: 100%
CurrentPrice: 0%

Example #1
Use Case: Deposit reserves above CBPrice
CBPrice: 22,102 stCZK/USDc
VWAPPrice: 22,536 stCZK/USDc
CurrentPrice: 22,386 stCZK/USDc
User wants to swap $100,000 to stCZK. Obtainable assets: 22.536*100,000=2,253,600 stCZK
StopPriceTop is 22.54404. VWAPPrice < StopPriceTop, CurrentPrice < StopPriceTop, user can perform deposit of USDc and withdrawal of stCZK.
CurrentPrice >= CBPrice with increased reserves action, so NegativeFee is 0.
User pays 0,01%+0,3% = 100,000*1.0031=100,310 USDc, from which 300 USDc goes to increase stCZK/USDc LP position. User receives 2,253,600 stCZK
Example #2
Use Case: Withdraw reserves above CBPrice
CBPrice: 22,102 stCZK/USDc
VWAPPrice: 22,536 stCZK/USDc
CurrentPrice: 22,386 stCZK/USDc
User wants to swap 2,239,936.38 stCZK to USDc.
StopPriceTop is 22.54404. VWAPPrice < StopPriceTop, CurrentPrice < StopPriceTop, user can perform deposit of stCZK and withdrawal of USDc.
CurrentPrice >= CBPrice with decreased reserves action, so NegativeFee is 0,3%.
User pays 0,01%+0,3%+0,3% = 2,239,936.38\*1.0061=2,253,600 stCZK, from which 6719,81 stCZK goes to increase stCZK/USDc LP position and 0,3% stays in reserves. User receives 99,393.70 USDc
Difference between 100,000 and 99,393.70 from deposit and withdrawal from example 1 and example 2 is kept in the reserve increase and AMM LP increase.

Example #3

BaseCurrency: USDc
stCurrency: stCHF
AMM Liquidity token 1: 100 000 000 USDc
AMM Liquidity token 2: 90 000 000 stCHF
Reserves: 300 000 000 USDc
Reserves coverage: 102%
ProtocolFee: 0.01%
LiquidityProgramFee: 0,0%
NegativeFee: 0,01%
ExitFee: 0,1%
Stop price: 10%

Protocol maturity configuration:
CBPrice: 0%
VWAPPrice: 0%
CurrentPrice: 100%

Use Case: Very mature market - AMM reserves higher than 100 000 000 USDc
CurrentPrice: 1,11 stCHF/ USDc
The smart contract will allow users to deposit reserves at current AMM price and receive stCHF.
The smart contract will allow users to withdraw reserves at 0,11% fee.
DAO
Some central banks might not like this protocol because blockchain technologies do not allow any privacy. The general users might be tagged with their accounts and at that point their full history of transactions, their incomes, investments and any other earnings will become public and non deletable. Options for users is to use multi accounts, and it is their decision to go public, but some governments or politicians might not be willing to make open monetary systems a preferable direction.
That's why the protocol must be secured with smart contracts where not even the DAO can cheat the protocol - allow any withdrawals of tokens without depositing reserves at the current rate.
The DAO must be resistant to local legislative unfavorability. That's why the DAO should be established in a trusted financial zone such as Switzerland or UAE.
Risks
Market manipulation to drain the reserves
The main purpose of the variables in the protocol are to prevent the drain of reserves. The VWAP price ensures the arbitrage opportunities for the real world market disable onchain price manipulation.
DAO takeover by market manipulator
The DAO must be decentralized and decisions must be done in a fair manner. DAO tokens should be issued to active participants. Price oracle multisig parties are executives of the DAO. DAO will be managed by the Vote Coin protocol. Variable setup is done using multisig wallets owned by the DAO executives.
Price oracle stops the data feed or becomes centralized
The DAO must ensure the oracle feeds are high quality and decentralized.
Reserves do not fully covers the issuance
Reserves may not be fully covered, but the selection of stablecoins to cover the reserves will ensure that reserves are much higher than the reserves of central banks.
Terrorist financing, money laundering
The freeze and clawback functionality will be used and any dispute by the authorities will be processed according to valid legislation.

## Other references

https://gist.githubusercontent.com/sgraaf/21d5919940844c9f0c12f147ed45953d/raw/9c8d95e7620b98d12b97cbaede5ff215792ec199/currencies.json

## Deployment

Setup .env file. Use `source .env && export $(sed '/^#/d' .env | cut -d= -f1)` to set env variables and proceed with following commands:

Example .env:

```
# source .env && export $(sed '/^#/d' .env | cut -d= -f1)

mnemonic=""
mnSig1=""
mnSig2=""

tokensAppId=698

oracleECBAppId=763
oracleAMMVWAP1W=795
oracleAMMVWAP1H=829
assetOracleBase=609
reserveAppId=880

addrFee=B45OXZJJIV3P36QCQNSR2VJWXJ7U2IFH77GU4YVO3ZTUDBZK5FR7GR2GEY
msig=RVXPGSGHUTBMJ33DWSLTBY3R66ZMNFIVMAB6I7OEBFRRWE6MARPB5YE364
clawback=STABLECOCG2W3ZB2QDXOOFTMI2TAG43MZE5UWT2IZ2IQPNUCT4I26YD2HE
freeze=STABLEYQKRPOL4DQVSKTTN5APHQPA3WXEJU4M36C2E46BS34A2Q3TCGT4U


```

1. Deploy icons and fungible tokens manifests to ipfs

```
./run-deploy-arc3.sh
```

2. Deploy tokens contract

```
./run-deploy-tokens-contract.sh
```

store tokensAppId to the env vars and reload env vars

3. Deploy ECB oracle

```
./run-deploy-oracle.sh
```

store oracleECBAppId to the env vars and reload env vars

4. AMM oracle not implemented yet, but the structure is the same as ECB oracle, so please deploy oracle again for oracleAMMVWAP1W feed and oracleAMMVWAP1H

```
./run-deploy-oracle.sh
./run-deploy-oracle.sh
```

store oracleECBAppId to the oracleAMMVWAP1W and oracleAMMVWAP1H env vars and reload env vars

5. Deploy reserve contract

```
./run-deploy-reserve.sh
```

store reserveAppId and addrFee env vars and reload env vars
