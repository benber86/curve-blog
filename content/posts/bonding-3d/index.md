---
title: "Dynamic StableSwap Bonding Curves"
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

What if AMM Bonding Curves adjusted dynamically based on trade size?

## Dynamic StableSwap

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

# Dynamic Curve Stableswap Simulator

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

# 3D View

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