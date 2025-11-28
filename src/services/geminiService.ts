import { GoogleGenerativeAI, ChatSession, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// CRÍTICO: La API key debe ser cargada desde variables de entorno para seguridad.
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY no está definida. Por favor, configura tu variable de entorno.");
  // Es buena práctica lanzar un error o deshabilitar la funcionalidad si la clave no está presente.
  // throw new Error("API Key de Gemini no configurada.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Contexto para el modelo de IA, define su personalidad y rol.
const systemInstruction = `
Eres el asistente virtual de ProTalent, una plataforma de reclutamiento impulsada por IA. 
Tu misión es ayudar a los candidatos a entender y aprovechar al máximo la plataforma.

Capacidades:
- Explicar cómo funciona ProTalent
- Guiar en el proceso de creación de perfil
- Aconsejar sobre mejores prácticas para destacar
- Responder dudas sobre el matching con empresas

Tono: Profesional, cercano y motivador
Idioma: Español
Longitud: Respuestas concisas (máximo 3 párrafos)
`;

let chat: ChatSession | null = null;

export const startNewChatSession = (): ChatSession => {
  chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500, // Limita la longitud de las respuestas de la IA
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
    systemInstruction: {
      role: "model",
      parts: [{ text: systemInstruction }]
    }, // Inyecta la instrucción del sistema al inicio del chat
  });
  return chat;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chat) {
    startNewChatSession(); // Iniciar una sesión si no existe (esto no debería pasar si el flujo es correcto)
  }
  if (!API_KEY) {
    return "Lo siento, el asistente de IA no está configurado correctamente. Por favor, contacta a soporte.";
  }

  try {
    const result = await chat!.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error al comunicarse con la API de Gemini:", error);
    // Implementar un manejo de errores más sofisticado aquí (ej. reintentos, mensajes al usuario)
    return "Lo siento, algo salió mal al procesar tu solicitud. Por favor, intenta de nuevo más tarde.";
  }
};
