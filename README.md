# 💊 PumpFun Solana Smart Contract

The **Pump.fun Smart Contract forking** is an innovative platform  designed to allow users to create tokens, markets, and pools on Raydium/Meteora. This comprehensive project offers not only same features of pump.fun but also more for managing token authorities, customizing token properties, white list and handling liquidity pools with advanced functionalities.

### ✨ Features

- **Token Management**: Create tokens with customizable names, symbols, and images. Revoke token authority as needed.
- **Market Creation**: Set up markets for trading tokens with ease.
- **Pool Management**: Add and remove liquidity in Raydium pools. Burn SPL tokens efficiently.
- **Dashboard**: Display detail information of token listed on pump.fun.
- **Discord Integration**: Receive real-time notifications on Discord via webhooks.
- **Fee**: Handling gather fee from user who use our smart contract.
- 🚀 **Migration to Meteora/Raydium** 🚀: Migration to Meteora/Raydium using CPI call.
- 🚀 **Whiltelist** 🚀: Add user to whitelist to add more permission to each user.
- 🚀 **Spam Detection** 🚀: Automatically catch and handle spammers making transactions to the OpenBook market.

## 📋 Demo

### I have shared my previous tx made on this smart contract

#### Main Wallet: [en1omyBPyReHeUQfRvFqPtDPrzwQWSuKQMRctXLFmwh](https://solscan.io/account/en1omyBPyReHeUQfRvFqPtDPrzwQWSuKQMRctXLFmwh?cluster=devnet)
#### Create Global PDA: [LhMyuC3uQbN3rxMwRHFZ17o6VGKtuyztesjpHuG3JnZqEFpRfRnnDBSwPCuXJnPkVfuLMGXEEaUd51m7E1zM99m](https://solscan.io/tx/LhMyuC3uQbN3rxMwRHFZ17o6VGKtuyztesjpHuG3JnZqEFpRfRnnDBSwPCuXJnPkVfuLMGXEEaUd51m7E1zM99m?cluster=devnet)
#### Create BondingCurve: [48J3SsHG1urNR8BmCPKwX2gdq6SX7bkNRdXYjKT45npVTYdgftMbaJMyTBniMCzJa6BnPkmcip8pd4aTyXEnWoGj](https://solscan.io/tx/48J3SsHG1urNR8BmCPKwX2gdq6SX7bkNRdXYjKT45npVTYdgftMbaJMyTBniMCzJa6BnPkmcip8pd4aTyXEnWoGj?cluster=devnet)
#### Add whitelist: [7Z9Fz18Eo99MAupb7tdSuMiYcz3pqvJdnCqKhWQuGrFtKcBKoxWJFKrk6H8Zqy5NvxgvZaukf2BgN4cvKTGhyju](https://solscan.io/tx/7Z9Fz18Eo99MAupb7tdSuMiYcz3pqvJdnCqKhWQuGrFtKcBKoxWJFKrk6H8Zqy5NvxgvZaukf2BgN4cvKTGhyju?cluster=devnet)
#### Migrate meteora: [524N14xCr75EiWP96xeQ6hFUxE8ewspjCbWUxqRZnCZfdGgCLVZDFuvxAQGka6rtArgKFDcPi2JYVU9JowyZvC8Z](https://solscan.io/tx/524N14xCr75EiWP96xeQ6hFUxE8ewspjCbWUxqRZnCZfdGgCLVZDFuvxAQGka6rtArgKFDcPi2JYVU9JowyZvC8Z?cluster=devnet)


## 📞 Contact Info

### Telegram: [enlomy](https://t.me/enlomy)

## 🍵 Tip

### If you are intereseted in my projects, please 🔗fork or give me ⭐star


# 🎯 Project Setup Guide

Welcome to the project! This guide will help you quickly get started by installing the required tools and configuring your local environment.

---

## 🛠️ Prerequisites

Ensure the following tools are installed on your system:

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://anchor-lang.com/docs/installation)

> ℹ️ **Recommended Anchor version:** `0.30.1`

---

## ✅ Check Versions & Set Config

Verify that everything is properly installed and configured:

```bash
rustc --version             # Check Rust version
solana --version            # Check Solana CLI version
anchor --version            # Check Anchor version

solana config get           # View current Solana config
solana config set --url devnet  # Set network to devnet
```

---


## 🔐 Wallet Setup

Generate and manage your wallet keys:

```bash
solana-keygen new -o ./keys/admin.json     # Generate a new keypair
solana-keygen pubkey ./keys/admin.json     # Get public key
solana balance ./keys/admin.json           # Check wallet balance
solana airdrop 5 YOUR_WALLET_ADDRESS -u devnet   # Airdrop 5 SOL to your wallet
```

---

## 📦 Project Installation

Clone the project and install dependencies:

```bash
git clone https://github.com/project-repo.git
cd project-folder
yarn
```

---


## ⚡ Quick Start

### 🏗️ Build the Program

Compile the Anchor smart contract:

```bash
# Build the Anchor program using nightly toolchain
RUSTUP_TOOLCHAIN="nightly-2024-11-19" anchor build

# Sync all program public keys
anchor keys sync

# Rebuild if the program address in lib.rs has changed
RUSTUP_TOOLCHAIN="nightly-2024-11-19" anchor build
```

---

### 🧪 Test on Devnet

Ensure your `Anchor.toml` uses Devnet:

```toml
[provider]
cluster = "https://api.devnet.solana.com"
```

---

### 🚀 Deploy the Program

```bash
anchor deploy
```

---

## 🧪 Use CLI to Interact with the Program

Use these CLI scripts to interact with your smart contract locally.

### Initialize Program

```bash
yarn script config
```

### launch a token
```bash
yarn script curve
```

### Swap SOL for Token
```bash
yarn script swap -t <TOKEN_MINT> -a <SWAP_AMOUNT> -s <SWAP_DIRECTION>

<TOKEN_MINT>: You can get the token mint address when you launch a token.

<SWAP_AMOUNT>: The amount of SOL or Token you want to swap.

<SWAP_DIRECTION>: 0: Buy token (Swap SOL → Token)   1: Sell token (Swap Token → SOL)
```

### Migrate Token to Raydium
```bash
yarn script migrate -m <TOKEN_MINT>
```
