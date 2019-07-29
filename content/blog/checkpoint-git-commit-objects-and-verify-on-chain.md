---
layout: blog-post
title: Checkpoint git commit objects and verify on-chain
type: blog
tag: [git, ethereum, blockchain, merkletree]
description: Checkpoint git commits with git push hooks and verify using merkle trees on Ethereum
date: 2019-06-19T00:00:00-00:00
draft: false
---

In this tutorial we'll go through how to create a smart contract on [Ethereum](https://www.ethereum.org/) that can notarize git commits and offer the ability to verify that a commit was published via verification with a merkle tree proof of git commit hash logs. Then we'll be using git hooks to publish the commit on-chain on every tagged release.

## The problem

When looking at the commit history in a git repository you can never be certain that the commits were published at the commit date it says.

Let's go through a quick example to demonstrate. First we'll initialize a new git repository and commit as normal and expected:


```bash
$ git init
Initialized empty Git repository in /tmp/example-repo/.git/

$ git touch README.md

$ git add .

$ git commit -m "init"
[master (root-commit) 98f2e97] init
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 README.md


$ git log
commit 98f2e9701776e4a861a0d5eff2404ebe5db2633b (HEAD -> master)
Author: Miguel Mota <hello@miguelmota.com>
Date:   Sun Jul 28 15:58:34 2019 -0700

    init
```

Everything looks good as expected, but now backtracking a little lets use the `--date` flag this time when committing to set a custom commit date:


```
$ git commit -m 'init' --date='10 days ago'
[master (root-commit) fd6b209] init
 Date: Sun Jun 16 16:00:50 2019 -0700
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 README.md


$ git log
commit fd6b209b8bb4ff6e1383ef068c444bfc295a09c2 (HEAD -> master)
Author: Miguel Mota <hello@miguelmota.com>
Date:   Sat Jun 06 16:00:50 2019 -0700

    init
```

Now it appears as if the commit happened 10 days ago.

Someone can completely make up the dates to make it appear as if it was created a while back so you can never really be sure if they're telling the truth. But if someone published their commits on-chain, then it's much easier to believe them because you can verify.

## Smart contract

There needs to be a way to notarize commits in a way that the commit date can also be verified to be current during notarization, meaning that the notary shouldn't allow commits older than a small window from the current time. This is actually pretty trivial to implement in a smart contract as we'll see.

Before proceeding let's look at what a commit consists of. A commit object contains:

  - `tree` hash
  - `parent` hash, or hashes
  - `author` meta string
  - `committer` meta string
  - `gpgsig` optional signature
  - message of commit

The `tree` is a merkle root of the committed file objects.

The `parent` references the parent commit, and sometimes there's multiple parents if merging multiple commits without fast-forwarding.

The `author` contains meta data about the author such as name, email, timestamp and timestamp timezone.

The `committer` contains meta data about the committer such as name, email, commit timestamp and timestamp timezone.

The `gpgsig` is the signature of the signed commit by the committer if gpg signing is [enabled](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work).

The last portion of the commit is the actual commit message which may span multiple lines.

An actual example of the commit will look like this:

