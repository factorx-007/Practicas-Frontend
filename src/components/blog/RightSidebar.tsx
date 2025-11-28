import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Briefcase, MessageCircle } from 'lucide-react';

import ChatUsersHighlights from './ChatUsersHighlights';
import AvailableUsersList from './AvailableUsersList'; // Importar AvailableUsersList
import JobOffersList from './JobOffersList'; // Importar JobOffersList

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void; // Añadir prop para cerrar el sidebar
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-6 overflow-y-auto lg:relative lg:translate-x-0 border-l border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Información Adicional</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar barra lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Sección de Chats Recientes */}
            <div>
              <div className="flex items-center mb-3">
                <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Chats Recientes</h3>
              </div>
              <ChatUsersHighlights />
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200" />

            {/* Sección de Usuarios Disponibles */}
            <div>
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Usuarios Conectados</h3>
              </div>
              <AvailableUsersList />
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200" />

            {/* Sección de Ofertas de Trabajo */}
            <div>
              <div className="flex items-center mb-3">
                <Briefcase className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Ofertas de Trabajo</h3>
              </div>
              <JobOffersList />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RightSidebar;