import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');

export async function readData(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
}
