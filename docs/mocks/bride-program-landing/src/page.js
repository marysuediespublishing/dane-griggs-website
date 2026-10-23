// The mock's frame (job 4212): picks the skin (?lo for the lo-fi, else the hi-fi),
// draws the nine books and the three buttons, and fakes the browser's status
// line on hover so a screenshot can show where a button goes.
/* global document, location, URLSearchParams */
const params = new URLSearchParams(location.search);
document.write(
	'<link rel="stylesheet" href="base.css">' +
		`<link rel="stylesheet" href="${params.has('lo') ? 'lofi.css' : 'hifi.css'}">`,
);

const IMG = '../../../../public/images/';
const BOOKS = [
	['The Bride Program', 'bride-program-cover.jpg', 'Maya volunteers to save her sister.'],
	['Bedside Manners for Aliens', 'bedside-manners-cover.jpg', 'A doctor and a clueless alien physician.'],
	["Threesome's Guide to the Galaxy", 'threesome-guide-cover.jpg', 'Kidnapped, escaped, and loved by two.'],
	['The Bride Program Honeymoon', 'honeymoon-cover.jpg', 'A girls’ trip to the planet Xerini.'],
	['Insatiable Curiosity', 'insatiable-curiosity-cover.jpg', 'A grounded astronaut gets to space.'],
	["The Alien's Gossip Queen", 'gossip-queen-cover.jpg', 'She loves gossip. He loves dogs.'],
	['Marshmallow', 'marshmallow-cover.jpg', 'The gruff general escorts her home.'],
	['War Brides', 'war-brides-cover.jpg', 'The rule-maker falls for a rule-breaker.'],
	["The Chancellor's Pilot", 'chancellors-pilot-cover.jpg', 'A fighter pilot and the chancellor.'],
];

// Example tags: the default ad group, and campaign "x"'s own.
const BOX = 'https://www.amazon.com/dp/B0B2M4RGCS';
const PRINT = 'https://www.amazon.com/dp/1090344378';
const TAGS = {
	'': '?maas=maas_adg_DEFAULT_afap_abs&ref_=aa_maas&tag=maas',
	x: '?maas=maas_adg_CAMPAIGN_X_afap_abs&ref_=aa_maas&tag=maas',
};
const tag = TAGS[params.get('utm_campaign') ?? ''] ?? TAGS[''];

function ctas(short) {
	return (
		`<a class="btn lg rose" data-cta="ku" href="${BOX}${tag}">Read free with Kindle Unlimited</a>` +
		`<p class="note">Free for Kindle Unlimited members</p>` +
		`<a class="btn lg gold" data-cta="buy" href="${BOX}${tag}">Buy the Kindle box set</a>` +
		(short ? '' : `<p class="paper"><a data-cta="paperback" href="${PRINT}${tag}">Prefer paper? Book 1 in paperback →</a></p>`)
	);
}

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('books').innerHTML = BOOKS.map(
		([title, cover, hook], i) =>
			`<li><img src="${IMG}${cover}" alt=""><div><p class="num">Book ${i + 1}</p><p class="bt">${title}</p><p class="bh">${hook}</p></div></li>`,
	).join('');
	document.querySelectorAll('[data-ctas]').forEach((el) => (el.innerHTML = ctas(el.hasAttribute('data-short'))));
	if (params.has('consent')) document.getElementById('consent-bar').hidden = false;

	const status = document.getElementById('status');
	document.querySelectorAll('[data-cta]').forEach((a) => {
		a.addEventListener('mouseenter', () => {
			status.textContent = a.href;
			status.hidden = false;
		});
		a.addEventListener('mouseleave', () => (status.hidden = true));
	});

	const bar = document.getElementById('cta-bar');
	new IntersectionObserver((e) => bar.classList.toggle('away', e[0].isIntersecting)).observe(
		document.getElementById('closing-ctas'),
	);
});
