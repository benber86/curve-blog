---
title: "Who are GHO users"
draft: false
date: 2024-09-06T09:25:45.000Z
ogimage: "https://blog.curvemonitor.com/images/ng-mev/thumbnail.png"
description: "Analysis of GHO Users"
categories:
  - Vyper
  - Security
tags:
  - Vyper
  - Security
  - Audits
---

_Authors:_ [benny](https://warpcast.com/bennylada)

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>

# Takeaways

GHO Users are twice more likely to be engaged in other DeFi protocols than regular AAVE v3 users

# Introduction

Definition of GHO users as users who have borrowed GHO.
We do not take into account the lifetime of the loan unless otherwise specified, this means that users who minted GHO and repaid their loans are still counted as users.
While this may include contracts, they only account for a small fraction (5.6%) of minters.
Unless otherwise indicated, we do not count holders of the GHO token as users.

Data pulled on Sept. 4th and for ethereum mainnet unless otherwise indicated.

# Growth & User Acquisition

GHO launched about a year ago in July 2023. 
The product gathered over 500 unique users and $20 million of outstanding loans in its first month.
A year later, it is in the [top 20 of stablecoins](https://www.coingecko.com/en/categories/stablecoins) by market capitalization and has over 2000 users.

In September 2023, a [$35 million cap was introduced](https://governance-v2.aave.com/governance/proposal/308/) to better manage the protocol's risk exposure.
It only took a couple of months for the cap to be filled. 
As the two charts below demonstrate, the cap subsequently strongly tempered user growth. 
While the crypto market saw strong growth in Q4-23 and Q1-24, that same period saw the number of unique GHO users stall. 


<script src="../../js/gho-users/new-users-chart.js"></script>
<script src="../../js/gho-users/debt-chart.js"></script>

<div style="display: flex; justify-content: space-between; margin-bottom: 20px">
  <div style="width: 48%;">
    <canvas id="linechart-new-users" width="400" height="400"></canvas>
  </div>
  <div style="width: 48%;">
    <canvas id="linechart-debt" width="400" height="400"></canvas>
  </div>
</div>


By Q2-24, GHO's Risk Stewards [started incrementally raising the cap](https://governance.aave.com/t/arfc-chaos-labs-risk-stewards-increase-gho-minting-cap-03-01-24/16805) and user and debt growth resumed, albeit at different paces.
Plotting the growth rate of users & debt vs. utilization, we can see that any drop below 100% in the utilization is followed by a much larger surge in debt than in users. 
This suggests that the gaps are getting filled either by existing users borrowing more or by new users coming in with size.

For instance, on June 1st, a mere hours after the cap was raised from 65 to 68 million dollars, user [0xFCC5](https://etherscan.io/address/0xfcc5acd50ae590889d2a53343d35b5fb80d403c2) took out a <span>$3m</span> loan and single handedly filled the cap. 
The same user likewise immediately filled the next cap increase to <span>$75m</span> with a [<span>$7m</span> loan](https://etherscan.io/tx/0xac837669efd297ab76c156542bf784d84b4752be5de97a3968ce0b5795cde62f) on June 3rd, and the following one to <span>$82m</span> with an [extra <span>$5m</span> loan](https://etherscan.io/tx/0x5c4c97482ff7e5c19758fd4cebe6ce3a4156315b820820cdd4c8619ca2e65ef7) on June 5th.

Borrowed amounts increased in general, from <span>$65k</span> in July-August 2023 to almost <span>$100k</span> in July-August 2024, with almost 3 times more users taking on $1m+ loans in the latter period
This, too, indicates that **growth in Q2 and Q3 2024 was driven more by capital than new users.**

<script src="../../js/gho-users/growth-and-utilization-chart.js"></script>
<div style="width: 100%; margin-bottom: 20px">
    <canvas id="chart-growth-and-utilization" width="800" height="400"></canvas>
</div>

However as borrow cap increases become larger, there are larger time windows for new users to mint GHO.
After the first <span>$35m</span> borrow cap was reached in 2023, any subsequent available borrowing capacity (from either cap raises or loan repayments) was filled within a couple of days, and often in just a few hours.
But the large increases in summer 2024 (from <span>$75m</span> to <span>$150m</span>) took over a month to fill, and the current cap, at the time of writing, has not been filled for over 2 weeks: 

<script src="../../js/gho-users/fill-times-chart.js"></script>

<div style="width: 90%; margin: auto; margin-bottom: 20px">
    <canvas id="barchart-fill-times" width="400" height="300"></canvas>
</div>

# Where do GHO users come from?

There are now over 2000 users who borrowed GHO, but that figure remains relatively small in comparison to AAVE's total user base.
**GHO users represent 10% of all AAVE v3 borrowers,** and around 5% of all users.
If we include v2 borrowers, that proportion falls to 2.95% of all time borrowers (1.4% of all users).
But how many of these GHO users are existing AAVE users and how many are new users that the product brought to AAVE?


<script src="../../js/gho-users/donut-charts.js"></script>

<div style="display: flex; justify-content: space-between; margin-bottom: 20px">
  <div style="width: 48%; height: 450px;">
    <canvas id="donutChart1"></canvas>
  </div>
  <div style="width: 48%; height: 450px;">
    <canvas id="donutChart2"></canvas>
  </div>
</div>

**About half of all GHO borrowers are entirely new users** while the other half had previously used AAVE either via v2 or v3.
This ability to attract new users is quite rare among borrowable assets. 
It is more often seen in mature assets - established stablecoins like USDC/USDT or ETH and derivatives - than in new products. 
The chart below compares the distribution of users' first actions against some of the other most commonly borrowed assets on AAVE:



<script src="../../js/gho-users/token-borrowing-patterns.js"></script>

<div style="height: 600px; width: 100%; margin-bottom: 20px">
    <canvas id="tokenBorrowingPatterns"></canvas>
</div>

One key difference with established assets is that **new GHO users are less likely to borrow other assets**.
In fact, out of all the assets in the chart above, new GHO users (understood as users who only ever borrowed GHO or started using AAVE by borrowing GHO) are the least likely to borrow other assets after borrowing GHO, although they might borrow more GHO.
This could be explained by the comparatively young age of the market and the situation is likely to change as it matures.

Indeed, GHO users are generally more active on-chain than other AAVE users.
In fact, **GHO users are twice more likely to use another DeFi protocol.**
There is further difference between users who started using AAVE through GHO (new users) and existing AAVE users who started borrowing GHO.
The latter are more active in DeFi and favor protocols like Curve and Convex where new users favor restaking protocols like ether.fi and Eigenlayer.

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
As we can not track protocol usage prior to opening a GHO loan (all-cross protocol data was drawn from the state of the user wallets as of September 10th via DeBank's API), it is difficult to establish directionality or causality (do GHO users move to Pendle to stake? or are Pendle users coming to AAVE?).
However, by looking at the assets that GHO users stake on Pendle, it's easy to see that they do not there to get yield on their GHO.
Instead, the tokens they most often stake on Pendle are USDC, USDe, ETH and LRTs/LSTs.

Likewise on Curve, very few GHO borrowers use the protocol to provide GHO liquidity. 
Instead they are more likely to provide liquidity in the 3pool (USDC/USDT/DAI) or for ETH pairs.

# Where do GHO users go?

If users are not staking GHO on the most popular yield platforms like Curve and Pendle, what do they do with their GHO?
The above charts only look at where users currently have assets, which does not capture, for instance, trading activities.
To have a better look at where GHO flows to, we can collect and parse the token's transfer events. 
This allows us to see where GHO minters sent their tokens to (first-order flow), and, if they swapped them, what tokens they swapped it for (second-order flow).
We quantify the flows in USD and in total number of transactions in the chart below:

<script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
<script src="../../js/gho-users/sankey.js"></script>


<div id="ddownsankey" style="margin-top: 40px; margin-bottom: 40px">
    <select id="data-type">
        <option value="volume" selected>USD Volume</option>
        <option value="transactions">Number of Transactions</option>
    </select>
</div>
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


# Liquidations

Liquidations are important to ensure the stability and collaterization of stablecoins like GHO.
They however present a risk to lending protocols as they might create bad debt and/or discourage liquidated users from borrowing again.
It is therefore worth investigating the prevalence of liquidations among GHO minters and whether that number is significantly different from that of other collateral assets.

We can look at the total number of liquidations (regardless of the loaned token) by type of users to determine if their overall borrowing behavior exhibits higher or lower risk preference. 
We can also look at the number of loans of a particular assets that were liquidated to see if the liquidations can be more specifically attributable to something about the asset.

<script src="../../js/gho-users/liquidations.js"></script>
<script src="../../js/gho-users/liq-prop.js"></script>
<div style="display: flex; justify-content: space-between; height: 450px; width: 100%; margin-bottom: 20px;">
    <div style="width: 48%;">
        <canvas id="liquidationChart"></canvas>
    </div>
    <div style="width: 48%;">
        <canvas id="liqPropChart"></canvas>
    </div>
</div>

At first glance, from the chart on the left, it might seem that GHO minters are more likely to experience a liquidation (10%) compared to other AAVE users (8%) and might therefore be less risk averse.
However, when further breaking down the numbers, we see that most GHO users who experienced liquidations are those who had previously borrowed on AAVE v2 or v3. 
That they've experienced more liquidations simply reflects the fact that they've spent more time on the platform.

When we look at asset specific loans (right), we see instead that **GHO denominated loans are less likely to be liquidated (6%) compared to other major stablecoins like USDC (8%) and USDT (9%).**
This number is also lower compared to another CDP stablecoin, crvUSD, where hard liquidations are closer to 10%, with some variation per market. 

That crypto denominated loans have lower liquidation rates overall simply reflects market conditions since the launch of AAVE v3.
Crypto assets have mostly lost value, making their borrowers less likely to be liquidated compared to users who borrowed stablecoins and most likely used crypto assets as collateral.

Looking at the present state of the market and the distribution of user health scores, GHO users are no different from asset borrowers with an **1.67 median health score** and a similar distribution:

<script src="https://unpkg.com/@sgratzl/chartjs-chart-boxplot@3"></script>
<script src="../../js/gho-users/health-violin.js"></script>
<canvas id="healthViolinChart" height="200px"></canvas>

Overall, health factor distribution is homogenous across all borrowed assets.
As these are aggregated health scores across all loans, a user's stats can be counted in different asset (if they have concurrently borrowed different assets).

# Collateral Preferences

The types and proportions of collateral supplied are also relatively similar across borrowers, including GHO minters.
ETH (wrapped or staked) is uniformally the leading choice for collateral.
USDC and USDT borrowers are somewhat different, with a collateral mix skewed more towards ETH and BTC than other borrowed assets, including other stablecoins.

<script src="../../js/gho-users/collateral-preference.js"></script>

<div style="height: 600px; width: 100%; margin-bottom: 20px">
    <canvas id="collatPreference"></canvas>
</div>

The chart displays that a sometimes large proportion of people borrowing a token also supply the token as collateral.
This can be due to a number of reasons, including multiple positions (sometimes asynchronous if different loans are opened separately over time), arbitrage, leverage or liquidity needs.

# Borrowing Patterns

<script src="../../js/gho-users/tx-count.js"></script>
<canvas id="txCountChart" height="180px"></canvas>

# Survival Rates

We compute the likelihood that a user who started using AAVE by borrowing a certain asset will continue to interact with the protocol.
We define continuous interaction as either another borrow or supply event (and exclude liquidations and repayments).
We only consider users who started interacting with AAVE in the past year to avoid bias towards assets that have been available for longer.


<script src="../../js/gho-users/survival-rate.js"></script>

<div style="height: 380px;width: 100%; margin-bottom: 20px">
    <canvas id="survivalChart"></canvas>
</div>
GHO minters are in the bottom range of assets for user stickiness.
While 8 out 10 users who started by borrowing PYUSD or LUSD continue transacting on AAVE, 40% of GHO minters never interact with the protocol again.

# User Age & Activity


<script src="../../js/gho-users/age-violin.js"></script>
<canvas id="violinChart"></canvas>

# User Wealth

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

| Metric     | AAVE v3 Users | GHO Users |
|------------|---------------|-----------|
| Mean       | 602,689 | 644,543 |
| Q1 (25%)   | 171 | 2,572 |
| Median     | 3,097 | 30,369 |
| Q3 (75%)   | 52,379 | 164,741 |
| Max        | 1,334,557,934 | 223,611,758 |
| Gini coef. | 92.8% | 84.7% |

</div>
</div>

GHO users are significantly wealthier with the **median wallet value 10 times that of other AAVE v3 users**.

If we breakdown the aggregate value of the users' portfolios we also see a number of differences between GHO users and v3 users.
GHO users are more likely to store their wealth on L2s like arbitrum or base.
While the actual distribution and choice of yield source may differ, both categories' portfolios are still strongly weighted towards ETH, BTC and stablecoins. 

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

We continued to work with our long term auditor [ChainSecurity](https://www.chainsecurity.com/) but extended our engagement to hire a consultant on retainer basis to provide continuous security advice.
Two new auditors, [Ottersec](https://osec.io/) and [Statemind](https://statemind.io/) were brought on board to provide additional security assessments and bring different perspectives and methods into our review process.
Shortly after the hack, a [security competition](https://codehawks.cyfrin.io/c/2023-09-vyper-compiler) was also organized on CodeHawks with $160,000 in prizes.