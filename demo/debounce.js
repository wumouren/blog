function debounce(fn, wait){
  let timer;
  return function (){
    clearTimeout(timer);
    timer = setTimeout(function(){
      fn()
    }, wait)
  }
}

function func(e){
  console.log('mousemve', this, e);
  return 'debounce'
}

function debounce(fn, wait){
  let timer;
  return function(...args){
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(function(){
      return fn.apply(context, args)
    }, wait)

    // timer = setTimeout(() => {
    //   console.log(this, '--this');
    //   fn()
    // }, wait)
  }
}


console.log(debounce(func, 1000)())