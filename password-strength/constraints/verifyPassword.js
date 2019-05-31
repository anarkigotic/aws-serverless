function verificarContraseña(password) {
  return new Promise((resolve, reject) => {
    if (password.length < 6) {
       reject({
        status:false,   
        message: "el password es demasiado corto"
      });
    }
     resolve({
      status:true,   
      message: "el password pasa no pasa nada  la validacion"
    });
  });
}

module.exports = {
    verificarContraseña
};
