class SudokuServiceHint{
  value:String
  index:Number
  extra:Boolean
  constructor(){}
  setValue(val:String){
    this.value = val + "key"
  }
}

export default SudokuServiceHint
