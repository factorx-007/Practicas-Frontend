import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Conversacion,
  Mensaje,
  UsuarioEnLinea,
  EstadoEscritura
} from '@/types/chat';

interface ChatState {
  // Datos
  conversaciones: Conversacion[];
  conversacionActiva: string | null;
  mensajes: Record<string, Mensaje[]>;
  usuariosEnLinea: UsuarioEnLinea[];
  usuariosEscribiendo: Record<string, EstadoEscritura[]>;

  // Estado de carga
  cargandoConversaciones: boolean;
  cargandoMensajes: Record<string, boolean>;
  conectado: boolean;

  // Acciones
  setConversaciones: (conversaciones: Conversacion[]) => void;
  agregarConversacion: (conversacion: Conversacion) => void;
  setConversacionActiva: (id: string | null) => void;

  setMensajes: (conversacionId: string, mensajes: Mensaje[]) => void;
  agregarMensaje: (mensaje: Mensaje) => void;
  actualizarMensaje: (mensaje: Mensaje) => void;

  setUsuariosEnLinea: (usuarios: UsuarioEnLinea[]) => void;
  setUsuarioEscribiendo: (estado: EstadoEscritura) => void;

  setCargandoConversaciones: (cargando: boolean) => void;
  setCargandoMensajes: (conversacionId: string, cargando: boolean) => void;
  setConectado: (conectado: boolean) => void;

  // Limpiar estado
  reset: () => void;
}

const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      // Estado inicial
      conversaciones: [],
      conversacionActiva: null,
      mensajes: {},
      usuariosEnLinea: [],
      usuariosEscribiendo: {},
      cargandoConversaciones: false,
      cargandoMensajes: {},
      conectado: false,

      // Acciones para conversaciones
      setConversaciones: (conversaciones: Conversacion[]) =>
        set({ conversaciones }, false, 'setConversaciones'),

      agregarConversacion: (conversacion: Conversacion) =>
        set(
          (state) => ({
            conversaciones: [conversacion, ...state.conversaciones]
          }),
          false,
          'agregarConversacion'
        ),

      setConversacionActiva: (id: string | null) =>
        set({ conversacionActiva: id }, false, 'setConversacionActiva'),

      // Acciones para mensajes
      setMensajes: (conversacionId: string, mensajes: Mensaje[]) =>
        set(
          (state) => ({
            mensajes: {
              ...state.mensajes,
              [conversacionId]: mensajes
            }
          }),
          false,
          'setMensajes'
        ),

      agregarMensaje: (mensaje: Mensaje) =>
        set(
          (state) => {
            const mensajesExistentes = state.mensajes[mensaje.conversacionId] || [];

            // Evitar duplicados
            const existeYa = mensajesExistentes.some(m => m._id === mensaje._id);
            if (existeYa) return state;

            return {
              mensajes: {
                ...state.mensajes,
                [mensaje.conversacionId]: [...mensajesExistentes, mensaje]
              }
            };
          },
          false,
          'agregarMensaje'
        ),

      actualizarMensaje: (mensaje: Mensaje) =>
        set(
          (state) => {
            const mensajesExistentes = state.mensajes[mensaje.conversacionId] || [];
            const mensajesActualizados = mensajesExistentes.map(m =>
              m._id === mensaje._id ? mensaje : m
            );

            return {
              mensajes: {
                ...state.mensajes,
                [mensaje.conversacionId]: mensajesActualizados
              }
            };
          },
          false,
          'actualizarMensaje'
        ),

      // Acciones para usuarios en línea
      setUsuariosEnLinea: (usuarios: UsuarioEnLinea[]) =>
        set({ usuariosEnLinea: usuarios }, false, 'setUsuariosEnLinea'),

      // Acciones para usuarios escribiendo
      setUsuarioEscribiendo: (estado: EstadoEscritura) =>
        set(
          (currentState) => {
            const { conversacionId, usuarioId, escribiendo } = estado;
            const escrituraActual = currentState.usuariosEscribiendo[conversacionId] || [];

            let nuevaEscritura: EstadoEscritura[];

            if (escribiendo) {
              // Agregar usuario escribiendo (evitar duplicados)
              const yaEscribiendo = escrituraActual.some(e => e.usuarioId === usuarioId);
              if (!yaEscribiendo) {
                nuevaEscritura = [...escrituraActual, estado];
              } else {
                nuevaEscritura = escrituraActual;
              }
            } else {
              // Remover usuario escribiendo
              nuevaEscritura = escrituraActual.filter(e => e.usuarioId !== usuarioId);
            }

            return {
              usuariosEscribiendo: {
                ...currentState.usuariosEscribiendo,
                [conversacionId]: nuevaEscritura
              }
            };
          },
          false,
          'setUsuarioEscribiendo'
        ),

      // Acciones para estados de carga
      setCargandoConversaciones: (cargando: boolean) =>
        set({ cargandoConversaciones: cargando }, false, 'setCargandoConversaciones'),

      setCargandoMensajes: (conversacionId: string, cargando: boolean) =>
        set(
          (state) => ({
            cargandoMensajes: {
              ...state.cargandoMensajes,
              [conversacionId]: cargando
            }
          }),
          false,
          'setCargandoMensajes'
        ),

      setConectado: (conectado: boolean) =>
        set({ conectado }, false, 'setConectado'),

      // Limpiar estado
      reset: () =>
        set(
          {
            conversaciones: [],
            conversacionActiva: null,
            mensajes: {},
            usuariosEnLinea: [],
            usuariosEscribiendo: {},
            cargandoConversaciones: false,
            cargandoMensajes: {},
            conectado: false
          },
          false,
          'reset'
        )
    }),
    {
      name: 'chat-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selectores para optimizar renders
// export const useChatSelectors = {
//   // Conversaciones
//   conversaciones: () => useChatStore(state => state.conversaciones),
//   conversacionActiva: () => useChatStore(state => state.conversacionActiva),
//   cargandoConversaciones: () => useChatStore(state => state.cargandoConversaciones),

//   // Mensajes
//   mensajes: () => useChatStore(state => state.mensajes),
//   mensajesDeConversacion: (conversacionId: string) =>
//     useChatStore(state => state.mensajes[conversacionId] || []),
//   cargandoMensajes: (conversacionId: string) =>
//     useChatStore(state => state.cargandoMensajes[conversacionId] || false),

//   // Usuarios
//   usuariosEnLinea: () => useChatStore(state => state.usuariosEnLinea),
//   usuariosEscribiendo: (conversacionId: string) =>
//     useChatStore(state => state.usuariosEscribiendo[conversacionId] || []),

//   // Estado general
//   conectado: () => useChatStore(state => state.conectado)
// };

// Acciones
export const useChatActions = () => useChatStore(state => ({
  setConversaciones: state.setConversaciones,
  agregarConversacion: state.agregarConversacion,
  setConversacionActiva: state.setConversacionActiva,
  setMensajes: state.setMensajes,
  agregarMensaje: state.agregarMensaje,
  actualizarMensaje: state.actualizarMensaje,
  setUsuariosEnLinea: state.setUsuariosEnLinea,
  setUsuarioEscribiendo: state.setUsuarioEscribiendo,
  setCargandoConversaciones: state.setCargandoConversaciones,
  setCargandoMensajes: state.setCargandoMensajes,
  setConectado: state.setConectado,
  reset: state.reset
}));

export default useChatStore;