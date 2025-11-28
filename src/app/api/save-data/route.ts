import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ruta al archivo de datos
const dataFilePath = path.join(process.cwd(), 'data', 'form-submissions.json');

export async function POST(request: Request) {
  try {
    // Crear directorio si no existe
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Leer datos existentes o inicializar array vacío
    let submissions = [];
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      submissions = JSON.parse(fileContent);
    }

    // Agregar nuevo registro
    const newData = await request.json();
    const timestamp = new Date().toISOString();
    const submissionWithTimestamp = {
      ...newData,
      id: Date.now().toString(),
      timestamp
    };
    
    submissions.push(submissionWithTimestamp);

    // Guardar en el archivo
    fs.writeFileSync(dataFilePath, JSON.stringify(submissions, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true, 
      message: 'Datos guardados correctamente',
      data: submissionWithTimestamp
    });
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar los datos' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      return NextResponse.json(JSON.parse(fileContent));
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error al leer los datos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al leer los datos' },
      { status: 500 }
    );
  }
}
