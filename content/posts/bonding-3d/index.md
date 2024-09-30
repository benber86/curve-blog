---
title: "Directional Dynamic StableSwap"
draft: false
date: 2024-09-25T09:16:45.000Z
ogimage: "https://blog.curvemonitor.com/images/parameter-ramping/img.png"
description: "What if AMM Bonding Curves adjusted dynamically based on trade size?"
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

What if AMM bonding curves adjusted dynamically based on trade size?
Or what if the curve changed based on directionality to incentivize swapping in a certain direction (selling rare asset the buy abundant one or vice-versa) with positive price impact?
Or combine both.

From recent interviews, several users have expressed their desire for different $A$ parameter depending on trade size.

## General Idea

Let's recall the StableSwap formula from the [whitepaper](https://curve.fi/files/stableswap-paper.pdf):
<div style="text-align: center;">
$A n^n \sum{x_i} + D = A n^n D + \frac{D^{n+1}}{(n^n \prod{x_i})}$
<br>
<br>
</div>

This does not distinguish between trade size, but really A is only convenient for large traders.
What if we could adjust $A$ dynamically based on trade size instead? 

To do so we could make $A$ into a function of trade size.

Trade size if of course relative to the pool's balances, so we want to make that relative.
We define trade size as $\delta = \frac{|\Delta x_i|}{\sum{x_i}}$

Next we want A to increase as $\delta$ gets bigger, but we still want boundaries $A_{min}$ and $A_{max}$ that would be set by the DAO through parameter vote.
So we can write:

$A(\delta) = A_{min} + (A_{max} - A_{min}) * f(\delta)$

With $f(\delta) = \delta^p$ where $p$ is likewise a parameter the deployer or DAO can set to adjust how elastic $A$ should be to trade size.
(Can fiddle to get better function).

So we just rewrite Stableswap with $A$ as a function:

<div style="text-align: center; margin-bottom: 40px">
    $A(\delta) n^n \sum{x_i} + D = A(\delta) n^n D + \frac{D^{n+1}}{(n^n \prod{x_i})}$

</div>

## Limitations

- There's no guarantee that $xyk$ type of AMM guarantees better price execution
- In fact, the advantages are probably unilateral you get more positive price impact when swapping from rare asset to common asset.
- Better execution also depends on what the competition is doing

## Dynamic Curve Stableswap Simulator

Not really the best because non-linear so curve/price impact changes depending on trade size, but you get the idea. 

<div>
    <label for="minA">Min A: </label>
    <input type="range" id="minA" min="1" max="100" value="1">
    <span id="minAValue"></span>
</div>
<div>
    <label for="maxA">Max A: </label>
    <input type="range" id="maxA" min="1" max="1000" value="500">
    <span id="maxAValue"></span>
</div>
<div>
    <label for="expp">p: </label>
    <input type="range" id="expp" min="0.01" max="5" value="0.5" step="0.01">
    <span id="pValue"></span>
</div>
<div>
    <label for="x1">x1 Balance: </label>
    <input type="range" id="x1" min="100" max="10000" value="5000">
    <span id="x1Value"></span>
</div>
<div>
    <label for="x2">x2 Balance: </label>
    <input type="range" id="x2" min="100" max="10000" value="5000">
    <span id="x2Value"></span>
</div>
<div>
    <label for="tradeSize">Trade Size: </label>
    <input type="range" id="tradeSize" min="0" max="5000" value="0">
    <span id="tradeSizeValue"></span>
</div>
<div>
    <label>Delta: </label>
    <span id="deltaValue"></span>
</div>
<div>
    <label>Current A: </label>
    <span id="currentAValue"></span>
</div>

<canvas id="curveChart" width="800" height="400"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../../js/bonding-3d/dynamic-curve.js"></script>

## 3D View

<div>
    <label for="minA3d">Min A (3D): </label>
    <input type="range" id="minA3d" min="1" max="100" value="1">
    <span id="minA3dValue"></span>
</div>
<div>
    <label for="maxA3d">Max A (3D): </label>
    <input type="range" id="maxA3d" min="1" max="1000" value="500">
    <span id="maxA3dValue"></span>
</div>
<div>
    <label for="p3d">p (3D): </label>
    <input type="range" id="p3d" min="0.01" max="5" value="0.5" step="0.01">
    <span id="p3dValue"></span>
</div>

<div id="chartholder3d"></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://x3dom.org/release/x3dom-full.js"></script>
<link rel="stylesheet" href="https://x3dom.org/release/x3dom.css"/>
<script src="https://raw.githack.com/jamesleesaunders/d3-x3d/master/dist/d3-x3d.js"></script>
<script src="../../js/bonding-3d/dynamica.js"></script>

