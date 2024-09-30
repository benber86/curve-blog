---
title: "Can Sandwich Attacks Benefit their Victims?"
draft: false
date: 2024-09-23T09:25:45.000Z
ogimage: "https://blog.curvemonitor.com/images/gho-users/sankey.jpg"
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

Sandwiches are widely considered to be detrimental because they create a financial loss for the sandwiched victims.
Sandwiches are zero sum games, in which **any profit made by the attacker comes from an equivalent loss incurred by the victim**.

During a sandwich, the value in a constant function automated market maker (CFAMM) will remain, by definition, constant (or will increase slightly if fees are applied). 
A searcher will, at least in theory, only execute a sandwich attack if it is profitable to do so. 
They therefore end up with more value than they started with at the end of the transaction.
While they must pay fees to the AMM during the front and back-run transactions, this is compensated by the value they extract during the sandwich.
This leaves the victim as the only dependent variable, which must incur a loss to pay for the fees and the attacker's profit.

We can illustrate this with the common scenario in which a liquidity taker attacks another taker on a CFAMM. 
We'll ignore AMM fees and gas costs for simplicity's sake. 
The CFAMM, whether constant product, stableswap or other, is defined by its constant function $f(x, y) = k$ where x and y are the quantities of two tokens in the pool, and k is a constant.
Prior to any transactions in our scenario, the AMM's initial state is $(x_0, y_0)$.
The Victim ($V$) intends to sell $x$ tokens ($\Delta x$) in order to buy $y$ tokens ($\Delta y$).

Knowing that the expected price (including price impact) at the time of sending the trader order may not be the actual execution price, the Victim sets a slippage tolerance $s$, such that the transaction will revert if the amount of $y$ token received is less than $(1-s)\Delta y$.
This also means that the Victim will most likely not receive their expected $\Delta y$ but instead will get $\Delta y'$ - due to the pool's state changing from other trades (including adversarial ones) executing prior to the Victim's trade.

To perform a sandwich attack, the Attacker ($A$) will need two transactions.
The goal of the first transaction (front-run) is to manipulate the price of the pool's assets by buying a large quantity $\delta y$ of $y$ asset with $\delta x$ tokens, so that buying $y$ tokens becomes more expensive for the Victim.
After the front-run and the Victim's trade have been executed, the Attacker sells back the entirety of their $y$ tokens ($\delta y$) and receives $\delta x'$ tokens in return (back-run).
Their profit is the difference between their amount of $x$ tokens after the sandwich ($\delta x'$) and their original amount ($\delta x$)

We can write this a bit more formally or move on to the next section:

- **Front-run**: $(x_0, y_0) \longrightarrow (x_1, y_1)$ where $(x_1, y_1) = (x_0 + \delta x, y_0 - \delta y)$
- **Victim trade**: $(x_1, y_1) \longrightarrow (x_2, y_2)$ where $(x_2, y_2) = (x_1 + \Delta x, y_1 - \Delta y')$
- **Back-run**: $(x_2, y_2) \longrightarrow (x_3, y_3)$ where $(x_3, y_3) = (x_2 - \delta x', y_2 + \delta y)$


We also have different prices at each steps (expressing the price of $y$ in units of $x$):
- **Initial price**: $P_0 = \frac{x_0}{y_0}$
- **Victim expected price**: $P_E = \frac{\Delta x}\{\Delta y}$
- **Front-run price**: $P_1 = \frac{\delta x}{\delta y}  = \frac{(x_1 - x_0)}{(y_0 - y_1)}$
- **Victim execution price**: $P_2 = \frac{\Delta x}{\Delta y'} =  \frac{(x_2 - x_1)}{(y_1 - y_2)}$
- **Back-run price**: $P_3 = \frac{\delta x'}{\delta y} = \frac{(x_2 - x_3)}{(y_3 - y_2)} $

We express $P_1$ and $P_3$  in terms of $P_0$ and their respective price impact factors:
$P_1 = P_0 * (1 + \alpha)$  and $P_3 = P_0 * (1 + \beta)$, where $\alpha$ represents the price increase due to the front-run and $\beta$ represents the price change from $P_0$ after the back-run.

And likewise for the Victim's expected price: $P_E = P_0 * (1 + \gamma)$, where $\gamma$ is the price impact of the Victim's trade based on the size of $\Delta x$ and non-inclusive of slippage.

Finally, the Attacker's profit is the difference between the amount of $x$ tokens obtained in the back-run and the amount of $x$ tokens spent in the front-run, or  $\Pi_A = \delta x' - \delta x$
$\Leftrightarrow \Pi_A = \delta y * (P_3 - P_1)$

$\Leftrightarrow \Pi_A = \delta y * P_0 * (\beta - \alpha)$

Therefore, the attacker's profit is maximized when they can create the largest gap between $\alpha$ and $\beta$.


We know that $P_2$ is limited by the Victim's slippage setting $s$ as the transaction would otherwise revert, so $P_2 ≤ P_E * (1 + s)$.
We also know that $P_1 > P_0$ (the front-run increases the price), $P_2 > P_1$ (the Victim's trade further increases the price) and $P_3 < P_2$ (the back-run sells $y$ for $x$, bringing the price down), so:

$P_3 < P_2 ≤ P_E * (1 + s)$

$\Leftrightarrow P_0 * (1 + β) < P_0 * (1 + \gamma) * (1 + s)$

$\Leftrightarrow \beta < \gamma + s + \gamma * s$   

We can substitute our inequality for $\beta$ into the profit equation from above:

$ \Pi_A = \delta y * P_0 * (\beta - \alpha)$

$ \Leftrightarrow \Pi_A < \delta y * P_0 * ((\gamma + s + \gamma*s) - \alpha)$

$ \Leftrightarrow \Pi_A < \delta y * P_0 * ((\gamma + s + \gamma*s))$


We know that P_2 is bound by the victim's slippage settings

Which shows that **the Attacker's profit is bounded by Victim's slippage tolerance and the price increase the Attacker can generate from the price impact of the front-run**. 
AMM fees and gas costs, if we were to account for them, would reduce the upper profit boundary but would not fundamentally alter the inequation.  
The above scenario makes no assumption about the nature of the AMM's constant function but confirms prior work by [Heimbach and Wattenhofer (2002)](https://arxiv.org/pdf/2202.03762) on Uniswap V2, in which the authors show that a sandwiching bot's profit cannot exceed the victim’s loss in a constant product formula AMM ($xy = k$). 


# From Zero Sum Duels to Greater Fool Theory

It therefore appears from the above that a sandwich will always result in a financial loss for the victim.
But while the scenario described is very common and what most people picture when thinking of a sandwich attack, it does not cover all attack scenarios.

