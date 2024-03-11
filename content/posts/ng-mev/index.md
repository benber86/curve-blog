---
title: "Impact of Dynamic Fees on MEV Activity"
draft: false
date: 2024-03-10T09:25:45.000Z
description: "This post compares MEV activity on StableSwap NG pools and pools with the original implementation. It explains dynamic fees and their impact on certain types of MEV activity."
categories:
  - MEV
  - Research
  - Pools
tags:
  - StableSwap
  - NG
  - Fees
  - Research
  - MEV
---

_Authors:_ [Philipp](https://twitter.com/phil_00llama), [benny](https://warpcast.com/bennylada)

# Key Findings

- Dynamic fees reduce the profitability of sandwiches but have little effect on their overall frequency.
- The additional cost of dynamic fees for MEV searchers decreases as the size of the sandwiched trade increases.
- As of March 2024, there are no searchers running sandwiches on Curve's NG Stableswap pools.
- In February 2024, over $7,000 could have been extracted from potentially sandwichable swaps on NG Stableswap pools. More value could also have been extracted by sandwiching liquidity additions and removals. 
- Dynamic fees would have reduced the profitability of each sandwich by approximately $2.
- NG Stableswap pools have, since their introduction, generated 10% more in fee revenue than they would have had they used a fixed fee.
- Making dynamic fees more efficient against sandwiches would require a new formula for their calculation. Currently even large increases to the fee multiplier are unlikely to have a significant effect.

# Introduction

Introduced in [late 2023](https://etherscan.io/tx/0x2c7c9319d9b9cc067c38000e450a9df09fee9ec6c7dde173deec73d37ae0e15d), New Generation (NG) Stableswap pools are a new iteration over the original Stableswap implementation. 
Based on the same invariant formula, [NG pools](https://curve.fi/#/ethereum/pools?filter=stableng) introduce a number of new features such as dynamic fees, better oracle integration, transferless swaps, and the ability to create pools for up to eight tokens of varying types (rebasing, ERC-4626 tokens, oracle-linked tokens).

Among these different enhancements, this article will focus on dynamic fees. 
While the original Stableswap pools applied a flat fee to all trades, the fee charged by NG pool is a function of its balances and internal rates. 
This approach allows NG pools to charge more when liquidity is imbalanced and assets deviate from their peg. 
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


Dynamic fees counteract this strategy by increasing the cost of executing trades that significantly skew the pool's balance. After a brief overview of how dynamic fees work on NG pools, we will look at MEV activity to assess their actual effect.

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
The line chart on the right shows how much the dynamic fee applied would be at different ratios of pool balances for the currently selected ${fee}$ and ${multiplier}$.
The curve is a parabola meaning that the fee rises as imbalances become more severe but stabilizes at the level of the base fee when the pool is balanced. 
The red dot show where the dynamic fee is at the currently selected liquidity balances ${xp_i}$ and ${xp_j}$.

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
In a typical sandwich, a searcher, via an MEV bot, will first artificially inflate the price of an asset in an operation also known as a "front-run".
The trader then buys the asset at an inflated price. 
Finally, the searcher deflates the price again by selling off the asset to secure a profit.
This final part is called the "backrun".
Sandwiches are zero-sum: the trader's loss is the searcher's gain. 
The maximum amount a trader can lose will be limited by their slippage settings.

The extractable value from a trade is defined as the difference between the original value of the trade's output and the minimum acceptable value set by the trader through their slippage setting. 
The searcher's revenue is defined as the value extracted from the sandwich minus the fees paid to the pool. 
We disregard gas costs for the time being.

For different trade sizes, we estimate numerically the amount the searcher would have to trade to push the price up and capture the traders' acceptable slippage loss.
We then calculate the fees the searcher would need to pay for the front and backrun. 
We run the same simulation on a fixed fee pool and a dynamic fee pool and then compare the outcomes. 
The sliders below let you change the pool parameters and the trader's slippage settings to compare fees and MEV profitability under different scenarios:

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

The charts reveal several important insights. 
First, there is a negative correlation between MEV profits and both the amplification coefficient ${A}$ and the TVL (Total Value Locked). 
This makes sense as both make it more costly for an MEV actor to affect the price of the pool.
The ${A}$ factor alone already serves as a strong deterrent for sandwiches, explaining why, even for the original Stableswap pools, sandwiches are [much less common on Curve than on other DEXes such as Uniswap](https://eigenphi.substack.com/p/10m-revenue-drain-in-5-months-mev).
Additionally, we observe that fees decrease as trade size grows.
This comes from the fact that larger trades tend to imbalance the pool more, making it cheaper for a third-party to manipulate the price.

Finally, the difference between fixed and dynamic fees varies from a few hundred to a few thousand dollars.
Although this may appear insignificant, MEV is a low margin business and searchers will often only turn in 2 or 3 digits worth of profits, if not less.
For instance, in 2023, the median profit for sandwiches on  all of Curve's Stableswap pools amounted to $285 USD. 
The complete distribution is presented below:

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


**Data collection:** We collected one month worth of data in 2024, from January 26th to February 26th.
We opted to focus on a single, recent month as the number of NG pools was still limited until the end of 2023, as was trading and MEV activity.
We collected the pool addresses by querying the Stableswap and Stableswap-NG factory's contracts, yielding 375 Stableswap pools and 105 Stableswap NG pools.
We used the pools' `TokenExchange` and `TokenExchangeUnderlying` events as well as all the pools' liquidity events to retrieve transactions, which we then parsed and analyzed for MEV activity.


**MEV detection:** For each block, we check that at least two transactions interact with the pool as there can't be a sandwich otherwise.
If there are at least 2 transactions, we look for matching transactions to detect a potential sandwich. 
Matching transactions are transactions that have the same caller, and where tokens A and B are swapped in different directions.
Once we have found a pair, we look for the sandwiched transaction. 
Its position in the block should be between that of the two sandwiching transactions.
The detection algorithm also handles more complex edge cases, such as multiple transactions being sandwiched between the same front- and backrun transactions.


### Observations

The results of our data collection are presented in the chart below.
The most striking finding was that, for the period considered, there was absolutely zero sandwiches detected on NG Stableswap pools.
Meanwhile, sandwiches constituted on average 1.6% of all the USD denominated volume of the regular StableSwap pools, with peaks at 16% and 10%.
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

Suspicious of the results at first, we double-, then triple-checked by manually crawling through 25,000 transactions to try and find sandwiches, without success.
There was clearly no sandwiching going on in the NG pools - at least in February 2024. 
Did this mean that dynamic fees had successfully managed to eradicate sandwiches?

### Where have all the sandwiches gone ?

Another explanation could be that, while arbitrageurs have been quick to integrate the new NG pools, sandwich searchers still haven't done so.
The NG pools may still be sandwichable, but MEV searchers have been leaving money on the table.
To verify this hypothesis, we opted to look at potentially sandwichable trades and see how profitable a sandwich would have been. 

We collected all swap transactions on all NG StableSwap pools that directly called one of the pool's exchange functions. 
We opted to exclude calls to the pools via contracts (MEV bots, aggregators) as finding out slippage setting is in most cases impossible due to the contracts being unverified or using widely different ABIs.
We also excluded liquidity events to facilitate the analysis. 
These can also be sandwiched, so the numbers reported below are a lower bound estimate of the total amount of MEV not extracted from NG pools.

To estimate the potentially extractable value of each swap, we calculated the difference between the outcome of the trade (${dy}$, or how many tokens the trader received) and its minimum acceptable output after slippage (${min\\_dy}$, the minimum amount of tokens the trader could have received without the trade reverting).
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
The figure is a lower bound estimate as liquidity events can be an additional source of profitable sandwiches.
It is also likely to increase in the near future as NG pools gain more adoption.
This tells us that the absence of sandwiches is more likely to be due to a lack of searchers monitoring the pools and leaving money on the table, rather than to the dissuasive effect of dynamic fees.

# Are Fee Multipliers Too Low?

Dynamic fees increase the cost of sandwiches by $2 but sandwiches are generally large transactions and searchers have to pay fees twice: for the front-run and the back-run.
When we consider all trades, dynamic fees, on average, increase the fees paid by 10¢ compared to fixed fees.

In aggregate, if we compare the fees generated by NG pools with a simulation of the fees they would have generated with a fixed fee similar to the original StableSwap pools, the total difference amounts to roughly $2,500 (an increase of about 10%).
This additional revenue is split equally between the DAO and LPs.
But if dynamic fees, at their current level, cannot significantly reduce sandwiches and only bring marginally more revenue to the DAO and LPs, is this a sign that fees ought to be raised?


The answer is not straightforward. 
Dynamic fees are not meant to constantly generate additional revenue for Curve. 
Rather, they should only do so when pools are severely imbalanced.
This has hardly ever been the case so far for the NG pools considered.
The low delta compared to fixed fees might instead indicate that dynamic fees are functioning as intended.


On the other hand, it is true that dynamic fees are presently not an effective deterrent for sandwiches on Stableswap NG pools.
Yet raising dynamic fees may not solve the issue entirely.
For a roughly balanced pool with over 10 million in TVL and an amplification coefficient ${A}$ of 200, the threshold at which a trade becomes profitably sandwichable is close to $500,000.
When such large trades are executed, it takes less capital for a searcher to manipulate the price and the brunt of the dynamic fees will be paid by the sandwichable trader.
In turn, if fees become too expensive for large traders, Curve pools could become less competitive and see their volume decrease.

With the simulator below, we can see that the impact of using low or high fee multipliers on sandwiches profitability actually tends to decrease as pools get more imbalanced.
This is because in an imbalanced state, the amount needed to perform a sandwich decreases along with the fees collected by the pool.

<script src="../../js/ng-mev/feesim.js"></script>
<div>
  <label for="aSlider3">${A}$:</label>
  <input type="range" id="aSlider3" min="50" max="500" value="200">
  <input type="number" id="aValue3" min="50" max="500" step="50" value="200">
  <br>
  <label for="xpiSlider3">${xp_i}$:</label>
  <input type="range" id="xpiSlider3" min="5000000" max="50000000" step="1000000" value="15000000">
  <input type="number" id="xpiNumber3" min="5000000" max="50000000" step="1000000" value="15000000">
  <br>
  <label for="xpjSlider3">${xp_j}$:</label>
  <input type="range" id="xpjSlider3" min="5000000" max="50000000" step="1000000" value="15000000">
  <input type="number" id="xpjNumber3" min="5000000" max="50000000" step="1000000" value="15000000">
  <br>
  <label for="feeSlider3">${fee}$:</label>
  <input type="range" id="feeSlider3" min="0" max="10000000" step="100000" value="4000000">
  <input type="number" id="feeNumber3" min="0" max="10000000" step="100000" value="4000000">
  <br>
  <label for="offpegSlider3">${multiplier}$:</label>
  <input type="range" id="offpegSlider3" min="0" max="100000000000" step="1000000000" value="2000000000">
  <input type="number" id="offpegNumber3" min="0" max="100000000000" step="1000000000" value="2000000000">
  <br>
  <label for="slippageSlider3">${slippage \, \%}$:</label>
  <input type="range" id="slippageSlider3" min="0.001" max="0.1" step="0.001" value="0.015">
  <input type="number" id="slippageNumber3" min="0.001" max="0.1" step="0.001" value="0.015">
  <br>
</div>
<br>
<div style="display: flex; flex-wrap: wrap; width: 100%;">
    <canvas id="dynamicFeesMultiplierChart" height="200px"></canvas>
</div>

Another observation we can make with the simulator is that dynamic fees, as they are currently designed, rise almost in parallel to the amount of extractable value. 
This means that while they could push some of the lowest value sandwiches into unprofitable territory, the dynamic fees' growth curve is not convex enough to catch up to the growth of extractable value.

Here even raising the fee multiplier would not help.
As we can see, while increasing the fee multiplier by a factor of 5 yields higher fees, an increase of 10 is almost indistinguishable from an increase of 5.
In other words, there are diminishing returns to increasing the fee multiplier as we simply reach the upper bound of the fee. 
This suggests that for dynamic fees to help prevent sandwiches, we would need to rethink the way they are calculated as the current formula is too limited.

# Conclusion

Dynamic fees are currently not an effective deterrent against sandwiches on StableSwap pools although they do affect searchers' profitability and create higher revenue for LPs and the DAO.
A revision of the current formula could make fees a more efficient deterrent, however any such changes need to be weighed against other considerations in terms of competitiveness, stability and security.
An important aspect to investigate is how dynamic fees fare at preventing pool imbalances, regardless of MEV activity.
