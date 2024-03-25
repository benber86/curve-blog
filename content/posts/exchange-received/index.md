---
title: "How to Do Cheaper, Approval-Free Swaps"
draft: false
date: 2024-03-24T09:25:45.000Z
ogimage: "/images/exchange-received/img.png"
description: "A deep dive into the exchange_received function on NG pools which allows users to trade without approvals and can significantly reduce transaction gas costs."
categories:
  - Gas
  - Trading
  - Guide
  - Pools
tags:
  - Trading
  - NG
  - Gas
---

_Authors:_ [mo](#), [benny](https://warpcast.com/bennylada)

## Summary

- NG Pools come with a new swap method, `exchange_received`, which allows users to trade based on the changes in balance within the pool.
- This can be used to do swaps without giving the contract approval and to reduce the amount of transfers during composite trades.
- Using `exchange_received` gives significant gas savings compared to the regular `exchange` function.
- Funds sent to the pool must be spent through `exchange_received` in the same transaction or run the risk of being appropriated by a third party.
- The method can potentially be used to recover tokens that were mistakenly sent to the pool.


## Introduction


The `exchange_received` function introduces a novel approach to exchanging tokens based on balance changes within AMMs, rather than the traditional method based on the transfer of tokens within the same function call. 
This approach is particularly targeted at DEX aggregators or arbitrageurs, as it presents two considerable advantages. 
First, the function eliminates the need for granting approval to the AMM contract, reducing gas costs, or, for users usually giving unlimited approvals, drastically reducing the risk of having their funds stolen if the contract were ever to be compromised.
Second, for any transaction involving multiple swaps across several pools, the transaction can eliminate one or more ERC-20 transfers, again significantly reducing gas costs.

The function is available for all new generation (ng) pools of Curve, including [Twocrypto-ng](https://github.com/curvefi/twocrypto-ng) pools and [Stableswap-ng pools](https://github.com/curvefi/stableswap-ng) (except for rebasing tokens and underlying trades on metapools).
However, as of March 2024, it is hardly ever used.
This article and the [associated notebooks](https://try.vyperlang.org/hub/user-redirect/lab/tree/shared/mo-anon/hop_exchange_received.ipynb) explain how the function works and how to use it. 
We start with a high-level overview before delving into the technicals.

## Approval-Free Swaps

In a traditional swap set-up, a user must first allow the pool to take a certain amount of tokens from their wallet before they can execute a swap and receive the output token.
This preliminary step is known as an [approval](https://help.1inch.io/en/articles/6147312-token-approvals).
Once a user has allowed a pool's contract to withdraw tokens from their wallet, they can then call the pool's `exchange` function to execute a swap.
The swap will withdraw from the user's wallet using the `transferFrom` ERC-20 function, execute the swap, and transfer the amount of output token to the user's wallet.

Using an example setup in which a user swaps 1000 USDC for 1 WETH, we can illustrate the process with the following flow chart:

<script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>
<script type="text/javascript" src="../../js/exchange-received/vis.animateTraffic.js"></script>
<script src="../../js/exchange-received/flowchart-basic-swap.js"></script>



<style>

  .controls button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }
  .control {   
    width: 24px;
    height: 24px;
    fill: #666;
    display: inline;
  }
  .subtitle{
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  #graph-b1 {
    width: 100%;
    height: 400px;
    border: 1px solid lightgrey;
  }
  .controls-b1 {
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
  }
  .controls-b1 button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }
  .control {
    width: 24px;
    height: 24px;
    fill: #666;
    display: inline;
  }
  .subtitle {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
</style>
<div id="graph-b1"></div>
<div id="subtitle-b1" class="subtitle"></div>
<div class="controls-b1">
  <button id="prevButton-b1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/>
    </svg>
  </button>
  <span id="stepCounter-b1"></span>
  <button id="nextButton-b1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/>
    </svg>
  </button>
  <button id="playPauseButton-b1">
    <svg id="playIcon-b1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="control">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
    </svg>
    <svg id="pauseIcon-b1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="display: none;" class="control">
      <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
    </svg>
  </button>
</div>

With `exchange_received`, the user can bypass the approval step. 
Instead, they would send their 1000 USDC directly to the pool's contract. 
After sending 1000 USDC to the pool, the user calls `exchange_received` specifying an input amount of 1000 USDC.
The pool executes the swap, but this time without `transferFrom` withdrawing tokens from the user's wallet.
Instead the pool will use the extra 1000 USDC that was just added to its balances.
After calculating the appropriate amount of output token (in our case 1 WETH), the pool transfers that amount back to the user.

This process is summarized in the flow chart below: 

<script src="../../js/exchange-received/flowchart-basic-received.js"></script>
<style>
  #graph-b2 {
    width: 100%;
    height: 400px;
    border: 1px solid lightgrey;
  }
  .controls-b2 {
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
  }
  .controls-b2 button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }
</style>
<div id="graph-b2"></div>
<div id="subtitle-b2" class="subtitle"></div>
<div class="controls-b2">
  <button id="prevButton-b2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/>
    </svg>
  </button>
  <span id="stepCounter-b2"></span>
  <button id="nextButton-b2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/>
    </svg>
  </button>
  <button id="playPauseButton-b2">
    <svg id="playIcon-b2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="control">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
    </svg>
    <svg id="pauseIcon-b2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="display: none;" class="control">
      <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
    </svg>
  </button>
</div>


## What's the Point?

The advantages of using `exchange_received` may not immediately be obvious.
After all, just like with the usual `exchange` method, the process requires two transactions, so it's not any simpler.
There are, however, two main advantages to using `exchange_received` over `exchange`: _security_ and _gas costs_.

### Security

The security benefits of `exchange_received` come from not having to grant approvals. 
If you allow a contract to spend a certain amount of your tokens and the contract is somehow compromised by an attacker, this attacker could potentially have the ability to use your funds in any way they see fit.
In the first two months of 2024 alone, over $10m was stolen from users who had given infinite approvals to [compromised](https://protos.com/seneca-protocol-hack-highlights-dangers-of-ethereums-token-approval-mechanism/) [contracts](https://cointelegraph.com/news/socket-protocol-loses-3-3-million-confirmed-approval-exploit).
And in March, [Paraswap](https://twitter.com/paraswap/status/1770313086072742263) ran a whitehat hack to protect over $2m of user funds that were at risk due to infinite approvals to its new Augustus V6 contract.
With [60% of approval transactions on Ethereum](https://arxiv.org/pdf/2207.01790.pdf) being infinite approvals, this is a real security risk facing most DeFi users.
It is also particularly dangerous for arbitrageurs who may hold large quantities of a token in their wallet and might need to use infinite approvals to save on gas. 

Of course, it is possible to *not* use infinite approvals.
A user can simply approve the amount they need and execute their swap.
This, however, costs more gas as the approval needs to be renewed for every transaction, leading us to our second benefit.

### Gas costs

An approval transaction costs about twice as much as a transfer transaction, making `exchange_received` a naturally cheaper option.
But to better quantify just how much gas a user can save, we can use boa's gas profiler on different scenarios.
The code used to generate the tables below is available in [this notebook on try.vyperlang.org](https://try.vyperlang.org/hub/user-redirect/lab/tree/shared/benber86/Gas_Profile_Exchange_Vs_Exchange_Received.ipynb)
The actual gas amounts for ERC20 functions like `transfer`, `approve` and `transferFrom` may vary in practice depending on the token contract's language and implementation.
Here we use the same Vyper implementation for all tokens.

#### Regular swap with approval and `exchange`
<div style="overflow: auto">

| **Contract**         | **Address**    | **Computation**  | **Gas**    |
|----------------------|------------|--------------|--------|
| ERC20.vy (Token A)   | 0x0880cf...| approve      | 24056  |
| CurveStableSwapNG.vy | 0xB82216...| exchange     | 78355  |
| ERC20.vy  (Token A)  | 0x0880cf...| balanceOf    | 3      |
| ERC20.vy  (Token A)  | 0x0880cf...| transferFrom | -15010 |
| ERC20.vy  (Token B)  | 0x2cb6bC...| transfer     | 6455   |
| **Total**            |            |              | **93859**  |

</div>

A "traditional" swap using the `exchange` function preceded by an approval will cost the user 93,859 gas.
The user benefits from some gas savings on `transferFrom` as the trade uses up the whole allowance.
Indeed, swapping for the same amount as the approval sets to zero the storage slot on the token's contract where the allowance amount is saved resulting in a [15k refund](https://www.zaryabs.com/clear-storage-and-get-incentivized-by-ethereum-blockchain). 
If we had only partially spent the allowance, for instance because we used an infinite approval before, we would not have received any refunds.

### Regular swap with `exchange` only after infinite approval

This scenario of a previous infinite approval results in the gas costs in the table below.
With an infinite approval, `transferFrom` now goes from giving the user a 15k gas refund to costing the user about 7k.
This is because we are merely decreasing the amount the contract is allowed to spend, not setting it to zero.
This effectively negates the gas saved from not using an approval transaction in the first place.
In fact, because the user still had to run an initial transaction to set an infinite approval (about 20k in gas + 21k for the transaction), using infinite approvals turns out to be *more expensive* gas wise than doing a limited approval before every transaction.

<div style="overflow: auto">

| Contract             | Address    | Computation    | Gas   |
|----------------------|------------|----------------|-------|
| CurveStableSwapNG.vy | 0xB82216...| exchange       | 80355 |
| ERC20.vy (Token A)   | 0x0880cf...| balanceOf        | 3     |
| ERC20.vy (Token A)   | 0x0880cf...| transferFrom   | 6890  |
| ERC20.vy (Token B)   | 0x2cb6bC...| transfer       | 6455  |
| **Total**            |            |                | **93703** |

</div>

### Swap with `exchange_received` and no approvals

Using `exchange_received`, we do not need to run an approval transaction. 
Instead, we simply use a transfer which is four times cheaper.
We do not get any gas refunds, but the total cost is about 8k cheaper compared to the regular `exchange` way.


<div style="overflow: auto">

| Contract             | Address    | Computation        | Gas   |
|----------------------|------------|--------------------|-------|
| ERC20.vy (Token A)   | 0x0880cf...| transfer           | 6455  |
| CurveStableSwapNG.vy | 0xB82216...| exchange_received  | 73113 |
| ERC20.vy (Token A)   | 0x0880cf...| balanceOf            | 3     |
| ERC20.vy (Token B)   | 0x2cb6bC...| transfer           | 6455  |
| **Total**            |            |                    | **86026** |

</div>

## Saving More With Less Transfers

So far, we have only considered the case of a simple swap between two tokens. 
However, transactions -- especially for arbitrage -- are often much more complex and involve multiple pools and tokens.
In this case, not only do users have to approve multiple pools to run each of their swaps, they also have to receive the output token of each swap to their wallet before transferring it to the next pool for the next step of their transaction.
By contrast, with `exchange_received`, users can just set the next pool as the recipient of the first swap to reduce the amount of transfers.
This means that the gas savings of using `exchange_received` increase with the number of swaps in a transaction.

To illustrate this, let's take an example where a trader wants to buy CRV with USDC.
There is no USDC/CRV pool, but there is a USDC/WETH pool and a WETH/CRV pool, so the user needs to first swap their USDC for WETH, then their WETH for CRV.
We'll assume that the price of WETH is 1000 USDC and the price of CRV 10 USDC.

In a scenario where the user uses `exchange`, they will have to approve the USDC/WETH pool to spend their USDC.
They will then call `exchange`, the pool will transfer 1000 USDC from their wallet and transfer 1 WETH back to the user. 
They now have to approve the WETH/CRV pool to let it transfer their 1 WETH to itself. 
Once this is done, they can call `exchange` on the WETH/CRV pool to swap their WETH for CRV. 

The steps are summed up in the flow chart below:

<script src="../../js/exchange-received/flowchart-h1.js"></script>
<style>
  #graph-h1 {
    width: 100%;
    height: 500px;
    border: 1px solid lightgrey;
  }
  .controls-h1 {
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
  }
  .controls-h1 button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }
</style>
<div id="graph-h1"></div>
<div id="subtitle-h1" class="subtitle"></div>
<div class="controls-h1">
  <button id="prevButton-h1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/>
    </svg>
  </button>
  <span id="stepCounter-h1"></span>
  <button id="nextButton-h1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/>
    </svg>
  </button>
  <button id="playPauseButton-h1">
    <svg id="playIcon-h1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="control">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
    </svg>
    <svg id="pauseIcon-h1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="display: none;" class="control">
      <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
    </svg>
  </button>
</div>

On the other hand, using `exchange_received` the user can skip some steps.
They would first transfer 1000 USDC to the WETH/USDC pool, then call `exchange_received`, specifying the WETH/CRV pool as the recipient.
The 1 WETH output from the first swap is therefore not returned to the user but directly transferred to the WETH/CRV pool.
The user can now call `exchange_received` again on the WETH/CRV pool using its excess balance of 1 WETH.
This time, the recipient will be their wallet and they will receive 100 CRV, having saved two approvals and one token transfer.

The steps are summed up below:

<script src="../../js/exchange-received/flowchart-h2.js"></script>
<style>
  #graph-h2 {
    width: 100%;
    height: 400px;
    border: 1px solid lightgrey;
  }
  .controls-h2 {
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
  }
  .controls-h2 button {
    background: none;
    border: none;
    cursor:    outline: none;
  }
</style>
<div id="graph-h2"></div>
<div id="subtitle-h2" class="subtitle"></div>
<div class="controls-h2">
  <button id="prevButton-h2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/>
    </svg>
  </button>
  <span id="stepCounter-h2"></span>
  <button id="nextButton-h2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control">
      <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/>
    </svg>
  </button>
  <button id="playPauseButton-h2">
    <svg id="playIcon-h2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="control">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
    </svg>
    <svg id="pauseIcon-h2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="display: none;" class="control">
      <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
    </svg>
  </button>
</div>

The second workflow is not only simpler it also ends up costing 38k less gas.
Using boa's [gas profiling](https://try.vyperlang.org/hub/user-redirect/lab/tree/shared/benber86/Gas%20Profile%20Multi%20Hop.ipynb) again, we can print out gas usage tables for each of the two process.

### Swapping with `exchange` and approvals


<div style="overflow: auto">

| Contract             | Address     | Computation  | Gas    |
|----------------------|-------------|--------------|--------|
| ERC20.vy (USDC)      | 0x42127D... | approve      | 24056  |
| CurveStableSwapNG.vy | 0x393DfC... | exchange     | 103973 |
| ERC20.vy (USDC)      | 0x42127D... | balanceOf    | 3      |
| ERC20.vy (USDC)      | 0x42127D... | transferFrom | -15010 |
| ERC20.vy (WETH)      | 0xBD228f... | transfer     | 26355  |
| ERC20.vy (WETH)      | 0xBD228f... | approve      | 24056  |
| CurveStableSwapNG.vy | 0xE67e0E... | exchange     | 75569  |
| ERC20.vy (WETH)      | 0xBD228f... | balanceOf    | 3      |
| ERC20.vy (WETH)      | 0xBD228f... | transferFrom | -36910 |
| ERC20.vy (CRV)       | 0x548b13... | transfer     | 6455   |
| **Total**                |             |              | **208550** |

</div>


Here `transferFrom` again results in gas refunds as it clears the allowance storage (-15k), and in the case of WETH, the balance storage slot as well (another -15k, since we swap all the WETH received, the balance goes to 0).
However this does not fully offset the added costs of the approvals and additional transfers.

### Swapping with `exchange_received`


<div style="overflow: auto">

| Contract             | Address       | Computation         | Gas     |
|----------------------| ------------- | ------------------- | ------- |
| ERC20.vy (USDC)      | 0x42127D...   | transfer            | 6455    |
| CurveStableSwapNG.vy | 0x393DfC...   | exchange_received   | 78819   |
| ERC20.vy (USDC)      | 0x42127D...   | balanceOf             | 3       |
| ERC20.vy (WETH)      | 0xBD228f...   | transfer            | 6455    |
| CurveStableSwapNG.vy | 0xE67e0E...   | exchange_received   | 72327   |
| ERC20.vy (WETH)      | 0xBD228f...   | balanceOf             | 3       |
| ERC20.vy (CRV)       | 0x548b13...   | transfer            | 6455    |
| **Total**            |               |                     | **170517**  |

</div>

With `exchange_received`, we save on approvals, extra transfer and the swap operation itself for a total of 38k gas savings compared to `exchange`.



## Caveat

There are significant risks associated with the new function. 
An incorrect implementation can lead to funds being stolen from the pool as  `exchange_received` can be invoked by any user. 
The contract does not distinguish between addresses that have sent tokens to the pool.
It merely uses the available extra balance to execute the swap, regardless of the origin of the surplus (more explanations on the inner workings of the function are available below).

For instance, if ALICE manually transfers tokens into the AMM and fails to immediately call `exchange_received`, BOB could potentially "frontrun" her. 
He could execute the function before she does, using her tokens for his exchange!

To mitigate this risk, the transfer of tokens and the execution of the `exchange_received` function must occur within the same transaction.
This is best achieved by using a proxy contract that will batch both operations together or by grouping the transactions in a [bundle](https://docs.flashbots.net/flashbots-mev-share/searchers/understanding-bundles).

This also means that if a user mistakenly sends the pools tokens, it is possible for anyone to retrieve those tokens using `exchange_received`.

## How does `exchange_received` work under the hood?

To understand the mechanics behind the `exchange_received` function and its approach to handling transfers, it's essential to initially explore the operational fundamentals of exchanges within Curve pools.

The `exchange_received` function handles the exchange of two coins within an AMM, much like the standard `exchange` function.
In fact, both functions share almost the same logic. 
Looking at the NG pool's [reference implementation](https://github.com/curvefi/stableswap-ng/blob/ec972b331da21d919f78943e00bf9398970eca54/contracts/main/CurveStableSwapNG.vy), we can indeed see that both functions call the same internal `_exchange` function under the hood.
The only difference is the last argument passed to `_exchange`. 
Named `expect_optimistic_transfer`, the argument is set to _True_ for `exchange_received` and _False_ for `exchange`:

Below is the code for `exchange_received`:

{{< highlight python "linenos=true, hl_lines=33">}}
@external
@nonreentrant('lock')
def exchange_received(
    i: int128,
    j: int128,
    _dx: uint256,
    _min_dy: uint256,
    _receiver: address = msg.sender,
) -> uint256:
    """
    @notice Perform an exchange between two coins without transferring token in
    @dev The contract swaps tokens based on a change in balance of coin[i]. The
        dx = ERC20(coin[i]).balanceOf(self) - self.stored_balances[i]. Users of
        this method are dex aggregators, arbitrageurs, or other users who do not
        wish to grant approvals to the contract: they would instead send tokens
        directly to the contract and call `exchange_received`.
        Note: This is disabled if pool contains rebasing tokens.
    @param i Index value for the coin to send
    @param j Index value of the coin to receive
    @param _dx Amount of `i` being exchanged
    @param _min_dy Minimum amount of `j` to receive
    @param _receiver Address that receives `j`
    @return Actual amount of `j` received
    """
    assert not pool_contains_rebasing_tokens  # dev: exchange_received not supported if pool contains rebasing tokens
    return self._exchange(
        msg.sender,
        i,
        j,
        _dx,
        _min_dy,
        _receiver,
        True,  # <--------------------------------------- swap optimistically.
    )
{{< / highlight >}}

And for the standard `exchange`:

{{< highlight python "linenos=true, hl_lines=27">}}
@external
@nonreentrant('lock')
def exchange(
    i: int128,
    j: int128,
    _dx: uint256,
    _min_dy: uint256,
    _receiver: address = msg.sender,
) -> uint256:
    """
    @notice Perform an exchange between two coins
    @dev Index values can be found via the `coins` public getter method
    @param i Index value for the coin to send
    @param j Index value of the coin to receive
    @param _dx Amount of `i` being exchanged
    @param _min_dy Minimum amount of `j` to receive
    @param _receiver Address that receives `j`
    @return Actual amount of `j` received
    """
    return self._exchange(
        msg.sender,
        i,
        j,
        _dx,
        _min_dy,
        _receiver,
        False
    )
{{< / highlight >}}


Within the internal `_exchange` function, the `expect_optimistic_transfer` argument is passed on to another internal function, `_transfer_in`.
The remaining logic is identical whether the user called `exchange` or `exchange_received`:


{{< highlight python "linenos=true, hl_lines=26">}}
@internal
def _exchange(
    sender: address,
    i: int128,
    j: int128,
    _dx: uint256,
    _min_dy: uint256,
    receiver: address,
    expect_optimistic_transfer: bool
) -> uint256:

    assert i != j  # dev: coin index out of range
    assert _dx > 0  # dev: do not exchange 0 coins

    rates: DynArray[uint256, MAX_COINS] = self._stored_rates()
    old_balances: DynArray[uint256, MAX_COINS] = self._balances()
    xp: DynArray[uint256, MAX_COINS] = self._xp_mem(rates, old_balances)

    # --------------------------- Do Transfer in -----------------------------

    # `dx` is whatever the pool received after ERC20 transfer:
    dx: uint256 = self._transfer_in(
        i,
        _dx,
        sender,
        expect_optimistic_transfer
    )

    # ------------------------------- Exchange -------------------------------

    x: uint256 = xp[i] + unsafe_div(dx * rates[i], PRECISION)
    dy: uint256 = self.__exchange(x, xp, rates, i, j)
    assert dy >= _min_dy, "Exchange resulted in fewer coins than expected"

    # --------------------------- Do Transfer out ----------------------------

    self._transfer_out(j, dy, receiver)

    # ------------------------------------------------------------------------

    log TokenExchange(msg.sender, i, dx, j, dy)

    return dy
{{< / highlight >}}


The `_transfer_in` function is thus where the action takes place, marking the divergence point between the two types of exchange functions — `exchange_received` and the standard `exchange`:

{{< highlight python "linenos=true, hl_lines=16 22-23 27-32">}}
@internal
def _transfer_in(
    coin_idx: int128,
    dx: uint256,
    sender: address,
    expect_optimistic_transfer: bool,
) -> uint256:
    """
    @notice Contains all logic to handle ERC20 token transfers.
    @param coin_idx Index of the coin to transfer in.
    @param dx amount of `_coin` to transfer into the pool.
    @param sender address to transfer `_coin` from.
    @param receiver address to transfer `_coin` to.
    @param expect_optimistic_transfer True if contract expects an optimistic coin transfer
    """
    _dx: uint256 = ERC20(coins[coin_idx]).balanceOf(self)

    # ------------------------- Handle Transfers -----------------------------

    if expect_optimistic_transfer:

        _dx = _dx - self.stored_balances[coin_idx]
        assert _dx >= dx

    else:

        assert dx > 0  # dev : do not transferFrom 0 tokens into the pool
        assert ERC20(coins[coin_idx]).transferFrom(
            sender, self, dx, default_return_value=True
        )

        _dx = ERC20(coins[coin_idx]).balanceOf(self) - _dx

    # --------------------------- Store transferred in amount ---------------------------

    self.stored_balances[coin_idx] += _dx

    return _dx
{{< / highlight >}}

The function starts by storing the pool's current balance of the coin being swapped into a variable `_dx`.
The logic then branches depending on whether `expect_optimistic_transfer` is `True` -- meaning the user called `exchange_received` -- or `False` -- meaning the user used the standard `exchange`.

### Transfer logic with `exchange_received` (`expect_optimistic_transfer==True`)

If the user used `exchange_received`, the function deducts the value of `stored_balances[coin_idx]` from the pool's current balance of the coin. 
The `stored_balances` variable is used for the pool's internal accounting.
It only records tokens that were transfered to or withdrawn from the pool through the standard `exchange` (or `exchange_underlying`) functions or via liquidity additions and removals.
It also keeps track of the fees accumulated by the pool and that will later be withdrawn and redistributed to veCRV holders.

In effect, `stored_balances` is thus equal to the pool's liquidity reserves plus the pool's admin fees pending withdrawal.
When we access `stored_balances[0]`, then, we get the amount of coin 0 liquidity plus the amount of fees accrued in coin 0.
By contrast when we call `balanceOf(pool_address)` on coin 0's contract, we get the total amount of coin 0 tokens in the pool.

Those two values are not always equivalent, if someone directly transfers tokens into the pool without adding liquidity or swapping, then `coin0.balanceOf(pool_address)` will be greater than `stored_balances[0]`.
Therefore, when we substract `stored_balances` from `_dx` (the pool's total token balance), we get the amount of "surplus" tokens in the pool, _i.e._ tokens transfered before `exchange_received` was called (or mistakenly sent to the pool at some point).
This "surplus" is then what is used to execute the swap.

This critical distinction between `stored_balances` and `balanceOf` underpins the functionality of exchange_received. 
To better understand it, [this notebook](https://try.vyperlang.org/hub/user-redirect/lab/tree/shared/mo-anon/stored_balances.ipynb) showcases how each changes during the execution of an `exchange_received` trade.

### Transfer logic with `exchange` (`expect_optimistic_transfer==False`)

For the standard exchange function that does not expect optimistic transfers, the function enforces an explicit transfer to the pool using `transferFrom`. 
The use of `transferFrom` here is why the pool needs prior approval, as the contract would not be allowed to withdraw from the user's wallet if the wallet hadn't previously allowed it to do so with an approval.

The contract then deducts the pool's token balance prior to `transferFrom` from its current token balance, ensuring that the pool only swaps the amount of tokens it received.
This is more secure than reusing the `dx` value that was passed to `transferFrom` as there is no guarantee that the amount received by the pool will match this argument (a token could impose a tax on transfers for instance, and only return a certain percentage of the specified `dx`).

Finally, the value of `_dx`, _i.e._ the amount of input token to swap, is added to the pool's `stored_balances` before the rest of the swap logic is executed. 