```bash
$ git cat-file -p HEAD
tree 00dd089c310aea2b821d23ea0f1a6a6235ad165c
parent 32f04c7f572bf75a266268c6f4d8c92731dc3b7f
author Miguel Mota <hello@miguelmota.com> 1560727622 -0700
committer Miguel Mota <hello@miguelmota.com> 1560727622 -0700
gpgsig -----BEGIN PGP SIGNATURE-----

 iQIzBAABCAAdFiEEkA8ilwQdtHsQgZEbZ+wRYViKAPkFAl0G0EYACgkQZ+wRYViK
 APmWdxAAgWKOQpz1/QbzYxOXQZ5uT8lTVnxw8HN4KZaZ36ehFTxzRVO0IEniJGr4
 5+sVskMDbkP/aKQyS/UUmeXKGeYQT4Kpwvtih5CZHSLNO2LQ8pz5o0wjWK8OHmx7
 pGuAd83gMqfnQF7+KDqpxqHR63NDmuRo4QQ18rolga16Md4wIRzFNU+JsX7WVIcD
 zPd6PzotAkGD+suqMiYt6ka6cqQT9lB8WN5L88Kdyy8mFsEu7YZBVkWQqB4YCLgu
 7s3vaSuJ9NIGtT3C1Kd2lmEsrDZj84bmEHaP8aOdLAstucNrl8/wSo3NQFeydALQ
 WBpiDhFY2jOYSxcuwI+ZYfeizztr4qGXUaI2VM7/HYSChmWzyvghmP/XmZJDwCKk
 dDgyNSxEjWfM6GD1fmPulvU2MZKabqv6juHpETsPNPdpw7u+Z7om8s2G66erMliU
 WQOfwE4lFcBF0oVoJp2FQQYcme4BERDsqUWJ8C60PW0FELuZlAWRRcUIl49M6gXa
 sSTNfIXubA2LxjHQFS7hy+9+N1Dl1AFcQZP+Md8ai8B4JfDgswf+m1OVuOihDECa
 bMotWVZ+qHeycly9RihDkCas8ICPlCIGZ6PmAPnsMr5Ruzt9oaKuZ5UInB6IRx2k
 H7510dWvJLLZ7w1r78UWdyiT4DH5xRuqQJ8F7erOmtPw5lCmKto=
 =OZk+
 -----END PGP SIGNATURE-----

add license
```

