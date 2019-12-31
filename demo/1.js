function A(option) {
  this.name = option.name;
  this.age = option.age;
  return '1';
  // return {
  //   a: 56
  // }
}
var a = new A({name: 'name',age: 10})
console.log(a instanceof A, a)