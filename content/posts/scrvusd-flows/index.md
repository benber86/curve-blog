---
title: "Savings crvUSD - Deposit flow"
draft: false
date: 2024-11-24T09:25:45.000Z
ogimage: "https://blog.curvemonitor.com/images/gho-users/sankey.jpg"
description: "Analysis of flows into savings crvUSD"
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

This research ....

# Introduction 

Hey ey

If users do not provide liquidity on Curve or deposit on Pendle, what do they do with their GHO?
The above charts only look at where users currently have assets, which does not capture flows such as trading activities.
To better understand where GHO liquidity moves, we can follow the token's transfer events.
This allows us to see where GHO minters sent their tokens to (first-order flow) and, if they traded them, what tokens they traded GHO for (second-order flow).
We display the flows in USD and total number of transactions in the following chart:

<script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
<script src="../../js/scrvusd-flows/sankey.js"></script>


<div id="ddownsankey" style="margin-top: 40px; margin-bottom: 40px">
 <select id="data-type">
 <option value="volume" selected>USD Volume</option>
 <option value="transactions">Number of Transactions</option>
 </select>
</div>
<div style="text-align: center; width: 100%; margin-bottom: 20px;">
<span style="font-size: 16px; color: #666; font-weight: bold">First and Second Order Flows into Savings crvUSD Vault (Volume)</span></div>
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
