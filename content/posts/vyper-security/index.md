---
title: "State of Vyper Security - September 2024"
draft: false
date: 2024-09-01T09:25:45.000Z
ogimage: "https://blog.curvemonitor.com/images/ng-mev/thumbnail.png"
description: "Review of Vyper Security 1 year after hack"
categories:
  - Vyper
  - Security
tags:
  - Vyper
  - Security
  - Audits
---

_Authors:_ [benny](https://warpcast.com/bennylada)


A year ago, a [vulnerability](https://hackmd.io/@vyperlang/HJUgNMhs2) in older versions of the Vyper compiler led to an [exploit](https://hackmd.io/@LlamaRisk/BJzSKHNjn) that affected multiple liquidity pools on [Curve Finance](https://www.curve.fi).
Since then the team has been working constantly to ensure the compiler's safety and robustness while delivering new features and optimization.
Thanks to generous contributions from Curve, [Lido](https://lido.fi/) and [Optimism](https://retrofunding.optimism.io/) we were able to significantly increase Vyper's security budget for 2023-2024. 
The result has been 9 audits, 2 security experts on retainer, 1 contest and over 100 findings addressed.


<div id="chart" class="chart"></div>
<script src="https://d3js.org/d3.v7.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=SUSE:wght@100..800&display=swap" rel="stylesheet">
<script src="../../js/vyper-security/timeline.js"></script>

<style>
    :root {
        --background-color: None;
        --tooltip-background-color: white;
        --alt-background-color: #f0f0f0;
        --text-color: black;
        --bar-color: rgba(159, 76, 242, 0.9);
        --bar-color-light: rgba(159, 76, 242, 0.6);
    }

    html.dark {
        --background-color: None;
        --tooltip-background-color: #202020;
        --alt-background-color: rgba(50, 50, 50, 0.3);
        --text-color: #e0e0e0;
        --bar-color: rgba(159, 76, 242, 0.7);
        --bar-color-light: rgba(159, 76, 242, 0.4);
    }

    .chart, .tooltip {
        font-family: "JetBrains Mono", sans-serif;
        color: var(--text-color);
        background-color: var(--background-color);
        overflow-x: auto;
    }
    .chart { width: 100%; overflow-x: auto; }
    .bar:hover { fill: rgba(159, 76, 242, 0.5); }
    .axis-label { font-size: 14px; }
    .target-label { font-size: 13px; }
    .tooltip {
        position: absolute;
        background-color: var(--tooltip-background-color);
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 10;
    }
    .tooltip.active {
        pointer-events: auto;
    }
    .tooltip-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
    .tooltip a {
        display: block;
        margin-top: 10px;
        color: #0066cc;
        text-decoration: none;
    }
    .tooltip a:hover {
        text-decoration: underline;
    }
</style>


We continued to work with our long term auditor [ChainSecurity](https://www.chainsecurity.com/) but extended our engagement to hire a consultant on retainer basis to provide continuous security advice.
Two new auditors, [Ottersec](https://osec.io/) and [Statemind](https://statemind.io/) were brought on board to provide additional security assessments and bring different perspectives and methods into our review process.
Shortly after the hack, a [security competition](https://codehawks.cyfrin.io/c/2023-09-vyper-compiler) was also organized on CodeHawks with $160,000 in prizes.

# CodeHawk Competition

Security competition are a great complement to a traditional audit process. 
Their large number of participants means more eyeballs on the codebase compared to the small teams of experts conducting regular audits.
The competitive nature of the event also pushes people to come up with unique, creative ways to break things.

CodeHawks, through [Patrick Collins](https://x.com/patrickalphac?lang=en), offered to run Vyper's contest free of charge and invited expert Python developers to participate.
They were joined by web3 security specialists such as [obront](https://github.com/zobront) and [pcaversaccio](https://github.com/pcaversaccio). 
In total the contest gathered 13 participants who submitted 38 findings.

Among the highest severity issues, auditors identified an [integer overflow](https://github.com/vyperlang/audits/blob/master/audits/CodeHawks_Vyper_September_2023_competitive_audit.md#h-01-integer-overflow-in-slice) in the slice() code that could cause memory corruption and an issue with the `concat` built-in that could lead to [memory corruption](https://github.com/vyperlang/audits/blob/master/audits/CodeHawks_Vyper_September_2023_competitive_audit.md#h-02-concat-built-in-can-corrupt-memory).

The contest also proved to be a recruiting ground for Vyper as [cyberthirst](https://github.com/cyberthirst) who finished in third position, was then hired to perform a continuous review of the codebase and will soon be implementing new measures to ensure the correctness of the compiler.

# Audits

From 2023 to early 2024 audits were focused on the 

<script src="../../js/vyper-security/severity-chart.js"></script>
<style>
.severity-chart {
    width: 100%;
    height: 450px;
    font-family: "JetBrains Mono", sans-serif;
}

.severity-chart text {
    fill: var(--text-color);
}

.severity-chart .domain,
.severity-chart .tick line {
    stroke: var(--text-color);
}
</style>

<div id="severity-chart" class="severity-chart"></div>
as