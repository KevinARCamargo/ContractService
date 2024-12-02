import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dados para envio
    const userData = {
      login,
      password,
    };

    try {
      const response = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Sucesso: Redirecionar ou armazenar token
        const data = await response.json();
        console.log('Login bem-sucedido', data);
        // Exemplo: Armazenar token
        sessionStorage.setItem('jwtToken', data.token);
        // Redirecionar para a dashboard
        window.location.href = '/dash';
      } else {
        // Falha: Exibir mensagem de erro
        setError('Login ou senha incorretos');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login">
              Login
            </label>
            <input
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
              id="login"
              type="text"
              placeholder="Digite seu login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Entrar
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-blue-400 hover:text-blue-500">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


                        