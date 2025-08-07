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

use spl_token::instruction::sync_native;

#[derive(Accounts)]
pub struct Migrate<'info> {
    /// CHECK: Safe
    #[account(
        mut,
        constraint = global_config.team_wallet == *team_wallet.key @ContractError::IncorrectAuthority
    )]
    team_wallet: UncheckedAccount<'info>,

    #[account(
        seeds = [CONFIG.as_bytes()],
        bump,
    )]
    global_config: Box<Account<'info, Config>>,

    #[account(
        mut,
        seeds = [BONDING_CURVE.as_bytes(), &coin_mint.key().to_bytes()],
        bump
    )]
    bonding_curve: Box<Account<'info, BondingCurve>>,

    /// CHECK
    #[account(
        mut,
        seeds = [GLOBAL.as_bytes()],
        bump,
    )]
    global_vault: UncheckedAccount<'info>,

    /// CHECK: Safe
    amm_program: UncheckedAccount<'info>,

    /// CHECK: Safe. The spl token program
    // token_program: Program<'info, Token>,
    token_program: UncheckedAccount<'info>,

    /// CHECK: Safe. The associated token program
    // associated_token_program: Program<'info, AssociatedToken>,
    associated_token_program: UncheckedAccount<'info>,

    // /// CHECK: Safe. System program
    // // system_program: Program<'info, System>,
    // system_program: UncheckedAccount<'info>,
    system_program: Program<'info, System>,

    /// CHECK: Safe. Rent program
    // sysvar_rent: Sysvar<'info, Rent>,
    sysvar_rent: UncheckedAccount<'info>,

    /// CHECK: Safe.
    #[account(
        mut,
        seeds = [
            amm_program.key.as_ref(),
            market.key.as_ref(),
            b"amm_associated_seed"],
        bump,
        seeds::program = amm_program.key()
    )]
    amm: UncheckedAccount<'info>,

    /// CHECK: Safe
    #[account(
        seeds = [b"amm authority"],
        bump,
        seeds::program = amm_program.key()
    )]
    amm_authority: UncheckedAccount<'info>,

    /// CHECK: Safe
    #[account(
        mut,
        seeds = [
            amm_program.key.as_ref(),
            market.key.as_ref(),
            b"open_order_associated_seed"],
        bump,
        seeds::program = amm_program.key()
    )]
    amm_open_orders: UncheckedAccount<'info>,

    /// CHECK: Safe
    #[account(
        mut,
        seeds = [
            amm_program.key.as_ref(),
            market.key.as_ref(),
            b"lp_mint_associated_seed"
        ],
        bump,
        seeds::program = amm_program.key()
    )]
    lp_mint: UncheckedAccount<'info>,

    ///CHECK:Safe
    #[account(mut)]
    coin_mint: UncheckedAccount<'info>,

    /// CHECK: Safe. Pc mint account
    pc_mint: UncheckedAccount<'info>,
    /// CHECK: Safe
    #[account(
        mut,
        seeds = [
            amm_program.key.as_ref(),
            market.key.as_ref(),
            b"coin_vault_associated_seed"
        ],
        bump,
        seeds::program = amm_program.key()
    )]
    coin_vault: UncheckedAccount<'info>,

    /// CHECK: Safe
    #[account(
        mut,
        seeds = [
            amm_program.key.as_ref(),
            market.key.as_ref(),
            b"pc_vault_associated_seed"
        ],
        bump,
        seeds::program = amm_program.key()
    )]
    pc_vault: UncheckedAccount<'info>,

    /// CHECK: Safe
    #[account(
        mut,
        seeds = [
            amm_program.key.as_ref(),
            market.key.as_ref(),
            b"target_associated_seed"
        ],
        bump,
        seeds::program = amm_program.key()
    )]
    target_orders: UncheckedAccount<'info>,

    /// CHECK: Safe
    #[account(
        mut,
        seeds = [b"amm_config_account_seed"],
        bump,
        seeds::program = amm_program.key()
    )]
    amm_config: UncheckedAccount<'info>,

    /// CHECK: Safe. OpenBook program.
    market_program: UncheckedAccount<'info>,

    /// CHECK: Safe. OpenBook market. OpenBook program is the owner.
    #[account(mut)]
    market: UncheckedAccount<'info>,

    /// CHECK: Safe. OpenBook market. OpenBook program is the owner.
    #[account(mut)]
    fee_destination: UncheckedAccount<'info>,

    /// CHECK: Safe. The user wallet create the pool
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = coin_mint,
        associated_token::authority = global_vault
    )]
    global_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = pc_mint,
        associated_token::authority = global_vault
    )]
    global_wsol_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: Safe. lp token account of global_vault
    #[account(
        mut,
        seeds = [
            global_vault.key().as_ref(),
            anchor_spl::token::spl_token::ID.as_ref(),
            lp_mint.key().as_ref(),
        ],
        bump,
        seeds::program = anchor_spl::associated_token::ID
    )]
    global_lp_account: UncheckedAccount<'info>,
}

impl<'info> Migrate<'info> {
    pub fn process(&mut self, nonce: u8, global_vault_bump: u8) -> Result<()> {
        let bonding_curve = &mut self.bonding_curve;

        //  check curve is completed
        require!(
            bonding_curve.is_completed == true,
            ContractError::CurveNotCompleted
        );

        require!(
            bonding_curve.real_sol_reserves > self.global_config.curve_limit,
            ContractError::ArithmeticError
        );

        ///Telegram: [enlomy](https://t.me/enlomy)
        Ok(())
    }
}
