function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9\-]/g, '_').toLowerCase();
}

export default sanitizeFilename;
