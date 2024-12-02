import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ClientForm = () => {
    const { userName } = useParams();
    console.log('User Name:', userName);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        cep: '',
        cidade: '',
        estado: '',
        rua: '',
        numero: '',
        dataEnsaio: '',
        horaEnsaio: '',
        servicoContratado: '', 
        fotografoContratado: userName, 
    });

    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCepData = async (cep) => {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.localidade && data.uf) {
                        setFormData(prevData => ({
                            ...prevData,
                            cidade: data.localidade,
                            estado: data.uf
                        }));
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do CEP:", error);
            }
        };

        if (formData.cep.length === 8) {
            fetchCepData(formData.cep);
        }
    }, [formData.cep]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`http://localhost:8081/cliente/info-fotografo?userName=${encodeURIComponent(userName)}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar serviços');
                }

                const data = await response.json();
                console.log('Dados recebidos:', data);
                
                if (data && Array.isArray(data)) {
                    setServices(data);
                } else {
                    setServices([]);
                }
            } catch (err) {
                setError('Erro ao carregar serviços.');
                console.error(err);
                setServices([]);
            }
        };

        fetchServices();
    }, [userName]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataHoraEnsaio = `${formData.dataEnsaio} - ${formData.horaEnsaio}`;

        const registerClientDTO = {
            ...formData,
            dataEnsaio: dataHoraEnsaio,
        };

        try {
            const response = await fetch('http://localhost:8081/cliente/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerClientDTO),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url);
                console.log('Cliente salvo com sucesso e PDF gerado!');
            } else {
                setError('Erro ao salvar cliente.');
            }
        } catch (err) {
            setError('Erro na conexão com o servidor.');
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-lg" style={{ minHeight: '90vh', marginTop: '1vh' }}>
            <h2 className="text-lg font-bold mb-2">Formulário do Cliente</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-1 flex flex-col" style={{ height: '90vh', justifyContent: 'space-between' }}>
                
                <div style={{ height: '7%' }}>
                    <label className="block text-gray-700 text-sm" htmlFor="nome">Nome</label>
                    <input
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ height: '7%' }}>
                    <label className="block text-gray-700 text-sm" htmlFor="cpf">CPF</label>
                    <input
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ height: '7%' }}>
                    <label className="block text-gray-700 text-sm" htmlFor="cep">CEP</label>
                    <input
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        type="text"
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ height: '7%' }}>
                    <label className="block text-gray-700 text-sm" htmlFor="cidade">Cidade</label>
                    <input
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ height: '7%' }}>
                    <label className="block text-gray-700 text-sm" htmlFor="estado">Estado</label>
                    <select
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um estado</option>
                        {/* Lista completa de estados brasileiros */}
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </select>
                </div>

                <div className="flex space-x-2" style={{ height: '7%' }}>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm" htmlFor="rua">Rua</label>
                        <input
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            type="text"
                            id="rua"
                            name="rua"
                            value={formData.rua}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-gray-700 text-sm" htmlFor="numero">Nº</label>
                        <input
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            type="text"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="flex space-x-2" style={{ height: '7%' }}>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm" htmlFor="dataEnsaio">Data do Ensaio</label>
                        <input
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            type="date"
                            id="dataEnsaio"
                            name="dataEnsaio"
                            value={formData.dataEnsaio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm" htmlFor="horaEnsaio">Hora do Ensaio</label>
                        <input
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            type="time"
                            id="horaEnsaio"
                            name="horaEnsaio"
                            value={formData.horaEnsaio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div style={{ height: '7%' }}>
                    <label className="block text-gray-700 text-sm" htmlFor="servicoContratado">Serviço Contratado</label>
                    <select
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        id="servicoContratado"
                        name="servicoContratado"
                        value={formData.servicoContratado}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um serviço</option>
                        {services.map((service, index) => (
                            <option key={index} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="w-full bg-blue-500 text-white py-2 rounded" type="submit" style={{ height: '8%' }}>Enviar</button>
            </form>
        </div>
    );
};

export default ClientForm;


                        