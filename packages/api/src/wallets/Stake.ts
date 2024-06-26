import Wallet from '../services/WalletService';
import BigNumber from "bignumber.js";
import Transaction from "../@types/Transaction";
import StakeValue from "../@types/StakeValue";
import AutoWithdrawStake from "../@types/AutoWithdrawStake";

export default class StakeWallet extends Wallet {
  async findPoolNFT(args: {launcherId: string, contractAddress: string}) {
    return this.command<{
        totalAmount: BigNumber | number;
        balanceAmount:BigNumber | number;
        recordAmount: BigNumber | number;
        contractAddress: string;
      }>('find_pool_nft', args);
  }

  async recoverPoolNFT(args: {launcherId: string, contractAddress: string, fee: number}) {
      return this.command<{
        amount: number;
        totalAmount:number;
        contractAddress: string;
        status: string;
        error: string;
      }>('recover_pool_nft', args);
  }

  async setAutoWithdrawStake(args: AutoWithdrawStake) {
    return this.command<AutoWithdrawStake>('set_auto_withdraw_stake', args);
  }

  async getAutoWithdrawStake() {
    return this.command<AutoWithdrawStake>('get_auto_withdraw_stake');
  }

  async stakeInfo(args: {
    walletId: number;
    isStakeFarm: boolean;
  }) {
    return this.command<{
      stakeReward: number;
      balance: number;
      balanceExp: number;
      balanceIncome: number;
      balanceOther: number;
      address: string;
      stakeList: StakeValue[];
      stakeOldList: StakeValue[];
      stakeMin: number;
      stakeForkHeight: number;
    }>('stake_info', args);
  }

 async stakeSend(args: {
    walletId: number;
    isStakeFarm: boolean;
    stakeType: number;
    address: string;
    amount: BigNumber;
    fee: BigNumber;
  }) {
    return this.command<{
      transaction: Transaction;
      transactionId: string;
    }>('stake_send', args);
  }

  async spendWithdrawCoins(args: { coinIds: string[]; fee: number | BigNumber }) {
    return this.command<{
      transactionIds: string[];
    }>('spend_withdraw_coins', args);
  }
}
