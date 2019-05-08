// Calculates magnitude of the supplied vector
const magnitude = vector => {
    return Math.sqrt(vector
    .filter(e => {return !!e})
    .reduce((acc, cur) => {
        return acc + cur * cur;
    }, 0));
}

// Calculates the dot product of two vectors
const dotProduct = (vectorA, vectorB) => {
    return vectorA.reduce((acc, cur, idx) => {
        if (vectorB[idx]) {
            return acc + cur * vectorB[idx];
        }

        return 0;
    }, 0);
}

// Return cosine of the angle between two vectors
const cosine = async (vectorA, vectorB) => {
    console.log(vectorA);
    console.log(vectorB);
    const magnitudeA = magnitude(vectorA);
    const magnitudeB = magnitude(vectorB);
    const dot = dotProduct(vectorA, vectorB);

    // console.log(`magnitudes: ${magnitudeA}, ${magnitudeB}`);
    // console.log(`dot: ${dot}`)
    //
    // console.log(magnitudeA * magnitudeB);
    return dotProduct(vectorA, vectorB) / (magnitudeA * magnitudeB);
}

module.exports = {magnitude, dotProduct, cosine};