The commit hash is a [SHA-1](https://en.wikipedia.org/wiki/SHA-1) of the commit object contents. It'll be computed like this, pseudocodically speaking:

```
SHA1(tree, parent, author, committer, signature, message)
```

An example of the commit hash for the shown commit object:

```
$ git rev-parse HEAD
d89f84d948796605a413e196f40bce1d6294175d
```

In the smart contract we need to have the committer publish the entire contents of the commit object instead of just the hash in order to be able to verify the commit date they're claiming.

First we can represent the commit object in solidity as a struct:

```solidity
struct Commit {
  string tree;
  string[] parents;
  string author;
  uint256 authorDate;
  string authorDateTzOffset;
  string committer;
  uint256 commitDate;
  string commitDateTzOffset;
  string message;
  string signature;
}
```

And specifiy a mapping to store the commit checkpoints:

```solidity
mapping (bytes20 => uint256) public checkpoints;
```

The meat of the contract is the checkpointing functionality. It should accept the commit object and verify that the commit date is within a 24 hour window from the current block time.

```solidity
function checkpoint(
  Commit calldata _commit
) external returns (bytes20 commitHash) {
  require(_commit.commitDate <= now + 24 hours);
  require(_commit.commitDate > now - 24 hours);

  // ...
```

Next it should construct the commit hash from the commit data by concanetating the fields into their proper format. We'll be using the [SHA1.sol](https://github.com/ensdomains/solsha1/blob/master/contracts/SHA1.sol) library which implements SHA-1 in solidity. Solidity doesn't offer a nice way to concatenate strings so I apologize for the rough looking code:

```solidity
  // ...

  string memory treeStr = concat("tree ", _commit.tree, "\n", "", "", "", "");

  string memory parentsStr;
  for (uint256 i = 0; i < _commit.parents.length; i++) {
    parentsStr = concat(parentsStr, "parent ", _commit.parents[i], "\n", "", "", "");
  }

  string memory authorStr = concat("author ", _commit.author, " ", uint2str(_commit.authorDate), " ", _commit.authorDateTzOffset, "\n");

  string memory committerStr = concat("committer ", _commit.committer, " ", uint2str(_commit.commitDate), " ", _commit.commitDateTzOffset, "\n");

  string memory signatureStr = "";
  if (bytes(_commit.signature).length > 0) {
    signatureStr = concat("gpgsig ", _commit.signature, "", "", "", "", "");
  }

  string memory messageStr = concat("\n", _commit.message, "", "", "", "", "");

  string memory data = concat(treeStr, parentsStr, authorStr, committerStr, signatureStr, messageStr, "");
  // ...
```

After concatenating to the proper format, the data must contain prefixed with the *commit* label followed by the length of the data to generate the commit hash:

```solidity
  // ...

  commitHash = SHA1.sha1(abi.encodePacked("commit ", uint2str(strsize(data)), byte(0), data));

  // ...
```

And lastly setting the commit hash as the key and the commit date as the value in the storage mapping if it doesn't exist already.

```solidity
  // ...

  require(checkpoints[commitHash] == 0);
  checkpoints[commitHash] = _commit.commitDate;
}
```

**Here's the full solidity contract:**

```solidity
pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./SHA1.sol";

contract Commits {
  mapping (bytes20 => uint256) public checkpoints;

  event Checkpointed(address indexed sender, bytes20 indexed commit);

  struct Commit {
    string tree;
    string[] parents;
    string author;
    uint256 authorDate;
    string authorDateTzOffset;
    string committer;
    uint256 commitDate;
    string commitDateTzOffset;
    string message;
    string signature;
  }

  function checkpoint(
    Commit calldata _commit
  ) external returns (bytes20 commitHash) {
    require(_commit.commitDate <= now + 24 hours);
    require(_commit.commitDate > now - 24 hours);

    string memory treeStr = concat("tree ", _commit.tree, "\n", "", "", "", "");

    string memory parentsStr;
    for (uint256 i = 0; i < _commit.parents.length; i++) {
      parentsStr = concat(parentsStr, "parent ", _commit.parents[i], "\n", "", "", "");
    }

    string memory authorStr = concat("author ", _commit.author, " ", uint2str(_commit.authorDate), " ", _commit.authorDateTzOffset, "\n");

    string memory committerStr = concat("committer ", _commit.committer, " ", uint2str(_commit.commitDate), " ", _commit.commitDateTzOffset, "\n");

    string memory signatureStr = "";
    if (bytes(_commit.signature).length > 0) {
      signatureStr = concat("gpgsig ", _commit.signature, "", "", "", "", "");
    }

    string memory messageStr = concat("\n", _commit.message, "", "", "", "", "");

    string memory data = concat(treeStr, parentsStr, authorStr, committerStr, signatureStr, messageStr, "");

    commitHash = SHA1.sha1(abi.encodePacked("commit ", uint2str(strsize(data)), byte(0), data));

    require(checkpoints[commitHash] == 0);
    checkpoints[commitHash] = _commit.commitDate;

    emit Checkpointed(msg.sender, commitHash);
  }

  function checkpointed(bytes20 commit) public view returns (bool) {

    return checkpoints[commit] != 0;
  }

  function checkpointVerify(bytes20 commit, bytes20 root, bytes20 leaf, bytes20[] memory proof) public view returns (bool) {

    require(checkpoints[commit] != 0);
    return verify(root, leaf, proof);
  }

  function verify(bytes20 root, bytes20 leaf, bytes20[] memory proof) public pure returns (bool) {
    bytes20 computedHash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes20 proofElement = proof[i];

      if (computedHash < proofElement) {
        // Hash(current computed hash + current element of the proof)
        computedHash = SHA1.sha1(abi.encodePacked(computedHash, proofElement));
      } else {
        // Hash(current element of the proof + current computed hash)
        computedHash = SHA1.sha1(abi.encodePacked(proofElement, computedHash));
      }
    }

    // Check if the computed hash (root) is equal to the provided root
    return computedHash == root;
  }

  function concat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e, string memory _f, string memory _g) internal returns (string memory) {
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    bytes memory _bf = bytes(_f);
    bytes memory _bg = bytes(_g);
    string memory abcdefg = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length + _bf.length + _bg.length);
    bytes memory babcdefg = bytes(abcdefg);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcdefg[k++] = _ba[i];
    for (uint i = 0; i < _bb.length; i++) babcdefg[k++] = _bb[i];
    for (uint i = 0; i < _bc.length; i++) babcdefg[k++] = _bc[i];
    for (uint i = 0; i < _bd.length; i++) babcdefg[k++] = _bd[i];
    for (uint i = 0; i < _be.length; i++) babcdefg[k++] = _be[i];
    for (uint i = 0; i < _bf.length; i++) babcdefg[k++] = _bf[i];
    for (uint i = 0; i < _bg.length; i++) babcdefg[k++] = _bg[i];
    return string(babcdefg);
  }

  function uint2str(uint v) internal view returns (string memory str) {
    uint256 maxlength = 100;
    bytes memory reversed = new bytes(maxlength);
    uint i = 0;
    while (v != 0) {
      uint remainder = v % 10;
      v = v / 10;

      reversed[i++] = byte(uint8(48 + remainder));
    }

    bytes memory s = new bytes(i);
    for (uint j = 0; j < i; j++) {
      s[j] = reversed[i - j - 1];
    }

    str = string(s);
  }

  function strsize(string memory str) internal view returns (uint length) {
    uint256 i = 0;
    bytes memory strbytes = bytes(str);

    while (i < strbytes.length) {
      if (strbytes[i]>>7 == 0) {
        i+=1;
      } else if (strbytes[i]>>5 == 0x06) {
        i+=2;
      } else if (strbytes[i]>>4 == 0x0E) {
        i+=3;
      } else if (strbytes[i]>>3 == 0x1E) {
        i+=4;
      } else {
        //For safety
        i += 1;
      }

      length++;
    }
  }
}
```

We'll go ahead an deploy it to the Kovan testnet, you can see it here on [etherscan](https://kovan.etherscan.io/address/0xBA7619DFA824A168fDD76a77b8236f83528d015C).

## Git hook

Ok cool it's all deployed now, so now we should create a git hook to submit a transaction to checkpoint.

The way this is going to work is we're going to only publish to the smart contract if it's a tagged release, meaning that we'll check if the current git commit has a corresponding git tag associated with it. For simplicity sake, let's use node.js and the child proccess library to execute git commands:

```js
const { execSync } = require('child_process')

const commit = execSync('git cat-file -p HEAD').toString().trim()
const commitHash = execSync('git rev-parse HEAD').toString().trim()
const tag = execSync('git describe --tags `git rev-list --tags --max-count=1`').toString().trim()
const tagCommit = execSync(`git rev-list -n 1 "${tag}"`).toString().trim()

if (tagCommit !== commitHash) {
  console.log('Tag not found for commit, skipping checkpoint.')
  process.exit(0)
}
```

If a tag was found matching the commit we'll proceed with parsing the commit string and prepping the values for the transaction data:

```js
const parseCommit = require('git-parse-commit')

console.log(`Tag ${tag} found, checkpointing commit ${commitHash}`)

const {
  tree,
  parents,
  author: {
    name: authorName,
    email: authorEmail,
    timestamp: authorDate,
    timezone: authorDateTzOffset
  },
  committer: {
    name: committerName,
    email: committerEmail,
    timestamp: commitDate,
    timezone: commitDateTzOffset
  },
  pgp,
  title,
  description
} = parseCommit(`${commitHash}\n${commit}`)

const author = `${authorName} <${authorEmail}>`
const committer = `${committerName} <${committerEmail}>`
const message = `${title}${description}
`

const signature = `-----BEGIN PGP SIGNATURE-----

${pgp}
-----END PGP SIGNATURE-----`.split('\n').join('\n ') + '\n'
```

We have all the data formatted and queued and now just need to set up the web3 provider and load the contract. First let's create custom git config attributes for setting the private key and provider uri (example private key was derived from `ganache-cli --deterministic`):

```bash
$ git config ethereumcheckpoint.privatekey 4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d

$ git config ethereumcheckpoint.provideruri https://kovan.infura.io/
```

These custom values live in `.git/config` but you may also set them to be global with the `--global` flag:

In the code we simply query for the custom config values:

```bash
const privateKey = execSync('git config ethereumcheckpoint.privatekey').toString().trim()
const providerUri = execSync('git config ethereumcheckpoint.provideruri').toString().trim()
```

Next up is setting the private key web3 provider:

```js
const Web3 = require('web3')
const PrivateKeyProvider = require('truffle-privatekey-provider')

const web3 = new Web3(provider)
const provider = new PrivateKeyProvider(privateKey, providerUri)
```

We'll read the ABI and contract address directly from the generated contract JSON file from truffle migrate when it was deployed and then initialize the contract instance:

```js
const fs = require('fs')
const path = require('path')

const { address: sender } = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`)

const contractJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../build/contracts/Commits.json')))
const { abi } = contractJSON
const networkId = 42 // kovan
const { address: contractAddress } = contractJSON.networks[networkId]

const contract = new web3.eth.Contract(abi, contractAddress)
```

Finally we send submit the transaction on-chain and assert the status to be successful:

```js
const data = {
  tree,
  parents,
  author,
  authorDate,
  authorDateTzOffset,
  committer,
  commitDate,
  commitDateTzOffset,
  message,
  signature
}

console.log('Checkpointing commit to Ethereum...')
const {
  status,
  transactionHash
} = await contract.methods.checkpoint(data).send({
  from: sender
})

console.log(`Transaction hash: ${transactionHash}`)
assert.ok(status)
```

**Here's the full git hook code:**

```js
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const Web3 = require('web3')
const PrivateKeyProvider = require('truffle-privatekey-provider')
const parseCommit = require('git-parse-commit')

const contractJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../build/contracts/Commits.json')))
const { abi } = contractJSON
const networkId = 42 // kovan
const { address: contractAddress } = contractJSON.networks[networkId]

const privateKey = execSync('git config ethereumcheckpoint.privatekey').toString().trim()
const providerUri = execSync('git config ethereumcheckpoint.provideruri').toString().trim()
const provider = new PrivateKeyProvider(privateKey, providerUri)
const web3 = new Web3(provider)

