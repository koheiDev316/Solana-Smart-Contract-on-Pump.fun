use anchor_lang::{prelude::*, solana_program::program::invoke_signed};
use anchor_spl::token::{burn, Burn, TokenAccount};

use crate::{
    amm_instruction,
    constants::{BONDING_CURVE, CONFIG, GLOBAL},
    errors::ContractError,
    events::MigrateEvent,
    state::{bondingcurve::*, config::*},
    utils::sol_transfer_with_signer,
};