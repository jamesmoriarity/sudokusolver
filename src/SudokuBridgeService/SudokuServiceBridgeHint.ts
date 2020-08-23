class SudokuServiceBridgeHint{
  value:String
  index:Number
  extra:Boolean
  constructor(){}

  static fromSudokuServiceHint(ssh:SudokuServiceBridgeHint){
    let ssb = new SudokuServiceBridgeHint()
    ssb.value = ssh.value
    ssb.index = ssh.index
    return ssb
  }
}

export default SudokuServiceBridgeHint
