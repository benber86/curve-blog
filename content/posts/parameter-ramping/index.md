---
title: "Parameter Ramping"
draft: false
date: 2024-02-11T09:16:45.000Z
description: "Why aren't parameter changes on Curve pools applied instantly? This post dwelves into the reasons behind gradual parameter changes."
categories:
  - Parameters
  - Pools
tags:
  - StableSwap
  - Invariant
  - Parameters
---


_Author:_ [benny](https://warpcast.com/bennylada)

<script src="../../js/parameters/poolsim.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

If you have ever looked at Curve pool contracts or followed the aftermath of a [DAO parameter vote](https://curvemonitor.com/#/dao/proposals), you have certainly noticed that changes in pool parameters are not immediately applied. Instead, the change happens gradually over a certain period of time. While the minimum time is technically 24h, in practice the parameter ramp periods are usually longer. 
Most of the increases in A for the 3pool, for instance, [took place over a week](https://etherscan.io/tx/0x46a054105e5519c06ef81e18616aac06c454eb6235c802e22fae62a641863750).

This delay in applying parameter changes can confuse or frustrate users, especially if the change is perceived as an emergency measure for a pool at risk of losing its peg. This post will explore the rationale behind the mechanics of delayed parameter changes.


## A quick refresher on Curve's StableSwap

While this post focuses on StableSwap pools, the points highlighted also apply to CryptoSwap pools and their additional parameters. 
As a reminder, Curve's StableSwap pools operate as a hybrid of a Constant Sum Market Maker (CSMM, assets can always be traded without price impact, but liquidity can easily be drained) and a Constant Product Market Maker (CPMM, price impact increases as liquidity becomes imbalanced):

<script src="../../js/parameters/ammChart.js"></script>

<style>
    #ammChartContainer {
        width: 770px;
        height: 400px;
    }

    #aSliderComp {
        width: 93%;
    }
</style>
<div style="text-align: center;">
<div id="ammChartContainer">
    <canvas id="ammCompChart"></canvas>
</div>
<label for="aSliderComp">A:</label>
<input type="range" id="aSliderComp" value="5" min="1" max="20">
<span id="aValueComp">5</span>
<br>
<br>
</div>


This hybridity allows Curve pools to behave more like CSMM and offer low price impact trades even when a pool is imbalanced. 
Just how much the pool can get imbalanced before it behaves more like a CPMM with higher price impact depends on $A$, the amplification parameter. 
The higher value of $A$, the more a pool will be allowed to become imbalanced while maintaining a near 1:1 rate for its assets.

You can get a graphical intuition for this behavior by increasing or decreasing the value of A on the chart above and see the bonding curve get closer to that of a CPMM when $A$ is low, and closer to that of a CSMM when $A$ is high.


## What else happens when we change A ?

Increasing or reducing the value of the pool's invariant comes with a number of long term risks and trade-offs for liquidity providers (LPs), traders and asset issuers. 
However, those are beyond the purview of this post, as we will instead focus solely on the more immediate effects of parameter changes.

To understand the direct impact of changing $A$, let's recall the StableSwap formula from the [whitepaper](https://curve.fi/files/stableswap-paper.pdf):
<div style="text-align: center;">
$A n^n \sum{x_i} + D = A n^n D + \frac{D^{n+1}}{(n^n \prod{x_i})}$
<br>
<br>
</div>

Parameter changes do not directly affect the balances of the pool ($x_i$), nor the number of assets traded ($n$), which means that $D$ is our dependent variable, shifting in value to offset the changes to $A$ and balance the equation (_i.e._ maintain the invariant).

You can see for yourself how $D$ is affected by changes to $A$ for fixed values of $x_i$ and $n=2$ by moving the slider below:


<style>
    #container {
        width: 600px;
        margin: auto;
    }
    .dValueDisplay {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
    }
    input[type="number"], input[type="range"] {
        width: 25%;
        border: 1px;
        margin: 10px 0; /* Small margin for vertical spacing */
    }
    #aSlider {
        width: 85%;
        text-align: center;
    }
</style>

<div id="container">
    <label for="x2Input">Token A ($x_1$):</label>
    <input type="number" id="x1Input" min="0" max="10000" value="1000">
    &nbsp; <!-- Non-breaking space for simple spacing -->
    <label for="x2Input">Token B ($x_2$):</label>
    <input type="number" id="x2Input" min="0" max="10000" value="5000">
    <br>
    <label for="aSlider">A:</label>
    <input type="range" id="aSlider" min="0" max="200" value="100">
    <span id="aValue">100</span>
    <div class="dValueDisplay" id="dValue">D: </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const x1Input = document.getElementById('x1Input');
        const x2Input = document.getElementById('x2Input');
        const aSlider = document.getElementById('aSlider');
        const aValue = document.getElementById('aValue');
        const dValueDisplay = document.getElementById('dValue');

        function updateDValue() {
            const xp = [parseInt(x1Input.value), parseInt(x2Input.value)];
            const A = parseInt(aSlider.value);
            const D = calculateD(xp, A);
            dValueDisplay.textContent = 'D: ' + D.toFixed(2);
        }

        x1Input.addEventListener('input', updateDValue);
        x2Input.addEventListener('input', updateDValue);
        aSlider.addEventListener('input', () => {
            aValue.textContent = aSlider.value;
            updateDValue();
        });

        updateDValue();
    });
