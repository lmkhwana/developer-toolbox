const vscode = acquireVsCodeApi();

document.getElementById('apiForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const loader = document.getElementById('loader');
    const responseContainer = document.getElementById('responseContainer');
    const responsePre = document.getElementById('response');

    loader.style.display = 'block';
    responseContainer.style.display = 'none';

    const url = document.getElementById('url').value;
    const method = document.getElementById('method').value;
    const headers = document.getElementById('headers').value;
    const body = document.getElementById('body').value;

    const options = {
        method,
        headers: headers ? JSON.parse(headers) : {},
        body: body && (method === 'POST' || method === 'PUT') ? body : null
    };

    try {
        const response = await fetch(url, options);
        const text = await response.text();
        responsePre.textContent = text;
        responseContainer.style.display = 'block';
    } catch (error) {
        responsePre.textContent = 'Error: ' + error.message;
        responseContainer.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
});