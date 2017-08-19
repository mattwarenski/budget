import { ScroogePage } from './app.po';

describe('scrooge App', () => {
  let page: ScroogePage;

  beforeEach(() => {
    page = new ScroogePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
