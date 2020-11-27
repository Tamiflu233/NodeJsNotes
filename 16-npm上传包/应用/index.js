const {fsWrite,fsRead,fsReadDir} = require('tamifs');

fsReadDir('../').then(files =>{
  console.log(files);
})

async function test () {
  let files = await fsReadDir("../../");
  console.log(files);
}

test()