## Simulation

To compare the dynamic Stableswap's performance with a regular Stableswap pool, we simulate the outcome of a long period of activity on pools of each type.

We take the [stETH pool](https://etherscan.io/address/0xdc24316b9ae028f1497c275eb9192a3ea0f67022#readContract) over the period 04/2024-09/2024 (because $A$ was different before April but constant after).
We re-run all the trades (excluding liquidity events for now) and see how each parameter combination performs.
We look at whether the traders have lost or gained vs the regular, static 200-$A$ StableSwap pool, depending on the direction of their trade.
We also look at the impact of the new formula on LP gains.

<div style="display: flex;">
    <div style="flex: 1;">
        <canvas id="dynamicDirectionChart" width="400" height="800"></canvas>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column;">
        <div style="flex: 1;">
            <canvas id="poolRatioChart" width="300" height="350"></canvas>
        </div>
        <div style="flex: 1; margin-bottom: 20px">
            <canvas id="averageMedianAChart" width="300" height="350"></canvas>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../../js/bonding-3d/dynamic-direction.js"></script>
<script src="../../js/bonding-3d/pool-ratio.js"></script>
<script src="../../js/bonding-3d/average-median-a.js"></script>


| Parameters | LP Fees Difference |
|------------|-------------------:|
| p = 0.05, A_min = 30, A_max = 500 | -0.0008 |
| p = 0.1, A_min = 30, A_max = 400 | -0.0034 |
| p = 0.1, A_min = 10, A_max = 500 | -0.0031 |
| p = 0.2, A_min = 30, A_max = 400 | -0.0099 |
| p = 0.25, A_min = 30, A_max = 400 | -0.0138 |
| p = 0.25, A_min = 100, A_max = 800 | -0.0054 |
| p = 0.3, A_min = 100, A_max = 500 | -0.0069 |

- Not much difference on LP profitability, although in general impact is negative
- Unsurprisingly, the parameter changes favor one direction over the other, depending on the directionality of the trade and how high A and stiff the ramp up towards high A is.
- Gains for one direction do not offset losses for the other
- Some peg-gains

## Adding Directionality

Since the gains of traders going one direction do not offset the losses of the traders going the other, what if we only applied the dynamic A on trades going from rare to abundant asset?

In other terms, this allows us to give positive price impact to small trades selling the rare asset to buy the abundant one.
Large trades still benefit from the strong peg ensured by a high $A$ factor, but do not get as much price impact.

To do so, the dynamic StableSwap equation defined earlier remains the same but we change $A(\delta)$ to include directionality:

$A(\delta) = A_{min} + (A_{max} - A_{min}) \cdot f(\delta) \cdot I(direction)$

where:

$I(direction) = \max\left(0, \min\left(1, \frac{RB_{in} - RB_{out} + \zeta}{2\zeta}\right)\right)$

with $RB_i = \frac{x_i}{\sum_{j=1}^n x_j}$ and $\zeta = \frac{1}{n}$

$RB_i$ is the relative balance, for the sake of simplicity we use the proportion of the pool balances as is and consider the threshold $\zeta$ at which an asset is imbalanced to be if the token ratios are not all exactly in the same proportion (2 pool coin = 50% of each pool, 3 coins = 33% and so on).
In practice this should be improved/secured for generalization.
 
## Simulation

<div style="display: flex;">
    <div style="flex: 1;">
        <canvas id="dynamicDirectionChartD" width="400" height="800"></canvas>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column;">
        <div style="flex: 1;">
            <canvas id="poolRatioChartD" width="300" height="350"></canvas>
        </div>
        <div style="flex: 1; margin-bottom: 20px">
            <canvas id="averageMedianAChartD" width="300" height="350"></canvas>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../../js/bonding-3d/dynamic-direction-d.js"></script>
<script src="../../js/bonding-3d/pool-ratio-d.js"></script>
<script src="../../js/bonding-3d/average-median-a-d.js"></script>

| Parameters | LP Fees Difference |
|------------|-------------------:|
| p = 0.05, A_min = 30, A_max = 500 | 0.2503 |
| p = 0.1, A_min = 30, A_max = 400 | 0.2573 |
| p = 0.1, A_min = 10, A_max = 500 | 0.5305 |
| p = 0.2, A_min = 30, A_max = 400 | 0.2495 |
| p = 0.25, A_min = 30, A_max = 400 | 0.2394 |
| p = 0.25, A_min = 100, A_max = 800 | 0.0768 |
| p = 0.3, A_min = 100, A_max = 500 | 0.0543 |

- Better outcome for traders either way but at the expense of peg/LPs
- Optimize within constraints for trader / LP outcomes?