</script>
<br> 
Alternatively, you can visualize this by plotting the value of $D$ for different values of $A$ given $x_i$ pool balances:
<br>
<br>

<style>
    #chartContainer {
        width: 770px;
        height: 300px;
    }
    input[type="range"] {
        width: 60%;
    }
</style>

<div style="text-align: center;">
<label for="x1Slider">Token A ($x_1$):</label>
<input type="range" id="x1Slider" min="1" max="10000" value="1000">
<span id="x1Value">2000</span>
<br>
<label for="x2Slider">Token B ($x_2$):</label>
<input type="range" id="x2Slider" min="1" max="10000" value="5000">
<span id="x2Value">5000</span>
<br>
<br>
<div id="chartContainer">
    <canvas id="ammChart"></canvas>
</div>
</div>

<script src="../../js/parameters/dChart.js"></script>

As we can see, $D$ increases when $A$ increases and decreases when $A$ decreases. When the pool is balanced ($x_1 = x_2$), changes in $A$ have no effect on $D$.
This is hard to prove mathematically as the relationship is not linear, yet it makes sense intuitively. 
$D$ is described in the whitepaper as the "total amount of coins when they have an equal price".
This amount is not denominated in dollars, but in an abstract, "virtual", numeraire that values the assets in the pool in a common unit.

Since increasing $A$ increases how much of an unbalanced asset can be traded at a 1:1 ratio, the valuation of the pool assets in terms of $D$ also naturally increases.
Put differently, increasing $A$ increases the value of the more abundant asset in the pool since more of them can be traded at par with the rarer asset, thus increasing the "value" of pool assets represented by $D$.
Conversely, when $A$ decreases, the more abundant asset becomes worth less (as there is now a greater price impact to trade them), thus decreasing the value of $D$.

## Why the delay then?

We have to keep in mind, however, that $D$ is also used to keep track of profits accrued by LPs. While $D$ is often referred to as an _invariant_, similarly to the $k$ of Uniswap v2's $xy = k$, its value actually varies constantly.
Adding or removing liquidity from the pool will of course affect $D$ as can be easily inferred from the StableSwap equation, but so will trades as they generate fees which are redistributed to LPs... by increasing the invariant.

Changes to $D$ thus directly affect LPs' profitability. If $D$ increases, whether as a result of parameter changes or accrued fees, so will the virtual price of the LP Token (calculated as $\frac{D}{LP\ token\ supply}$) and therefore the amount of the pool's assets a LP can redeem for a single token.
Conversely, if $D$ decreases, in the case of a reduction in $A$ for instance, then LPs' profitability will be negatively impacted.

The gradual parameter changes act as a way to mitigate these effects.
When $A$ is due to increases, arbitrageurs can buy the abundant, cheaper asset before the increase knowing they will be able to sell it at a better rate (closer to 1:1) once the full parameter change is enacted.
Or they might take advantage of the sudden rise in virtual price caused by the higher $A$ by depositing liquidity right before the parameter change and withdrawing right after once the virtual price has increased.
These behaviors are not necessarily bad, and in fact, arbitrage trades  will not only help bring the pool closer to its desired state, but they will also increase LP profitability through the fees paid for executing the trades.
However, the delay allows to lengthen the timeframe of the arbitrage or increase liquidity over the ramp period. 
Conversely, when $A$ decreases, arbitrageurs are incentivized to trade and pay fees to sell the abundant asset, thus softening the blow of a direct reduction in virtual price from the decrease in $D$.


To conclude, let's illustrate this with an example. Let's assume that on the [crvUSD/TUSD pool](https://etherscan.io/address/0x34d655069f4cac1547e4c8ca284ffff5ad4a8db0#code), 1 **TUSD** trades for 0.981 **crvUSD** and 1 **crvUSD** trades for 1.018 **TUSD** with an $A$ parameter of 500.
If $A$ increased to 1500, 1 **TUSD** would trade for 0.998 **crvUSD** and 1 **crvUSD** for 1.002 **TUSD**.
Before $A$ increases, a trader could buy 1,007,314 **TUSD** with 1 million **crvUSD** at an average price of 0.992.
After the increase, they can sell the **TUSD** back for 1,005,705 **crvUSD**, netting a 5,700 **crvUSD** profit and fees for the pool. 


