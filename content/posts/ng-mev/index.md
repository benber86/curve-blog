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

Among these different enhancements, this article will focus on dynamic fees. While the original Stableswap pools applied a flat fee to all trades, the fee charged by NG pool is a function of its balances and exchange rate. 
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


Dynamic fees counteract this strategy by increasing the cost of executing trades that significantly skew the pool's balance.