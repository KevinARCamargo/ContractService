import React from 'react';

const Navbar = () => {
    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Gerenciamento de Contratos</h1>
            <div className="flex items-center space-x-4">
                <span>Olá, Fotógrafo!</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                    Sair
                </button>
            </div>
        </div>
    );
};

export default Navbar;
