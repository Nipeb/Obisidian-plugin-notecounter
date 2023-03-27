const { Plugin } = require('obsidian');

class NoteOpenCounterPlugin extends Plugin {
  async onload() {
    console.log('Loading note open counter plugin');
    this.app.workspace.on('file-open', this.handleFileOpen.bind(this));
  }

  async handleFileOpen(file) {
    if (!file || file.extension !== 'md') {
      return;
    }
  
    const noteMetadata = await this.app.metadataCache.getFileCache(file);
  
    const noteOpenCount = (noteMetadata?.frontmatter?.open_count ?? 0) + 1;
  
    const content = await this.app.vault.read(file);
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const frontmatterMatch = content.match(frontmatterRegex);
  
    let updatedContent = '';
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const newFrontmatter = frontmatter.replace(
        /open_count:\s*\d+/,
        `open_count: ${noteOpenCount}`
      );
      updatedContent = `---\n${newFrontmatter}\n---\n${content.slice(
        frontmatterMatch[0].length
      )}`;
    } else {
      updatedContent = `---\nopen_count: ${noteOpenCount}\n---\n${content}`;
    }
  
    await this.app.vault.modify(file, updatedContent);
  }

  onunload() {
    console.log('Unloading note open counter plugin');
    this.app.workspace.off('file-open', this.handleFileOpen.bind(this));
  }
}

module.exports = NoteOpenCounterPlugin;