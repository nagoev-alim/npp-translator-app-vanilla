// ⚡️ Import Styles
import './style.scss';
import countries from './data/mock.js';
import feather from 'feather-icons';
import axios from 'axios';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='translator'>
    <h2 class='title'>Translator</h2>

    <div class='container'>
      <div class='header'>
        <textarea data-text='from' placeholder='Enter text'></textarea>
        <textarea data-text='to' placeholder='Translation' readonly disabled></textarea>
      </div>

      <ul class='controls'>
        <li class='control from'>
          <div class='icons'>
            <button data-icon-from-copy=''>${feather.icons.clipboard.toSvg()}</button>
            <button data-icon-from-volume=''>${feather.icons['volume-2'].toSvg()}</button>
          </div>

          <select data-select='from'>
             ${countries.map(({ value, name }) => value === 'en-GB'
  ? `<option value='${value}' selected>${name}</option>` : `<option value='${value}'>${name}</option>`).join('')}
          </select>
        </li>

        <li class='control exchange'>
          <button data-exchange=''>${feather.icons['refresh-cw'].toSvg()}</button>
        </li>

        <li class='control to'>
          <select data-select='to'>
            ${countries.map(({ value, name }) => value === 'ru-RU'
  ? `<option value='${value}' selected>${name}</option>` : `<option value='${value}'>${name}</option>`).join('')}
          </select>

          <div class='icons'>
            <button data-icon-to-copy=''>${feather.icons.clipboard.toSvg()}</button>
            <button data-icon-to-volume=''>${feather.icons['volume-2'].toSvg()}</button>
          </div>
        </li>

      </ul>
    </div>

    <button data-submit=''>Translate Text</button>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      btnSubmit: document.querySelector('[data-submit]'),
      selectFrom: document.querySelector('[data-select="from"]'),
      textareaFrom: document.querySelector('[data-text="from"]'),
      selectTo: document.querySelector('[data-select="to"]'),
      textareaTo: document.querySelector('[data-text="to"]'),
      exchangeBtn: document.querySelector('[data-exchange]'),
      icons: {
        fromCopy: document.querySelector('[data-icon-from-copy]'),
        fromVolume: document.querySelector('[data-icon-from-volume]'),
        toCopy: document.querySelector('[data-icon-to-copy]'),
        toVolume: document.querySelector('[data-icon-to-volume]'),
      },
    };

    this.DOM.btnSubmit.addEventListener('click', this.onSubmit);
    this.DOM.exchangeBtn.addEventListener('click', this.onExchange);
    this.DOM.icons.fromCopy.addEventListener('click', this.onCopy);
    this.DOM.icons.toCopy.addEventListener('click', this.onCopy);
    this.DOM.icons.fromVolume.addEventListener('click', this.onSpeech);
    this.DOM.icons.toVolume.addEventListener('click', this.onSpeech);
  }


  /**
   * @function onSubmit - Form submit handler
   * @returns {Promise<void>}
   */
  onSubmit = async ({ target }) => {
    const textFrom = this.DOM.textareaFrom.value.trim();

    if (textFrom.length === 0) {
      showNotification('warning', 'Please fill the field.');
      return;
    }

    try {
      target.textContent = 'Loading...';

      const { data: { responseData: { translatedText } } } = await axios.get(`https://api.mymemory.translated.net/get?q=${textFrom}&langpair=${this.DOM.selectFrom.value}|${this.DOM.selectTo.value}`);
      this.DOM.textareaTo.value = translatedText;

      target.textContent = 'Translate Text';
    } catch (e) {
      showNotification('danger', 'Something went wrong, open dev console.')
      console.log(e);
    }
  };

  /**
   * @function onExchange - Exchange languages
   */
  onExchange = () => {
    const tmpText = this.DOM.textareaFrom.value;
    const tmpSelect = this.DOM.selectFrom.value;

    this.DOM.textareaFrom.value = this.DOM.textareaTo.value;
    this.DOM.textareaTo.value = tmpText;

    this.DOM.selectFrom.value = this.DOM.selectTo.value;
    this.DOM.selectTo.value = tmpSelect;
  };

  /**
   * @function onCopy - Copy to clipboard
   * @param target
   */
  onCopy = ({ target }) => {
    navigator.clipboard.writeText(target.matches('[data-icon-from-copy=""]') ? this.DOM.textareaFrom.value : this.DOM.textareaTo.value);
    showNotification('success', 'Success copy to clipboard');
  };

  /**
   * @function onSpeech - Speech text
   * @param target
   */
  onSpeech = ({ target }) => {
    const speechConfig = new SpeechSynthesisUtterance(target.matches('[data-icon-from-volume=""]') ? this.DOM.textareaFrom.value : this.DOM.textareaTo.value);
    speechConfig.lang = target.matches('[data-icon-from-volume=""]') ? this.DOM.selectFrom.value : this.DOM.selectTo.value;
    speechSynthesis.speak(speechConfig);
  };
}

// ⚡️Class instance
new App();
