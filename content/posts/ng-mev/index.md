---
title: "Impact of Dynamic Fees on MEV Activity"
draft: false
date: 2024-03-06T09:16:45.000Z
description: "This post compares MEV activity on StableSwap NG pools and pools with the original implementation. It explains dynamic fees and their role in the drastic reduction of certain types of MEV activity on NG pools."
categories:
  - MEV
  - Pools
tags:
  - StableSwap
  - NG
  - MEV
---

# Key Findings

- Dynamic fees reduce the profitability of sandwiches but have little effect on their overall number
- As of March 1st 2024, there are no searchers running sandwiches on Curve's NG Stableswap pools. Since the pools were launched, traders saved over $7,000 that could otherwise have been sandwiched.
- The additional cost of dynamic fees for MEV searcher decreases as the size of the sandwiched trade increases
- On average dynamic fees would have reduced the profitability of individual sandwiches by $2
- Dynamic fees generated approximately $2,500 more in fees accross all NG pools since inception, compared to if the pools had used a fixed fee.

# Introduction

New Generation (NG) pools, [introduced in late 2023](https://etherscan.io/tx/0x2c7c9319d9b9cc067c38000e450a9df09fee9ec6c7dde173deec73d37ae0e15d), are a new iteration over the original Stableswap implementation. 
Based on the same invariant formula, [NG pools](https://curve.fi/#/ethereum/pools?filter=stableng) introduce a number of new features such as dynamic fees, better oracle integration, transferless swaps, the ability to create pools for up to eight tokens of varying types (rebasing, ERC-4626 tokens, oracle-linked tokens).

Among these different enhancements, this article will focus on dynamic fees. While the original Stableswap pools applied a flat fee to all trades, the fee charged by NG pool is a function of its balances and internal rates. 
This allows pools to charge more when liquidity is imbalanced and assets off-peg. 
This has the advantage of offering better risk-adjusted returns to LPs: when the pool is imbalanced and they hold more of the risky, depegging asset, they receive a higher compensation through fees. 
It also improves the stability and security of the pool by making it more expensive to execute trades that significantly imbalance the pool. 

This last type of trades is a staple of so-called ["sandwich attacks"](https://eigenphi-1.gitbook.io/classroom/mev-types/sandwich-mev), where an attacker exploits the mechanics of AMM pools to their advantage. 
In a sandwich attack, the attacker first notices a pending transaction for a trade within a pool. They then place one order just before the pending transaction, driving up the price (front-run), followed by another order just after the original transaction has been processed, selling off the asset at the new, higher price (back-run).

For example, if a large buy order for Asset A is detected by an attacker, they may first buy a substantial amount of Asset A, driving up its price. After the original large buy order is executed, further increasing the price, the attacker then sells their Asset A at this inflated rate, profiting from the price discrepancy caused by their initial purchase and the subsequent large order.
<div style="text-align: center;">
    <img src="../../images/ng-mev/sandwich-monitor.png#center" alt="Sandwich attack">
    <div style="font-size: 14px; italic;">Example of a sandwich attack spotted by <a href="https://t.me/curve_monitor_backup">Curvemonitor's sandwich monitoring bot</a> on Telegram. The attacker executed a large trade to manipulate the price of USDC, resulting in a loss of approximately 20 thousand dollars for the user.</div>
    <br>
</div>


Dynamic fees counteract this strategy by increasing the cost of executing trades that significantly skew the pool's balance. After a brief overview of how dynamic fees work on NG pools, we will look at MEV activity to try and assess their actual effect.

## Dynamic Fees

The formula used to calculate the dynamic fees uses the pool's base fee and an `offpeg_fee_multiplier` variable, whose value determines by how much the base fee will increase in proportion to liquidity imbalances. The full logic for the calculation can be found in the [CurveStableSwapNG contract](https://github.com/curvefi/stableswap-ng/blob/ec972b331da21d919f78943e00bf9398970eca54/contracts/main/CurveStableSwapNG.vy#L887-L900):

```python
def _dynamic_fee(xpi: uint256, xpj: uint256, _fee: uint256) -> uint256:

    _offpeg_fee_multiplier: uint256 = self.offpeg_fee_multiplier
    if _offpeg_fee_multiplier <= FEE_DENOMINATOR:
        return _fee

    xps2: uint256 = (xpi + xpj) ** 2
    return unsafe_div(
        unsafe_mul(_offpeg_fee_multiplier, _fee),
        unsafe_add(
            unsafe_sub(_offpeg_fee_multiplier, FEE_DENOMINATOR) * 4 * xpi * xpj / xps2,
            FEE_DENOMINATOR
        )
    )
```

Or, in a slightly more readable mathematical notation: $\frac{fee * offpeg\\_fee\\_multiplier}{\frac{(offpeg\\_fee\\_multiplier - 10^{10}) * 4 * xp_i * xp_j}{(xp_i + xp_j)^2} + 10^{10}}$

Where `fee` is the pool's base fee, `offpeg_fee_multiplier` is the multiplier and `FEE_DENOMINATOR` is a constant equal to ${10^{10}}$ used to handle the fees' precision. The variables ${xp_i}$ and ${xp_j}$ are the balances of the tokens of the pool adjusted for decimals and the pool's internal rates. 
For instance, if one of the pool's tokens uses rates from an external oracle like wstETH or is an ERC-4626 vault token with a share to asset ratio, these rates will be applied to the pools' balances before computing the dynamic fee. 

You can use the controls below to further visualize how the dynamic fee behaves in response to imbalances.
The bar chart on the left shows the pools balances, with the pool being balanced when both bars are of equal height.
The line chart on the right shows how much the dynamic fee applied would be at different ratio of pool balances for the currently selected ${fee}$ and ${multiplier}$.
As you can see, the curve is a parabola meaning that the fee rises as imbalances become more severe but stabilizes at the level of the base fee when the pool is imbalanced. 
The red dot show where the dynamic fee is at the currently selected liquidity balances.

<script src="../../js/ng-mev/dynamicFee.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
    .chart-container {
        width: 45%;
        display: inline-block;
    }
    .full-chart {
        width: 100%;
        display: inline-block;
    }
    .widget-container {
        text-align: left;
    }
    input[type="range"], input[type="number"] {
        width: 35%;
        margin: 5px;
    }
</style>


<div class="widget-container">
<label for="xpiSlider">${xp_i}$:</label>
<input type="range" id="xpiSlider" min="1" max="100" value="50">
<input type="number" id="xpiNumber" min="1" max="100" value="50">
<br>
<label for="xpjSlider">${xp_j}$:</label>
<input type="range" id="xpjSlider" min="1" max="100" value="50">
<input type="number" id="xpjNumber" min="1" max="100" value="50">
<br>
<label for="feeSlider">${fee}$:</label>
<input type="range" id="feeSlider" min="0" max="10000000" step="100000" value="4000000">
<input type="number" id="feeNumber" min="0" max="10000000" step="100000" value="4000000">
<br>
<label for="offpegSlider">${multiplier}$:</label>
<input type="range" id="offpegSlider" min="0" max="100000000000" step="1000000000" value="20000000000">
<input type="number" id="offpegNumber" min="0" max="100000000000" step="1000000000" value="20000000000"><br>
</div>

<div class="chart-container">
    <canvas id="barChart" height="250px"></canvas>
</div>

<div class="chart-container">
    <canvas id="lineChart" height="280px"></canvas>
</div>

How do dynamic fees affect MEV profits? 
To compare the effect of dynamic fees and fixed fees on sandwiching profits we can set up a small simulation of both scenarios.
In a typical sandwich, a searcher, via an MEV bot, will first artificially inflate the price of an asset, the trader then buys the asset at an inflated price before the searcher deflates the price again to secure a profit.
The trader's loss is the searcher's gain. The maximum amount a trader can lose will be limited by their slippage settings.

We therefore define the extractable value from a trade as the difference between the original value of the trade's output and the minimum acceptable value set by the trader through their slippage setting. 
We assume that a searcher will sandwich everytime and capture this difference.
The searcher's profits is defined as the value extracted from the sandwich minus the fees paid to the pool. 
We disregard gas costs.

For different trade sizes, we estimate numerically the amount the searcher would have to trade to push the price up and capture the traders' acceptable slippage loss.
We use this to calculate the fees paid to the pool under a fixed and dynamic configuration. 
You can simulate this scenario under different pool parameters and trader slippage settings using the sliders below:

<script src="../../js/ng-mev/poolsim.js"></script>
<script src="../../js/ng-mev/mevsim.js"></script>

<div>
    <label for="aSlider">${A}$:</label>
    <input type="range" id="aSlider" min="50" max="500" value="200">
    <input type="number" id="aValue" min="50" max="500" step="50" value="200">
    <br>
    <label for="xpiSlider2">${xp_i}$:</label>
    <input type="range" id="xpiSlider2" min="1000000" max="50000000" step="1000000" value="15000000">
    <input type="number" id="xpiNumber2" min="1000000" max="50000000" step="1000000" value="15000000">
    <br>
    <label for="xpjSlider2">${xp_j}$:</label>
    <input type="range" id="xpjSlider2" min="1000000" max="50000000" step="1000000" value="15000000">
    <input type="number" id="xpjNumber2" min="1000000" max="50000000" step="1000000" value="15000000">
    <br>
    <label for="feeSlider2">${fee}$:</label>
    <input type="range" id="feeSlider2" min="0" max="10000000" step="100000" value="4000000">
    <input type="number" id="feeNumber2" min="0" max="10000000" step="100000" value="4000000">
    <br>
    <label for="offpegSlider2">${multiplier}$:</label>
    <input type="range" id="offpegSlider2" min="0" max="100000000000" step="1000000000" value="20000000000">
    <input type="number" id="offpegNumber2" min="0" max="100000000000" step="1000000000" value="20000000000">
    <br>
    <label for="slippageSlider2">${slippage \, \%}$:</label>
    <input type="range" id="slippageSlider2" min="0.001" max="0.1" step="0.001" value="0.015">
    <input type="number" id="slippageNumber2" min="0.001" max="0.1" step="0.001" value="0.015">
    <br>

</div>
<br>
<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
    <div>
        <h3>Fixed: MEV and Profits</h3>
        <canvas id="fixedFeesMEVChart" height="300px"></canvas>
    </div>
    <div>
        <h3>Dynamic: MEV and Profits</h3>
        <canvas id="dynamicFeesMEVChart" height="300px"></canvas>
    </div>
    <div>
        <h3>Fixed: Fees Cost</h3>
        <canvas id="fixedFeesChart" height="300px"></canvas>
    </div>
    <div>
        <h3>Dynamic: Fees Cost</h3>
        <canvas id="dynamicFeesChart" height="300px"></canvas>
    </div>
</div>

The charts allow us to see a few things. 
First, MEV profits are negatively correlated with the amplification coefficient ${A}$ and the amount of TVL. 
This makes sense as both make it more costly for an MEV actor to affect the price of the pool.
The ${A}$ factor on its own is already a strong deterrent for sandwiches, explaining why, even for the original Stableswap pools, they are [much less common on Curve than on other DEXes such as Uniswap](https://eigenphi.substack.com/p/10m-revenue-drain-in-5-months-mev). 
We also notice that fees go down as trade size increases.
Again this is to be expected as larger trades will imbalance the pool more and make it cheaper to manipulate the price.

Finally, we can also notice that the difference between fixed and dynamic fees ranges from a few hundred to a few thousand dollars.
This may not seem significant, but MEV is a low margin business and searchers will often only turn in 2 or 3 digits worth of profits, if not less.
Indeed, looking at 2023 for instance, the median profit for sandwiches on  all of Curve's Stableswap pools amounted to
$285 USD. 
The full distribution was as follows:

<script src="../../js/ng-mev/sandDistrib.js"></script>


<div class="full-chart">
    <canvas id="mevDistribution" height="150px"></canvas>
</div>
In practice, therefore, as most sandwiches net less than $1,000, we can anticipate that the added cost of dynamic fees will reduce their frequency.
To confirm this intuition, let's now work with actual data collected from recent on-chain activity.
<br>
<br>

## Empirical MEV Activity

### Methodology


**Data collection:** We collected one month worth of data in 2024, from January 26th to Feburary 26th.
We opted to focus on a single, recent month as the number of NG pools was still limited until the end of 2023, as was trading and MEV activity.
We collected the pool addresses by querying the Stableswap and Stableswap-NG factory's contracts, yielding 375 Stableswap pools and 105 Stableswap NG pools.
We used the pools' `TokenExchange` and `TokenExchangeUnderlying` events as well as all the pools' liqudity events to retrieve transactions, which we then parsed and analyzed for MEV activity.


**MEV detection:** 



### Observations

The results of our data collection are presented in the chart below.
The most striking finding was that, for the period considered, there was absolutely zero sandwiches detected on NG Stableswap pools.
Meanwhile sandwiches constituted on average 1.6% of all the USD denominated volume of the regular StableSwap pools, with peaks at 16% and 10%.
It's not that MEV actors have all failed to notice the new NG pools either. 
Indeed, the arbitrage activity is higher than on the original Stableswap pools: 

<script src="../../js/ng-mev/mev.js"></script>
<select id="dataSelect">
    <option value="Sandwiches">Sandwiches</option>
    <option value="Atomic Arbitrages">Atomic Arbitrages</option>
    <option value="Total MEV">Total MEV</option>
</select>
<canvas id="mevChart"></canvas>
<br>
<br> 

Suspicious of the results at first, we double, then triple checked by manually crawling through 25,000 transactions to try and find sandwiches, without success.
There was clearly no sandwiching going on in the NG pools - at least in February 2024. 
Did this mean that dynamic fees had successfully managed to eradicate sandwiches?

### Where have all the sandwiches gone ?

Another explanation could be that, while arbitrageurs have been quick to integrate the new NG pools, sandwich searchers still haven't done so.
The NG pools may still be sandwichable, but MEV searchers have been leaving money on the table.
To verify this hypothesis, we opted to look at potentially sandwichable trades and see how profitable a sandwich would have been. 

For all the trades in our dataset, we estimated the potentially extractable value by calculating the difference between the outcome of the trade (${dy}$, or how much tokens the trader received) and its minimum acceptable output after slippage (${min\\_dy}$, the minimum amount of tokens the trader could have received without the trade reverting).
We then ran a quick solver to find the amount a searcher would have had to trade to successfully extract this value with a sandwich.
We simulate the sandwich in both a dynamic fee NG Stableswap pool and a fixed fee original Stableswap pool to be able to compare the impact of each fee regime on sandwich profitability.

In this way we identify 96 trades that would have been potentially profitably sandwichable with dynamic fees against 101 trades that would have been had the pools used a fixed fee. 
This means that the use of dynamic fees might have prevented about 5% of the sandwiches:

<div style="text-align: center;">


| Metric       | Fixed Fees     | Dynamic Fees   |
|--------------|----------------|----------------|
| Count        | 101            | 96             |
| Mean         | 96.250184      | 99.111161      |
| Standard Dev | 207.459745     | 209.250597     |
| Min          | 0.015311       | 0.026776       |
| 25%          | 1.290534       | 1.648859       |
| 50% (Median) | 7.867945       | 8.173049       |
| 75%          | 79.650235      | 78.199968      |
| Max          | 1135.999276    | 1125.083182    |

<div style="font-size: 14px; italic;">Descriptive statistics for sandwiches with positive revenue (before deducting gas costs) assuming fixed and dynamic fees. All values in USD.</div>
<br>
</div>

These numbers, however, do not account for gas costs which can often be high enough to render a sandwich unprofitable. 
To estimate the gas costs of the sandwich attack we simply take the gas costs of the original (sandwichable but not sandwiched) trade, and multiply those by two.
Once we deduct gas costs, our profitable sandwich number decreases to 31 for both fixed and dynamic fees:


<div style="text-align: center;">

| Metric       | Fixed Fees     | Dynamic Fees  |
|--------------|----------------|---------------|
| Count        | 31             | 31            |
| Mean         | 241.394859     | 236.721689    |
| Standard Dev | 285.449172     | 282.611291    |
| Min          | 6.844660       | 3.689774      |
| 25%          | 27.752442      | 25.253399     |
| 50% (Median) | 96.491908      | 94.022582     |
| 75%          | 446.941833     | 438.311420    |
| Max          | 1076.655629    | 1065.739535   |

<div style="font-size: 14px; italic;">Descriptive statistics for sandwiches with positive profit (after deducting gas costs) assuming fixed and dynamic fees. All values in USD.</div>
<br>
</div>

After accounting for gas costs, therefore, dynamic fees do not reduce the number of profitable sandwiches. 
They do, however, reduce the profitability of said sandwiches by a small margin. 
Dynamic fees lead, on average, to 10% higher revenue for the pool compared to fixed fees.
However, in absolute values, this only represents a $2 difference -- not enough to make most sandwiches unprofitable.
We can see how minute the difference is by plotting our profitable sandwiches under each (fixed and dynamic) regime:

<script src="../../js/ng-mev/profitable.js"></script>
<div style="width:100%">
    <canvas id="scatterChart" height="200px"></canvas>
</div>

The total value of the sandwiches that could have been executed adds up to $7,338.
This tells us that the absence of sandwiches is more likely to be due to a lack of searchers monitoring the pools and leaving money on the table, rather than to the dissuassive effect of dynamic fees.

# Conclusion: Are Fee Multipliers Too Low?

Dynamic fees increase the cost of sandwiches by $2 but sandwiches are generally large transactions and searchers have to pay fees twice: for the front-run and the back-run.
When we consider all trades, dynamic fees, on average, increase the fees paid by 10¢ compared to fixed fees.

In aggregate, if we compare the fees generated by NG pools with a simulation of the fees they would have generated with a fixed fee similar to the original StableSwap pools, the total difference amounts to roughly $2,500.
This additional revenue is split equally between the DAO and LPs.
But if dynamic fees, at their current level, can not significantly lower sandwiches and only bring marginally more revenue to the DAO and LPs, isn't this a sign that the fees ought to be raised?


The answer to this is "not necessarily". Dynamic fees are not meant to constantly generate additional revenue for Curve, they should only do so when pools are severely imbalanced.
This has hardly ever been the case so far for the NG pools considered, so the low delta compared to fixed fees might instead be a signal that dynamic fees are working as intended.

On the other hand, it is true that dynamic fees do not seem like they would be an effective deterrent for sandwiches on Stableswap NG pools.
Yet raising them may not solve the issue entirely.
As we can test with the simulator above, for a roughly balanced pool with over 10 million in TVL and an amplification coefficient ${A}$ of 200, the threshold at which a trade becomes profitably sandwichable is over $500,000.
When such large trades are executed, it takes less capital for a searcher to manipulate the price and the brunt of the dynamic fees will be paid by the sandwichable trader.
If fees become too expensive for large traders, Curve pools could become less competitive and see their volume decrease.