const { address: sender } = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`)

const commit = execSync('git cat-file -p HEAD').toString().trim()
const commitHash = execSync('git rev-parse HEAD').toString().trim()
const tag = execSync('git describe --tags `git rev-list --tags --max-count=1`').toString().trim()
const tagCommit = execSync(`git rev-list -n 1 "${tag}"`).toString().trim()

if (tagCommit !== commitHash) {
  console.log('Tag not found for commit, skipping checkpoint.')
  process.exit(0)
}

console.log(`Tag ${tag} found, checkpointing commit ${commitHash}`)

const {
  tree,
  parents,
  author: {
    name: authorName,
    email: authorEmail,
    timestamp: authorDate,
    timezone: authorDateTzOffset
  },
  committer: {
    name: committerName,
    email: committerEmail,
    timestamp: commitDate,
    timezone: commitDateTzOffset
  },
  pgp,
  title,
  description
} = parseCommit(`${commitHash}\n${commit}`)

const author = `${authorName} <${authorEmail}>`
const committer = `${committerName} <${committerEmail}>`
const message = `${title}${description}
`

const signature = `-----BEGIN PGP SIGNATURE-----

${pgp}
-----END PGP SIGNATURE-----`.split('\n').join('\n ') + '\n'

const data = {
  tree,
  parents,
  author,
  authorDate,
  authorDateTzOffset,
  committer,
  commitDate,
  commitDateTzOffset,
  message,
  signature
}

const contract = new web3.eth.Contract(abi, contractAddress)

try {
  console.log('Checkpointing commit to Ethereum...')
  const {
    status,
    transactionHash
  } = await contract.methods.checkpoint(data).send({
    from: sender
  })

  console.log(`Transaction hash: ${transactionHash}`)
  assert.ok(status)

  const _commitDate = await contract.methods.checkpoints(`0x${commitHash}`).call()
  assert.equal(_commitDate.toString(), commitDate.toString())
  console.log('Successfully checkpointed commit to Ethereum.')

  process.exit(0)
} catch(err) {
  console.error(err.message)
}
```

## Trying it out

In an git repository, create a [pre-push](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) git hook by creating the file `.git/hooks/pre-push`.

