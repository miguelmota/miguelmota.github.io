---
layout: blog-post
title: Hop Protocol Explained
type: blog
tag: [blockchain, ethereum, hop, protocol, exchange]
description: Explaining how Hop Protocol on Ethereum works.
date: 2021-08-25T00:00:00-00:00
draft: true

---
[Hop Protocol](https://hop.exchange/) is a scalable rollup-to-rollup general token bridge. It allows users to send tokens from one rollup to another almost immediately without having to wait for the rollup’s challenge period.

Hop was first publicly announced in [ethresear.ch](https://ethresear.ch/t/hop-send-tokens-across-rollups/8581) in January 2021, and went [live](https://twitter.com/HopProtocol/status/1414624873775878148) on July 2021.

This post will attempt to go into detail of how Hop protocol functions and the different roles involved. Reading the original [whitepaper](https://hop.exchange/whitepaper.pdf) is recommended.

## Explain like I'm five

Alice lives in the mainland and needs to send a gift to her friend Bob that lives in a far away island.

Alice just remembered that it's Bob's birthday tomorrow and needs to send the gift as soon as possible. Bob really loves [Twinkies](https://en.wikipedia.org/wiki/Twinkie) and wants a box of twinkies for this birthday because twinkies are not readily available on the island. Alice already has the box ready to gift, but there's a small problem...

This island has no airport for overnight shipping, so the only way to send it is by boat. It takes an entire week for the boat to arrive at the island from the mainland, meaning that the box of twinkies would not arrive in time for Bob's birthday.

Alice has a friend of a friend named Charlotte that also lives on the same island as Bob.    Alice calls Charlotte and asks if she has a spare box of twinkies that Alice can borrow to gift to Bob. Charlottle, being a twinkie fan as well, always keeps a few spare boxes of twinkies in her pantry--and tells Alice she does have some available.

Alice tells Charlotte that she will be re-payed back the full amount of twinkies in a week when the the box of twinkies she shipped by boat arrives at the island. Charlotte agrees to do it but only if she receives an extra twinkie as well in return for her time and effort.

Alice and Charlotte agree to the deal.

The next day on Bob's birthday, Charlotte gives the box of twinkies to Bob on behalf of Alice. Bob is happy to have his favorite snack. Alice is happy Bob received his gift in time. Charlotte is happy she got an extra twinkie.

<img width="700" src="eli5-twinkies.png" />

In this analogy,

- The mainland and islands are rollups
- The boat travel time is the rollup exit period
- Alice is a user transferring assets to another rollup
- Bob is the "bonder" providing liquidity at the destination
- Charlotte is the recipient of the asset at the destination

What all this means exactly is further explained below.

## Explain like I'm a nerd

At a high-level, Hop protocol works by _burning_ tokens at the source chain and _minting_ tokens at the destination chain and using native messaging bridges for relaying messages between Ethereum and Layer-2s.

_Note: For simplicity sake, we'll be using the term "chain" to refer to either an L1 chain (e.g. Ethereum mainnet), a rollup (e.g. Optimism, Arbitrum) or sidechain (e.g. xDai, Polygon) and "Layer-2" to refer to either a rollup or sidechain._

### Minting and burning

A "transfer" of a token between chains occurs when the token is "burned" (destroyed) at the source and then "minted" (created) at the destination.

<img width="500" src="tokens-burn-mint.png" />

The tokens that are minted and burned are referred to as "h-tokens" and these tokens can only be created and burned by the Hop bridge. Each h-token is backed by their canonical token on Layer-1. These h-tokens are an intermediary bridge token that represent a transferred token and can be swapped for their canonical token on the Layer-2 or burned to redeem the underlying asset on Layer-1.

_Note: The "canonical" term is used to refer to the native non-synthetic asset. E.g. USDC on Optimism is the canonical USDC token and sUSDC (synthetic USDC) and  cUSDC (Compound USDC) are non-canonical tokens._

For example, if 10 USDC h-tokens exist on a rollup then there are 10 USDC locked on Layer-1. On Hop, each h-token is named as the canonical token symbol prefixed by an "h" (e.g. "hUSDC", "hUSDT", "hDAI", "hETH", etc).

<img width="500" src="tokens-locked-on-layer1-and-minted-on-layer2.png" />

Anyone can mint h-tokens at on L2 as long as they lock tokens on Layer-1 by sending the canonical tokens using the Hop Bridge on Layer-1.

This is done by calling [`sendToL2`](https://github.com/hop-protocol/contracts/blob/b38e1949b71df4e81e9f4dbb7c3eb740d3625a1e/contracts/bridges/L1_Bridge.sol#L120) on the Layer-1 bridge for the token, specifying the destination `chainId`, `recipient`, and `amount`.

```solidity
function sendToL2(
    uint256 chainId,
    address recipient,
    uint256 amount,
    uint256 amountOutMin,
    uint256 deadline,
    address relayer,
    uint256 relayerFee
)
    external
    payable
{
  ....
}
```

The `amountOutMin`, and `deadline` parameters are for the AMM swap on the destination chain which we'll get to shortly. To receive h-tokens, these should be set to `0`.

The `relayer` and `relayerFee` are optional parameters which can be used for paying any relayer that performs the transfer on your behalf.

For example, making this call will lock 50 USDC tokens and mint 50 hUSDC on Optimism whose [chain ID](https://chainlist.org/) is `10`.

```javascript
hop_USDC_L1_Bridge_Contract.sendToL2(10, '50000000', '0x123456789abcdef123456789abcdef123456789a', 0, 0, '0x0000000000000000000000000000000000000000', 0)
```

The h-tokens are fundamental to Hop for trustless transfers and swaps but it's important to note that end users don't deal with h-tokens directly and they only deal with the respective Layer-2 canonical token.

### Message bridges

Currently Hop only works with Layer-2s that support sending messages natively from the Ethereum mainchain to the Layer-2 and from the Layer-2 to the Ethereum mainchain.

What this means is that sending data across from Ethereum to the Layer-2 can be done trustlessly because there is no trusted broker or mediator involved that connects and relays messages between these chains. The nodes of the Layer-2 network are responsible for verifying events emitted from Layer-1 and invoking the calldata on it's Layer-2.

In Hop, each asset bridge has the concept of a "messenger". A _messenger_ is a contract that initiates the process of relaying the message from Layer-1 to Layer-2 and vice versa.

Each Layer-2 chain has a slightly different interface and way of how the message must be structured so Hop abstracts these differences by having a "messenger wrapper" contract.

For example, the `sendToL2` function on the Layer-1 bridge invokes the `sendCrossDomainMessage` method of the messenger wrapper contract which triggers the message to be sent to the destination chain.

```solidity
messengerWrapper.sendCrossDomainMessage(message);
```

The `message` in this example is the ABI encoded function to invoke at the destintaion bridge contract, which in this case is the `distribute` method and takes in parameters.

```solidity
bytes memory message = abi.encodeWithSignature(
    "distribute(address,uint256,uint256,uint256,address,uint256)",
    recipient,
    amount,
Bonder
    amountOutMin,
    deadline,
    relayer,
    relayerFee
);
```

Each supported chain on Hop (xDai, Polygon, Optimism, Arbitrum) has a custom message wrapper contract that implements the same interface.

For example, here's what the message wrapper on Layer-1 looks like for sending messages to Layer-2 Optimism:

```solidity
function sendCrossDomainMessage(bytes memory _calldata) public override onlyL1Bridge {
    l1MessengerAddress.sendMessage(
        l2BridgeAddress,
        _calldata,
        uint32(defaultGasLimit)
    );
}
```

Getting messages across to Arbitrum is slightly more complicated for example:

```solidity
function sendCrossDomainMessage(bytes memory _calldata) public override onlyL1Bridge {
    arbInbox.createRetryableTicket(
        l2BridgeAddress,
        0,
        0,
        tx.origin,
        address(0),
        100000000000,
        0,
        _calldata
    );
}
```

The common parameters across each Layer-2s message bridges are destination contract address, the encoded payload, and gas limit.

In the context of Hop, the destination address is always the Hop Layer-2 bridge.

The methods on the Hop Layer-2 bridge that are invoked by a message sent from the Hop Layer-1 bridge verify that the sender was the Hop bridge to prevent anyone from triggering messages.

```solidity
modifier onlyL1Bridge {
    _verifySender(l1BridgeCaller);
    _;
}
```

Each message wrapper implements `_verifySender` since each Layer-2 has a slightly different way of verifying the originating sender.

The `distribute` function on the Layer-2 is responsible for minting h-tokens to the recipient.

```solidity
function _distribute(
    address recipient,
    uint256 amount,
    uint256 amountOutMin,
    uint256 deadline,
    address feeRecipient,
    uint256 fee
)
    internal
{
    if (fee > 0) {
        hToken.mint(feeRecipient, fee);
    }
    uint256 amountAfterFee = amount.sub(fee);

    if (amountOutMin == 0 && deadline == 0) {
        hToken.mint(recipient, amountAfterFee);
    } else {
        hToken.mint(address(this), amountAfterFee);
        hToken.approve(address(ammWrapper), amountAfterFee);
        ammWrapper.attemptSwap(recipient, amountAfterFee, amountOutMin, deadline);
      }
}
```

The h-tokens can be attempted to be swapped for canonical tokens in AMM if the `amountOutMin` or `deadline` parameters are specified. We'll get to the AMM role soon.

### Roles

Hop protocol involves a number of different roles

- Automated market-maker (AMM)
- Bonder
- Challenger

#### AMM

Hop has an AMM deployed on each Layer-2 to be able to swap between h-tokens and their canonical counterpart. The h-tokens is an intermediary asset to enable cross-chain transfers but once the h-tokens are minted at the destination chain they don't become very useful on their own because users and defi apps are only interested in the canonical tokens.

The AMM is built on top of the [Saddle finance](https://github.com/hop-protocol/contracts/blob/b38e1949b71df4e81e9f4dbb7c3eb740d3625a1e/contracts/saddle/Swap.sol) contracts (which is based on the [StableSwap curve](https://curve.fi/files/stableswap-paper.pdf)).

An AMM is necessary because the AMM prices liquidity and incentivizes rebalancing liquidity on each Layer-2.

Each supported token on Hop has it's own AMM on each Layer-2. The AMM pool is composed of two tokens; the canonical token and h-token, e.g. hUSDC+USDC, hDAI+DAI, etc.

The StableSwap-based AMM works well with stables by providing a stable 1 to 1 rate when the pools are balanced relatively equal. StableSwap is essentially a combination of a linear-invariant and constant-product invariant (like Uniswap) and it becomes more like one or the other depending on how unbalanced the pool is. When the pool is pretty balanced then it's closer to a linear-invariant and when the pool balances become really unbalanced then it's closer to the constant-product invariant to gurantee liquidity.

_Note: Check out [Understanding StableSwap (Curve)](https://miguelmota.com/blog/understanding-stableswap-curve/) to learn more about how StableSwap works._

AMM's require liquidity providers (LP) to contribute passive liquidity to the pool. Providing liquidity is incentivzed by rewarding liquidity providers with a small fee from each swap. For example, a user swapping hUSDC for USDC will reward the LP with a small portion of hUSDC, and a user swapping USDC for hUSDC will reward the LP with a small portion of USDC.

The swap fees are relatively small and at the time of this writing Hop AMM's use 4 basis points (bps) which is 0.04%.

It's recommended to provide liquidity of both assets (h-tokens and canonical token) in equal porportions, otherwise the pools become unbalance and incurs a higher price impact when swapping.

Arbitrageurs can swap between h-tokens and canonical tokens on one Hop Layer-2 AMM and trade the token on a different Hop Layer-2 AMM for a profit. Arbitrage opportunites eventually cause the prices to stabilize because the liquidity is rebalances across the Hop Layer-2 AMMs.

The AMM only deals with ERC-20 tokens so assets like ETH are converted to WETH and treated like any other ERC20.

#### Bonder

The Bonder role in the hop protocol network are market makers that front liquidity at the destination chain in exchange for a small fee.

Bonders exists to enable instant transfers across chains by watching transfer events on the source chain and then providing liquidity at the desired destination chain specified in the transfer event.

A transfer initiated by a user gets propagted to

// rephrase this
It works by involving market makers (referred to as Bonder) who front the liquidity at the destination chain in exchange for a small fee.

This credit is extended by the Bonder in form of hTokens which are then swapped for their native token counterpart in an AMM.

A bonder providers up-front liquidity on the destination rollup to allow instant transfers, and are incentivized by transfer fees.

A bonder must stake (lock up) collateral to be used as credit for transfers in order to guarantee liquidity on the destination rollup. The stake is treated like credit. The credit is subtracted when individual transfers are bonded and re-credited when transfers are settled. Transfers are settled when the bonded transfer root is propagated from Layer-2 to Layer-1 after the rollup challenge period).

A bonder cannot steal any funds. The bonder can only speed up cross-domain transfers by providing liquidity. Worst case scenario is the bonder going offline then your transfer will take as long as the rollup's exit time.



When bonder is offline then a fallback bonder will bond the transfers. If there are no fallback bonders, then the transfer will be settled after the rollup’s challenge period.



The Bonder gets their collateral back on rollup B after they provide proof that hTokens were burned on rollup A (see above question for more context).

The "hTokens" will be burned on rollup A and the Bonder will use collateral to mint hTokens on rollup B. The hTokens are immediately available to the sender.

#### Challenger


### Transfer roots

<!--
Transfers out of rollup A are merklelized into a "Transfer Root". The Transfer Root acts as proof that "hTokens" were burned on rollup A. The Transfer Root is sent to layer-1 (this takes ~1 week). After it's been commited on layer-1 then the Transfer Root is distributed to rollup B. At this point the Bonder can reclaim their collateral using the Transfer Root on rollup B as proof.


A Transfer consists of Destination chain id, destination recipient address, and transfer amount.

A transfer root object represents a bundle of transfers. A transfer root is composed of a merkle root of the transfer IDs and list of total amounts for each destination rollup chain.


<img src="https://help.hop.exchange/hc/article_attachments/4406103253773/Screenshot_2021-07-30_at_17.24.49.png" width="300" />


A transfer bond is the bonding of a transfer root which distributes the transfer root from Layer-1 to Layer-2 destination rollup chains. Only the bonder role can do this and requires positive credit balance. Someone may challenge this transfer root if it is believed to consist of invalid transfers.



At the moment Hop doesn't support arbitrary contract calls but may in the future after security risks are more understood.



Bonders and liquidity providers earn fees from transfers in exchange for providing liquidity. Other than that, there is no concrete business model detailed yet.



// rephrase this

To provide liquidity on Hop you need to add either Hop tokens (e.g hUSDC) or the equivalent native tokens (e.g USDC) into one of the Hop AMM liquidity pools. There is one Hop AMM for every asset and every network that Hop supports. You can deposit either one of the assets into the pool or provide both tokens together. Once you will have deposited funds into the pool you will receive LP tokens that represent your ownership share of the pool. Liquidity providers earn swap fees on every transfer that goes through the Hop bridge, as they facilitate conversions of Hop tokens into native tokens.



// rephrase this



A rogue chain/L2 can only negatively affect the Liquidity Providers on that specific chain. If for instance, blockchain validators on one chain would collude and create tokens out of thin air, they could cause price movements and slip pools on that chain only. The Hop LPs on other L2s cannot be affected by this because Hop’s accounting system makes sure that Hop tokens maliciously minted on one chain can not simply be exchanged for Hop tokens on another L2. The bonder can be affected negatively if they bond a transfer that was created maliciously on the rogue chain, but the LPs will not be affected.




//rephrase this

As mentioned previously, every Hop token minted on a L2 network is collateralised 1:1. The collateral is locked in the Hop bridge contract on L1. For example, if you have 1 hUSDC, 1 USDC is locked in the Bridge Contract on Ethereum mainnet. You can always redeem your 1 hUSDC at a 1:1 ratio in the convert section if you choose the “via Hop Bridge” in the Convert section.




//rephrase this

For the time being, Bonders must be whitelisted by the Hop Bridge smart contract. We are working on decentralizing the Bonder role completely.



//rephrase this

A transfer bond is the bonding of a transfer root which distributes the transfer root from layer-1 to layer-2 destination rollup chains. Only the bonder role can do this and it requires a positive credit balance. Someone may challenge this transfer root if they believe it contains invalid transfers.



//rephrase this

If the bonder attests to an invalid transfer root either maliciously or because of buggy software, anyone can challenge it. Imagine for example, The Bonder produces an invalid transfer root sending (minting) themselves 10,000 hUSDC on a different network. If this goes undetected the market would be flooded with fake (un-backed) hUSDC causing LP's a loss. However, the Hop protocol provides economic incentives for challenging a fraudulent transaction. The Bonder has to lock up 110% of the total value of the transfer root they bond as collateral -- in the event where a fraudulent transaction is detected 10% go to the challenger receives and the value of the fraudulent transaction is covered by The Bonder's stake. The challenge logic lives here and there's an open-source Challenge Watcher that anyone can run. In the very near future, we are going to set up a notification system to Tweet if a bonder is fraudulent so that anyone can see and challenge a transfer root.


// rephrase this

Moreover, Hop is completely non-custodial, meaning both liquidity provider's funds in the AMM and user funds that are sent through the Hop Bridge are never held in custody by a single party. Contracts are currently managed by a multi-sig with a one day timelock, which means that any changes to the code are delayed by one day before being implemented.
-->


## Deposit times

<!--
The advantages with Hop come about when you transfer from L2 to L1 or from one L2 to another L2.

Here, the rule of thumb is that an exit will take as many blocks to be considered final (safe from reorgs) on the sending chain.

Deposits from L1

Ethereum -> xDai: ∼5 minutes

Ethereum -> Polygon: ∼8 minutes

Withdrawals from xDai

xDAI -> Ethereum: ∼2 minutes (12 blocks)

xDAI -> Polygon: ∼2 minutes (12 blocks)




Withdrawals from Polygon

Polygon-> Ethereum: ∼4.5 minutes ( 124 blocks)



Polygon-> xDai: ∼4.5 minutes ( 124 blocks)




xdai: ~1hr

polygon: ~1hr

optimism: 7 days

arbitrum: 7 daysgoing from L1-> L2 is pretty instant, less than ~10mingoing from L2<>L2 looks like this:

L2->L1->L2

eg. xdai->ethereum->poygon

eg. polygon->ethereum->xdai

eg. polygon->ethereum->optimism, etc

basically, sending a message from L2 to L2 means that the source L2 sends a mesage to L1 and then L1 sends the message to the other L2. The L1 is the broker because all these L2s can communicate directly to L1, but L2's cannot communicate directly with other L2s.The 'message' we are talking about here is data about which function to call on the receiving end contract. For example, sending L2->L2 the message contains the calldata to a method that will mint hTokens and then swap on AMM for canonical tokens.let go through a transfer example,

starting at time 0 (T=0)



(T+1) a transfer is sent from polygon to xdai



(T+1) in the same transfer call, the bridge on polygon triggers a message for the polygon messenger to send to ethereum (L2->L1)



(T+60) the message will be received on L1 bridge contract within ~1hour (because it's polygon->L1 exit time)



(T+60) after the L1 bridge recieves the message, then it sends the same message to xdai (L1->L2)



(T+61) The message is received on xdai after a few moments



(T+2) bonder sees transfer event emitted on polygon

(T+3) bonder bonds transfer on xdai

(T+62) bonder withdrawals transfer amount from xdai after about an hour (this is after step with [T+61])

so bonders liquidity was locked up for about an hour because that's how long it took for polygon to send a message to xdai (it went from polygon->ethereum->xdai)



so the bonder is able to receive funds less than 1 day currently because sidechains like xdai and polygon have really short periods where they write back to the mainchain.if the source chain is optimism or arbitrum, then the same steps occur as above, except instead of [T+60] (~1 hour) it will be [T+1week]we'll see bonder liquidity locked up for a week once hop is live on optimism and arbitrum, which means more liquidity will be needed on bonder sideHowever, this is where bonding transfer roots come in to help free up liquidity on L2.

on chains with long exit periods (like optimistic rollups), the bonder will bond the transfer root ahead of time on L1.

basically instead of waiting 7 days to reclaim the funds it used to bond withdrawals on L2s, the bonder will bond the total amount (sum of all bonded withdrawal amounts) on L1 and then the L1 bridge sends a root bonded message to the destination chain, which then the bonder's liquidity is freed up on L2.

This way of bonding the transfer root is basically a fast shortcut for sending messages from L2->L1->L2 on chains with long exit periods but requires the bonder to lock up funds in L1.

The bonder's liquidity used for bonding the transfer root on L1 will be freed after the rollup's message reaches L1 after the 7 days. (
-->



## Sources



- [Whitepaper](https://hop.exchange/whitepaper.pdf)

https://blog.li.finance/hop-protocol-a-deep-dive-5075eddc4dd
