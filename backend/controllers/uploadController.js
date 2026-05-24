import Idea from '../models/Idea.js';
import cloudinary, { assertCloudinaryConfig } from '../config/cloudinary.js';

function getUploadUrl(file) {
  return file.path || file.secure_url || file.url;
}

function buildAttachment(file, type) {
  return {
    type,
    name: file.originalname,
    url: getUploadUrl(file),
    public_id: file.filename || file.public_id,
    size: file.size || file.bytes || 0,
    uploadedAt: new Date(),
  };
}

async function attachToIdea({ ideaId, file, type, res }) {
  assertCloudinaryConfig();

  if (!ideaId) {
    return res.status(400).json({ success: false, error: 'ideaId is required.' });
  }

  if (!file) {
    return res.status(400).json({ success: false, error: 'File is required.' });
  }

  const attachment = buildAttachment(file, type);
  const idea = await Idea.findOne({ id: ideaId });

  if (!idea) {
    const resourceType = attachment.url?.includes('/raw/') ? 'raw' : 'image';
    await cloudinary.uploader.destroy(attachment.public_id, {
      resource_type: resourceType,
    });
    return res.status(404).json({ success: false, error: 'Idea not found' });
  }

  idea.attachments.push(attachment);
  idea.lastActiveAt = new Date();
  idea.xp = (idea.xp || 0) + 3;
  await idea.save();

  return res.status(201).json({
    success: true,
    data: idea,
    attachment: idea.attachments[idea.attachments.length - 1],
  });
}

export async function uploadIdeaImage(req, res) {
  try {
    await attachToIdea({ ideaId: req.body.ideaId, file: req.file, type: 'image', res });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function uploadIdeaPdf(req, res) {
  try {
    await attachToIdea({ ideaId: req.body.ideaId, file: req.file, type: 'pdf', res });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function deleteUpload(req, res) {
  try {
    assertCloudinaryConfig();

    const publicId = req.params.publicId || req.body.public_id;
    if (!publicId) {
      return res.status(400).json({ success: false, error: 'public_id is required.' });
    }

    const idea = await Idea.findOne({ 'attachments.public_id': publicId });
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Attachment not found' });
    }

    const attachment = idea.attachments.find((item) => item.public_id === publicId);
    const resourceType = attachment.url?.includes('/raw/') ? 'raw' : 'image';
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    idea.attachments = idea.attachments.filter((item) => item.public_id !== publicId);
    idea.lastActiveAt = new Date();
    await idea.save();

    res.json({ success: true, data: idea });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}
