// es7装饰器(很多node版本可能不支持)
function zsq(target) {
  console.log(target);
}
/* @zsq */
class User {
  constructor() {
    this.username = "小明";
    this.password = "123456";
  }
}

var u1 = new User()
console.log(u1);