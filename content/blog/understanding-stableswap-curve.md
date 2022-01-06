---
layout: blog-post
title: Understanding StableSwap (Curve)
type: blog
tag: [blockchain, stableswap, curve, exchange, algorithm]
description: Understanind the Curve exchange StableSwap algorithm.
date: 2021-07-17T00:00:00-00:00
draft: false
---
*Disclaimer: These are my notes on learning about StableSwap and may contain errors. Please do you own research and cite the official whitepaper.*

## Intro

[StableSwap](https://curve.fi/files/stableswap-paper.pdf) is an autonomous market-maker (AMM) for stablecoins.

The StableSwap AMM aims to provide low slippage and low fees when trading stablecoins (such as USDC, DAI, USDT, etc).

A starting point for understanding the StableSwap protocol is to look at a simple linear invariant and existing AMMs like [Uniswap](https://uniswap.org/whitepaper.pdf) since the StableSwap bonding curve is a more sophisticated combination of these curves.

> Note: The StableSwap protocol was rebranded to [Curve](https://curve.fi/) Finance after the StableSwap whitepaper was published. I'll be referring to Curve as StableSwap to be consistent with the whitepaper throughout this article.

## Linear invariant

A linear invariant algorithm is described as:

$$x + y = C$$

where \\(x\\) and \\(y\\) are pooled tokens and \\(C\\) is the invariant.

The invariant stays constant and doesn't change.

The \\(x + y = C\\) formula is known as the **constant sum formula**.

Solving for \\(y\\) to get the equation for the curve:

> \\(x + y = C\\)

> \\(y = C - x\\)

The constant sum formula is a linear straight line when graphed.

<div class="chart" id="chart-constant-sum-1"></div>

Let's go over some simple examples. First calculate constant if there are 100 `X` tokens and 100 `Y` tokens:

> \\(x + y = C\\)

> \\(x = 100\\)

> \\(y = 100\\)

> \\(100 + 100 = C\\)

> \\(C = 200\\)

The constant is \\(200\\).

If Alice wants to sell 25 `X` tokens, how many `Y` tokens would she receive?

Alice selling tokens means there will be more of that token added to the pool.

Since the constant must remain the same, we have to solve for `Y`:

> \\((x + 25) + y = C\\)

> \\((100 + 25) + y = 200\\)

> \\(125 + y = 200\\)

> \\(y = 200 - 125\\)

> \\(y = 75\\)

The number of `Y` tokens _after_ the trade will be 75 which means we need to
take the difference of `Y` before the swap minus `Y` after the swap to calculate how many Alice should receive.

> \\(receiveY = beforeY - afterY\\)

> \\(receiveY = 100 - 75\\)

> \\(receiveY = 25\\)

Alice will receive 25 `Y` tokens if she sells 25 `X` tokens.

The pools are now 125 `X` tokens and 75 `Y` tokens.

To calculate the price will do:

$${P} = \frac{\Delta y}{\Delta x}$$

where \\({\Delta y}\\) is how much was _withdrawn_ and \\({\Delta x}\\) is how much was _deposited_.

> \\(price = receivedY / depositedX\\)

> \\(price = 25 / 25\\)

> \\(price = 1\\)

The rate was exactly `1`.

1 `X` token for 1 `Y` token.

Taking the derivative to graph tangent:

> \\(y = C - x\\)

> \\(y' = (-1)(x)^1\\)

> \\(y' = (1)(-1)(x)^{1-1}\\)

> \\(y' = (-1)(x)^0\\)

> \\(y' = -x^0\\)

> \\(y' = -1\\)

Moving the mouse over the graph line shows the price at X and Y:

<div class="chart" id="chart-constant-sum-2"></div>

Where pool is equally balanced, like at _(50, 50)_, the price is exactly 1.

If Alice does another trade, what price will she get this time?

With a constant sum formula, **the price will always remain the same regardless of the balances in the pools**.

There is **zero slippage** with the linear invariant. Zero slippage is also called **infinite leverage**.

The pool currently has 125 `X` tokens and 75 `Y` tokens.

If Alice sells 75 `X` tokens, then Alice receives 75 `Y` tokens.

The pool now has 200 `X` tokens and 0 `Y` tokens.

With a constant sum formula, the price stays constant but the **pools can be drained completely**.

## Uniswap AMM

The Uniswap AMM algorithm can be described as:

$$x * y = k$$

where \\(x\\) and \\(y\\) are pooled tokens and \\(k\\) is the invariant.

The invariant \\(k\\) is the product of multiplying \\(x\\) and \\(y\\).

The invariant \\(k\\) is the constant price.

The formula \\(x * y = k\\) is known as the **constant product formula**.

Solving for \\(y\\) to get the equation for the curve:

> \\(x + y = k\\)

> \\(y = k / x\\)

This is what the Uniswap constant product formula curve looks like if x=10 and y=10:

<div class="chart" id="chart-constant-product-1"></div>

With the Uniswap AMM, the pool auto-adjusts the price ensuring that there is always liquidity.

For example,

if there are 100 `X` tokens and 100 `Y` tokens,

then \\(k\\) is calculated:

> \\(x * y = k\\)

> \\(100 * 100 = k\\)

> \\(k = 10,000\\)

\\(k\\) is \\(10{,}000\\) or \\(1 * 10^4\\)

If Alice wants to buy 20 `Y` tokens, how many `X` tokens does she need to deposit into the pool?

Since 10,000 is constant, then removing 20 `Y` tokens from the pool means there'll be
80 `Y` tokens

> \\(x * (y - 20) = k\\)

> \\(x * (100 - 20) = 10000\\)

> \\(x * 80 = 10000\\)

> \\(x = 10000 / 80\\)

> \\(x = 125\\)

This means that `X` tokens need to go up from 100 to 125 to preserve k.

The difference between 125 (after swap) and 100 (before swap) is 25

Alice needs to deposit 25 `X` tokens to receive 20 `Y` tokens

Calculate the price:

> \\(P = \frac{\Delta y}{\Delta x}\\)

> \\(P = 20 / 25\\)

> \\(P = 0.8\\)

1 `Y` token costs 0.8 `X` tokens.

If Alice does a subsequent trade of 25 `X` tokens for `Y`:

> \\(x * y = k\\)

> \\((x + 25) * y = k\\)

> \\((120 + 25) * y = 10000\\)

> \\(145 * y = 10000\\)

> \\(y = 10000 / 145\\)

> \\(y = 68.96551724137932\\)

The new Y is \\(68.96551724137932\\) so the delta is:

> \\(deltaY = newY - oldY\\)

> \\(deltaY = 80 - 68.96551724137932\\)

> \\(deltaY = 11.034482758620683\\)

so Alice will receive \\(11.034482758620683\\) `Y` tokens for 25 `X` tokens.

The price is calculated:

> \\(P = 11.034482758620683 / 25\\)

> \\(P = 0.44137931034482736\\)

1 `Y` token costs \\(0.44137931034482736\\) `X` tokens

There were more X tokens in the pool (X supply increased) due to the first trade, so the cost for a Y token (Y supply decreased) became more expensive for \\(k\\) to remain the same.

The price is adjusted automatically after each trade.

The delta change \\(\frac{\Delta y}{\Delta x}\\) (or dy / dx), is the slope (rise over run), also known as _gradient_, of the curve.

$$\frac{\Delta y}{\Delta x} = slope$$

Taking the derivative:

> \\(y = k / x\\)

> \\(y' = k(x)^{-1}\\)

> \\(y' = -k(x)^{-2}\\)

> \\(y' = \frac{-k}{x^2}\\)

Move the mouse over the line graph to see the Price (Y/X) as the tangent (red line).

<div class="chart" id="chart-constant-product-2"></div>

If more `X` tokens keep being deposited due to `X` token trades, then there will be more `Y` tokens withdrawn from the pool, therefore, lowering the Y token supply.

- A shallow tangent (more horizontal), means less Y for X tokens (because Y is more expensive due to lower supply)
- A steeper tangent (more vertical), means more Y for X tokens (because Y is cheaper due to more supply)

In an order book, the more we buy a token, then the more we travel up the curve. The price and volume are set by each trader.

In AMM, the _xy=k_ equation and depth of the pool determine the slippage.

If Alice sold 50 `X` tokens initially (instead of two separate 25 X tokens and 25 X tokens sells)

> \\(x * y = k\\)

> \\((x + 50) * y = k\\)

> \\((100 + 50) * y = 10000\\)

> \\(150 * y = 10000\\)

> \\(Y = 1000 / 150\\)

> \\(Y = 66.66666666666667\\)

Calculate \\(receiveY\\):

> \\(receiveY = newY - oldY\)

> \\(receiveY = 100 - 66.66666666666667\\)

> \\(receiveY = 33.33333333333333\\)

Alice would receive \\(33.33333333333333\\) `Y` tokens for selling 50 `X` tokens.

Calculate rate:

> \\(P = dy/dx\\)

> \\(P = 33.33333333333333 / 50\\)

> \\(P = 0.6666666666666665\\)

The rate is 0.6666666666666665 X token for 1 Y token.

In previous first and second trades, Alice had the rate of `0.8` and `0.44137931034482736` respectively.

If Alice did a single trade instead of the two separate trades, then the price Alice would pay for the tokens is an average between the first and second trades.

> \\(P = (0.8 + 0.44137931034482736) / 2\\)

> \\(P = 0.6206896551724137\\)

The price Alice paid per token is closely the same as when she did two consecutive trades because the price is determined by the curve.

Finding the slippage means comparing the price before and after the trade.

Arbitrage is important for keeping equilibrium.

When the price of `X` increases, then the `Y` price decreases.

Arbitrageurs will buy X in another market and sell to the pool, receiving more Y tokens.

It becomes very expensive to drain a pool because token A becomes exponentially more expensive.

As supply decreases near to 0, the price goes up exponentially, traveling up the xy=k curve.

## StableSwap

Linear invariants that have no slippage, such as \\(\sum_{i=1}^n x_i = C\\), are not ideal because the pool can run out of tokens or make the pool very unbalanced.

The constant product invariant such as \\(\prod_{i=1}^n x_i = k\\) is self-regulating however it makes it expensive to bring the pool out of balance.

The StableSwap AMM algorithm combines \\(x * y = k\\) and \\(x + y = C\\).

The StableSwap compromise is that the pool can slide up or down the \\(x+y=k\\) curve only when pools are pretty balanced and the price is stable around \\($1\\) value.

When pools become unbalanced then the invariant becomes a product invariant instead of the sum invariant, therefore swapping then becomes expensive like an \\(x * y = k\\) exchange.

StableSwap AMM pools have multiple stablecoins together, such as USDC, DAI, USDT,
so the formula looks more like \\(x * y * z = k\\) and \\(x + y + z = C\\).

The StableSwap protocol combines the sum invariant \\(\sum x_i = D\\) with the product invariant \\(\prod x_i = \left(\frac{d}{n}\right)^n\\) of stablecoins where \\(D\\) is the total number of coins when they have an equal price.

The constant sum formula is generalized to use any \\(n\\) number of tokens.

$$\displaystyle\sum_{i=1}^n x_i = C$$

The constant product formula is generalized to use any \\(n\\) number of tokens.

$$\displaystyle\prod_{i=1}^n x_i = k$$

Combining the two formulas becomes:

$$\displaystyle\sum_{i=1}^n x_i + \displaystyle\prod_{i=1}^n x_i = C$$

For example,

for a USDC + DAI pool:

$$USDC + DAI = 100M$$

and

$$USDC * DAI = \left(\frac{100M}{2}\right)^2$$

Adding the two equations become:

$$(USDC + DAI) + (USDC * DAI) = 100M + \left(\frac{100M}{2}\right)^2$$

Generalized as:

$$(x + y) + (x * y) = D + \left(\frac{D}{n}\right)^n$$

where \\(n = 2\\) since there are two tokens, \\(x\\) and \\(y\\).

Solving for \\(y\\) to get the equation for the curve:

> \\(x + y + x * y = D + (D / n)^n\\)

> \\(x + y + x * y = D + (D^n / n^n)\\)

> \\(y + x * y = D + D^n n^{-n} -x\\)

> \\(y (1 + x) = D + D^n n^{-n} -x\\)

> \\(y = \frac{D + D^n n^{-1} -x}{1 + x}\\)

> \\(y = (1 + x)^{-1} (D + D^n n^{-n} -x)\\)

Taking the derivative to graph tangent:

> \\(y = (1 + x)^{-1} (D + D^n n^{-n} -x)\\)

> \\(y' = (1 + x)^{-1} (0 + 0 - 1) + (D + D^n n^{-n} - x) (-1 (1 + x)^{-2})\\)

> \\(y' = -1(1 + x)^{-1} + -(D + D^n n^{-n} - x) (1 + x)^{-2}\\)

> \\(y' = -(1 + x)^{-1} [1 + (D + D^n n^{-n} - x) (1 + x)^{-1}]\\)

> \\(y' = -(1 + x)^{-1} [1 + (D + D^n n^{-n} - x) (1 + x)^{-1}]\\)

Graphing the equation:

<div class="chart" id="chart-stableswap-1"></div>

The graph looks almost identical to the \\(x * y = k\\) graph. This is because the sum invariant is not amplified.

A multiple for the constant sum formula will make the curve more effective. The sum invariants need to be multiplied by a factor of \\(\chi\\).

$$\chi(x + y) + (x * y) = \chi D + \left(\frac{D}{n}\right)^n$$

The multiplier \\(\chi\\) will magnify the low slippage portion of the equation. This will amplify the bonding curve giving more importance to the low slippage side.

Increase the \\(\chi\\) multiplier and the bonding curve will become more linear.

Solving for \\(y\\) to get the equation for the curve:

> \\(\chi(x + y) + (x * y) = \chi D + \left(\frac{D}{n}\right)^n\\)

> \\(\chi x + \chi y + x * y = \chi D + \left(\frac{D}{n}\right)^n\\)

> \\(\chi y + x * y = \chi D + \left(\frac{D}{n}\right)^n - \chi x\\)

> \\(y(\chi + x) = \chi D + \left(\frac{D}{n}\right)^n - \chi x\\)

> \\(y = (\chi D + \left(\frac{D}{n}\right)^n - \chi x) (\chi + x)^{-1}\\)

Taking the derivative to graph tangent:

> \\(y = (\chi D + D^n n^{-n} -\chi x) (\chi + x)^{-1}\\)

> \\(y' = (\chi D + D^n n^{-n} - \chi x) (-1) (\chi + x)^{-2} + (\chi + x)^{-1} (0 + 0 - \chi)\\)

> \\(y' = -(\chi + x)^{-2} (\chi D + D^n n^{-n} - \chi x) - \chi(\chi + x)^{-1}\\)

> \\(y' = -(\chi + x)^{-1}[\chi + (\chi D + D^n n^{-n} - \chi  x) (\chi + x)^{-1}]\\)

Graphing the equation:

<div class="chart" id="chart-chi"></div>
<div align="center">
  0 <input type="range" id="s" min="0" max="30" step="0.01" value="0"> 30
  <div>
    <label>𝛘 = <span id="s-out"></span></label>
  </div>
</div>

There's infinite leverage as \\(\chi \rightarrow \infty\\).

And zero leverage as \\(\chi \rightarrow 0\\).

Here are the three different invariants we have disccused graphed together; increase \\(\chi\\) to see StableSwap curve flatten like sum invariant and decrease \\(\chi\\) to 0 for curve to be product invariant.

<div class="chart" id="chart-combined"></div>
<div align="center">
  0 <input type="range" id="s2" min="0" max="30" step="0.01" value="1"> 30
  <div>
    <label>𝛘 = <span id="s2-out"></span></label>
  </div>
  0 <input type="range" id="k" min="0" max="10" step="0.1" value="4"> 10
  <div>
    <label>k = <span id="k-out"></span></label>
  </div>
</div>

Ideally the the curve is linear when pools are equally balanced, such as 50M USDC and 50M DAI, so \\(\chi\\) must be a function of the number of X and Y tokens.

 \\(\chi\\) will decrease When pools are out of balance, causing a steeper curve like the product invariant curve.

 \\(\chi\\) will increases When pools are balanced, causing a linear curve like the sum invariant curve with no slippage.

 The sum invariant is multiplied by \\(D\\) to make the leverage factor dimensionless, meaning \\(\chi\\) won't depend on the total number of tokens in the pools or the depth of the pool.

The sum invariant multiplied by \\(D\\) is:

$$D \chi(x + y) = D^n$$

The StableSwap formula becomes:

$$D \chi(x + y) + (x * y) = \chi D^n + \frac{D^n}{n^n}$$

The formula for \\(\chi\\) to be dynamic and adapt to the relative ratio of tokens in the pool:

$$\chi = \frac{Ax * y}{\left(D/n\right)^n}$$

where \\(A\\) is a fixed constant.

The value of \\(\chi\\) in a _balanced_ pool, where x is 50 and y is 50.

$$\chi = \frac{A50 * 50}{\left(100 / 2\right)^2} = A$$

The value of \\(\chi\\) in an _unbalanced_ pool, where X is 10 and Y is 50

$$\chi = \frac{A10 * 50}{\left(60 / 2\right)^2} = 0.5A$$

The value of \\(\chi\\) in an even more unbalanced pool, where X is 5 and Y is 50

$$\chi = \frac{A5 * 50}{\left(55 / 2\right)^2} = 0.33A$$

Here \\(\chi\\) approaches closer to 0 as pools get more unbalanced, and the curve starts looking more like the x*y=k invariant curve.

The amplification coefficient \\(A\\) is a fixed constant and chosen by the StableSwap protocol team.

Substituting \\(\chi\\) into the StableSwap invariant becomes:

$$D \frac{Ax*y}{\left( D /n \right)^n} (x + y) + (x * y) = \frac{ Ax * y}{\left( D / n \right)^n} D^n + \frac{D^n}{n^n}$$

The equation can be simplified:

$$n^nA(x + y) + D = n^nAD+\frac{D^{n+1}}{n^n x*y}$$

The final StableSwap equation:

$$\boxed{An^n\displaystyle\sum x_i + D = ADn^n + \frac{D^{n+1}}{n^n \prod x_i}}$$

<iframe
  width="100%"
  height="725"
  style="border:0;outline:0;margin-top:2rem;"
  src="https://stableswap-graph.netlify.app/?hide-fork-button"></iframe>

## Sources

- [StableSwap - efficient mechanism for Stablecoin liquidity](https://curve.fi/files/stableswap-paper.pdf)
- [Curve Research by Dr. Alvaro Feito Boirac](https://alvarofeito.com/articles/curve)

<div id="chart-container"></div>
<link href="style.css" rel="stylesheet">
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script src="https://unpkg.com/function-plot/dist/function-plot.js"></script>
<script src="main.js"></script>

## Side notes

What this post didn't cover:

- AMM Fees
- LP Tokens
- Price impact
  - I think this is calculated as \\(virtualPrice * depositLpTokenAmount / tokenInputSum\\) where \\(tokenInputSum\\) is the sum of all tokens user is pooling and \\(depositLpTokenAmount\\) is the calculated LP tokens received for pooling input tokens.

Source code:

- Charts
  - The hacky JS is available [here](https://github.com/miguelmota/miguelmota.github.com/blob/master/static/blog/understanding-stableswap-curve/main.js) and [here](https://github.com/miguelmota/stableswap-curve-example/blob/master/main.js)
