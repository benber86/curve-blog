---
title: "Can Sandwich Attacks Benefit their Victims?"
draft: false
date: 2024-08-30T09:25:45.000Z
ogimage: "https://blog.curvemonitor.com/images/ng-mev/thumbnail.png"
description: "We question the conventional idea that sandwich attacks are always financially detrimental to their victims with empirical examples and theoretical justifications for the contrary."
categories:
  - MEV
  - Research
tags:
  - Research
  - MEV
---

_Authors:_ [benny](https://warpcast.com/bennylada), [Philipp](https://twitter.com/phil_00llama) 

# Key Findings

- Lorem ipsum

# Sandwich Attacks are Zero Sum Games

Sandwiches are widely considered to be detrimental because there are a zero sum games, in which any profit made by the attacker comes from an equivalent loss incurred by the victim.

We can illustrate this with the common scenario in which a liquidity taker attacks another taker on a constant function automated market maker (CFAMM). 
We'll ignore AMM fees and gas costs for simplicity's sake. 
The CFAMM is defined by its constant function $f(x, y) = k$ where x and y are the quantities of two tokens in the pool, and k is a constant.
Prior to any transactions in our scenario, the AMM's initial state is $(x_0, y_0)$.
The Victim ($V$) intends to sell $x$ tokens ($\Delta x$) in order to buy $y$ tokens ($\Delta y$).

Knowing that the expected price (including price impact) at the time of sending the trader order may not be the actual execution price, the Victim sets a slippage tolerance $s$, such that the transaction will revert if the amount of $y$ token received is less than $(1-s)\Delta y$.
This also means that the Victim will most likely not receive their expected $\Delta y$ but instead will get $\Delta y'$ - due to the pool's state changing from other trades (including adversarial ones) executing prior to the victim's trade.

To perform a sandwich attack, the Attacker ($A$) will need two transactions.
The goal will be to manipulate the price of the pool's assets by buying a large quantity $\delta y$ of $y$ asset with $\delta x$ tokens, so that buying $y$ tokens becomes more costly for the Victim.
After the Victim's trade has been performed, the Attacker sells back the entirety of their $y$ tokens ($\delta y$) and receives $\delta x'$ tokens in return.

A bit more formally:

- **Front-run**: $(x_0, y_0) \longrightarrow (x_1, y_1)$ where $(x_1, y_1) = (x_0 + \delta x, y_0 - \delta y)$
- **Victim trade**: $(x_1, y_1) \longrightarrow (x_2, y_2)$ where $(x_2, y_2) = (x_1 + \Delta x, y_1 - \Delta y')$
- **Back-run**: $(x_2, y_2) \longrightarrow (x_3, y_3)$ where $(x_3, y_3) = (x_2 - \delta x', y_2 + \delta y)$

The Attacker's profit is therefore $\Pi_A = \delta x' - \delta x$  

We also have different prices at each steps (expressing the price of $y$ in units of $x$):
- **Initial price**: $P_0 = y_0 / x_0$
- **Front-run price**: $P_1 = \delta y / \delta x = (y_0 - y_1) / (x_1 - x_0)$
- **Victim price**: $P_2 = \Delta y' / \Delta x = (y_1 - y_2) / (x_2 - x_1)$
- **Back-run price**: $P_3 = \delta y / \delta x' = (y_3 - y_2) / (x_2 - x_3) $

While the Victim's originally expected price would be $\mathbb{E}[P_V] = \Delta y / \Delta x$

Because the front-run transaction increases the price for the Victim, we know that $P_1 > P_2$. 
We also know that $\delta x = P_1 * \delta y$ and $\delta x' = P_3 * \delta y$. 
Since the attack would not be executed unless $\Pi_A =  \delta x' - \delta x > 0$, we know that $\delta x' > \delta x$ and therefore $P_3 > P_1$.

We can plug in the values of $P_3$ and $P_1$ from above into this inequality to get:

$\frac{(y_3 - y_2)}{(x_2 - x_3)} > \frac{(y_0 - y_1)}{(x_1 - x_0)}$

Furthermore we know that $(x_2 - x_3)$, $(x_1 - x_0)$ and $(y_0 - y_1)$ are all positive. 
In the back-run, the attacker is selling $y$ tokens to receive $x$ tokens, so $x_2 > x_3$.
In the front-run, the attacker is buying $y$ tokens by selling $x$ tokens, so $x_1 > x_0$, and $y_0 > y_1$.

So we can rewrite the inequality as:

$(x_2 - x_3) < \frac{(y_3 - y_2)(x_1 - x_0)}{(y_0 - y_1)}$

Since $\Pi_A = \delta x' - \delta x = (x_2 - x_3) - (x_1 - x_0)$

$\implies \Pi_A < \frac{(y_3 - y_2)(x_1 - x_0)}{(y_0 - y_1)} - (x_1 - x_0)$

$\iff \Pi_A < (x_1 - x_0) \left[ \frac{(y_3 - y_2)}{(y_0 - y_1)} - 1 \right]$

$\iff \Pi_A < (x_1 - x_0) \left[ \frac{(y_1 - y_2) - (y_0 - y_3)}{(y_0 - y_1)} \right]$

We know that $(y_0 - y_3) \geq 0$ (the Attacker returns as many $y$ tokens during the back-run as they took during the front-run, so only what the Victim bought is taken from the pool's balance after the sandwich, i.e. $y_3 = y_0 - \Delta y'$). 
Furthermore, $(y_1 - y_2) = \Delta y' \leq (1-s)\Delta y$, so we can write:

$\Pi_A < \frac{(x_1 - x_0)}{(y_0 - y_1)}((1-s)\Delta y)$

Which shows that **the Attacker's profit is bounded by Victim's slippage tolerance and the price increase the Attacker can generate from the price impact of front-run**.

# From Zero Sum Duels to Greater Fool Theory

Dynamic fees are currently not an effective deterrent against sandwiches on StableSwap pools although they do affect searchers' profitability and create higher revenue for LPs and the DAO.
A revision of the current formula could make fees a more efficient deterrent, however any such changes need to be weighed against other considerations in terms of competitiveness, stability and security.
An important aspect to investigate is how dynamic fees fare at preventing pool imbalances, regardless of MEV activity.
