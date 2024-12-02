import React from 'react';

const Sidebar = () => {
    return (
        <div className="h-screen bg-gray-700 text-white w-64">
            <h2 className="text-2xl font-bold p-4">Dashboard</h2>
            <ul className="space-y-2 p-4">
                <li className="p-2 hover:bg-gray-700 rounded">
                    <a href="#">Contratos</a>
                </li>
                <li className="p-2 hover:bg-gray-700 rounded">
                    <a href="#">Serviços</a>
                </li>
                <li className="p-2 hover:bg-gray-700 rounded">
                    <a href="#">Fotógrafos</a>
                </li>
                <li className="p-2 hover:bg-gray-700 rounded">
                    <a href="#">Configurações</a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
