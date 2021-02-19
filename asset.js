/* 
NOTE: Execute the below method to get the results

const exampleOutputAssetList = exampleInputAssetList.map(processAsset).filter(filterValidAsset).sort(sortAsset)
console.log("the result is ...", exampleOutputAssetList);

*/

// Create class and assign object
function typecast(Class, obj) {
	let t = new Class();
	return Object.assign(t, obj);
}

// Move the common  methods to base class
class Base {
	imageDomainReplace() {
		if (!this.image) return;
		this.image = this.image.replace('image.domain1.com/cms', 'cms.domain2.com');
	}
}

// Team class( homeTeam, awayTeam)
class Team extends Base {
	id;
	name;
	image;

	hasValidKeys() {
		return this.id && this.name && this.image;
	}

	result() {
		if (!this.hasValidKeys()) return false;
		this.imageDomainReplace();
		return { id: this.id, name: this.name, image: this.image };
	}
}

// Asset
class Asset extends Base {
	id;
	title;
	image;
	description;
	broadcastStartTime;
	broadcastEndTime;
	duration;
	match;

	hasValidKeys() {
		return this.id && this.title && this.image && this.description && this.broadcastStartTime && this.duration;
	}

	generateBroadcastEndTime() {
		let broadcastStart = new Date(this.broadcastStartTime);
		broadcastStart.setSeconds(broadcastStart.getSeconds() + this.duration);
		this.broadcastEndTime = broadcastStart.toISOString();
	}

	validateMatch() {
		if (!this.match) return;
		const { id, homeTeam, awayTeam } = this.match;

		if (!id || !homeTeam || !awayTeam) return;

		const ht = typecast(Team, homeTeam).result();
		const at = typecast(Team, awayTeam).result();
		if (id && ht && at) return { id, ...ht, ...at };
	}

	result() {
		if (!this.hasValidKeys()) return false;
		this.imageDomainReplace();
		this.generateBroadcastEndTime();
		const match = this.validateMatch();

		return {
			id: this.id,
			title: this.title,
			description: this.description,
			image: this.image,
			duration: this.duration,
			broadcastStartTime: this.broadcastStartTime,
			broadcastEndTime: this.broadcastEndTime,
			...(match && { match })
		};
	}
}

const processAsset = (asst) => typecast(Asset, asst).result();
const sortAsset = (i, j) => new Date(i.broadcastStartTime) - new Date(j.broadcastStartTime);
const filterValidAsset = (isValid) => isValid;
