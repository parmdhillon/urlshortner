const toggleNavBtn = document.getElementById('toggleNav');
const menuEl = document.querySelector('.menu');
const form = document.getElementById('shortURLForm');

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
      document.getElementById('responseError').style.display = 'block';
      return;
    } else {
      var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
      var regex = new RegExp(expression);
      if (!this.url.match(regex)) {
        document.getElementById('responseError').style.display = 'block';
        return;
      }
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
      let getHashIDS = localStorage.getItem('hashids');
      getHashIDS = getHashIDS ? getHashIDS.split(',') : [];
      getHashIDS.push(this.hashID.hashid);
      localStorage.setItem('hashids', getHashIDS.toString());
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
    form.reset();
    document.getElementById('responseError').style.display = 'none';
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
    let getHashIDS = localStorage.getItem('hashids');
    if (!getHashIDS) {
      return;
    }
    getHashIDS = getHashIDS.split(',');
    getHashIDS.forEach((hashID) => {
      this.hashID = { hashid: hashID };
      this.fetchData();
    });
  }

  async fetchData() {
    const apiResponse = await fetch(
      'https://rel.ink/api/links/' + this.hashID.hashid + '/'
    );
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      this.url = data.url;
      this.updateUI();
    } else {
      throw 'Something went wrong! Try Again';
    }
  }
}

class App {
  static init() {
    const getURL = new LocalUrl();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newURL = form.querySelector('input').value;
      new ShortUrlAPI(newURL).sendData();
    });
  }
}
App.init();
