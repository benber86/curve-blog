---
title: "How to Do Cheaper, Approval-Free Swaps"
draft: false
date: 2024-03-19T09:25:45.000Z
ogimage: "/images/ng-mev/thumbnail.png"
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

_Authors:_ [mo](#)

## **Summary**

- NG Pools come with a new swap method, `exchange_received`, which allows users to trade based on the changes in balance within the pool.
- This can be used to do swaps without giving the contract approval and to reduce the amount of transfers during composite trades.
- Funds sent to the pool must be spent through `exchange_received` in the same transaction or run the risk of being appropriated by a third party.
- The method can potentially be used to recover tokens that were mistakenly sent to the pool


## **Introduction**


The `exchange_received` function introduces a novel approach to exchanging tokens based on balance changes within AMMs, rather than the traditional method based on the transfer of tokens within the same function call. 
This apporach is particularly targeted at DEX aggregators or arbitrageurs, as it presents two considerable advantages. 
First, the function eliminates the need for granting approval to the AMM contract, reducing gas costs, or, for users usually giving unlimited approvals, drastically reducing the risk of having their funds stolen if the contract were ever to be compromised.
Second, for any transaction involving multiple swaps across several pools, the transaction can eliminate one or more ERC-20 transfers, again significantly reducing gas costs.
The function is available for all new generation (ng) pools of Curve, including[Twocrypto-ng](https://github.com/curvefi/twocrypto-ng) pools and [Stableswap-ng pools](https://github.com/curvefi/stableswap-ng) (except for rebasing tokens and underlying trades on metapools).

full example: https://try.vyperlang.org/user/mo-anon/lab/tree/hop_exchange_received.ipynb


For stableswap pools, this function is not enabled for pools containing rebasing tokens. The function also does not work on underlying tokens of metapools. its only possible to swap the metapool token for the lp token paired against it using this method.


<script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>
<script type="text/javascript" src="../../js/exchange-received/vis.animateTraffic.js"></script>
<script src="../../js/exchange-received/flowchart.js"></script>
  <style>
    #graph {
      width: 100%;
      height: 400px;
      border: 1px solid lightgrey;
    }
    .controls {
      margin-top: 10px;
      margin-bottom: 20px;
      text-align: center;
    }
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
  </style>


<div id="graph"></div>
<div id="subtitle" class="subtitle"></div>
<div class="controls">
  <button id="prevButton">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/></svg>
  </button>
  <span id="stepCounter"></span>
  <button id="nextButton">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="control"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/></svg>
</button>
  <button id="playPauseButton">
    <svg id="playIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="control">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
    </svg>
  <svg id="pauseIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="display: none;" class="control">
<path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
</button>
</div>



---


## **How do Exchanges within Curve pools work?**

To grasp the mechanics behind the `exchange_received` function and its approach to handling transfers, it's essential to initially explore the operational fundamentals of exchanges within Curve pools.

The `exchange_received` function handles the exchange of two coins within an AMM, without the function itself initiating the transfer of tokens into the AMM. Unlike the standard `exchange` function, where the token transfer is an integrated part of the exchange process, requiring a transfer (and a prior grant of approval) within the same function call, `exchange_received` relies on tokens already being transferred into the AMM using the token's native `transfer` or `transferFrom` methods.


The process is anchored by three principal functions:

*For the sake of showcasing `exchange_received`, we will mainly focus on the `_transfer_in` function.*

- *`exchange` or `exchange_underlying`*: These functions necessitate standard input values such as the input token `i`, output token `j`, the swap amount `_dx`, the minimum expected amount `_min_dy`, and the recipient `_receiver` of the output tokens. These inputs are then passed further along to `_exchange()`.

  An additional parameter, `expect_optimistic_transfer`, is also relayed, signifying the anticipation of an optimistic transfer – `False` for `exchange`, `True` for `exchange_underlying`.

  ???quote "*`exchange`*"

        ```py hl_lines="27"
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
        ```


    ???quote "*`exchange_recived`*"

        ```py hl_lines="33"
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
        ```

- *`_exchange`*: This function facilitates the exchange of tokens within an AMM by transferring tokens in, performing the exchange based on current rates and balances, and then transferring the output tokens to the receiver.

  ???quote "*`_exchange`*"

        ```py
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
        ```

- *`__exchange`*: This function handles the core logic for executing token exchanges. It calculates the output amount (`dy`) and manages fees. An in-depth exploration of its workings is beyond the scope of this article.

  ???quote "*`__exchange`*"

        ```py
        @internal
        def __exchange(
            x: uint256,
            _xp: DynArray[uint256, MAX_COINS],
            rates: DynArray[uint256, MAX_COINS],
            i: int128,
            j: int128,
        ) -> uint256:

            amp: uint256 = self._A()
            D: uint256 = self.get_D(_xp, amp)
            y: uint256 = self.get_y(i, j, x, _xp, amp, D)

            dy: uint256 = _xp[j] - y - 1  # -1 just in case there were some rounding errors
            dy_fee: uint256 = unsafe_div(
                dy * self._dynamic_fee(
                    unsafe_div(_xp[i] + x, 2), unsafe_div(_xp[j] + y, 2), self.fee
                ),
                FEE_DENOMINATOR
            )

            # Convert all to real units
            dy = (dy - dy_fee) * PRECISION / rates[j]

            self.admin_balances[j] += unsafe_div(
                unsafe_div(dy_fee * admin_fee, FEE_DENOMINATOR) * PRECISION,
                rates[j]
            )

            # Calculate and store state prices:
            xp: DynArray[uint256, MAX_COINS] = _xp
            xp[i] = x
            xp[j] = y
            # D is not changed because we did not apply a fee
            self.upkeep_oracles(xp, amp, D)

            return dy
        ```


---


*The AMM utilizes an internal method, `_transfer_in`, to manage token transfers into the contract, marking the divergence point between the two types of exchange functions — `exchange_received` and the standard `exchange`. Aside from this distinction, the remainder of the exchange process remains consistent across both functions.*


## **Understanding `_transfer_in`**

The `_transfer_in` function is crucial for handling ERC20 token transfers into the pool, with its behavior adjusted based on whether an optimistic token transfer (`expect_optimistic_transfer`) is expected. For transactions calling `exchange_received`, which anticipates optimistic transfers (`expect_optimistic_transfer == True`), the function calculates the transferred amount (_dx) by comparing the current pool's balance (`balanceOf`) and the internally stored balance (`stored_balances(coin)`) for the coin. This mechanism bypasses the need for a traditional token transfer within the same call, relying instead on tokens being transfered into the contract prior and outside the specific exchange function call.

Conversely, for the standard exchange function that does not expect optimistic transfers, the function enforces an explicit transfer to the pool using `transferFrom`. It asserts that the amount to be transferred (dx) is greater than zero to prevent pointless transactions.

In summary, the key difference lies in how token transfers are validated: `exchange_received` leverages an optimistic approach based on balance changes for efficiency and flexibility, while the regular exchange method relies on explicit, conventional token transfers.

| Input                         | Type      | Description                                                       |
| ----------------------------- | --------- | ----------------------------------------------------------------- |
| `coin_idx`                    | `int128`  | The index of the coin to be transferred in, corresponding to `i` in `exchange`. |
| `dx`                          | `uint256` | The quantity of the input coin to transfer in.                    |
| `sender`                      | `address` | The address from which the coins are transferred.                 |
| `expect_optimistic_transfer`  | `bool`    | Indicates whether an optimistic transfer is anticipated (`True` for yes, `False` for no). |


---

### Transfer logic with regular transfers

*First, let's delve into the logic applied during a regular exchange. In this scenario, `expect_optimistic_transfer` is set to False, indicating that a standard transfer is anticipated, rather than an optimistic one.*


???quote "Transfer logic with regular transfers"

    ```py hl_lines="16 25-38"
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
    ```

First, the total token balance (`balanceOf`) of the input token (`coin_idx`) is stored in a new variable named `_dx`. The code checks if `dx > 0`[^2], as a zero-value transfer is not permitted, before proceeding to execute the transfer via `transferFrom`. A successful transfer returns `True`, ensuring the assertion passed.

[^2]: `dx` represents the amount designated for exchange, as provided in the `exchange` function.

Subsequently, the previously specified `_dx` storage is updated to reflect the difference between the new balance of the pool (`ERC20(coins[coin_idx]).balanceOf(self)`) and its former balance (`_dx`). This difference accurately represents the quantity of tokens being transfered in and exchanged.

The process concludes with an update to the `stored_balances` of the input token by augmenting it with the newly determined `_dx`.



---

### Transfer logic when expecting an optimistic transfer

*Now, let's examine the transfer logic when utilizing `exchange_received`:[^3]*

[^3]: Here, `expect_optimistic_transfer` is set to `True`, indicating the anticipation of an optimistic transfer.


???quote "Transfer logic when expecting an optimistic transfer"

    ```py hl_lines="16 20-23 36-38"
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
    ```

Again, `_dx` is set as the total amount of the input token (`balanceOf`) present in the pool.

In this scenario, **no tokens are transferred into the pool**. The procedure involves a mere evaluation of `stored_balances(coin_idx)` and deducting this value from `_dx`. The outcome is then recorded by reassigning it to `_dx`. For safety purposes, the code verifies if `_dx >= dx` to ensure that an adequate quantity of tokens has been transferred into the pool. If not, it signifies that the pool has not received enough tokens.

Even though the user specifies `dx` when calling `exchange_received`, the function always uses the full difference of the balances. E.g. if Alice transfered in 100 tokens and calls the function with a input value of 50 for `dx`, the function will still use all 100 tokens to swap. todo: reason for this is...?

todo: wouldnt it make sense to just use 1 (smallest possible value; reverts if 0 is used.) as dx input when calling `exchange_received`, so this assert is true for most of the time?


---


### `stored_balances`

`stored_balances` acts as internal accounting system for the AMM, acknowledging token transfers only via `_transfer_in` and `_transfer_out` methods. It does not recognize direct tokens transfered to the AMM through the standard `transfer` or `transferFrom` methods. Due to this behavior, the critical distinction between `stored_balances` and `balanceOf` underpins the functionality of exchange_received.

Here is a hosted jupyter notebooks to showcase the workings around it: https://try.vyperlang.org/user/mo-anon/lab/tree/stored_balances.ipynb


---


## Dangers

There are significant dangers associated with the new function. Incorrect implementation can lead to funds being stolen from the pool. This vulnerability arises because `exchange_received` can be invoked by any user. The contract does not distinguish between addresses that have sent tokens to the pool. If ALICE manually transfers tokens into the AMM and fails to immediately call `exchange_received`, BOB could potentially "frontrun" her. He could execute the function before she does, using her tokens for his exchange!

To mitigate this risk, the transfer of tokens and the execution of the `exchange_received` function must occur within the same transaction.




## But what does this all mean? What are the benefits?

`Exchange_received` offers significant advantages by reducing smart contract risks and eliminating unnecessary ERC20 transfers in multi-step transactions.

Firstly, `exchange_received` obviates the need for smart contract approval for token exchanges, a critical factor for third-party integrators aiming to minimize smart contract risks within their systems.

Secondly, it decreases the overall gas fees for transactions involving multiple "hops" in token exchanges. For instance, consider a user wanting to sell GOV tokens for crvUSD. Typically, since most GOV tokens are paired against ETH, the transaction would involve converting GOV to ETH, followed by ETH to crvUSD, entailing several steps:


1. Transfer GOV to pool1 and exchange for ETH.
2. Transfer ETH out of pool1.
3. Transfer ETH into pool2.
4. Transfer crvUSD out of pool2.

https://try.vyperlang.org/user/mo-anon/lab/tree/hop_exchange_received.ipynb

Such a transaction would necessitate a total of 4 ERC-20 transfers. However, with `exchange_received`, transfers 2 and 3 can be consolidated into a single action by directly transferring ETH from pool1 to pool2, thereby streamlining the process.