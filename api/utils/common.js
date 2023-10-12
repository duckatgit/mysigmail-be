const generateRandomNumber = () => {
  const randomNumber = Math.random();

  const scaledNumber = Math.floor(randomNumber * 10001);

  return scaledNumber;
};

module.exports = {
    generateRandomNumber
}