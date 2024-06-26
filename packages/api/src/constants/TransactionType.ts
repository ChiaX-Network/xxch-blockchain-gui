enum TransactionType {
  INCOMING = 0,
  OUTGOING = 1,
  COINBASE_REWARD = 2,
  FEE_REWARD = 3,
  INCOMING_TRADE = 4,
  OUTGOING_TRADE = 5,
  INCOMING_CLAWBACK_RECEIVE = 6,
  INCOMING_CLAWBACK_SEND = 7,
  OUTGOING_CLAWBACK = 8,
  INCOMING_CRCAT_PENDING = 9,

  OUTGOING_STAKE_FARM = 70,
  INCOMING_STAKE_FARM_RECEIVE = 72,
  INCOMING_STAKE_LOCK_RECEIVE = 73,
  STAKE_WITHDRAW = 74,
  STAKE_LOCK_WITHDRAW = 75,
}

export default TransactionType;
