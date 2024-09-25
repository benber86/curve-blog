---
title: "GHO Users: Interactions & Patterns"
draft: false
date: 2024-09-24T09:25:45.000Z
ogimage: "https://blog.curvemonitor.com/images/gho-users/sankey.jpg"
description: "Analysis of GHO Users' On-Chain Behavior"
categories:
  - GHO
  - AAVE
  - Users
  - Analytics
  - Products
tags:
  - GHO
  - AAVE
  - Users
  - Analytics
  - Products
---

_Authors:_ [benny](https://warpcast.com/bennylada)

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>

# Executive Summary

This research presents a comprehensive user analysis of GHO, Aave's decentralized stablecoin, since its launch in July 2023. We identify key user behavior and adoption trends by leveraging on-chain data, subgraphs, and information from third-party providers. Our study reveals several important insights:

- GHO borrowers now represent 10% of all Aave v3 borrowers, with Q1/Q2-24 growth driven more by increased capital from existing users than new borrowers.
- Approximately half of GHO borrowers are new to Aave, suggesting the stablecoin's potential to attract fresh participants to the platform.
- GHO users demonstrate higher engagement with other DeFi protocols than regular Aave v3 users, indicating a more active user base.
- The introduction of staking incentives has been crucial in stabilizing GHO's peg and reducing outflows to other stablecoins.
- GHO loans show lower liquidation rates than established stablecoins like USDC and USDT, indicating that GHO users, despite being wealthier and more experienced, do not present higher risk preferences when borrowing.
- User retention remains a challenge, with about 40% of initial GHO borrowers not returning for further interactions.

These findings present a promising landscape for the GHO stablecoin, allowing Aave to capitalize on its unique user base and adapt strategies that foster long-term engagement.

# Introduction & Methodology

[GHO](https://docs.gho.xyz/) is a decentralized and overcollateralized stablecoin launched by Aave in July 2023.
This article examines the product's growth, the flows of GHO within the DeFi ecosystem, the impact of incentives, and the specificities of GHO users.
We aim to understand who the GHO users are, how they differ from other Aave users, and what insights can be drawn about their behavior and impact on the ecosystem. This article will also include visualizations and graphs to help intuitively illustrate user behaviors and asset flows.
In addition to analyzing transactional data, this approach will uncover valuable business insights related to the token's performance, user engagement, and the broader strategic implications for GHO within the DeFi landscape.

We want to note clarifying details regarding the framework of our analysis:

- While GHO is [technically minted rather than borrowed](https://docs.gho.xyz/concepts/how-gho-works/gho-implementation), we will nonetheless use the terms "borrow" and "borrowers" when referring to minting and minters.
- We define GHO users as individuals or entities who have borrowed GHO at one point.
- We do not consider the loan's lifetime unless otherwise specified; this means that users who minted GHO and repaid their loans are still counted as users.
- Our definition of users includes smart contracts. However, they only account for a small fraction (5.6%) of minters.
- We do not count holders of the GHO token who never minted it on AAVE as users.
- We also equate one address to one user, as the human unit is not the most relevant for blockchain analytics. An individual may own multiple addresses, but if each address's behavior is different, there is no practical or analytical advantage in grouping them (assuming we could know who owns them). On the other hand, two different individuals may run the same bots and behave the same way on-chain. It's, therefore, more productive to take addresses as the base unit and potentially group users based on their similarities.

Unless otherwise specified, our analysis is solely for the Ethereum mainnet based on data collected on September 4th, 2024.
Data is sourced from the [AAVE v3 subgraphs](https://github.com/aave/protocol-subgraphs/tree/main/src), a [subgraph tracking GHO transfers](https://github.com/benber86/gho_token_subgraph) built for this study, third party data providers ([Debank](https://debank.com/), [Moralis](https://moralis.io/), [Arkham](https://platform.arkhamintelligence.com/)) or directly from a node.

# Growth & User Acquisition

GHO launched a year ago, in July 2023.
The product gathered over 500 unique users and $20 million of outstanding loans in its first month.
A year later, it is in the [top 20 of stablecoins](https://www.coingecko.com/en/categories/stablecoins) by market capitalization and has over 2000 users.

In September 2023, a [$35 million cap was introduced](https://governance-v2.aave.com/governance/proposal/308/) to better manage the protocol's risk exposure.
It only took a couple of months for the cap to be filled.
As the charts below demonstrate, the cap subsequently strongly tempered user growth.
While the crypto market saw strong growth in Q4-23 and Q1-24, that same period saw the number of unique GHO users stall.

The restraint on growth was seen as necessary to [restore and ensure the stability of the peg](https://www.llamarisk.com/research/explainer-series-gho-stablecoin), which had fallen below $0.98 shortly after the product's launch and remained there until the end of 2023.
With limited incentives to hold onto GHO, new mints necessarily put downward pressure on the peg.

<script src="../../js/gho-users/new-users-chart.js"></script>
<script src="../../js/gho-users/debt-chart.js"></script>
<script src="../../js/gho-users/peg-chart.js"></script>
<script src="../../js/gho-users/debt-ceiling-chart.js"></script>

<div style="display: flex; justify-content: space-between; margin-bottom: 20px">
 <div style="width: 48%;">
 <canvas id="linechart-new-users" width="400" height="400"></canvas>
 </div>
 <div style="width: 48%;">
 <canvas id="linechart-debt" width="400" height="400"></canvas>
 </div>
</div>

<div style="display: flex; justify-content: space-between; margin-bottom: 20px">
 <div style="width: 48%;">
 <canvas id="linechart-peg" width="400" height="400"></canvas>
 </div>
 <div style="width: 48%;">
 <canvas id="linechart-ceiling" width="400" height="400"></canvas>
 </div>
</div>

The introduction of the [GHO Stability Module](https://docs.gho.xyz/developer-docs/gho-stability-module) and staking incentives eventually stabilized the peg.
By Q2-24, GHO's Risk Stewards [started incrementally raising the cap](https://governance.aave.com/t/arfc-chaos-labs-risk-stewards-increase-gho-minting-cap-03-01-24/16805) and user and debt growth resumed, albeit at different paces.
Plotting the growth rate of users & debt vs. utilization, we can see that any drop below 100% in utilization is followed by a much larger surge in debt than in users.
This suggests that the gaps are getting filled either by existing users borrowing more or by new users coming in with size.

<script src="../../js/gho-users/growth-and-utilization-chart.js"></script>
<div style="width: 100%; margin-bottom: 20px">
 <canvas id="chart-growth-and-utilization" width="800" height="400"></canvas>
</div>

For instance, on June 1st, a mere hours after the cap was raised from $65m to $68m, user [0xFCC5](https://etherscan.io/address/0xfcc5acd50ae590889d2a53343d35b5fb80d403c2) took out a <span>$3m</span> loan and single-handedly filled the cap.
The same user likewise immediately filled the next cap increase to <span>$75m</span> with a [<span>$7m</span> loan](https://etherscan.io/tx/0xac837669efd297ab76c156542bf784d84b4752be5de97a3968ce0b5795cde62f) on June 3rd, and the following one to <span>$82m</span> with an [extra <span>$5m</span> loan](https://etherscan.io/tx/0x5c4c97482ff7e5c19758fd4cebe6ce3a4156315b820820cdd4c8619ca2e65ef7) on June 5th.

Borrowed amounts increased in general, from an average <span>$65k</span> in July-August 2023 to almost <span>$100k</span> in July-August 2024, with nearly 3 times more users taking on $1m+ loans in the latter period. This, too, indicates that **growth in Q2 and Q3 2024 was driven more by capital than new users.**

However, as the borrow cap increases and becomes larger, there are now larger time windows for new users to mint GHO.
After the first <span>$35m</span> borrow cap was reached in 2023, any subsequent available borrowing capacity (from either cap raises or loan repayments) was filled within a couple of days, and often in just a few hours.
But the large increases in summer 2024 (from <span>$75m</span> to <span>$150m</span>) took almost a month to fill, and the current cap, at the time of writing, has not been filled for over 2 weeks:


<script src="../../js/gho-users/fill-times-chart.js"></script>

<div style="width: 90%; margin: auto; margin-bottom: 20px">
 <canvas id="barchart-fill-times" width="400" height="300"></canvas>
</div>

# Where do GHO users come from?

Over 2000 users have now borrowed GHO.
**GHO users represent 10% of all Aave v3 borrowers** and around 5% of all v3 users.
If we include v2 borrowers, that proportion falls to 2.95% of all-time borrowers (1.4% of all users).
But how many of these GHO users are existing Aave users? And how many new users did the product bring to Aave?


<script src="../../js/gho-users/donut-charts.js"></script>

<div style="display: flex; justify-content: space-between; margin-bottom: 20px">
 <div style="width: 48%; height: 450px;">
 <canvas id="donutChart1"></canvas>
 </div>
 <div style="width: 48%; height: 450px;">
 <canvas id="donutChart2"></canvas>
 </div>
</div>


As seen above, **about half of all GHO borrowers are entirely new users**, while the other half had previously used Aave via v2 or v3.
This means that GHO is better at attracting new users than other stablecoins like LUSD, crvUSD, or PYUSD.
Established stablecoins like USDT or USDC have a much higher rate of new users onboarded, but this merely reflects that they were available on Aave when there were fewer assets to choose from.
To expand further, the chart below compares the distribution of users' borrowing behavior against some of the other most commonly borrowed assets on Aave:


<script src="../../js/gho-users/token-borrowing-patterns.js"></script>

<div style="height: 600px; width: 100%; margin-bottom: 20px">
 <canvas id="tokenBorrowingPatterns"></canvas>
</div>

One key difference between GHO and other assets borrowers is that **new GHO users are less likely to borrow additional assets**.
In fact, out of all the assets in the chart above, new GHO users (understood as users who only ever borrowed GHO or started using Aave by borrowing GHO) are the least likely to borrow other assets after initially borrowing GHO. However, they may continue to borrow more GHO.
The comparatively young market age could explain this, and the situation will likely change as it matures.

GHO users tend to be more active on-chain than other Aave users, making them more inclined to explore the various options within the protocol. **GHO users are twice as likely to engage with other DeFi protocols** than non-GHO users on Aave. There's also a noticeable difference between new users who began using Aave through GHO and existing Aave users who borrowed GHO. The latter are more active across DeFi and tend to favor protocols like Curve and Convex, while new users gravitate more toward restaking protocols such as ether. fi and Eigenlayer.

<script src="../../js/gho-users/protocol-usage-charts.js"></script>
<style>
#chartContainer .h4 {
    color: #ccf !important;
}
</style>
<div id="chartContainer">
 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 550px; width: 100%; margin-bottom: 60px">
 <div style="height: 280px;">
 <canvas id="v3UsersChart"></canvas>
 </div>
 <div style="height: 280px;">
 <canvas id="ghoUsersChart"></canvas>
 </div>
 <div style="height: 280px;">
 <canvas id="newGhoUsersChart"></canvas>
 </div>
 <div style="height: 280px;">
 <canvas id="existingAaveUsersChart"></canvas>
 </div>
 </div>
</div>



Pendle is one of the most commonly used protocols for both categories of GHO users.
As we cannot track protocol usage before opening a GHO loan (all-cross protocol data was drawn from the state of the user's address as of September 10th via DeBank's API), it is difficult to establish directionality or causality:
Do GHO users move to Pendle to stake? Or are Pendle users coming to AAVE?

An analysis of GHO users' assets on Pendle reveals that they do not primarily go there to earn yield on their GHO. Instead, the tokens they most frequently stake include USDC, USDe, ETH, and LRTs/LSTs. Similarly, only a small number of GHO borrowers use Curve to provide liquidity for GHO. Instead, they are more inclined to provide liquidity in the 3pool (USDC/USDT/DAI) or for ETH pairs.

# Where do GHO users go?

If users do not provide liquidity on Curve or deposit on Pendle, what do they do with their GHO?
The above charts only look at where users currently have assets, which does not capture flows such as trading activities.
To better understand where GHO liquidity moves, we can follow the token's transfer events.
This allows us to see where GHO minters sent their tokens to (first-order flow) and, if they traded them, what tokens they traded GHO for (second-order flow).
We display the flows in USD and total number of transactions in the following chart:

<script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
<script src="../../js/gho-users/sankey.js"></script>


<div id="ddownsankey" style="margin-top: 40px; margin-bottom: 40px">
 <select id="data-type">
 <option value="volume" selected>USD Volume</option>
 <option value="transactions">Number of Transactions</option>
 </select>
</div>
<div style="text-align: center; width: 100%; margin-bottom: 20px;">
<span style="font-size: 16px; color: #666; font-weight: bold">GHO First and Second Order Flows From Mint</span></div>
<div id="sankey-chart"></div>

<style>
    #sankey-chart {
        width: 100%;
        margin-bottom: 20px;
        height: 600px;
 }
    
    .node rect {
        cursor: move;
        fill-opacity: 0.9;
        shape-rendering: crispEdges;
 }
    
    .node text {
        pointer-events: none;
        text-shadow: 0 1px 0 #fff;
 }
        
    .link:hover path {
        stroke-opacity: 0.5;
 }
    
    .link-tooltip {
        font-size: 10px;
        pointer-events: none;
 }
</style>

The chart shows that while most minters traded their GHO for another stablecoin such as USDC, USDT or DAI, GHO staking and liquidity on DEXes are important supply sinks for the coin.

But, as this is an aggregated view over 1 year, it does not capture some of the changes in GHO flow directionality over time.
In particular, 2024 saw the introduction of [GHO staking](https://governance.aave.com/t/arfc-upgrade-safety-module-with-stkgho/15635/10) which offered incentives for minters to hold on to their GHO rather than immediately trade it for other assets.
Incentives for staking were [increased in February](https://governance.aave.com/t/arfc-amend-safety-module-emissions/16640) and further strengthened by the introduction of the [Merit Program](https://governance.aave.com/t/arfc-merit-a-new-aave-alignment-user-reward-system/16646) in March.

To evaluate the impact of these incentives on flows, we split the data into two different periods using March 15th -- after most incentives were introduced -- as the demarcation date:

<script src="../../js/gho-users/before-after.js"></script>

<div style="height: 300px; margin-bottom: 50px; margin-top: 20px;">
 <canvas id="beforeAfterChart" style="margin-top: 30px;"></canvas>
</div>

The most obvious change is the tremendous increase in the proportion of flows going towards staking, from 3.8% to 19.1%.
The corollary to this increase is a decrease in the flows towards DEXes such as Uniswap (12.8% to 1.2%) or Balancer (11% to 1.8%).
This indicates that the staking program was successful at preventing users from selling GHO for other stablecoins or crypto assets.
Mitigating selling pressure this way did, in turn, help stabilize the peg.

Not all users might indeed have been using DEXes to sell their GHO.
Looking at second-order flows on major DEXes, we can see in the chart below that many users were using DEXes to provide liquidity and get yield on their GHO in the absence of staking rewards.
(_Stablecoins_ means that users traded their GHO for other stables like USDC or USDT, while _Crypto assets_ refers to all other, volatile tokens users have traded GHO for):


<script src="../../js/gho-users/sec-order-merit.js"></script>

<div id="merit-charts">
 <div id="merit-chart-container" style="display: flex; justify-content: space-between; height: 450px; width: 100%; margin-bottom: 20px;">
 </div>
</div>

Incentives thus successfully reduced the outflows towards other stablecoins on the three major mainnet DEXes.
They also reduced flows going towards liquidity pools, particularly on Uniswap v3, which may have reduced available liquidity and destabilized the peg.
However, reducing liquidity providing might also have been necessary to minimize sell pressure on GHO.
Depositing single sided liquidity on Curve or Balancer is equivalent to a partial sell, and on Uni v3 is akin to a sell order.

This comparison is still lacking, as we did not include aggregators such as CowSwap or 1inch since they did not offer an option to LP.
The two periods are also of different lengths, and the supply of GHO was much larger in the second period than in the first.

After normalizing for time and supply and considering all outflows to DEXes, we find that overall **staking incentives reduced outflows to stablecoins by close to 25%**.
Concomitantly, incentives also drastically reduced outflows towards liquidity pools by <span>83%</span>.


<script src="../../js/gho-users/outflow-change-merit.js"></script>

<div style="display: flex; height: 400px; margin-bottom: 50px; margin-top: 10px; text-align: center;">
 <div style="width: 50%; margin: 0 auto;">
 <canvas id="outflowChange" style="margin-top: 10px;"></canvas>
 </div>
</div>

# Liquidations

Liquidations are important to ensure the stability and collateralization of stablecoins like GHO.
They, however, present a risk to lending protocols as they might create bad debt and/or discourage liquidated users from borrowing again.
Therefore, it is worth investigating the prevalence of liquidations among GHO minters and checking whether it is significantly different from other borrowed assets.

There are two things we can look at.
- Total number of liquidations (regardless of the denomination of the liquidated loans) by type of user. This shows whether GHO users' overall borrowing behavior exhibits higher or lower risk preference.
- Proportion of loans of a particular asset that were liquidated. This shows if liquidations can be related to asset attributes.

<script src="../../js/gho-users/liquidations.js"></script>
<script src="../../js/gho-users/liq-prop.js"></script>
<div style="display: flex; justify-content: space-between; height: 450px; width: 100%; margin-bottom: 20px;">
 <div style="width: 50%;">
 <canvas id="liquidationChart"></canvas>
 </div>
 <div style="width: 48%;">
 <canvas id="liqPropChart"></canvas>
 </div>
</div>


At first glance, from the chart on the left, it might seem that GHO minters are more likely to experience a liquidation (10%) compared to other Aave users (8%) and might, therefore, be less risk averse.
However, when further breaking down the numbers, we see that most GHO users who experienced liquidations had previously borrowed on Aave v2 or v3.
That they've experienced more liquidations simply reflects the fact that they've spent more time on the platform.

When we look at asset-specific loans (right), we see instead that **GHO denominated loans are less likely to be liquidated (6%) compared to other major stablecoins like USDC (8%) and USDT (9%).**
For comparison, on [Curve's lending platform](https://crvusd.curve.fi/#/ethereum) hard liquidations for crvUSD borrowers are closer to 10%, with some variation per market.

The lower liquidation rates for crypto-denominated loans can largely be attributed to market conditions since the launch of Aave v3. As crypto assets have generally decreased in value, borrowers of these assets are less likely to face liquidation than those who have borrowed stablecoins using volatile assets as collateral.

Looking at the present state of the market and the distribution of user health scores, GHO users are not significantly different from other asset borrowers with a **1.67 median health score** and similar distribution:

<script src="https://unpkg.com/@sgratzl/chartjs-chart-boxplot@3"></script>
<script src="../../js/gho-users/health-violin.js"></script>
<canvas id="healthViolinChart" height="240px"></canvas>

Overall, health factor distribution is homogenous across all borrowed assets.
As these are aggregated health scores across all loans, a user's score can be counted in different assets (if they have concurrently borrowed multiple assets).

# Collateral Preferences

The types and proportions of collateral supplied are also relatively similar across borrowers, including GHO minters.
ETH (wrapped or staked) is uniformly the leading choice for collateral.
USDC and USDT borrowers are somewhat different, with a collateral mix skewed more towards ETH and BTC than other borrowed assets, including other stablecoins.

<script src="../../js/gho-users/collateral-preference.js"></script>

<div style="height: 600px; width: 100%; margin-bottom: 20px">
 <canvas id="collatPreference"></canvas>
</div>

The chart shows that sometimes a large proportion of people borrowing a token also supply the token as collateral.
This can be due to several reasons, including multiple positions (sometimes asynchronous if different loans are opened separately over time), rate arbitrage, leverage, or liquidity needs.

# Borrowing Patterns

We know that GHO users are slightly less likely to borrow other tokens than other borrowers.
But when they do, they favor established stablecoins like USDC, USDT, DAI, or WETH when borrowing crypto.
This co-utilization pattern is similar to other assets, albeit in lesser proportions.
GHO is a relatively popular borrowing option, considering the age of the asset.
Almost 10% of USDC borrowers also borrow GHO, and roughly one-third of LUSD, PYUSD, and crvUSD borrowers.


<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script src="../../js/gho-users/borrowed-heatmap.js"></script>
<div id="borrowedHeatmap"></div>

GHO users are less likely to borrow other assets but more likely to borrow GHO again compared to crypto assets or stablecoins like LUSD or crvUSD.
**Almost half of all GHO borrowers will go on to borrow GHO again**.
Only USDC and USDT do better, with 55% of multiple borrows and 10% of users borrowing more than 7 times.

<script src="../../js/gho-users/tx-count.js"></script>
<canvas id="txCountChart" height="180px"></canvas>

# Survival Rates

Expanding beyond repeat borrows of a single asset; we compute the likelihood that a user who started using Aave by borrowing a certain asset will continue to interact with the protocol.
We define continuous interaction as another borrow or supply event (excluding liquidations and repayments), regardless of the asset.
We only consider users who started interacting with Aave in the past year to avoid bias towards assets that have been available for longer.


<script src="../../js/gho-users/survival-rate.js"></script>

<div style="height: 380px;width: 100%; margin-bottom: 20px">
 <canvas id="survivalChart"></canvas>
</div>

From this perspective, users who started using Aave by minting GHO are in the bottom range of assets for user stickiness.
While 8 out of 10 users who started by borrowing PYUSD or LUSD continue transacting on Aave, 40% of GHO minters never interact with the protocol again.

# User Wealth

Using [DeBank data](https://cloud.debank.com/open-api), we collect the USD value and composition of the portfolios of a large sample of Aave v3 users and GHO minters:

<script src="../../js/gho-users/wallet-balance-distribution.js"></script>


<div style="display: flex; justify-content: space-between; height: 300px; width: 100%; margin-bottom: 20px;">
 <div style="width: 48%;">
 <canvas id="walletBalanceDistributionAll"></canvas>
 </div>
 <div style="width: 48%;">
 <canvas id="walletBalanceDistributionGHO"></canvas>
 </div>
</div>
<div style="width: 60%; margin: 0 auto; display: flex; justify-content: center; align-items: center; flex-direction: column;">

<div style="width: 100%; justify-content: center">

| Metric     | Aave v3 Users | GHO Users |
|------------|---------------|-----------|
| Mean       | 602,689 | 644,543 |
| Q1 (25%)   | 171 | 2,572 |
| Median     | 3,097 | 30,369 |
| Q3 (75%)   | 52,379 | 164,741 |
| Max        | 1,334,557,934 | 223,611,758 |
| Gini coef. | 92.8% | 84.7% |

</div>
</div>

GHO users are significantly wealthier, with the **median portfolio value 10 times that of other Aave v3 users**.

If we break down the aggregate value of the users' portfolios, we also see several differences between GHO users and other v3 users.
GHO users are more likely to store their wealth on L2s like Arbitrum or Base.
While the actual distribution and choice of yield source may differ, both categories' portfolios are strongly weighted towards ETH, BTC, and stablecoins:

<script src="../../js/gho-users/donut-charts-comparison.js"></script>

<div id="portfolioChart">
 <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
 <div style="width: 48%; height: 550px;">
 <canvas id="donutChart10"></canvas>
 </div>
 <div style="width: 48%; height: 550px;">
 <canvas id="donutChart20"></canvas>
 </div>
 </div>
</div>


# User Age & Activity

Finally, we take a look at the age and level of activity (using the account's nonce as a proxy) of Aave v3 and GHO users:

<script src="../../js/gho-users/age-violin.js"></script>
<canvas id="violinChart"></canvas>

GHO borrowers appear more experienced, with a median account age of 2.3 years compared to 1.5 years for other Aave users.
They're also much more active on-chain, with a median of 121 transactions against 32 for other users.

# Arbitrum

In the previous section, we only looked at metrics observed on Ethereum mainnet; however [GHO has been available on Arbitrum](https://governance.aave.com/t/arfc-gho-cross-chain-launch/17616/14) since July 2024.
The Arbitrum user base has been growing steadily since, reaching close to 25% of the number of Ethereum users. While it is too early to perform in-depth analysis, it may be covered in future iterations.

An interesting feature so far is that Arbitrum users seem to be more risk-averse than their Ethereum mainnet counterparts.
Less than 3% of the GHO loans have been liquidated so far vs 6% on mainnet.
Also, the median health is higher on Arbitrum, and an (admittedly crude, heuristic) estimation of the prevalence of user leveraging their loans indicates that the practice is more common on Ethereum.
But of course, this may reflect the younger age of the Arbitrum product (only 2 months at the time of writing) and the market's low volatility since the summer.


<script src="../../js/gho-users/arbitrum-users.js"></script>
<script src="../../js/gho-users/new-users-chart-arbi.js"></script>

<div style="display: flex; justify-content: space-between; margin-bottom: 20px">
 <div style="width: 48%;">
 <canvas id="linechart-new-users-arb" width="400" height="447"></canvas>
 </div>
 <div style="width: 48%;">
 <canvas id="arbiCompare" width="400" height="500"></canvas>
 </div>
</div>

# Closing Remarks

The analysis of GHO user behavior provides valuable insights into the evolving landscape of DeFi and the role of Aave's stablecoin in attracting and retaining users. GHO's ability to draw in new participants, particularly with a noteworthy proportion of first-time borrowers, highlights its appeal and the potential for future growth within the ecosystem. The observed loyalty among returning users and a distinct borrowing behavior set GHO apart from more established stablecoins, suggesting that users are increasingly finding value in its unique offerings.

The trends also indicate a vibrant engagement with other DeFi protocols, demonstrating GHO's capacity to foster a cross-protocol interest that can strengthen the overall DeFi landscape. The lower liquidation rates and the significant wealth of GHO users further underscore the product's attractiveness and the careful risk management strategies employed by borrowers.

As GHO continues to mature, this analysis helps to understand how user behaviors adapt to market changes and the effectiveness of incentive structures. The insights gleaned from this study not only underscore the current state of GHO but could also pave the way for future strategic decisions contributing to scaling GHO adoption.

In summary, GHO is not just a stablecoin; it represents a pivotal shift in how users engage with the Aave protocol. It emphasizes the importance of innovation, user experience, and community building to drive the next level of scale for Aave.
