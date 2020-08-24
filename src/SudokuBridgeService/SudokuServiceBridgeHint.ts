/// <reference path="../AlphaSudokuService/SudokuServiceHint.ts" />

class SudokuServiceBridgeHint{
  value:String
  index:Number
  type:String
  constructor(){}

  static fromSudokuServiceHint(h:SudokuServiceHint){
    let ssbHint = new SudokuServiceBridgeHint()
    ssbHint.value = h.value
    ssbHint.index = h.index
    ssbHint.type = h.type
    return ssbHint
  }
}
