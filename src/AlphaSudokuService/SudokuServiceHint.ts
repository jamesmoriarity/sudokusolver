class SudokuServiceHint{
  value:String
  index:Number
  type:String
  constructor(index:Number, value:String, type:String){
    this.index = index
    this.value = value
    this.type = type
  }
  setValue = (val:String) =>{
    this.value = val
  }
  getValue = () =>{
    return(this.value)
  }
}
