const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Obtener el token del header de la petición
  const token = req.header('x-auth-token');

  // 2. Si no hay token, negar el acceso
  if (!token) {
    return res.status(401).json({ message: 'No hay token, permiso denegado' });
  }

  // 3. Si hay token, verificar que sea válido
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Guardamos los datos del usuario en el objeto 'req'
    next(); // El guardia da paso a la siguiente función (la ruta)
  } catch (error) {
    res.status(401).json({ message: 'El token no es válido' });
  }
};