For convenience, I created a [gist](https://gist.github.com/miguelmota/8d2d0d1c010137eca271985a1cfaa67d) with the required files to create an NPM module which you can install with:

```bash
npm install gist:8d2d0d1c010137eca271985a1cfaa67d
```

Now in `.git/hooks/pre-push` add the following content:

```bash
#!/usr/bin/env node

require('ethereum-checkpoint-git-commit')
```

And make sure it's executable:

```bash
chmod +x .git/hooks/pre-push
```

Assuming you have set the required custom git config attributes already, you can tag the commit and push which invokes the pre-push git hook and publishes the commit on-chain:

```bash
$ git tag v0.0.1

$ git push origin master

Tag v0.0.1 found, checkpointing commit da1597df5884f651acfa2d3f50bb37d320fb2a20
Checkpointing commit to Ethereum...
Transaction hash: 0x0f64c42d47e7c92d5aa0da5eca0a6d3a33aed2695e46b70e3e850ce4694c525f
Successfully checkpointed commit to Ethereum.
// ...
```

See the transaction on [etherscan](https://kovan.etherscan.io/tx/0x0f64c42d47e7c92d5aa0da5eca0a6d3a33aed2695e46b70e3e850ce4694c525f).

## Verification

Since the parent commit hash lives on-chain now, it's very easy to check if any previous commits are children of the parent commit.

Run git `log` to get all commit hashes:

```bash
$ git --no-pager log --pretty=oneline | awk '{print $1}'
07fe57235fc504613879f11107a5d81ffaaf1d40
d89f84d948796605a413e196f40bce1d6294175d
32f04c7f572bf75a266268c6f4d8c92731dc3b7f
b80b52d80f5fe940ac2c987044bc439e4218ac94
1553c75a1d637961827f4904a0955e57915d8310
```

Now we'll construct a merkle tree using the commit log hashes as the leaves:

```js
const { MerkleTree } = require('merkletreejs')
const sha1 = require('sha1')

const leaves = execSync(`git --no-pager log --pretty=oneline | awk '{print $1}'`).toString().trim().split('\n').map(x => Buffer.from(x, 'hex'))

const tree = new MerkleTree(leaves, sha1, { sort: true })
```

We specify a leaf node that we want to generate proof from, meaning that we'll get the minimum node hashes requires to proof that the leaf exists in the merkle tree:

```js
const root = tree.getHexRoot()
const leaf = Buffer.from('32f04c7f572bf75a266268c6f4d8c92731dc3b7f', 'hex')
const proof = tree.getHexProof(leaf)
```

Now that we have the proof we make a read-only call to the smart contract to verify that the proof is valid and that the commit exists on-chain

```js
const verified = await contract.methods.verify(root, leaf, proof).call({
  from: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
})

console.log(`verified: ${verified}`) // true
```

It returns `true`, and if we pass it an invalid commit hash or proof for a parent hash as the leaf that has not been committed on-chain then it returns `false`.

**Full code of verification call code:**

```js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const Web3 = require('web3')
const { MerkleTree } = require('merkletreejs')
const sha1 = require('sha1')

const contractJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../build/contracts/Commits.json')))
const { abi } = contractJSON
const networkId = 42 // kovan
const { address: contractAddress } = contractJSON.networks[networkId]

const providerUri = execSync('git config ethereumcheckpoint.provideruri').toString().trim()
const web3 = new Web3(new Web3.providers.HttpProvider(providerUri))

;(async () => {
  const contract = new web3.eth.Contract(abi, contractAddress)

  const leaves = execSync(`git --no-pager log --pretty=oneline | awk '{print $1}'`).toString().trim().split('\n').map(x => Buffer.from(x, 'hex'))

  const tree = new MerkleTree(leaves, sha1, { sort: true })

  const root = tree.getHexRoot()
  const leaf = Buffer.from('32f04c7f572bf75a266268c6f4d8c92731dc3b7f', 'hex')
  const proof = tree.getHexProof(leaf)

  const verified = await contract.methods.verify(root, leaf, proof).call({
    from: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
  })

  console.log(`verified: ${verified}`)
})()
```

All of the code is available on [github](https://github.com/miguelmota/ethereum-checkpoint-git-commit/).
