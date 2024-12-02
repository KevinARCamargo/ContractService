import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cadastro = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { login, password };

    try {
      // Requisição para cadastrar o usuário.
      const registerResponse = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (registerResponse.ok) {
        // Se o cadastro for bem-sucedido, tenta fazer login.
        const loginResponse = await fetch('http://localhost:8081/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          const token = loginData.token;
          sessionStorage.setItem('jwtToken', token);
          window.location.href = '/fotografo';
        } else {
          // Exibe uma mensagem de erro caso o login falhe.
          const loginErrorData = await loginResponse.json();
          setError(loginErrorData.message || 'Erro ao fazer login.');
        }
      } else {
        // Processa o erro retornado como JSON
        const registerErrorData = await registerResponse.json();
        setError(registerErrorData.message || 'Erro ao validar cadastro.');
      }
    } catch (error) {
      // Mensagem de erro para problemas de conexão.
      console.error('Erro ao se conectar com o servidor:', error);
      setError('Erro ao se conectar com o servidor.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Cadastro</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
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
              required
            />
          </div>
          <div className="mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Cadastrar
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Já possui uma conta?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-500">
            Voltar para login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
