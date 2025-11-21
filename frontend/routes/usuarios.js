const express = require('express');
const router = express.Router();
const ctlUsuarios = require('../apps/usuarios/controller/ctlUsuarios');

router.get('/novo', ctlUsuarios.ViewCadastro);
router.post('/novo', ctlUsuarios.CadastrarUsuario);

module.exports = router;
