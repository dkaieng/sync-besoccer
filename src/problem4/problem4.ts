const n = 10
// Implementation A: Iterative Approach
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
// Time Complexity: O(n)
// Space Complexity: O(1)
// This approach uses a loop to accumulate the sum, which is straightforward but linear with respect to n.
//-------------------------------------------------------------------------------------------------------

// Implementation B: Recursive Approach
function sum_to_n_b(n: number): number {
    if (n <= 0) return 0;
    return n + sum_to_n_b(n - 1);
}
// Time Complexity: O(n)
// Space Complexity: O(n) due to call stack
// This recursive approach is elegant but can lead to stack overflow for large n due to deep recursion.
//-------------------------------------------------------------------------------------------------------

 // Implementation C: Mathematical Formula Approach
function sum_to_n_c(n: number): number {
    return (n * (n + 1)) / 2;
}
// Time Complexity: O(1)
// Space Complexity: O(1)
// This approach uses the mathematical formula for the sum of the first n natural numbers, making it the most efficient.
//-------------------------------------------------------------------------------------------------------

console.time("Iterative Approach");
console.log(sum_to_n_a(n), "Iterative Approach");
console.timeEnd("Iterative Approach");

console.time("Recursive Approach");
console.log(sum_to_n_b(n), "Recursive Approach");
console.timeEnd("Recursive Approach");

console.time("Mathematical Formula Approach");
console.log(sum_to_n_c(n), "Mathematical Formula Approach");
console.timeEnd("Mathematical Formula Approach");