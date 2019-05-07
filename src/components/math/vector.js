// Calculates magnitude of the supplied vector
const magnitude = vector => {
    return Math.sqrt(vector
    .filter(e => {return !!e})
    .reduce((acc, cur) => {
        acc += cur * cur;
    }));
}

// Calculates the dot product of two vectors
const dotProduct = (vectorA, vectorB) => {
    return vectorA.reduce((acc, cur, idx) => {
        if (vectorB[idx]) {
            return cur * vectorB[idx];
        }

        return 0;
    });
}

// Return cosine of the angle between two vectors
async cosine(vectorA, vectorB) => {
    const magnitudeA = magnitude(vectorA);
    const magnitudeB = magnitude(vectorB);

    return dotProduct(vectorA, vectorB) / (magnitudeA * magnitudeB);
}

module.exports = {magnitude, dotProduct, cosine};
