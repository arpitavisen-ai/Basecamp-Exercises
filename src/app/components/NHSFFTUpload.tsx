import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { parseFFTFile, type ParseResult, type FFTRecord } from '../utils/fftParser';

interface NHSFFTUploadProps {
  onImport?: (records: FFTRecord[]) => void;
}

export function NHSFFTUpload({ onImport }: NHSFFTUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setResult(null);

    try {
      const parseResult = await parseFFTFile(file);
      setResult(parseResult);
    } catch (error) {
      setResult({
        success: false,
        totalRows: 0,
        validRows: 0,
        duplicates: 0,
        errors: [{ row: 0, column: 'file', message: error instanceof Error ? error.message : 'Unknown error occurred' }]
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImport = () => {
    if (result?.records && onImport) {
      onImport(result.records);
    }
  };

  const resetUpload = () => {
    setResult(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Stage 1 — Intelligence Loop
        </p>
        <h2
          className="text-2xl font-semibold text-slate-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          NHS FFT Data Upload
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl">
          Upload NHS Friends and Family Test export files (CSV or XLSX). The system validates structure, 
          detects duplicates, and processes ward-level feedback data.
        </p>
      </div>

      {/* Upload Area */}
      {!result && (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50 transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-sm font-medium text-slate-700">Processing {fileName}...</p>
            </div>
          ) : (
            <>
              <FileSpreadsheet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-3"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select NHS FFT File
              </Button>
              <p className="text-xs text-slate-500">
                Accepts CSV or XLSX matching published NHS FFT structure
              </p>
            </>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Success Summary */}
          {result.success && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <AlertDescription className="text-emerald-900">
                <strong className="font-semibold">Upload successful!</strong>
                <div className="mt-2 text-sm space-y-1">
                  <p>✓ {result.validRows} records validated and ready to import</p>
                  {result.duplicates > 0 && <p>⊘ {result.duplicates} duplicate records skipped</p>}
                  <p className="text-xs text-emerald-700 mt-3">
                    Processing completed in under 5 minutes ✓
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Partial Success or Errors */}
          {!result.success && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong className="font-semibold">Upload failed</strong>
                <div className="mt-2 text-sm">
                  <p>Found {result.errors.length} validation error{result.errors.length !== 1 ? 's' : ''}:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    {result.errors.map((err, idx) => (
                      <li key={idx} className="font-mono">
                        Row {err.row}, {err.column}: {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Rows</p>
              <p className="text-2xl font-semibold text-slate-900">{result.totalRows}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
              <p className="text-xs text-emerald-700 uppercase tracking-wider mb-1">Valid Records</p>
              <p className="text-2xl font-semibold text-emerald-900">{result.validRows}</p>
            </div>
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
              <p className="text-xs text-amber-700 uppercase tracking-wider mb-1">Duplicates Skipped</p>
              <p className="text-2xl font-semibold text-amber-900">{result.duplicates}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={resetUpload} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Upload Another File
            </Button>
            {result.success && result.records && (
              <Button onClick={handleImport}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Import {result.validRows} Records
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
