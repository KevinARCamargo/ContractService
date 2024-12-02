import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PhotographerForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        userName: '',
        cnpj: '',
        cpf: '',
        cep: '',
        numero: '',
        rua: '',
        cidade: '',
        estado: '',
        servicos: [],
        descricaoServico: '',
        valorServico: '',
    });

    const [error, setError] = useState('');
    const token = sessionStorage.getItem('jwtToken');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const formatCPF = (cpf) => {
        return cpf
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handleAddService = () => {
        const { descricaoServico, valorServico } = formData;
        if (descricaoServico && valorServico) {
            const formattedService = `${descricaoServico} - R$ ${valorServico.replace('.', ',')}`;
            setFormData((prevData) => ({
                ...prevData,
                servicos: [...prevData.servicos, formattedService],
                descricaoServico: '',
                valorServico: '',
            }));
        } else {
            alert('Por favor, preencha tanto a descrição quanto o valor.');
        }
    };

    const handleRemoveService = (serviceToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            servicos: prevData.servicos.filter((service) => service !== serviceToRemove),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8081/fotografo/add-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Erro na resposta da API');
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === 'success') {
                    navigate('/infoContrato');
                } else {
                    setError(data.message || 'Erro desconhecido');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message);
            });
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Cadastro de Fotógrafo</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-left font-medium mb-2">
                        Nome Completo:
                    </label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Nome Completo"
                        className="w-full px-3 py-1 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-left font-medium mb-2">
                        Nome de usuário:
                    </label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        placeholder="Nome de Usuário"
                        className="w-full px-3 py-1 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-left font-medium mb-2">
                            CNPJ:
                        </label>
                        <input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleChange}
                            required
                            placeholder="00.000.000/0000-00"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-left font-medium mb-2">
                            CPF:
                        </label>
                        <input
                            type="text"
                            name="cpf"
                            value={formatCPF(formData.cpf)}
                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                            required
                            placeholder="000.000.000-00"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-left font-medium mb-2">
                        CEP:
                    </label>
                    <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                        placeholder="00000-000"
                        className="w-full px-3 py-1 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-left font-medium mb-2">
                            Rua:
                        </label>
                        <input
                            type="text"
                            name="rua"
                            value={formData.rua}
                            onChange={handleChange}
                            required
                            placeholder="Rua"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-left font-medium mb-2">
                            Número:
                        </label>
                        <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            placeholder="Número"
                            required
                            className="w-full px-3 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-left font-medium mb-2">
                            Cidade:
                        </label>
                        <input
                            type="text"
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                            required
                            placeholder="Cidade"
                            className="w-full px-3 py-1 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-left font-medium mb-2">
                            Estado:
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-1 border border-gray-300 rounded-md"
                        >
                            <option value="">Selecione o estado</option>
                            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((uf) => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-left font-medium mb-2">
                        Lista de Serviços:
                    </label>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            name="descricaoServico"
                            value={formData.descricaoServico}
                            onChange={handleChange}
                            placeholder="Descrição do serviço"
                            className="w-1/2 px-3 py-1 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            name="valorServico"
                            value={formData.valorServico}
                            onChange={handleChange}
                            placeholder="Valor"
                            className="w-1/4 px-3 py-1 border border-gray-300 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={handleAddService}
                            className="w-1/4 bg-blue-500 text-white py-1 rounded-md"
                        >
                            Adicionar
                        </button>
                    </div>
                    <div className="mt-2">
                        {formData.servicos.map((service, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span>{service}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveService(service)}
                                    className="text-red-500 ml-2"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md"
                    >
                        Finalizar Cadastro
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PhotographerForm;
