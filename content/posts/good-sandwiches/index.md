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

We can write this a bit more formally (or [move on to the next section](#section2)):

- **Front-run**: $(x_0, y_0) \longrightarrow (x_1, y_1)$ where $(x_1, y_1) = (x_0 + \delta x, y_0 - \delta y)$
- **Victim trade**: $(x_1, y_1) \longrightarrow (x_2, y_2)$ where $(x_2, y_2) = (x_1 + \Delta x, y_1 - \Delta y')$
- **Back-run**: $(x_2, y_2) \longrightarrow (x_3, y_3)$ where $(x_3, y_3) = (x_2 - \delta x', y_2 + \delta y)$

The Attacker's profit is the difference between the amount of $x$ tokens obtained in the back-run and the amount of $x$ tokens spent in the front-run, or  $\Pi_A^{x} = \delta x' - \delta x$.
The Victim's loss is the difference between the amount of $y$ token obtained after the front-run and what was expected or $\Lambda_V^{y} = \Delta y - \Delta y'$

At the end of the attack the reserves of the AMM are:
$y_3 = y_0 - \Delta y'$ and $x_3 = x_0 + \Delta x + \delta x - \delta x'$.
But if there had been no attack, the reserves would instead have been:
$y_{no\ \ sandwich} = y_0 - \Delta y$ and $x_{no\ \ sandwich} = x_0 + \Delta x$, 
so the changes in reserves induced by the sandwich are:

$\Delta_{R^{y}} = -\Delta y' + \Delta y = \Delta y - \Delta y' = \Lambda_V^{y}$

$\Delta_{R^{x}} = \Delta x + (\delta x - \delta x') - \Delta x = \delta x - \delta x' = -\Pi_A^{x}$

In other words, whatever profit in $x$ tokens the attacker took came at the expense of the victim's loss denominated in $y$ tokens. 
This does not necessarily make the two values equal, since each are denominated in a different token.
To establish a more precise relationship, we would need to convert one value to the other's unit and consider the AMM's pricing function to understand how the relative values change during the attack.
An example of such a more specific illustration is given in  [Heimbach and Wattenhofer (2002)](https://arxiv.org/pdf/2202.03762), using Uniswap V2's constant product AMM ($x \cdot y=k$) to give an analytical proof.


<a id="section2"></a>
# From Duels to Multiplayer Games

From the above, it seems that a sandwich will always result in a financial loss for the victim.
But the scenario described is schematic and doesn't account for the external factors present in real attack contexts.

In particular, sandwich attacks are usually described as a two-player zero-sum game, when the number of participants is in practice often much higher.
It's not uncommon, especially on a chain like Ethereum mainnet, to have multiple trades for the same pool within the same block. 
This means that an attacker can potentially sandwich multiple victims at the same time.

Even if the attacker only sandwiches one victim while the other trades execute normally, both the attacker and the victim are competing with the other traders for a favorable ordering of their transaction within the block.
Depending on the other traders' trade size and direction, being at the top or at the bottom of the block can result in very different execution prices and outcomes.
Because a sandwich attacker will usually want to be at the top of the block, this means that its victims's transaction will be reordered to a potentially higher position in the block.



Let's illustrate this with a simple example.
A trader named **0xPepe**, wants to sell 1 ETH for 1000 USDC.
However, another trader, **0xWhale**, wants to sell 1000 ETH and pays a higher priority fee.
His transaction therefore gets included first in the block.
Because of the large size of the whale's trade, **0xPepe**'s trade either executes at a very unfavorable price or reverts due to excessive slippage.


<h4>Scenario 1: Two transactions </h4>
<div class="transaction-container">
  <div class="transactions">
    <div class="transaction-block whale" title="Whale's transaction">
      <div class="transaction-number">1</div>
      <div class="profile-pic">
        <img src="../../images/good-sandwiches/whale.png" alt="Whale">
      </div>
      <div class="transaction-info">
        <div class="name">0xWhale</div>
        <div class="action">Sells 1000 ETH</div>
      </div>
      <div class="gas-info">Gas: Normal</div>
    </div>
    <div class="transaction-block pepe" title="Pepe's transaction">
      <div class="transaction-number">2</div>
      <div class="profile-pic">
        <img src="../../images/good-sandwiches/pepe.png" alt="Pepe">
      </div>
      <div class="transaction-info">
        <div class="name">0xPepe</div>
        <div class="action">Sells 1 ETH</div>
      </div>
      <div class="gas-info">Gas: Low</div>
    </div>
  </div>
  <div class="arrow"></div>
  <div class="result-block" title="Transaction results">
    <h4>Outcome</h4>
    <p>Because of the <b>high price impact</b> of the first transaction, transaction 2 gets executed at a <b>low price</b> or reverts due to <b>slippage</b></p>
  </div>
</div>

Now let's assume that an MEV bot is watching the mempool and decides to sandwich **0xPepe**. 
The whale, meanwhile, has tight slippage settings and is not be sandwiched.
**0xPepe**'s trade is now guaranteed to be executed since the MEV bot's front run will only raise the price up to the threshold of **0xPepe**'s slippage settings.


<h4>Scenario 2: Sandwich changes the transaction's original order </h4>
<div class="transaction-container">
  <div class="transactions">
    <div class="transaction-block bot" title="MEV Bot's frontrun transaction">
      <div class="transaction-number">1</div>
      <div class="profile-pic">
        <img src="../../images/good-sandwiches/bot.png" alt="MEV Bot">
      </div>
      <div class="transaction-info">
        <div class="name">MEV Bot</div>
        <div class="action">Frontrun</div>
      </div>
      <div class="gas-info">Gas: Low</div>
    </div>
    <div class="transaction-block pepe" title="Pepe's transaction">
      <div class="transaction-number">2</div>
      <div class="profile-pic">
        <img src="../../images/good-sandwiches/pepe.png" alt="Pepe">
      </div>
      <div class="transaction-info">
        <div class="name">0xPepe</div>
        <div class="action">Sells 1 ETH</div>
      </div>
      <div class="gas-info">Gas: Low</div>
    </div>
    <div class="transaction-block bot" title="MEV Bot's backrun transaction">
      <div class="transaction-number">3</div>
      <div class="profile-pic">
        <img src="../../images/good-sandwiches/bot.png" alt="MEV Bot">
      </div>
      <div class="transaction-info">
        <div class="name">MEV Bot</div>
        <div class="action">Backrun</div>
      </div>
      <div class="gas-info">Gas: High</div>
    </div>
    <div class="transaction-block whale" title="Whale's transaction">
      <div class="transaction-number">4</div>
      <div class="profile-pic">
        <img src="../../images/good-sandwiches/whale.png" alt="Whale">
      </div>
      <div class="transaction-info">
        <div class="name">0xWhale</div>
        <div class="action">Sells 1000 ETH</div>
      </div>
      <div class="gas-info">Gas: Normal</div>
    </div>
  </div>
  <div class="arrow"></div>
  <div class="result-block" title="Transaction results">
    <h4>Outcome</h4>
    <p>Pepe's transaction is now <b>guaranteed to be executed</b> and will not revert. It will also be executed before that of the whale. The whale's price impact is mitigated, but the MEV Bot's frontrun still lowers the execution price. The frontrun's price impact may be lower than that caused by the original whale's transaction and result in a better execution price for Pepe.</p>
  </div>
</div>

<style>
.transaction-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.transactions {
  flex: 1;
  margin-right: 20px;
}

.transaction-block {
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.whale {
  background-color: rgba(230, 243, 255, 0.7);
}

.pepe {
  background-color: rgba(255, 230, 230, 0.7);
}

.bot {
  background-color: rgba(230, 255, 230, 0.7);
}

.whale:hover {
  background-color: rgba(230, 243, 255, 1);
}

.pepe:hover {
  background-color: rgba(255, 230, 230, 1);
}

.bot:hover {
  background-color: rgba(230, 255, 230, 1);
}

.transaction-number {
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
}

.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.transaction-info {
  flex-grow: 1;
}

.name {
  font-weight: bold;
  margin-bottom: 5px;
}

.action {
  font-size: 14px;
  color: #666;
}

.gas-info {
  font-size: 14px;
  color: #666;
  margin-left: 15px;
}

.arrow {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 20px solid #ccc;
  margin: 0 25px;
  align-self: center;
}

.result-block {
  background-color: rgba(240, 240, 240, 0.7);
  border-radius: 10px;
  padding: 10px;
  width: 250px;
  transition: background-color 0.3s ease;
}

.result-block:hover {
  background-color: rgba(240, 240, 240, 0.9);
}

.result-block h4 {
  margin-top: 0;
  text-align: center;
}

.result-block p {
  padding-left: 5px;
  font-size: 14px;
}
</style>

In the sandwich scenario, it is also technically possible for **0xPepe** to receive a better execution price than without the sandwich.
If we assume that the price impact from **0xWhale**'s trade is higher than **0xPepe**'s minimum acceptable execution price but lower than the price after the front-run, **0xPepe** may not only get guaranteed execution but also a better price than without the sandwich.

In practice, however, this is unlikely to happen.
MEV bots are extremely efficient and rarely leave more than rounding errors on the table, _i.e._ the front-run run price will almost always be extremely close to the victim's minimum acceptable price.

We can illustrate this using data from our dataset of sandwich attacks on Curve.
We take a subset of 767 sandwiches where the victim traded directly with the pool's contract or the router contract used by the web UI.
This allows us to easily retrieve their slippage settings and compute how much value, if any, the attacker left unextracted. 
Or, in other words, to check how close to the victim's minimum acceptable price the bot pushed the market price during its frontrun.




<script src="../../js/good-sandwiches/histogram.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="display: flex; justify-content: space-between; height: 400px; margin-bottom: 40px;">
    <div style="width: 48%;">
        <canvas id="percentageChart"></canvas>
    </div>
    <div style="width: 48%;">
        <canvas id="absoluteChart"></canvas>
    </div>  
</div>

As we can see the vast majority (~95%) of sandwich attacks bring the victim's execution price within less than 1% of their minimum acceptable price. 
The scenario in which random trades prior to the victim's bring the price not only within that range but also lower than the sandwich is extremely unlikely.
However, the case in which these trades would bring the victim's price below its slippage tolerance but a sandwich allows the trade to be executed has a much higher probability, particularly during periods of volatility.

# An Example in the Wild

In fact, such slippage preventing, or "execution guaranteeing" sandwiches can be observed in pools with low liquidity and high volatility, such as memecoin pools on Uniswap. 
On block [20797275](https://etherscan.io/block/20797275) on Ethereum mainnet, on September 21, 2024, for instance, the infamous [jaredfromsubway](https://www.theblock.co/post/312245/jaredfromsubway-eth-is-back-with-a-new-mev-bot-and-new-sandwich-attacks) sandwiched a trader in a [Uniswap v2 pool](https://etherscan.io/address/0x6bcd2862522c0ab45f4f9fe693e36c791ede0a42#code) pairing ETH with [TERMINUS](https://www.bitget.com/price/first-city-in-mars), an Elon Musk related memecoin that had launched a month earlier.

The same block saw four other traders swap in the pool, none of whom got sandwiched.
By getting sandwiched, the victim's transaction was executed at the top of the block. 
But without the sandwich, the victim's transaction would instead have appeared last.

We provide below a schematic rendition of what happened in the pool (on the left) and what would have happened (on the right) if the victim had not been sandwiched. 
Prices are in ETH and have been multiplied by $10^6$ for readibility.

<div class="diagrams-container">
  <div id="sandwich-diagram" class="diagram-container">
    <h4>With Sandwich</h4>
    <div id="sandwich-transactions" class="transactions-sd"></div>
  </div>
  <div id="no-sandwich-diagram" class="diagram-container">
    <h4>Without Sandwich</h4>
    <div id="no-sandwich-transactions" class="transactions-sd"></div>
  </div>
</div>

<style>
.diagrams-container {
  display: flex;
  justify-content: space-between;
  font-family: Arial, sans-serif;
  max-width: 820px;
  margin: 0 auto 30px;
  padding: 4px
}

.diagram-container {
  width: 400px;
}

.transactions-sd {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.transaction-block-sd {
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  transition: background-color 0.3s ease;
  font-size: 12px;
}

.transaction-block-sd.Frontrun { background-color: rgba(230, 255, 230, 0.7); }
.transaction-block-sd.Backrun { background-color: rgba(230, 255, 230, 0.7); }
.transaction-block-sd.Victim { background-color: rgba(255, 230, 230, 0.7); } 
.transaction-block-sd.Trader { background-color: rgba(230, 243, 255, 0.7); }

.transaction-block-sd.Frontrun:hover { background-color: rgba(230, 255, 230, 1); }
.transaction-block-sd.Backrun:hover { background-color: rgba(230, 255, 230, 1); }
.transaction-block-sd.Victim:hover { background-color: rgba(255, 230, 230, 1); }
.transaction-block-sd.Trader:hover { background-color: rgba(230, 243, 255, 1); }


.transaction-number-sd {
  font-size: 14px;
  font-weight: bold;
  width: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  margin: 2px;
}

.transaction-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin: 0 5px;
}

.transaction-header {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
}

.transaction-address {
  font-weight: bold;
}

.transaction-tag {
  font-style: italic;
  margin-left: 5px;
}

.transaction-details {
  font-size: 11px;
}

.transaction-gas {
  font-size: 10px;
  color: #666;
  margin-top: 1px;
  width: 100%;
  text-align: left;
  border-top: 1px solid #ddd;
  padding-top: 5px;
}

.transaction-price {
  font-weight: bold;
  width: 80px;
  text-align: right;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.transaction-gas-etherscan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 5px;
  padding-top: 5px;
}

.transaction-gas {
  font-size: 10px;
  color: #666;
  flex-grow: 1;
}

.etherscan-link {
  display: flex;
  align-items: center;
}

.etherscan-icon {
  width: 16px;
  height: 16px;
  margin-left: 10px;
}
</style>

<script src="../../js/good-sandwiches/sandwich-diagram.js"></script>

Three out of the four traders who swapped in the same block were selling TERMINUS for WETH, each causing significant price drops in a pool that had then a bit over $100k of liquidity.
By being sandwiched, however, the victim's transaction is moved before all these selling trades and gets executed with a price of 5.59.
If no sandwich had occured, the victim would instead be placed last due to low gas and priority fee settings.
The price in this position would then be 5.31, well below the victim's minimum acceptable price of 5.588, resulting in the transaction reverting.



# Prevalence of Execution Guaranteeing Sandwiches

Curve vs UniV2
Methodology

# Datasets

Either JSON or sqlite db

- Curve sandwiches
- UniV2 sandwiches


# Draft Notes (to delete)
---------------

We also have different prices at each steps (expressing the price of $y$ in units of $x$):
- **Initial price**: $P_0 = \frac{x_0}{y_0}$
- **Victim expected price**: $P_E = \frac{\Delta x}\{\Delta y}$
- **Front-run price**: $P_1 = \frac{\delta x}{\delta y}  = \frac{(x_1 - x_0)}{(y_0 - y_1)}$
- **Victim execution price**: $P_2 = \frac{\Delta x}{\Delta y'} =  \frac{(x_2 - x_1)}{(y_1 - y_2)}$
- **Back-run price**: $P_3 = \frac{\delta x'}{\delta y} = \frac{(x_2 - x_3)}{(y_3 - y_2)} $

The Attacker's profit is the difference between the amount of $x$ tokens obtained in the back-run and the amount of $x$ tokens spent in the front-run, or  $\Pi_A = \delta x' - \delta x$
$\Leftrightarrow \Pi_A = \delta y \cdot (P_3 - P_1)$
Therefore, the attacker's profit is maximized when they can create the largest gap between $P_3$ and $P_1$.


We know that $\Delta y' > 0$ since the victim can't get a negative amount of $y$ tokens, and therefore $y_3 > y_0$.
On the other hand, since AMM liquidity curves are generally [monotonically decreasing](https://drops.dagstuhl.de/storage/01oasics/oasics-vol092-fab2021/OASIcs.FAB.2021.5/OASIcs.FAB.2021.5.pdf), the increase in $y$ reserves is mirrored by a decrease in $x$ reserves to maintain the invariant, so $x_3 > x_0$ $\Rightarrow \Delta x + \delta x - \delta x' > 0$

$\Leftrightarrow \Delta x > \delta x' - \delta x$

$\Leftrightarrow \Delta x > \Pi_A$

----------------

We know that $P_2$ is limited by the Victim's slippage setting $s$ as the transaction would otherwise revert, so $P_2 ≤ P_E \cdot (1 + s)$.
We also know that $P_1 > P_0$ (the front-run increases the price), $P_1 < P_2$ (the Victim's trade further increases the price) and $P_3 < P_2$ (the back-run sells $y$ for $x$, bringing the price down), so:

$P_3 - P_1 < P_E \cdot (1 + s) - P_0$

As $P_3 - P_1$ would be maximized when $P_3$ is close to its upper bound of $P_E \cdot (1 + s)$ -- _i.e._ if the back-run could sell at the same peak price as the victim -- and $P_1$ is close to its lower bound of $P_0$ -- i.e. if the front-run could purchase token at the lowest possible price.

Plugging in this in our original profit equation, we can write:

$\Pi_A < \delta y \cdot (P_E \cdot (1 + s) - P_0$)
