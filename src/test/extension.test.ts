import * as path from 'path';
import * as vscode from 'vscode';
import * as vscodeTest from '@vscode/test-electron';
import { expect } from 'chai';

suite('API Tester Tool', function() {
  this.timeout(10000);

  let extensionPath: string;
  let apiTesterPanel: vscode.WebviewPanel | undefined;

  setup(async () => {
    extensionPath = path.resolve(__dirname, '..');
    await vscodeTest.runTests({
      extensionDevelopmentPath: extensionPath,
      extensionTestsPath: path.join(extensionPath, 'test'),
      launchArgs: [path.join(extensionPath, 'test-fixtures', 'empty-workspace')],
    });
  });

  test('Open API Tester Tool', async () => {
    const apiTesterCommand = 'developer-toolbox.showApiTester';
    await vscode.commands.executeCommand(apiTesterCommand);

    // Wait for the webview to open
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (vscode.window.activeTextEditor) {
      const editor = vscode.window.activeTextEditor;
      const webview = editor.document.uri.toString();

      // Check if the webview is opened
      expect(webview).to.contain('apiTester');
    } else {
      throw new Error('Webview panel was not found.');
    }
  });

  test('Check HTML Content', async () => {
    if (!apiTesterPanel) {
      throw new Error('Webview panel is not open.');
    }

    const htmlContent = apiTesterPanel.webview.html;
    expect(htmlContent).to.contain('<title>Live API Tester</title>');
    expect(htmlContent).to.contain('<link rel="stylesheet" href="vscode-resource://');
    expect(htmlContent).to.contain('<script src="vscode-resource://');
  });

  teardown(async () => {
    if (apiTesterPanel) {
      apiTesterPanel.dispose();
    }
  });
});
