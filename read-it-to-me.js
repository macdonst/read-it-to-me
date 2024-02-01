/* globals document window HTMLElement SpeechSynthesisUtterance customElements */
const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    --_ritm-color: var(--ritm-color, #AD6EF9);
    --_ritm-active: var(--ritm-active, black);
    --_ritm-text: var(--ritm-text, white);
    --_ritm-top: var(--ritm-top, 0em);
  }
  :host button {
    color: var(--_ritm-text);
    background-color: var(--_ritm-color, var(--_ritm-active));
    border: 1px solid transparent;
    white-space: nowrap;
    padding-inline: 0.5rem;
    padding-block: 0.5rem;
    font-weight: 600;
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    aspect-ratio: 1 / 1;
  }
  :host button:active {
    color: var(--_ritm-active);
    background-color: var(--_ritm-color, var(--_ritm-text));
    border: 1px solid var(--_ritm-active);
  }

  .pause-icon {
    display: none;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 0.25em;
    margin-block-start: var(--_ritm-top);
  }

  svg {
    width: 16px;
    height: 16px;
  }
</style>
  <div class="controls">
    <button name="play">
      <svg xmlns="http://www.w3.org/2000/svg" class="play-icon" viewBox="0 0 512 512">
        <path d="M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16z" fill="currentColor" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" class="pause-icon" viewBox="0 0 512 512">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 96h16v320h-16zM320 96h16v320h-16z"/>
      </svg>
    </button>
    <button name="stop">
      <svg xmlns="http://www.w3.org/2000/svg" class="stop-icon" viewBox="0 0 512 512">
        <rect x="96" y="96" width="320" height="320" rx="24" ry="24" fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/>
      </svg>
    </button>
  </div>
  <span class="content">
    <slot></slot>
  </span>
`

export class ReadItToMe extends HTMLElement {
  static get observedAttributes() {
    return [ 'pitch', 'rate', 'voice' ]
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }


  connectedCallback() {
    this.synth = window.speechSynthesis

    this.controls = this.shadowRoot.querySelector('div.controls')
    this.playBtn = this.shadowRoot.querySelector('button[name="play"]')
    this.playIcon = this.shadowRoot.querySelector('.play-icon')
    this.pauseIcon = this.shadowRoot.querySelector('.pause-icon')
    this.stopBtn = this.shadowRoot.querySelector('button[name="stop"]')
    // this.content = this.shadowRoot.querySelector('span.content')

    this.toggleReading = this.toggleReading.bind(this)
    this.stopReading = this.stopReading.bind(this)
    this.playBtn.addEventListener('click', this.toggleReading)
    this.stopBtn.addEventListener('click', this.stopReading)

    this.pitch = this.getAttribute('pitch') || 1
    this.rate = this.getAttribute('rate') || 1
    this.lang = this.getAttribute('lang') || "en-US"

    if (!window.speechSynthesis) {
      this.controls.remove()
    }
  }

  disconnectedCallback() {
    this.play.removeEventListener('click', this.toggleReading)
    this.stop.removeEventListener('click', this.stopReading)
  }

  toggleReading() {
    if (this.synth.speaking && !this.synth.paused) {
      console.log('pause')
      this.playIcon.style.display = 'block'
      this.pauseIcon.style.display = 'none'
      this.synth.pause()
    } else if (this.synth.speaking && this.synth.paused) {
      console.log('resume')
      this.playIcon.style.display = 'none'
      this.pauseIcon.style.display = 'block'
      this.synth.resume()
    } else if (!this.synth.paused && !this.synth.speaking) {
      console.log('start playing')
      this.playIcon.style.display = 'none'
      this.pauseIcon.style.display = 'block'

      const content = Array.from(this.children).map(child => child.textContent).join('\n')
      let utterance = new SpeechSynthesisUtterance(content)
      utterance.addEventListener("end", () => {
        this.playIcon.style.display = 'block'
        this.pauseIcon.style.display = 'none'
      })
      utterance.pitch = this.pitch
      utterance.rate = this.rate

      let voices = this.synth.getVoices()

      if (voices.length > 0) {
        let voice = voices.find(element => element.lang === this.lang)
        if (voice) utterance.voice = voice
      }

      this.synth.speak(utterance)
    }
  }

  stopReading() {
    this.playIcon.style.display = 'block'
    this.pauseIcon.style.display = 'none'
    this.synth.cancel()
  }
}

customElements.define('read-it-to-me', ReadItToMe)
