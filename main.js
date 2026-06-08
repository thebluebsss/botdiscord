function myString() {
  var str = "";
  for (var param of arguments) {
    str += param + " ";
  }
  console.log(str);
}
myString("Hello", "World", "!");

function test(a, b) {
  return a + b;
}

test(5, 10);
console.log(test(5, 10));
