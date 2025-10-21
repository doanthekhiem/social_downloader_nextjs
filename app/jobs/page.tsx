'use client';

import { useJobsList } from '@/lib/hooks/useYtDlp';
import Link from 'next/link';
import { getJobStatusText, getJobStatusColor, formatFileSize, formatDuration } from '@/lib/utils/ytdlpHelpers';
import { DownloadIcon, ClockIcon, CheckCircleIcon, XCircleIcon, PlayIcon } from 'lucide-react';

export default function JobsPage() {
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useJobsList();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'processing':
        return <PlayIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <DownloadIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Social Downloader</h1>
              <p className="text-sm text-gray-400">Paste URL → pick format → download</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link href="/jobs" className="text-white hover:text-purple-400 transition-colors">Jobs</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Download Jobs</h1>
          <p className="text-gray-400">Monitor your download progress and manage your files</p>
        </div>

        {/* Jobs List */}
        {jobsLoading ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading jobs...</p>
          </div>
        ) : jobsError ? (
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-red-300">{jobsError.message}</p>
          </div>
        ) : jobsData?.jobs.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <DownloadIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
            <p className="text-gray-400 mb-4">Start downloading videos to see them here</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Start Downloading
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobsData?.jobs.map((job) => (
              <div key={job.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {job.thumbnail && (
                      <img
                        src={job.thumbnail}
                        alt="Video thumbnail"
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {job.title || 'Unknown Title'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2 break-all">{job.url}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Format: {job.format}</span>
                        {job.file_size && (
                          <span>Size: {formatFileSize(job.file_size)}</span>
                        )}
                        {job.duration && (
                          <span>Duration: {formatDuration(job.duration)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      <span className={`text-sm font-medium ${getJobStatusColor(job.status)}`}>
                        {getJobStatusText(job.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {job.status === 'processing' && job.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Job Details */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>Created: {new Date(job.created_at).toLocaleString()}</span>
                    <span>Updated: {new Date(job.updated_at).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {job.status === 'completed' && job.file_path && (
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                        Download File
                      </button>
                    )}
                    {job.status === 'failed' && job.error_message && (
                      <span className="text-red-400 text-sm">
                        Error: {job.error_message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
