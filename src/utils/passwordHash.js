import CryptoJS from 'crypto-js';

/**
 * Gera um hash SHA-256 da senha
 * @param {string} password - Senha em texto plano
 * @returns {string} - Hash da senha
 */
export const hashPassword = (password) => {
  if (!password) {
    throw new Error('Senha não pode ser vazia');
  }
  return CryptoJS.SHA256(password).toString();
};

/**
 * Compara uma senha em texto plano com um hash
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash armazenado
 * @returns {boolean} - true se a senha corresponde ao hash
 */
export const comparePassword = (password, hash) => {
  if (!password || !hash) {
    return false;
  }
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
};
