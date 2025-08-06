import { MAINNET_PROGRAM_ID, DEVNET_PROGRAM_ID } from "@raydium-io/raydium-sdk";
import { Cluster, PublicKey } from "@solana/web3.js";

export const SEED_CONFIG = "config";
export const SEED_BONDING_CURVE = "bonding_curve";

export const TEST_NAME = "TrueSin";
export const TEST_SYMBOL = "TrueSin";
export const TEST_URI =
  "https://gateway.irys.xyz/GwKuTp6xH8FktZcLfF9Uk7kPZX5iME5DsrPU2nVe6nWM";
export const TEST_VIRTUAL_RESERVES = 50_000_000_0;
export const TEST_TOKEN_SUPPLY = 1_000_000_000_000_000;
export const TEST_DECIMALS = 6;
export const TEST_INIT_BONDING_CURVE = 80;
export const TEST_INITIAL_VIRTUAL_TOKEN_RESERVES = 1_073_000_191_000_000;
export const TEST_INITIAL_VIRTUAL_SOL_RESERVES = 50_000_000_0;
export const TEST_INITIAL_REAL_TOKEN_RESERVES = 793_100_000_000_000;
export const TEST_INITIAL_RAYDIUM_TOKEN_RESERVES = 206_900_000_000_000;
export const TEST_INITIAL_RAYDIUM_SOL_AMOUNT = 1_000_000_0;

const cluster: Cluster = "mainnet-beta";

export const raydiumProgramId =
  cluster.toString() == "mainnet-beta" ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID;

export const ammProgram =
  cluster.toString() == "mainnet-beta"
    ? new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8") // mainnet-beta
    : new PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8"); // devnet

export const marketProgram =
  cluster.toString() == "mainnet-beta"
    ? new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX") // mainnet-beta
    : new PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj"); // devnet

export const feeDestination =
  cluster.toString() == "mainnet-beta"
    ? new PublicKey("7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5") // Mainnet
    : new PublicKey("3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR"); // Devnet
