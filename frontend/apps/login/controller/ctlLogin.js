const axios = require('axios');



const LoginView = (req, res) => {
    // Renderiza o arquivo 'views/login/login.ejs'
    res.render('login/login', { title: 'Login', message: null });
};




const LoginExec = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Frontend chama a API do Backend
        const resp = await axios.post(process.env.SERVIDOR_DW3 + "/Login", {
            username: username,
            password: password
        });

        // Se o Backend disse que não está autorizado --->auth: false
        if (!resp.data.auth) {
            return res.render('login/login', { 
                title: 'Login', 
                message: resp.data.message
            });
        }
        //se triver logado, salva na session
        if (resp.data.auth) {
            req.session.isLogged = true;
            req.session.token = resp.data.token;
            req.session.userName = username;
            
            req.session.isAdmin = resp.data.isadmin;
            return res.redirect('/');
        }
        
        // Manda o user para a Home
        res.redirect('/');

    } catch (error) {
        console.error('Erro no Login:', error.message);
        res.render('login/login', { title: 'Login', message: 'Erro de conexão com o servidor' });
    }
};



const Logout = (req, res) => {
    req.session.destroy();
    res.redirect('/Login');
};

module.exports = {
    LoginView,
    LoginExec,
    Logout
};