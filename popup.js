document.getElementById('toggleTheme').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'toggleTheme' });
});

document.getElementById('copyUrl').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await navigator.clipboard.writeText(tab.url);
  
  const button = document.getElementById('copyUrl');
  button.textContent = 'Copied!';
  setTimeout(() => {
    button.textContent = 'Copy Project URL';
  }, 2000);
});

document.getElementById('analyzeCode').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const analysis = document.getElementById('analysis');
  const results = document.getElementById('analysisResults');
  
  chrome.tabs.sendMessage(tab.id, { action: 'analyzeCode' }, response => {
    if (!response) {
      results.innerHTML = '<span class="warning">Unable to analyze code files.</span>';
      analysis.classList.remove('hidden');
      return;
    }

    let html = `<p>Analyzed ${response.totalFiles} code files.</p>`;
    
    if (response.exceedsLimit) {
      html += `
        <p class="warning">⚠️ Total estimated tokens (${response.totalTokens}) exceeds Bolt limit!</p>
        <p>This may cause issues with Bolt.new. Consider splitting the code into smaller files.</p>
      `;
    } else {
      html += `<p class="info">✓ Total tokens (${response.totalTokens}) within limit</p>`;
    }

    if (response.largeFiles.length > 0) {
      html += '<p class="warning">Files that may cause token issues:</p>';
      response.largeFiles.forEach(file => {
        html += `
          <p>${file.name}<br>
          Estimated tokens: ${file.estimatedTokens}</p>
        `;
      });
    }

    results.innerHTML = html;
    analysis.classList.remove('hidden');
  });
});