import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import fs from "fs";

import { Keypair, Connection, PublicKey, SystemProgram, TransactionInstruction, SYSVAR_RENT_PUBKEY, ComputeBudgetProgram, Transaction, TransactionMessage, AddressLookupTableProgram, VersionedTransaction } from "@solana/web3.js";

import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

import { PumpRaydium } from "../target/types/pump_raydium";
import {
  createConfigTx,
  createBondingCurveTx,
  swapTx,
  migrateTx,
} from "../lib/scripts";
import { execTx } from "../lib/util";
import {
  TEST_DECIMALS,
  TEST_INIT_BONDING_CURVE,
  TEST_NAME,
  TEST_SYMBOL,
  TEST_TOKEN_SUPPLY,
  TEST_URI,
  TEST_VIRTUAL_RESERVES,
  TEST_INITIAL_VIRTUAL_TOKEN_RESERVES,
  TEST_INITIAL_VIRTUAL_SOL_RESERVES,
  TEST_INITIAL_REAL_TOKEN_RESERVES,
  SEED_BONDING_CURVE,
  SEED_CONFIG,
  TEST_INITIAL_RAYDIUM_TOKEN_RESERVES,
  TEST_INITIAL_RAYDIUM_SOL_AMOUNT,
} from "../lib/constant";
import { createMarket } from "../lib/create-market";


let solConnection: Connection = null;
let program: Program<PumpRaydium> = null;
let payer: NodeWallet = null;

// Address of the deployed program.
let programId;

/**
 * Set cluster, provider, program
 * If rpc != null use rpc, otherwise use cluster param
 * @param cluster - cluster ex. mainnet-beta, devnet ...
 * @param keypair - wallet keypair
 * @param rpc - rpc
 */
export const setClusterConfig = async (
  cluster: web3.Cluster,
  keypair: string,
  rpc?: string
) => {
  if (!rpc) {
    solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
  } else {
    solConnection = new web3.Connection(rpc);
  }

  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(keypair, "utf-8"))),
    { skipValidation: true }
  );
  payer = new NodeWallet(walletKeypair);

  console.log("Wallet Address: ", payer.publicKey.toBase58());

  anchor.setProvider(
    new anchor.AnchorProvider(solConnection, payer, {
      skipPreflight: true,
      commitment: "confirmed",
    })
  );

  // Generate the program client from IDL.
  program = anchor.workspace.PumpRaydium as Program<PumpRaydium>;
  programId = program.programId.toBase58();
  console.log("ProgramId: ", program.programId.toBase58());
};

