/**Random generator function**/
let randomGenerator = function randomGenerator() {

    return Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);

};

module.exports = randomGenerator;