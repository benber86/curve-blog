---
title: "Impact of Dynamic Fees on MEV Activity"
draft: false
date: 2024-02-11T09:16:45.000Z
description: "This post compares MEV activity on StableSwap NG pools and pools with the original implementation. It explains dynamic fees and their role in the drastic reduction of certain types of MEV activity on NG pools."
categories:
  - MEV
  - Pools
tags:
  - StableSwap
  - NG
  - MEV
---


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
    <img src="/images/ng-mev/sandwich-monitor.png#center" alt="Sandwich attack">
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

Where `fee` is the pool's base fee, `offpeg_fee_multiplier` is the multiplier and `FEE_DENOMINATOR` is a constant equal to $10^{10}$ used to handle the fees' precision. The variables ${xp_i}$ and ${xp_j}$ are the balances of the tokens of the pool adjusted for decimals and the pool's internal rates. 
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

## MEV Activity

### Methodology


**Data collection:** We collected one month worth of data in 2024, from January 26th to Feburary 26th.
We opted to focus on a single, recent month as the number of NG pools was still limited until the end of 2023, as was trading and MEV activity.
We collected the pool addresses by querying the Stableswap and Stableswap-NG factory's contracts, yielding 375 Stableswap pools and 105 Stableswap NG pools.
We used the pools' `TokenExchange` and `TokenExchangeUnderlying` events as well as all the pools' liqudity events to retrieve transactions, which we then parsed and analyzed for MEV activity.

**MEV detection:** 


## Observations

<script src="../../js/ng-mev/mev.js"></script>
<select id="dataSelect">
    <option value="% Sandwich">% Sandwich</option>
    <option value="% Atomic Arb">% Atomic Arb</option>
    <option value="% MEV">% MEV</option>
</select>
<canvas id="mevChart"></canvas>