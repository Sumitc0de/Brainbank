import { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  Download,
  ExternalLink,
  FileText,
  Image,
  Maximize2,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import useIdeaStore from '../../store/useIdeaStore';
import Button from '../ui/Button';
import { toast } from '../ui/Toast';

const IMAGE_CATEGORIES = [
  { value: 'idea', label: 'Idea' },
  { value: 'logo', label: 'Logo' },
  { value: 'inspiration', label: 'UI' },
];

const PDF_CATEGORIES = [
  { value: 'prd', label: 'PRD' },
  { value: 'research', label: 'Research' },
];

function cloudinaryImage(url, width = 720) {
  if (!url?.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

function pdfPreviewUrl(url) {
  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
}

function downloadUrl(item) {
  if (item.type !== 'pdf' || !item.url?.includes('/upload/') || item.url?.includes('/raw/')) return item.url;
  const filename = encodeURIComponent((item.name || 'brainbank-file').replace(/\.pdf$/i, ''));
  return item.url.replace('/upload/', `/upload/fl_attachment:${filename}/`);
}

function formatSize(size = 0) {
  if (!size) return '';
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date));
}

export default function AttachmentsPanel({ idea }) {
  const { uploadAttachment, deleteAttachment } = useIdeaStore();
  const [imageCategory, setImageCategory] = useState('idea');
  const [pdfCategory, setPdfCategory] = useState('prd');
  const [progress, setProgress] = useState({});
  const [preview, setPreview] = useState(null);

  const attachments = useMemo(() => idea.attachments || [], [idea.attachments]);
  const images = useMemo(() => attachments.filter((item) => item.type === 'image'), [attachments]);
  const pdfs = useMemo(() => attachments.filter((item) => item.type === 'pdf'), [attachments]);

  const uploadFiles = async (files, type, category) => {
    for (const file of files) {
      const key = `${type}-${file.name}-${file.lastModified}`;
      setProgress((current) => ({ ...current, [key]: 1 }));

      try {
        await uploadAttachment({
          ideaId: idea.id,
          file,
          type,
          category,
          onProgress: (value) => setProgress((current) => ({ ...current, [key]: value })),
        });
        toast(`${file.name} uploaded`, 'success');
      } catch (err) {
        toast(err.message || 'Upload failed', 'error');
      } finally {
        setProgress((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
      }
    }
  };

  const remove = async (attachment) => {
    try {
      await deleteAttachment(attachment.public_id);
      toast('Attachment deleted', 'info');
    } catch (err) {
      toast(err.message || 'Delete failed', 'error');
    }
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied', 'success');
    } catch {
      toast('Copy failed', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
            <UploadCloud size={15} className="text-purple" />
            Attachments
          </h3>
          <p className="text-xs text-fg-3 mt-1">{attachments.length} media files in this workspace</p>
        </div>
        <div className="text-[11px] px-2.5 py-1 rounded-lg border border-purple/20 bg-purple/10 text-purple font-bold">
          Cloudinary
        </div>
      </div>

      <DropSurface
        title="Images"
        hint="Logos, screenshots, thumbnails, UI inspiration"
        icon={Image}
        accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'] }}
        categories={IMAGE_CATEGORIES}
        category={imageCategory}
        onCategoryChange={setImageCategory}
        onDrop={(files) => uploadFiles(files, 'image', imageCategory)}
        progress={progress}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((item) => (
            <motion.div
              key={item.public_id}
              layout
              className="group overflow-hidden rounded-xl border border-edge bg-surface-2/70 shadow-card"
            >
              <button
                type="button"
                onClick={() => setPreview(item)}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-surface-3 cursor-zoom-in"
              >
                <img
                  src={cloudinaryImage(item.url, 520)}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute right-2 top-2 rounded-lg bg-black/45 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 size={14} />
                </span>
              </button>
              <AttachmentActions item={item} onCopy={copyLink} onDelete={remove} onPreview={setPreview} />
            </motion.div>
          ))}
        </div>
      )}

      <DropSurface
        title="PDFs"
        hint="PRDs, pitch decks, research docs, planning files"
        icon={FileText}
        accept={{ 'application/pdf': ['.pdf'] }}
        categories={PDF_CATEGORIES}
        category={pdfCategory}
        onCategoryChange={setPdfCategory}
        onDrop={(files) => uploadFiles(files, 'pdf', pdfCategory)}
        progress={progress}
      />

      {pdfs.length > 0 && (
        <div className="space-y-2">
          {pdfs.map((item) => (
            <motion.div
              key={item.public_id}
              layout
              className="rounded-xl border border-edge bg-surface-2/70 p-3 shadow-card"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreview(item)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red/10 text-red border border-red/20 cursor-pointer"
                >
                  <FileText size={22} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-fg">{item.name}</p>
                  <p className="text-xs text-fg-3">{formatSize(item.size)} {formatDate(item.uploadedAt)}</p>
                </div>
              </div>
              <AttachmentActions item={item} onCopy={copyLink} onDelete={remove} onPreview={setPreview} compact />
            </motion.div>
          ))}
        </div>
      )}

      <PreviewModal attachment={preview} onClose={() => setPreview(null)} onCopy={copyLink} />
    </div>
  );
}

function DropSurface({
  title,
  hint,
  icon: Icon,
  accept,
  categories,
  category,
  onCategoryChange,
  onDrop,
  progress,
}) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    multiple: true,
    noClick: true,
    onDrop,
  });

  return (
    <div className="rounded-xl border border-edge bg-surface-2/60 p-3 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-purple" />
          <span className="text-sm font-bold text-fg">{title}</span>
        </div>
        <div className="flex rounded-lg border border-edge bg-white/50 p-0.5">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onCategoryChange(item.value)}
              className={`rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                category === item.value ? 'bg-purple text-white' : 'text-fg-3 hover:text-fg'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-xl border border-dashed p-5 text-center transition-all ${
          isDragActive
            ? 'border-purple bg-purple/10 shadow-glow-purple'
            : 'border-edge bg-white/45 hover:border-purple/40 hover:bg-white/70'
        }`}
      >
        <input {...getInputProps()} />
        <motion.div animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}>
          <UploadCloud size={24} className="mx-auto mb-2 text-purple" />
          <p className="text-sm font-bold text-fg">{isDragActive ? 'Drop to upload' : 'Drag files here'}</p>
          <p className="mt-1 text-xs text-fg-3">{hint}</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={open} icon={UploadCloud}>
            Browse
          </Button>
        </motion.div>
      </div>

      {Object.entries(progress).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(progress).map(([key, value]) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-[11px] text-fg-3">
                <span className="truncate">Uploading</span>
                <span>{value}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full rounded-full bg-gradient-to-r from-purple to-blue" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AttachmentActions({ item, onCopy, onDelete, onPreview, compact = false }) {
  return (
    <div className={`flex items-center justify-between gap-2 ${compact ? 'mt-3' : 'p-2'}`}>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-fg">{item.name}</p>
        <p className="text-[11px] text-fg-3">{formatSize(item.size)} {formatDate(item.uploadedAt)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <IconButton label="Preview" icon={ExternalLink} onClick={() => onPreview(item)} />
        <IconButton label="Copy link" icon={Copy} onClick={() => onCopy(item.url)} />
        <a
          href={downloadUrl(item)}
          download={item.name}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg p-1.5 text-fg-3 transition-colors hover:bg-white/70 hover:text-fg"
          title="Download"
        >
          <Download size={14} />
        </a>
        <IconButton label="Delete" icon={Trash2} onClick={() => onDelete(item)} danger />
      </div>
    </div>
  );
}

function IconButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-lg p-1.5 transition-colors ${
        danger ? 'text-red hover:bg-red/10' : 'text-fg-3 hover:bg-white/70 hover:text-fg'
      }`}
    >
      <Icon size={14} />
    </button>
  );
}

function PreviewModal({ attachment, onClose, onCopy }) {
  return (
    <AnimatePresence>
      {attachment && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 cursor-zoom-out" onClick={onClose} aria-label="Close preview" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-white/15 bg-surface-2 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-fg">{attachment.name}</p>
                <p className="text-xs text-fg-3">{formatSize(attachment.size)} {formatDate(attachment.uploadedAt)}</p>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label="Copy link" icon={Copy} onClick={() => onCopy(attachment.url)} />
                <a
                  href={downloadUrl(attachment)}
                  download={attachment.name}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg p-1.5 text-fg-3 transition-colors hover:bg-white/70 hover:text-fg"
                  title="Download"
                >
                  <Download size={15} />
                </a>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-fg-3 hover:bg-white/70 hover:text-fg">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="max-h-[78vh] bg-surface-0">
              {attachment.type === 'image' ? (
                <img
                  src={cloudinaryImage(attachment.url, 1400)}
                  alt={attachment.name}
                  className="mx-auto max-h-[78vh] w-auto object-contain"
                />
              ) : (
                <div className="relative h-[78vh] w-full bg-white">
                  <iframe
                    title={attachment.name}
                    src={pdfPreviewUrl(attachment.url)}
                    className="h-full w-full bg-white"
                  />
                  <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-edge bg-surface-2/95 px-3 py-2 text-xs text-fg-2 shadow-card">
                    Preview not loading? Open or download the PDF from the toolbar.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
