// middleware/auth.js
import jwt from "jsonwebtoken";

export function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, role: usuario.role, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

export function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

export function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Usuário não autenticado" });
    if (!rolesPermitidos.includes(req.user.role)) {
      console.log("role:", req.user.role)
      return res.status(403).json({ error: "Acesso negado" });
    }
    next();
  };
}
