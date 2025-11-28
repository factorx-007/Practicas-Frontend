// Tipos para el perfil de estudiante
export type Rol = 'ADMIN' | 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION';
export type TipoEstudiante = 'PRIMER_CICLO' | 'CICLOS_AVANZADOS' | 'EGRESADO' | 'TITULADO';

// Tipos de disponibilidad
export type DisponibilidadTipo = 'INMEDIATA' | 'DOS_SEMANAS' | 'UN_MES' | 'NEGOCIABLE';

// Modalidades de trabajo
export type ModalidadTrabajo = 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO' | 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'POR_HORAS';

// Tipos de instituciones
export type TipoInstitucion = 'INSTITUTO' | 'UNIVERSIDAD' | 'CENTRO_TECNICO' | 'ESCUELA_PROFESIONAL' | 'COLEGIO';

// Niveles académicos
export type NivelAcademico = 'BACHILLERATO' | 'TECNICO' | 'PREGRADO' | 'LICENCIATURA' | 'MAESTRIA' | 'DOCTORADO' | 'SECUNDARIA';

// Sistemas de notas
export type SistemaNotas = 'VIGESIMAL' | 'ALFABETICO' | 'NUMERICO_100' | 'GPA' | '0_20' | '0_100' | 'A_F' | 'OTRO';

// Niveles de dominio
export type NivelDominio = 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';

// Tipos de proyecto
export type TipoProyecto = 'DESARROLLO_SOFTWARE' | 'DISEÑO' | 'INGENIERIA' | 'INVESTIGACION' | 'EMPRESARIAL' | 'OTRO' | 'ACADEMICO' | 'LABORAL' | 'PERSONAL' | 'PROFESIONAL';

// Estados de proyecto
export type EstadoProyecto = 'COMPLETADO' | 'EN_DESARROLLO' | 'PAUSADO' | 'CANCELADO' | 'EN_PROGRESO' | 'EN_PAUSA';

// Contextos de proyecto
export type ContextoProyecto = 'ACADEMICO' | 'PERSONAL' | 'FREELANCE' | 'COMPETENCIA' | 'EQUIPO' | 'INDIVIDUAL' | 'COLABORATIVO';

// Tipos de certificación
export type TipoCertificacion = 'PROFESIONAL' | 'CURSO_ONLINE' | 'CERTIFICADO_ACADEMICO' | 'CAPACITACION' | 'CERTIFICACION_PROFESIONAL' | 'CURSO' | 'DIPLOMADO' | 'TALLER' | 'TECNICA' | 'IDIOMAS' | 'OTRO';

// Niveles de idioma
export type NivelIdioma = 'A1_BASICO' | 'A2_ELEMENTAL' | 'B1_INTERMEDIO' | 'B2_INTERMEDIO_ALTO' | 'C1_AVANZADO' | 'C2_MAESTRIA' | 'NATIVO' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Tipos de contrato
export type TipoContrato = 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'POR_HORAS' | 'TEMPORAL' | 'PRACTICAS' | 'FREELANCE';

// Exportar todos los tipos
export * from './user';
export * from './offers.types';
// Agrega aquí más exportaciones según sea necesario
