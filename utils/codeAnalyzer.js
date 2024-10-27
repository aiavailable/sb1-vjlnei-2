class CodeAnalyzer {
  constructor() {
    this.maxTokens = 199999;
    this.avgCharsPerToken = 4;
    this.fileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.py', '.java', '.cpp', '.cs', '.php', '.rb'];
  }

  async analyzeCurrent() {
    try {
      const files = await this.getAllFiles();
      if (!files || files.length === 0) return null;
      return this.analyzeFiles(files);
    } catch (error) {
      console.error('Error analyzing code:', error);
      return null;
    }
  }

  async getAllFiles() {
    const files = [];
    
    try {
      // Get all file elements from the StackBlitz file tree
      const fileElements = document.querySelectorAll('[data-cy="file-tree-item"]');
      
      for (const elem of fileElements) {
        const fileName = elem.getAttribute('title') || elem.textContent.trim();
        if (this.isCodeFile(fileName)) {
          const content = await this.getFileContent(fileName);
          if (content) {
            files.push({ name: fileName, content });
          }
        }
      }
    } catch (error) {
      console.error('Error getting files:', error);
    }

    return files;
  }

  isCodeFile(fileName) {
    return this.fileExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }

  async getFileContent(fileName) {
    try {
      // Use the Monaco editor's model to get file content
      const editors = document.querySelectorAll('.monaco-editor');
      for (const editor of editors) {
        const model = editor.__proto__.getModel();
        if (model && model.uri.path.endsWith(fileName)) {
          return model.getValue();
        }
      }

      // Fallback: Try getting content from visible editor
      const editorContent = document.querySelector('.monaco-scrollable-element');
      if (editorContent) {
        return editorContent.textContent;
      }

      return '';
    } catch (error) {
      console.error('Error getting file content:', error);
      return '';
    }
  }

  analyzeFiles(files) {
    let totalTokens = 0;
    const largeFiles = [];

    files.forEach(file => {
      const estimatedTokens = Math.ceil(file.content.length / this.avgCharsPerToken);
      totalTokens += estimatedTokens;

      if (estimatedTokens > this.maxTokens) {
        largeFiles.push({
          name: file.name,
          estimatedTokens,
          size: file.content.length
        });
      }
    });

    return {
      totalFiles: files.length,
      totalTokens,
      exceedsLimit: totalTokens > this.maxTokens,
      largeFiles,
      tokenLimit: this.maxTokens
    };
  }
}

window.codeAnalyzer = new CodeAnalyzer();