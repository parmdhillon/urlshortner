const toggleNavBtn = document.getElementById('toggleNav');
const menuEl = document.querySelector('.menu');

toggleNavBtn.addEventListener('click', () => {
  toggleNavBtn.classList.toggle('show');
  menuEl.classList.toggle('show');
  if (menuEl.classList.contains('smooth')) {
    setTimeout(() => {
      menuEl.classList.remove('smooth');
    }, 200);
  } else {
    menuEl.classList.add('smooth');
  }
});

class ShortUrlAPI {
  constructor(url) {
    this.url = url;
    this.hashID;
    this.copyBtn;
    this.shortUrl;
  }

  async sendData() {
    if (this.url == '') {
      return;
    }
    const apiResponse = await fetch('https://rel.ink/api/links/', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: this.url,
      }),
    });
    if (apiResponse.ok) {
      this.hashID = await apiResponse.json();
      this.updateUI();
    } else {
      throw 'Something went wrong! Try Again';
    }
  }

  updateUI() {
    document.querySelector('.shortUrl-container').style.display = 'block';
    const urlEl = document.createElement('div');
    urlEl.className = 'shortUrl-box';
    const urlTemplate = `<div class="shortUrl--link">${this.url}</div>
    <hr />
    <div class="shortUrl--refLink">https://rel.ink/${this.hashID.hashid}</div>`;
    urlEl.innerHTML = urlTemplate;
    this.shortUrl = `https://rel.ink/${this.hashID.hashid}`;
    this.copyBtn = document.createElement('button');
    this.copyBtn.className = 'button';
    this.copyBtn.textContent = 'Copy';
    this.copyBtn.addEventListener(
      'click',
      this.copyBtnHandler.bind(this, this.shortUrl)
    );
    urlEl.insertAdjacentElement('beforeend', this.copyBtn);
    document.querySelector('.shortUrl-container').appendChild(urlEl);
  }

  async copyBtnHandler(shortUrl) {
    await navigator.clipboard.writeText(shortUrl);
    this.copyBtn.textContent = 'Copied!';
    this.copyBtn.classList.add('copied');
    setTimeout(() => {
      this.copyBtn.classList.remove('copied');
      this.copyBtn.textContent = 'Copy';
    }, 1000);
  }
}

class LocalUrl extends ShortUrlAPI {
  constructor() {
    super(false);
  }
}

const getURL = new ShortUrlAPI('https://google.com');
getURL.sendData();
