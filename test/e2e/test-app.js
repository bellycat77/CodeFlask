'use strict'

const expect = require('chai').expect;

const server = require('../test-server');

//
// Synchronous Mode will depcrecated with Node.js v16
// https://webdriver.io/docs/api/element/isExisting
//

describe('CodeFlask Tests', () => {
  before(async() => {
    await browser.url('http://localhost:8888/');
  });
  
  after(() => {
    server.close();
  });

  it('should open page', async () => {
    const title = await browser.getTitle();
    const url = await browser.getUrl();
    await expect(title).to.be.equals('CodeFlask Test Page');
    await expect(url).to.be.equals('http://localhost:8888/');
  });

  it('should create editor elements', async function () {
    expect(await $('.codeflask').isExisting()).to.be.true;
    expect(await $('.codeflask__pre').isExisting()).to.be.true;
    expect(await $('.codeflask__textarea').isExisting()).to.be.true;
    expect(await $('.codeflask__code').isExisting()).to.be.true;
    expect(await $('.codeflask__flatten').isExisting()).to.be.true;
  });

  it('should enable syntax highlight', async function () {
    expect(await $('.codeflask .token.punctuation').isExisting()).to.be.true;
  });

  it('should render lineNumbers', async function () {
    expect(await $('.codeflask .codeflask__lines').isExisting()).to.be.true;
    expect(await $('.codeflask .codeflask__lines__line').isExisting()).to.be.true;
  });
  
  it('should have same lineNumbers as lines of code', async function () {
    await $('.codeflask__textarea').setValue('let it = "go";\nconst parrot = "bird";');
    expect(await $('.codeflask .codeflask__lines').isExisting()).to.be.true;
    const lines = await $$('.codeflask .codeflask__lines__line');
    expect(lines.length).to.equal(2);
  });

  it('should update editor upon update', async function () {
    await $('.codeflask__textarea').setValue('let it = "go";');
    expect(await $('.codeflask .token.keyword').isExisting());
    expect(await $('.codeflask .token.operator').isExisting());
    expect(await $('.codeflask .token.string').isExisting());
    expect(await $('.codeflask .token.punctuation').isExisting());
  });

  it('should be instance of CodeFlask', async function () {
    const isInstance = await browser.execute(async () => { return flask instanceof CodeFlask });
    expect(isInstance).to.be.true;
  });

  it('.updateCode(): should update lineNumbers', async function () {
    await browser.execute(async () => { flask.updateCode("let age = 20"); });
    const lines = await $$('.codeflask .codeflask__lines__line');
    expect(lines.length).to.equal(1);
  });

  it('.onUpdate(): should execute callback upon user interaction', async function () {
    $('.codeflask__textarea').setValue('');
    browser.execute(() => { flask.onUpdate(code => document.title = code) });
    $('.codeflask__textarea').setValue('let it = "go";');
    browser.getTitle('let it = "go";');
  });

  it('should enable rtl when rtl: true', async function () {
    browser.execute(() => {
      const test_div = document.createElement('div');
      document.body.appendChild(test_div);
      const flask_test = new CodeFlask(test_div, { rtl: true });
    });
    expect(await $('.codeflask__textarea[dir="rtl"]').isExisting());
    expect(await $('.codeflask__pre[dir="rtl"]').isExisting());
  });

  it('should NOT enable rtl when rtl: false', async function () {
    browser.execute(() => {
      const test_div = document.createElement('div');
      document.body.appendChild(test_div);
      const flask_test = new CodeFlask(test_div, { rtl: false });
    });
    expect(await $('.codeflask__textarea:not([dir="rtl"])').isExisting());
    expect(await $('.codeflask__pre:not([dir="rtl"])').isExisting());
  });

  it('should NOT enable rtl when rtl not set', async function () {
    browser.execute(() => {
      const test_div = document.createElement('div');
      document.body.appendChild(test_div);
      const flask_test = new CodeFlask(test_div, { language: 'js' });
    });
    expect(await $('.codeflask__textarea:not([dir="rtl"])').isExisting());
    expect(await $('.codeflask__pre:not([dir="rtl"])').isExisting());
  });

  it('.getCode(): should return current code', async function () {
    await $('.codeflask__textarea').setValue('return "my code here"');
    const code = await browser.execute(() => { return flask.getCode(); });
    expect(code).to.be.equals('return "my code here"');
  });
});