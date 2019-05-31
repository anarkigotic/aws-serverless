const zxcvbn = require("zxcvbn");

function fortaleza(pass) {
  return new Promise((resolve, reject) => {
    var score = zxcvbn(pass).score;
    if (score < 2) {
        reject({
            message:"el password es demasiado debil",
            score
        });
    }
    resolve({
        message:"el password tiene una fortaleza buena",
        score
    })
  });
}

module.exports = {
  fortaleza
};
