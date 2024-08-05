---
title: "Who are Curve's Users?"
draft: false
date: 2024-07-29T09:25:45.000Z
ogimage: "https://blog.curvemonitor.com/images/exchange-received/img.png"
description: "A look at how different types of users use Curve's products"
categories:
  - Users
  - Analytics
  - Products
tags:
  - Trading
  - Users
---

_Authors:_ [benny](https://warpcast.com/bennylada)

<script src="../../js/curve-users/chainlist.js"></script>
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

## Summary

- Most users trade via the UI, but UI traders are less experienced, have a lower net worth, generate fewer volume and are less likely to engage with other Curve products.
- Lending products (LlammaLend and crvUSD) have the "stickiest" users (the ones more likely to keep using the protocol)
- LlammaLend and trading (via the contracts/aggregators) are the products most likely to get users to try other Curve products
- Very few (< 5%) of Curve LPs provide liquidity on other DEXes such as Uniswap, Ambient or Velo/Aero
- Curve shares 25% of its user based with Aave 

## Introduction


User research in web3 is very different from the established practices of web2.
Smart contracts can be called from anyone with access to an RPC, so tracking users via their interaction with a web UI might only yield insights into a small subset of the total user population.
Furthermore, user tracking via UI is (or at least should be) generally frowned upon in web3.
The pseudonymous nature of the EVM also means that traditional categorization schemes that often relied on demographic information (age, gender, geolocation) are less relevant. 
On chain, everybody is a wallet.

During a recent discussion about UI/UX, we felt the need to get a better grasp on the user base, and particularly those who use [Curve's website](https://curve.fi/).
We do not collect data on users who visit the site. 
However, users who trade from the site's UI will have their trades routed through a specific router contract. 
We can use the trades going through this contract as a proxy to estimate how many users trade directly via the website.

Our analysis breaks down Curve's products into 6 categories:
1. _DAO:_ Creating a proposal, voting or locking veCRV
2. _Trading:_ Swapping tokens via Curve's pools contracts - but not the UI
3. _LP:_ Providing liquidity in one of Curve's pools
4. _UI Router:_ Swapping tokens via the site's router contract
5. _crvUSD:_ Borrowing crvUSD or using associated LLAMMAs
6. _Lending:_ Borrowing, supplying or trading in LlammaLend

We only consider the present year. All data covers a period between January 1st, 2024 and July 31st, 2024 unless otherwise specified.
Finally, our analysis is not transitive, in the sense that if multiple users use the same contract to interact with one of the above product, we only count the intermediary as a single user. 
This means, for instance, that individual vlCVX voters are not counted as separate users of the DAO, likewise for users trading via 1inch or other aggregators' router contracts.
Likewise, users who trade via the UI's router contract are not included in the users of the "Trading" product.

## Unique users

To get a sense of how popular different products are, we first plot the number of unique users they've attracted over the course of this year:

<script src="../../js/curve-users/uniqueusers.js"></script>
<div style="margin-bottom: 10px;">

  <span>Select a chain: </span>
  <select id="chainSelectUsers"></select>
</div>

<canvas id="userChart"></canvas>

Unsurprisingly, the more mature DEX products (providing liquidity and trading via the contracts or UI) attract a lot more users than the more recent lending products.
This means that the lending products still have room to grow.
As lending users bring in comparatively much more revenue per capita than traders and LPs, the growth of these products will be key for the financial health of the protocol.

Overall two third of unique users trade through the site's UI rather than through aggregators such as 1inch or CoWswap. 
This proportion varies from chain to chain. 
On Ethereum, the split is closer to 50-50. On chains like Arbitrum, Polygon and Base, virtually all trading is done through Curve's router contract.


## Volume

Of course, the number of unique users is only one aspect of the product.
Not all users trade or borrow the same amounts and consequently they generate different amounts of revenue for the protocol.
If we look at volume (defined as trades for the _Trading_ and _Router UI_ categories, as liquidity events for _LP_, and as all LLAMMA trade and liquidity events for _crvUSD_ and _Lending_), a different picture emerges:

<script src="../../js/curve-users/volume.js"></script>
<div style="margin-bottom: 10px;">

  <span>Select a chain: </span>
  <select id="chainSelectUsersVolume"></select>
</div>

<canvas id="userVolumeChart"></canvas>

The volume from traders who use the UI is 10 times smaller than the volume from traders who directly interact with the contracts.
Indeed, we can expect most of the volume to come from arbitrageurs and MEV bots which will all interact directly with the contracts.
The distribution of the total volume generated by the users of each product is likewise telling:

<script src="../../js/curve-users/volhist.js"></script>
<div style="margin-bottom: 20px;">
<span>Select a chain: </span>
<select id="chainSelectHistogram"></select>
<span>Select a product: </span>
<select id="productSelectHistogram"></select>
</div>
<canvas id="histogramChart"></canvas>

The single largest trade via the UI was [$15 millions](https://etherscan.io/tx/0x4fa509c96e9a2a044fa6e6c7403bd9d557e5a54335fcd8a15e5bc5c055841c27), compared to [$81 millions](https://etherscan.io/tx/0x4dab46397f77317ecce7597eda11da90138677653af2c5e11d75e8b9d0674a93) for an MEV bot using the contracts.


## Products

Users can be active across all chains but they are also often active across several of Curve's products:
DAO participants, for instance are also active users of all of Curve's products:

<script src="../../js/curve-users/heatmap.js"></script>
<div style="margin-bottom: 10px;">

  <span>Select a chain: </span><select id="chainSelectHeatmap"></select>
</div>
<br>
<div id="heatmapChart"></div>

Compared to DEX products users, lending products users are more involved in the DAO and more likely to use other Curve products.
This suggests that current lending users are still mostly people already familiar with the protocol and that more efforts are needed to bring on new users.

The vast majority of users, however, only uses a single product. 
Only about 20% of users use multiple products.

<script src="../../js/curve-users/productuse.js"></script>
<div style="margin-bottom: 20px;">

<span>Select a chain: </span> <select id="chainSelectUsersCount"></select>
</div>
<div style="margin-bottom: 20px;">
<canvas id="userCountChart"></canvas>
</div>

In fact, half of users (49%) only ever perform a single transaction. 
And L2 users are much less sticky than mainnet ones. 
Most L2s have over 60% of single transaction users, compared to mainnet's 47%. 
Fraxtal is the exception for L2s with 74% of returning users.

<script src="../../js/curve-users/txhist.js"></script>
<div style="margin-bottom: 20px; margin-top: 20px">
  <span>Select a chain: </span>
  <select id="chainSelectTransactionHistogram"></select>
  <span>Select a product: </span>
  <select id="productSelectTransactionHistogram"></select>
</div>
<canvas id="transactionHistogramChart"></canvas>


## Gateway Products

Some products bring in more first-time users than others.
The UI router, for instance, is where most users start their Curve journey, regardless of the chain.
It also accounts for more first-time transactions compared to other products. 
But does it manage to turn those first time users into long-term users of the protocols?
Does it lead first-time users to try out other Curve products?

The data shows that the UI router is, in fact, not much of a gateway product:

<script src="../../js/curve-users/firsttimedis.js"></script>
<div style="margin-bottom: 20px;">
    <label for="chainSelector">Select Chain:</label>
    <select id="chainSelector"></select>
</div>

<div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-bottom: 50px">
    <div style="width: 45%; min-width: 300px;">
        <canvas id="percentageChart"></canvas>
    </div>    
    <div style="width: 45%; min-width: 300px;">
        <canvas id="firstTimeUsersChart"></canvas>
    </div>
</div>

Users who start using Curve by trading through the UI are often less likely to keep on using the protocol.
On the other hand, crvUSD and Lending users and -- to a lesser extent -- liquidity providers are much more likely to come back and do more transactions.

One could argue that liquidity providers and lending/crvUSD users are more likely than traders to do 2 transactions because closing a position requires another transaction.
To see if users of these products really are stickier, we can plot the user survival rate over a longer time period.
We calculate the probability that a user who started using Curve with a certain product will go on to stop using the product or do 1 or more, 2 or more, etc. transactions:
<script src="../../js/curve-users/survival.js"></script>

<div style="margin-bottom: 20px;">

<select id="survivalChainSelector"></select>
</div>
<div style="margin-bottom: 20px;">
<canvas id="survivalChart"></canvas>
</div>

From the chart, it's clear that this phenomenon applies to LP.
There's a higher probability that an LP will make a second transaction rather than stop using the product, but after the second transaction, probabilities plummet to levels similar to Trading and UI Router.
Lending and crvUSD users, are much more likely to continue performing more transactions over the long term.

Instead of simply tracking repeat users, we can also look for products whose first-time users are more likely to later try out other products.
We can compute the probability that users who first interact with Curve through a certain product will go on to try a different product:

Overall when considering cross-product adoption, the main gateways are Trading and Lending, but there are differences between chains.
On Ethereum mainnet, a user who first start trading on Curve via the contracts or aggregators is hihgly likely to use another product in the future.
On L2s, the main gateway product is providing liquidity, although the probability of switching to another product are relatively lower.


We can further break this down by product:

<script src="../../js/curve-users/firsttransition.js"></script>
<div style="margin-bottom: 20px;">
    <label for="chainSelector">Select Chain:</label>
  <select id="chainSelectTransitionsHeatmap"></select>
</div>
<div id="transitionsHeatmapChart"></div>


## Experience

Curve is a complex protocol, but that complexity varies between products.
Consequently, we might expect that the users of each product will have different levels of DeFi literacy. 
While such a metric is hard to quantify, we can use each user's wallet age as a proxy for their overall on-chain experience, with the assumption that older wallets will be more familiar with DeFi.

<script src="https://unpkg.com/@sgratzl/chartjs-chart-boxplot@3"></script>
<script src="../../js/curve-users/violin.js"></script>
<canvas id="violinChart"></canvas>


## Wealth

<script src="../../js/curve-users/wealthviolin.js"></script>
<canvas id="wealthViolinChart"></canvas>


| Metric           | LP | Trading | UI Router | Lending | crvUSD | DAO |
|------------------|----|---------|-----------|---------|---------|----|
| Mean             | 631.5k | 495.7k | 392.3k | 649.6k | 414.9k | 4.1m |
| Q1 (25%)         | 1.6k | 515.21 | 91.13 | 1.8k | 193.48 | 22.4k |
| Median           | 12.4k | 6.1k | 3.4k | 20.4k | 12.6k | 98.1k |
| Q2 (75%)         | 109.8k | 55.2k | 62.8k | 141.2k | 72.8k | 482.8k |
| Max              | 106.3m | 82.3m | 114.7m | 75m | 62.2m | 1.1b |
| Gini coefficient | 85.98 | 89.45 | 87.30 | 84.30 | 86.51 | 91.67 |
| % above 100k     | 25.83% | 19.90% | 20.81% | 30.55% | 22.11% | 49.16% |
| % above 1m       | 8.37% | 6.06% | 5.98% | 8.22% | 5.65% | 17.27% |

%age of net worth on ethereum

<script src="../../js/curve-users/ethworthviolin.js"></script>
<div style="margin-bottom: 20px;">
<span>Select a chain: </span><select id="ethWorthChainSelector"></select>
</div>
<div style="margin-bottom: 20px;">

<canvas id="ethWorthViolinChart"></canvas>
</div>

Hour glass shape overall really shows that most users keep their wealth on the chain on which they interact with Curve


## Other protocols used

Based on their positions in early August 2024 as reported by Debank. Positions on other protocols worth less than $100 were filtered out.
What's interesting is also what's not there (or insignificant): for instance Curve LPs very rarely LP on other DEXes such as Uniswap or Velodrome

<script src="../../js/curve-users/protoverlap.js"></script>
<div>
    <span>Select a chain: </span><select id="chainSelectOverlap"></select>
<span>Select a product: </span><select id="productSelectOverlap"></select>
</div>
<canvas id="overlapBarChart" style="height: 200px;"></canvas>


## Cross-chain behavior

Chains can exhibit differences in terms of product usage and volume distribution.
This is to be expected as less than 2% of all users transact on more than one chain.
However when users do use multiple chains, they tend to favor the same clusters of related chains:

<script src="../../js/curve-users/producthmp.js"></script>
<div style="margin-bottom: 20px;">
<span>Select a product:</span>
<select id="productSelectHeatmap"></select>

</div>
<div id="productHeatmapChart"></div>

On Polygon, Arbitrum and Optimism make up one such cluster in which users on one chain also often use either of the two others.
Only a small fraction of Ethereum Mainnet users use other chains.
For Lending, however, almost 10% of Ethereum users also have a loan on Arbitrum.


## Profiles