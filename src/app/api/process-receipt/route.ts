import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create a temporary directory for processing
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'receipt-'));
    const filePath = path.join(tempDir, file.name);
    
    console.log('Temp directory created:', tempDir);
    console.log('File path:', filePath);

    // Write the uploaded file to disk
    const bytes = await file.arrayBuffer();
    await fs.promises.writeFile(filePath, Buffer.from(bytes));
    
    console.log('File written to disk');

    // Get the absolute path to the Python script
    const pythonScriptPath = path.join(process.cwd(), 'src', 'python', 'process_receipt.py');
    console.log('Python script path:', pythonScriptPath);

    // Verify Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
      throw new Error(`Python script not found at: ${pythonScriptPath}`);
    }

    // Use Python 3.8 explicitly
    const pythonPath = 'C:\\Users\\veara\\AppData\\Local\\Programs\\Python\\Python38\\python.exe';
    console.log('Using Python executable:', pythonPath);

    // Process the receipt using Python script
    const result = await new Promise((resolve, reject) => {
      console.log('Spawning Python process...');
      console.log('Command:', pythonPath, [pythonScriptPath, filePath]);
      
      const pythonProcess = spawn(pythonPath, [pythonScriptPath, filePath], {
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1',
          PYTHONIOENCODING: 'utf-8'
        },
        cwd: process.cwd() // Set working directory to project root
      });

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Python stdout:', output);
        outputData += output;
      });

      pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error('Python stderr:', error);
        errorData += error;
      });

      pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });

      pythonProcess.on('close', async (code) => {
        console.log('Python process exited with code:', code);
        
        try {
          // Clean up temporary file
          await fs.promises.unlink(filePath).catch(err => {
            console.error('Error cleaning up temp file:', err);
          });
          await fs.promises.rmdir(tempDir).catch(err => {
            console.error('Error cleaning up temp dir:', err);
          });

          if (code === 0) {
            try {
              // Try to parse the last line as JSON (in case there's debug output before it)
              const lines = outputData.trim().split('\n');
              const lastLine = lines[lines.length - 1];
              const result = JSON.parse(lastLine);
              resolve(result);
            } catch (e) {
              console.error('Failed to parse Python output:', e);
              console.error('Raw output:', outputData);
              reject(new Error('Failed to parse Python script output. Check server logs for details.'));
            }
          } else {
            console.error('Python script error output:', errorData);
            reject(new Error(`Python script error: ${errorData || 'Unknown error'}`));
          }
        } catch (error) {
          console.error('Error in cleanup:', error);
          reject(error);
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing receipt:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process receipt' },
      { status: 500 }
    );
  }
} 