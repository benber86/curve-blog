---
title: "Who are Curve Users?"
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

- XXX

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
6. _Lend:_ Borrowing or supplying in a lending market or using associated LLAMMAs

We only consider the present year. All data covers a period between January 1st, 2024 and July 31st, 2024 unless otherwise specified.
Finally, our analysis is not transitive, in the sense that if multiple users use the same contract to interact with one of the above product, we only count the intermediary as a single user. 
This means, for instance, that individual vlCVX voters are not counted as separate users of the DAO, likewise for users trading via 1inch or other aggregators' router contracts.
Likewise, users who trade via the UI's router contract are not included in the users of the "Trading" product.

## Unique users

To get a sense of how popular different products are, we first plot the number of unique users they've attracted over the course of this year:

<script src="../../js/curve-users/uniqueusers.js"></script>
<div>
  <span>Select a chain: </span>
  <select id="chainSelectUsers"></select>
</div>

<canvas id="userChart"></canvas>

Unsurprisingly, the more mature DEX products (providing liquidity and trading via the contracts or UI) attract a lot more users than the more recent lending products.
This means that the lending products still have room to grow.
As lending users bring in comparatively much more revenue per capita than traders and LPs, the growth of these products will be key for the financial health of the protocol.

Another observation is that overall two third of unique users trade through the site's UI than through aggregators such as 1inch or CoWswap. 
This proportion, however, varies from chain to chain. On Ethereum, the split is closer to 50-50. On chains like Arbitrum, Polygon and Base, virtually all trading is done through Curve's router contract.


## Volume

Of course, the number of unique users is only one aspect of the product.
Not all users trade or borrow the same amounts and consequently they generate different amounts of revenue for the protocol.
If we look at volume (defined as trades for the _Trading_ and _Router UI_ categories, as liquidity events for _LP_, and as all LLAMMA trade and liquidity events for _crvUSD_ and _Lending_), a different picture emerges:

<script src="../../js/curve-users/volume.js"></script>
<div>
  <span>Select a chain: </span>
  <select id="chainSelectUsersVolume"></select>
</div>

<canvas id="userVolumeChart"></canvas>



## Products

In a traditional swap set-up, a user must first allow the pool to take a certain amount of tokens from their wallet before they can execute a swap and receive the output token.
This preliminary step is known as an [approval](https://help.1inch.io/en/articles/6147312-token-approvals).
Once a user has allowed a pool's contract to withdraw tokens from their wallet, they can then call the pool's `exchange` function to execute a swap.
The swap will withdraw from the user's wallet using the `transferFrom` ERC-20 function, execute the swap, and transfer the amount of output token to the user's wallet.

Using an example setup in which a user swaps 1000 USDC for 1 WETH, we can illustrate the process with the following flow chart:

<script src="../../js/curve-users/heatmap.js"></script>
<div>
  <span>Select a chain: </span><select id="chainSelectHeatmap"></select>
</div>
<br>
<div id="heatmapChart"></div>
