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

# Introduction


# Growth & User Acquisition

GHO launched about a year ago  


<script src="../../js/gho-users/new-users-chart.js"></script>
<script src="../../js/gho-users/debt-chart.js"></script>

<div style="display: flex; justify-content: space-between;">
  <div style="width: 48%;">
    <canvas id="linechart-new-users" width="400" height="400"></canvas>
  </div>
  <div style="width: 48%;">
    <canvas id="linechart-debt" width="400" height="400"></canvas>
  </div>
</div>

At first it's many new users, but with the peak it's whales coming in with size and filling in the cap.

Another way to look at this is to plot and compare growth rates.
We use a weekly sliding window to compute growth to better capture trends and smooth out day to day variations.

<script src="../../js/gho-users/growth-and-utilization-chart.js"></script>
<div style="width: 100%;">
    <canvas id="chart-growth-and-utilization" width="800" height="400"></canvas>
</div>



<script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
<script src="../../js/gho-users/sankey.js"></script>


<select id="data-type">
    <option value="volume" selected>Volume</option>
    <option value="transactions">Number of Transactions</option>
</select>
<div id="sankey-chart"></div>

<style>
    #sankey-chart {
        width: 100%;
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



We continued to work with our long term auditor [ChainSecurity](https://www.chainsecurity.com/) but extended our engagement to hire a consultant on retainer basis to provide continuous security advice.
Two new auditors, [Ottersec](https://osec.io/) and [Statemind](https://statemind.io/) were brought on board to provide additional security assessments and bring different perspectives and methods into our review process.
Shortly after the hack, a [security competition](https://codehawks.cyfrin.io/c/2023-09-vyper-compiler) was also organized on CodeHawks with $160,000 in prizes.

# CodeHawks Competition

Security competitions are a great complement to a traditional audit process. 
Their large number of participants means more eyeballs on the codebase compared to the small teams of experts conducting regular audits.
The competitive nature of the event also pushes people to come up with unique, creative ways to break things.

CodeHawks, through [Patrick Collins](https://x.com/patrickalphac?lang=en), offered to run Vyper's contest free of charge and invited expert Python developers to participate.
They were joined by web3 security specialists such as [obront](https://github.com/zobront) and [pcaversaccio](https://github.com/pcaversaccio). 
In total the contest gathered 13 participants who submitted 38 findings.

Among the highest severity issues, auditors identified an [integer overflow](https://github.com/vyperlang/audits/blob/master/audits/CodeHawks_Vyper_September_2023_competitive_audit.md#h-01-integer-overflow-in-slice) in the slice() code that could cause memory corruption and an issue with the `concat` built-in that could lead to [memory corruption](https://github.com/vyperlang/audits/blob/master/audits/CodeHawks_Vyper_September_2023_competitive_audit.md#h-02-concat-built-in-can-corrupt-memory).

The contest also proved to be a recruiting ground for Vyper as [cyberthirst](https://github.com/cyberthirst) who finished in third position, was then hired to perform a continuous review of the codebase and will soon be implementing new measures to ensure the correctness of the compiler.

# What's Next?

The upcoming versions of Vyper will offer new features such as proxy built-ins, traits, storage packing, abstract functions and more optimizations on the backend (Venom). 
We plan to keep working with our auditing partners to ensure every change is thoroughly reviewed and tested before making it into production.

Another exciting development for Vyper's security is the work that cyberthirst will be undertaking to implement state of the art compiler verification methods.
As more and more optimizations are added to the backend, it becomes crucial to have a way to ensure that the compiled bytecode maintains semantic equivalence with the original source code.
The work will focus on two main approaches:

- Differential fuzzing, with a definitional interpreter as a language specification and fuzzing oracle to compare the compiled bytecode and interpreted source code of automatically generated contracts.
- An abstract analysis framework built on top of the Vyper AST and Venom IR, to verify that inferred abstract properties of contracts align with actual semantics at the compiled Venom IR level.

While these security measures and future developments are crucial for Vyper's growth and reliability, they require ongoing financial support. 
The future of Vyper's development and security ultimately depends on community backing. 
If you value the work we're doing and want to help keep the project safe , you can [donate directly](https://etherscan.io/address/0x70CCBE10F980d80b7eBaab7D2E3A73e87D67B775#code), or vote for us during funding rounds on Gitcoin, Octant and Optimism.