export const configProject = async () => {

  const teamWallet = new PublicKey("Br4NUsLoHRgAcxTBsDwgnejnjqMe5bkyio1YCrM3gWM2")
  const migrationWallet = new PublicKey("DQ8fi6tyN9MPD5bpSpUXxKd9FVRY2WcnoniVEgs6StEW");
  // Create a dummy config object to pass as argument.
  const newConfig = {
    authority: payer.publicKey,
    migrationAuthority: payer.publicKey,
    teamWallet: teamWallet,
    migrationWallet: migrationWallet,
    initBondingCurve: new BN(TEST_INIT_BONDING_CURVE),
    platformBuyFee: 1, // Example fee: 0.1%
    platformSellFee: 1, // Example fee: 0.1%
    platformMigrationFee: 1, //  Example fee: 0.1%
    lamportAmountConfig: {
      range: { min: new BN(50_000_000_0), max: new BN(50_000_000_0) },
    },
    tokenSupplyConfig: {
      range: { min: new BN(1_000_000_000), max: new BN(1_000_000_000) },
    },
    tokenDecimalsConfig: { range: { min: 6, max: 6 } },
    initialVirtualTokenReservesConfig: new BN(TEST_INITIAL_VIRTUAL_TOKEN_RESERVES),
    initialVirtualSolReservesConfig: new BN(TEST_INITIAL_VIRTUAL_SOL_RESERVES),
    initialRealTokenReservesConfig: new BN(TEST_INITIAL_REAL_TOKEN_RESERVES),
    initialRaydiumTokenReserves: new BN(TEST_INITIAL_RAYDIUM_TOKEN_RESERVES),
    initialRaydiumSolAmount: new BN(TEST_INITIAL_RAYDIUM_SOL_AMOUNT),

    curveLimit: new BN(1_416_000_000), //  Example limit: 85 SOL
    initialized: false,
  };

  const tx = await createConfigTx(
    payer.publicKey,
    newConfig,
    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

export const createBondingCurve = async () => {
  const configPda = PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_CONFIG)],
    program.programId
  )[0];
  const configAccount = await program.account.config.fetch(configPda);

  const tx = await createBondingCurveTx(
    TEST_DECIMALS,
    TEST_TOKEN_SUPPLY,
    TEST_VIRTUAL_RESERVES,

    //  metadata
    TEST_NAME,
    TEST_SYMBOL,
    TEST_URI,

    payer.publicKey,
    configAccount.teamWallet,
    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

export const swap = async (
  token: PublicKey,

  amount: number,
  style: number
) => {
  const tx = await swapTx(
    payer.publicKey,
    token,
    amount,
    style,
    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

export const migrate = async (token: PublicKey) => {
  const market = await createMarket(payer, token, solConnection);

  console.log("***market publickey", market.toBase58());

  const tx = await migrateTx(
    payer.publicKey,
    token,
    market,
    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

const calcPrice = (
  virtualTokenReserves: BN,
  virtualSolReserves: BN
): number => {
  if (virtualSolReserves.isZero()) {
    throw new Error("Division by zero: virtualSolReserves is zero.");
  }

  return virtualSolReserves.toNumber() / virtualTokenReserves.toNumber() / 1000;
};

export const getCurrentPrice = async (mint: string) => {
  const tokenBMint = new PublicKey(mint);
  const bondingCurvePda = PublicKey.findProgramAddressSync([Buffer.from(SEED_BONDING_CURVE), tokenBMint.toBytes()], program.programId)[0];
  const bondingCurve = await program.account.bondingCurve.fetch(bondingCurvePda);
  const curveData = {
    virtualSolReserves: bondingCurve.virtualSolReserves,
    virtualTokenReserves: bondingCurve.virtualTokenReserves,
    realSolReserves: bondingCurve.realSolReserves,
    realTokenReserves: bondingCurve.realTokenReserves,
  };
  console.log(curveData);
  const currentPrice = calcPrice(curveData.virtualTokenReserves, curveData.virtualSolReserves);
  console.log("Current Price:", currentPrice);
  return currentPrice;
}

const SCALE_UP = new BN(1_000_000_000);  // Scale tokens to 9 decimals
const SCALE_DOWN = new BN(1_000_000);    // Convert back to 6 decimals

const calculateTokensOut = (
  virtualSolReserves: BN,
  virtualTokenReserves: BN,
  solAmount: BN
): BN | null => {
  // Convert token reserves to 9 decimal places
  const currentSol = virtualSolReserves;
  const currentTokens = virtualTokenReserves.mul(SCALE_UP).div(SCALE_DOWN);

  if (currentTokens.isZero()) return null; // Avoid division by zero

  // Calculate new reserves using constant product formula
  const newSol = currentSol.add(solAmount);
  const newTokens = currentSol.mul(currentTokens).div(newSol);

  // Tokens to be received
  let tokensOut = currentTokens.sub(newTokens);

  // Convert back to 6 decimal places
  tokensOut = tokensOut.mul(SCALE_DOWN).div(SCALE_UP);

  return tokensOut;
};

const solAmountToBN = (solAmount: number): BN => {
  return new BN(solAmount); // Scale to 9 decimals
};

export const calculateSwap = async (mint: string, solAmount: number) => {
  if (solAmount == 0) {
    return null;
  }
  const tokenBMint = new PublicKey(mint);
  const bondingCurvePda = PublicKey.findProgramAddressSync([Buffer.from(SEED_BONDING_CURVE), tokenBMint.toBytes()], program.programId)[0];
  const bondingCurve = await program.account.bondingCurve.fetch(bondingCurvePda);
  const curveData = {
    virtualSolReserves: bondingCurve.virtualSolReserves,
    virtualTokenReserves: bondingCurve.virtualTokenReserves,
    realSolReserves: bondingCurve.realSolReserves,
    realTokenReserves: bondingCurve.realTokenReserves,
  };
  console.log(curveData);

  solAmount -= solAmount * 0.01; // Decrease by 0.1%
  console.log("Updated SOL Amount:", solAmount);
  const solAmountBN = solAmountToBN(solAmount);
  console.log(solAmountBN.toString());
  let tokensOut = calculateTokensOut(curveData.virtualSolReserves, curveData.virtualTokenReserves, solAmountBN);

  if (tokensOut >= curveData.realTokenReserves) {
    console.log("realTokenReserves limit:", tokensOut?.toString(), curveData.realTokenReserves.toString());
    tokensOut = curveData.realTokenReserves;
  }
  console.log("Tokens Out:", tokensOut?.toString());
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
} 