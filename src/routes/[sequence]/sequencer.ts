export class Sequencer {
	testSequence = [
		{
			"time": 0,
			"events": [
				{
					"layer": 0,
					"type": "sample"
				}
			]
		},
		{
			"time": 0.25,
			"events": [
				{
					"layer": 2,
					"type": "sample"
				}
			]
		},
		{
			"time": 0.5,
			"events": [
				{
					"layer": 0,
					"type": "sample"
				}
			]
		},
		{
			"time": 0.5,
			"events": [
				{
					"layer": 1,
					"type": "sample"
				}
			]
		},
		{
			"time": 0.75,
			"events": [
				{
					"layer": 2,
					"type": "sample"
				}
			]
		}
	]

	testSamples = [
		{
			"type": "sample",
			"sample": "/samples/FH2_Kick_26.wav"
		},
		{
			"type": "sample",
			"sample": "/samples/FH2_Snare_05.wav"
		},
		{
			"type": "sample",
			"sample": "/samples/FH2_Hat_09.wav"
		},
		{
			"type": "frequency response",
			"sample": "/samples/l960big_empty_church.wav"
		}
	];

	/**
	 * OLD is sequence-old repo
	 * https://github.com/choshun/sequence-old
	 * 
	 * 1. create context
	 * 2. create buffers
	 * 3. create scheduler
	 * 4. play buffers with scheduler via sequence
	 */

	// 1. create context
	// OLD: public/js/application/utility/service.audio-context.js
	private readonly _contextClass = window?.AudioContext || window?.webkitAudioContext || window?.mozAudioContext || window?.oAudioContext || window?.msAudioContext;
	public context: AudioContext | null = null

	constructor() {
		this.createContext()
	}

	createContext() {
		if (this.context) {
			return this.context
		}

		if (this._contextClass) {
			this.context = new this._contextClass()
			return this.context 
		}
	}

	getContext() {
		return this.context
	}

	// 2. create buffers
	// OLD: public/js/application/utility/service.buffer-loader.js
	public buffers: Array<AudioBuffer | undefined> = []
	async loadBuffer(url: string) {
		const response = await fetch(url)
		const arrayBuffer = await response.arrayBuffer()
		const audioBuffer = await this.context?.decodeAudioData(arrayBuffer)
		this.buffers.push(audioBuffer)
	}

	async loadBuffers(urls: Array<string>) {
		for (const url of urls) {
			await this.loadBuffer(url)
		}
	}

	getBuffers() {
		return this.buffers
	}
}