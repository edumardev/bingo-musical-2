export default function getCombinations(input, k) {
    const combinations = [];
    generateCombinations(input, combinations, [], k, 0);
    return combinations;
}

function generateCombinations(input, combinations, current, k, start) {
    if (current.length === k) {
        combinations.push([...current]);
        return;
    }

    for (let i = start; i < input.length; i++) {
        current.push(input[i]);
        generateCombinations(input, combinations, current, k, i + 1);
        current.pop();
    }
}