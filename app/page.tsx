"use client";

import { useState } from "react";
import { useFormats, useSubmitJob, useJobsList } from "@/lib/hooks/useYtDlp";
import Link from "next/link";
import Image from "next/image";
import { formatFileSize, formatDuration, getPlatformFromUrl } from "@/lib/utils/ytdlpHelpers";
import { DownloadIcon, CopyIcon, XIcon, SunIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon } from "lucide-react";
import { API_CONFIG } from "@/lib/api/config";

export default function Home() {
  const [url, setUrl] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const [downloadingFormats, setDownloadingFormats] = useState<Set<string>>(new Set());
  const [downloadSuccess, setDownloadSuccess] = useState<Set<string>>(new Set());
  const [downloadErrors, setDownloadErrors] = useState<Map<string, string>>(new Map());
  const [submittedJobIds, setSubmittedJobIds] = useState<Set<string>>(new Set());

  const { data: formatsData, isLoading: formatsLoading, error: formatsError } = useFormats(url, !!url);
  const submitJob = useSubmitJob();
  // Remove the downloadFile hook since we'll handle downloads differently
  const { data: jobsData } = useJobsList(0, 50);

  const handleGetFormats = () => {
    if (!url.trim()) return;
    // Reset download states when URL changes
    setDownloadingFormats(new Set());
    setDownloadSuccess(new Set());
    setDownloadErrors(new Map());
    // Formats will be fetched automatically when url changes
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
  };

  const handleClearUrl = () => {
    setUrl("");
  };

  const handleDownload = async (formatId: string) => {
    if (!url.trim()) return;

    // Add to downloading set
    setDownloadingFormats((prev) => new Set(prev).add(formatId));

    // Clear any previous errors for this format
    setDownloadErrors((prev) => {
      const newMap = new Map(prev);
      newMap.delete(formatId);
      return newMap;
    });

    try {
      const job = await submitJob.mutateAsync({
        url: url,
        format: formatId,
      });

      // Mark as successful
      setDownloadSuccess((prev) => new Set(prev).add(formatId));

      // Add job ID to submitted jobs
      setSubmittedJobIds((prev) => new Set(prev).add(job.id));

      // Remove from downloading set
      setDownloadingFormats((prev) => {
        const newSet = new Set(prev);
        newSet.delete(formatId);
        return newSet;
      });

      console.log("Download job submitted:", job);
    } catch (error: any) {
      // Mark as error
      setDownloadErrors((prev) => new Map(prev).set(formatId, error.message || "Download failed"));

      // Remove from downloading set
      setDownloadingFormats((prev) => {
        const newSet = new Set(prev);
        newSet.delete(formatId);
        return newSet;
      });

      console.error("Download error:", error);
    }
  };

  const handleDownloadWithJobId = async (jobId: string) => {
    if (!url.trim()) return;
    try {
      // Create a direct download link
      const downloadUrl = `${API_CONFIG.baseURL}/v1/jobs/${jobId}/download`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess((prev) => new Set(prev).add(jobId));
    } catch (error: any) {
      console.error("Download error:", error);
      setDownloadErrors((prev) => new Map(prev).set(jobId, error.message || "Download failed"));
    }
  };

  const handleDownloadThumbnail = (thumbnailUrl: string, title: string) => {
    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = thumbnailUrl;

    // Clean title for filename
    const cleanTitle = title
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .substring(0, 50); // Limit length

    link.download = `${cleanTitle}_thumbnail.jpg`;
    link.target = "_blank";

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exampleUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://www.tiktok.com/@username/video/1234567890",
  ];

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
            <Link href="/" className="text-white hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">
              Jobs
            </Link>
          </nav>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <SunIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-400 mb-4">Social Downloader</h1>
          <p className="text-xl text-gray-400 mb-8">
            Download videos from YouTube and other platforms with high quality formats
          </p>
        </div>

        {/* URL Input Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-700 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button
                  onClick={handleCopyUrl}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                  title="Copy URL"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearUrl}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                  title="Clear URL"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handleGetFormats}
              disabled={!url.trim() || formatsLoading}
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>{formatsLoading ? "Loading..." : "Get Formats"}</span>
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {showExamples ? "Hide examples" : "Show examples"}
            </button>

            {showExamples && (
              <div className="mt-3 space-y-2">
                {exampleUrls.map((exampleUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setUrl(exampleUrl)}
                    className="block w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {exampleUrl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Formats Section */}
        {formatsData && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center flex-1 space-x-4">
                <Image
                  src={formatsData.thumbnailUrl}
                  alt="Video thumbnail"
                  width={128}
                  height={128}
                  className="object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{formatsData.title}</h3>
                  <p className="text-sm text-gray-400">
                    Duration: {formatDuration(formatsData.durationSec)} • Platform: {getPlatformFromUrl(url)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownloadThumbnail(formatsData.thumbnailUrl, formatsData.title)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Download Thumbnail</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Format</th>
                    <th className="text-left py-3 px-4">Quality</th>
                    <th className="text-left py-3 px-4">Size</th>
                    <th className="text-left py-3 px-4">Codec</th>
                    <th className="text-left py-3 px-4">Format</th>
                    <th className="text-left py-3 px-4">
                      Type
                      <span
                        className="text-xs text-gray-400 ml-1"
                        title="Progressive: Video + Audio | Video-only: Chỉ video | Audio: Chỉ âm thanh"
                      >
                        (?)
                      </span>
                    </th>
                    <th className="text-left py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formatsData.videos.map((video, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{video.note}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{video.height}p</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">{formatFileSize(video.filesizeBytes)}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{video.vcodec}</td>
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-mono">
                          {video.ext}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            video.progressive ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {video.progressive ? "Progressive" : "Video-only"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {downloadingFormats.has(video.itag) ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                            <span className="text-sm text-gray-400">Submitting...</span>
                          </div>
                        ) : downloadSuccess.has(video.itag) ? (
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircleIcon className="w-4 h-4" />
                            <span className="text-sm">Submitted</span>
                          </div>
                        ) : downloadErrors.has(video.itag) ? (
                          <div className="flex items-center space-x-2 text-red-400">
                            <AlertCircleIcon className="w-4 h-4" />
                            <span className="text-sm">Failed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownload(video.itag)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                          >
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {formatsData.audios.map((audio, index) => (
                    <tr key={`audio-${index}`} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">Audio {audio.abrKbps}kbps</td>
                      <td className="py-3 px-4">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          {audio.abrKbps}kbps
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">{formatFileSize(audio.filesizeBytes)}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">-</td>
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-mono">
                          .{audio.ext}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Audio</span>
                      </td>
                      <td className="py-3 px-4">
                        {downloadingFormats.has(audio.itag) ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                            <span className="text-sm text-gray-400">Submitting...</span>
                          </div>
                        ) : downloadSuccess.has(audio.itag) ? (
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircleIcon className="w-4 h-4" />
                            <span className="text-sm">Submitted</span>
                          </div>
                        ) : downloadErrors.has(audio.itag) ? (
                          <div className="flex items-center space-x-2 text-red-400">
                            <AlertCircleIcon className="w-4 h-4" />
                            <span className="text-sm">Failed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownloadWithJobId(audio.itag)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                          >
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submitted Jobs Section */}
        {submittedJobIds.size > 0 && jobsData && (
          <div className="bg-gray-800 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Submitted Jobs</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Format</th>
                    <th className="text-left py-3 px-4">Progress</th>
                    <th className="text-left py-3 px-4">File Size</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsData
                    .filter((job) => submittedJobIds.has(job.id))
                    .map((job) => (
                      <tr key={job.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {job.status === "RUNNING" && (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                                <span className="text-blue-400 text-sm">Running</span>
                              </>
                            )}
                            {job.status === "COMPLETED" && (
                              <>
                                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">Completed</span>
                              </>
                            )}
                            {job.status === "FAILED" && (
                              <>
                                <AlertCircleIcon className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-sm">Failed</span>
                              </>
                            )}
                            {job.status === "EXPIRED" && (
                              <>
                                <ClockIcon className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 text-sm">Expired</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-mono">
                            {job.format}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400">{job.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {job.fileSizeBytes ? formatFileSize(job.fileSizeBytes) : "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">{new Date(job.createdAt).toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          <button
                            onClick={() => handleDownloadWithJobId(job.id)}
                            disabled={job.status !== "COMPLETED"}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                          >
                            {job.status !== "COMPLETED" ? "Downloading..." : "Download"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error State */}
        {formatsError && (
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-red-300">{formatsError.message}</p>
          </div>
        )}

        {/* Loading State */}
        {formatsLoading && (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading formats...</p>
          </div>
        )}
      </main>
    </div>
  );
}
