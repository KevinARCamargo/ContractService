import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState({ login: '', nome: '', clientes: [] });
    const [error, setError] = useState('');
    const [link, setLink] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Função para buscar as informações do usuário (fotógrafo) na API
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:8081/fotografo/info-dash', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Inclua "Bearer" antes do token se necessário
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Erro ao obter informações do fotógrafo');
                }
    
                const data = await response.json();
    
                // Log para verificar o que está sendo recebido na resposta
                console.log("Dados recebidos para a Dashboard:");
                console.log("Nome do Fotógrafo:", data.nome);
                console.log("Login do Fotógrafo:", data.login);
                console.log("Clientes do Fotógrafo:", data.clientes);
    
                setUserInfo(data);
    
                const userName = data.nome || data.login;
                const userLink = `http://localhost:3000/clientForm/${encodeURIComponent(userName)}`;
                setLink(userLink);
            } catch (error) {
                setError(error.message);
            }
        };
    
        fetchUserInfo();
    }, []);
    

    // Função para copiar o link para a área de transferência
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência!');
    };

    // Função para enviar a requisição e gerar o contrato PDF
    const handlePdfRequest = async (clienteId) => {
        try {
            const token = sessionStorage.getItem('jwtToken');
            const payload = {
                nomeFotografo: userInfo.nome,
                idCliente: clienteId,
            };
    
            // Log para verificar o que está sendo enviado na requisição
            console.log("Enviando requisição para gerar contrato PDF com os dados:");
            console.log("Nome do Fotógrafo:", payload.nomeFotografo);
            console.log("ID do Cliente:", payload.idCliente);
            console.log("Token:", token);
    
            const response = await fetch(`http://localhost:8081/fotografo/gerar-contrato`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Inclua "Bearer" antes do token se necessário
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao gerar o contrato PDF');
            }
    
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
    
            window.open(url); // Abre o PDF em uma nova aba
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    };
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClients = userInfo.clientes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(userInfo.clientes.length / itemsPerPage);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-100">
                <Navbar />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Bem-vindo à sua Dashboard</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <p>Aqui você poderá gerenciar seus contratos, serviços e muito mais.</p>

                    <div className="mt-4 flex items-center">
                        <input
                            type="text"
                            value={link}
                            readOnly
                            className="border border-gray-300 rounded p-2 mr-2 w-full"
                        />
                        <button 
                            onClick={copyLinkToClipboard}
                            className="bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Copiar 
                        </button>
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Contratos</h3>
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border-b p-2 text-left font-medium text-gray-600">Nome</th>
                                    <th className="border-b p-2 text-left font-medium text-gray-600">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClients.map((cliente, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border-b p-2">{cliente.nome}</td>
                                        <td className="border-b p-2">
                                            <button
                                                onClick={() => handlePdfRequest(cliente.id)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                <img src="/icons/pdf.png" alt="PDF" className="inline w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 flex justify-center">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="mr-2 bg-gray-300 p-2 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="mx-2">Página {currentPage} de {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-2 bg-gray-300 p-2 rounded disabled:opacity-50"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
