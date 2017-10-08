function fib() {

    let memo = [0, 1];
    let runCount = 0;

    const fibonacci = n => {

         if(memo[n])
             return memo[n];

        runCount++;

        if (n < 2) return n;

        let result = fibonacci(n - 2) + fibonacci(n - 1);
        memo[n] = result;
        return result;
    }

    return {
        fibonacci: fibonacci,
        runCount: () => { return runCount }
    };
}

var fibonacci = fib();
console.log(fibonacci.fibonacci(13));
console.log(fibonacci.runCount());