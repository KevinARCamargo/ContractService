import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const clauses = [
  {
    id: 1,
    text: 'Cláusula 1.2. O valor da taxa de deslocamento é de R$X,00 por quilômetro excedente de condução, calculando a partir da cidade de moradia do CONTRATADO, sendo isento dessa taxa locações dentro do perímetro urbano.',
    placeholder: 'Digite o valor da taxa de deslocamento por KM.',
    key: 'taxaDeDeslocamento',
    format: (value) => `R$${parseFloat(value.replace('R$', '').replace(',', '.')).toFixed(2).replace('.', ',')}`,
    validate: (value) => /^R?\$?(\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/.test(value),
  },
  {
    id: 2,
    text: 'Cláusula 2. Os produtos e serviços deste contrato têm o valor inicial descrito na clausula 1, fora taxas de aluguel, serviço e/ou deslocamento, fotos extras, tempo extra e/ou outros serviços adicionais, pagos da seguinte forma: 1ª parte: R$ X,00 para a reserva da data (acertado na assinatura deste contrato) e a 2ª parte sendo constituída pelo restante do valor acordado. ',
    placeholder: 'Digite o valor fixo ou percentual da 1ª parte',
    key: 'valorInicial',
    format: (value) => value.includes('%') ? value : `R$${parseFloat(value.replace('R$', '').replace(',', '.')).toFixed(2).replace('.', ',')}`,
    validate: (value) => /^R?\$?(\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/.test(value) || /^\d+%$/.test(value),
  },
  {
    id: 3,
    text: 'Cláusula 3. A data do ensaio poderá ser remarcada, sem necessidade de uma nova taxa de reserva, caso seja solicitado em até 7 (sete) dias após o pagamento da reserva ou em caso fortuito que impossibilite o acontecimento da sessão. Caso contrário, será cobrado uma taxa de reserva no valor de R$X,00 para escolher uma nova data.',
    placeholder: 'Digite o valor da reserva de uma nova data.',
    key: 'taxaNovaReserva',
    format: (value) => `R$${parseFloat(value.replace('R$', '').replace(',', '.')).toFixed(2).replace('.', ',')}`,
    validate: (value) => /^R?\$?(\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/.test(value),
  },
  {
    id: 4,
    text: 'Cláusula 4. O prazo para envio das fotos digitais é de X dias úteis, contados a partir do pagamento da segunda parte, conforme explícito na cláusula 2 deste contrato.',
    placeholder: 'Digite o prazo em dias úteis',
    key: 'diasEntregaDigital',
    format: (value) => `${parseInt(value)} dias`,
    validate: (value) => /^\d+$/.test(value),
  },
  {
    id: 5,
    text: 'Cláusula 4. O prazo para envio dos materiais físicos (se houver) é de X dias corridos, contados a partir da aprovação.',
    placeholder: 'Digite o prazo em dias corridos',
    key: 'diasEntregaFisica',
    format: (value) => `${parseInt(value)} dias`,
    validate: (value) => /^\d+$/.test(value),
  },
  {
    id: 6,
    text: 'Cláusula 4.1 Em caso de solicitação de reedição após a entrega final das fotos, será cobrado o valor de R$X,00 por cada foto reeditada.',
    placeholder: 'Digite o valor da taxa de reedição por foto.',
    key: 'taxaReedicao',
    format: (value) => `R$${parseFloat(value.replace('R$', '').replace(',', '.')).toFixed(2).replace('.', ',')}`,
    validate: (value) => /^R?\$?(\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/.test(value),
  },
];

const InfoContrato = ({ token }) => {
  const [currentClause, setCurrentClause] = useState(0);
  const [answers, setAnswers] = useState(Array(clauses.length).fill(''));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    const updatedAnswers = [...answers];
    updatedAnswers[currentClause] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    const currentClauseObj = clauses[currentClause];
    const currentAnswer = answers[currentClause];

    if (currentClauseObj.validate(currentAnswer)) {
      const formattedAnswer = currentClauseObj.format(currentAnswer);
      const updatedAnswers = [...answers];
      updatedAnswers[currentClause] = formattedAnswer;
      setAnswers(updatedAnswers);
      setError('');

      if (currentClause < clauses.length - 1) {
        setCurrentClause(currentClause + 1);
      } else {
        handleSubmit(updatedAnswers); // Passando respostas formatadas para handleSubmit
      }
    } else {
      setError('Entrada inválida. Tente novamente.');
    }
  };

  const handleSubmit = (formattedAnswers) => {
    const token = sessionStorage.getItem('jwtToken');
    
    const formData = clauses.reduce((acc, clause, index) => {
      acc[clause.key] = formattedAnswers[index];
      return acc;
    }, {});

    fetch('http://localhost:8081/fotografo/add-infoContrato', {
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
          navigate('/dash');
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Informações Adicionais do Contrato
        </h2>
        <div className="mb-4 text-justify">
          <p className="text-gray-700">{clauses[currentClause].text}</p>
          <input
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500 mt-2"
            type="text"
            placeholder={clauses[currentClause].placeholder}
            value={answers[currentClause]}
            onChange={handleChange}
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-between">
          {currentClause > 0 && (
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={() => setCurrentClause(currentClause - 1)}
            >
              Anterior
            </button>
          )}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNext}
          >
            {currentClause < clauses.length - 1 ? 'Próxima' : 'Finalizar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoContrato;
