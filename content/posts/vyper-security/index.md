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

# Key Findings

- Lorem ipsum

# Audits

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

