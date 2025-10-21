'use client';

import { useState } from 'react';
import { useYtDlp, useDownloadFlow } from '@/lib/hooks/useYtDlp';
import { getJobStatusText, getJobStatusColor, formatFileSize, formatDuration } from '@/lib/utils/ytdlpHelpers';

export default function YtDlpExample() {
  const [url, setUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  
  const { data: healthData, isLoading: healthLoading } = useYtDlp.useHealthCheck();
  const { data: formatsData, isLoading: formatsLoading } = useYtDlp.useFormats(url, !!url);
  const { data: jobsData, isLoading: jobsLoading } = useYtDlp.useJobsList();
  
  const downloadFlow = useDownloadFlow();

  const handleGetFormats = () => {
    if (!url) return;
    // Formats will be fetched automatically when url changes
  };

  const handleStartDownload = async () => {
    if (!url || !selectedFormat) return;
    
    try {
      const job = await downloadFlow.startDownload(url, selectedFormat);
      console.log('Job started:', job);
    } catch (error) {
      console.error('Failed to start download:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">YT-DLP Downloader</h1>
      
      {/* Health Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">API Status</h2>
        {healthLoading ? (
          <p>Checking API health...</p>
        ) : (
          <p className={healthData?.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
            Status: {healthData?.status || 'Unknown'}
          </p>
        )}
      </div>

      {/* URL Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Video URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleGetFormats}
          disabled={!url}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Get Formats
        </button>
      </div>

      {/* Formats List */}
      {formatsLoading && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p>Loading formats...</p>
        </div>
      )}

      {formatsData && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Available Formats</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {formatsData.formats.map((format) => (
              <div
                key={format.format_id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedFormat === format.format_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedFormat(format.format_id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{format.format_id}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      {format.ext} • {format.resolution} • {format.vcodec}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {format.filesize ? formatFileSize(format.filesize) : 'Unknown size'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Button */}
      {selectedFormat && (
        <div className="mb-6">
          <button
            onClick={handleStartDownload}
            disabled={downloadFlow.isSubmitting}
            className="px-6 py-3 bg-green-500 text-white rounded-lg disabled:bg-gray-300"
          >
            {downloadFlow.isSubmitting ? 'Starting Download...' : 'Start Download'}
          </button>
        </div>
      )}

      {/* Jobs List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Download Jobs</h2>
        {jobsLoading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="space-y-3">
            {jobsData?.jobs.map((job) => (
              <div key={job.id} className="p-4 border border-gray-300 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{job.title || 'Unknown Title'}</h3>
                    <p className="text-sm text-gray-600">{job.url}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${getJobStatusColor(job.status)}`}>
                    {getJobStatusText(job.status)}
                  </span>
                </div>
                
                {job.progress > 0 && (
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{job.progress}%</p>
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <p>Created: {new Date(job.created_at).toLocaleString()}</p>
                  {job.file_size && (
                    <p>Size: {formatFileSize(job.file_size)}</p>
                  )}
                  {job.duration && (
                    <p>Duration: {formatDuration(job.duration)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
