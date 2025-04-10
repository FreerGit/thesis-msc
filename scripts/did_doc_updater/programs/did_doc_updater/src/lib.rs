use anchor_lang::prelude::*;

declare_id!("Eaz8J2hJGzFJYSX6reZittxrFkL6PdESB5AJt7LvAUsd");

#[program]
pub mod did_doc_updater {
    use super::*;

    pub fn initialize_did_doc(ctx: Context<InitializeDidDoc>, data: Vec<u8>) -> Result<()> {
        let account = &mut ctx.accounts.did_doc;
        account.data = data;
        Ok(())
    }

    // Your existing update function
    pub fn update(ctx: Context<Update>, data: Vec<u8>) -> Result<()> {
        let account = &mut ctx.accounts.did_doc;
        account.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeDidDoc<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 4 + 1000, // Adjust the space as needed
        seeds = [payer.key().as_ref()],
        bump
    )]
    pub did_doc: Account<'info, DidDoc>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub did_doc: Account<'info, DidDoc>,
}

#[account]
pub struct DidDoc {
    pub data: Vec<u8>,
}

impl DidDoc {
    const LEN: usize = 8 + 32 + 4 + 256; // space for account discriminator, data, and max size for `Vec<u8>`
}
