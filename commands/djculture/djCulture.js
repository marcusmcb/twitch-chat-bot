const classicDanceMusicFacts = [
	'House music originated in Chicago in the early 1980s, with pioneers like Frankie Knuckles shaping the sound at the Warehouse nightclub.',
	"Detroit techno emerged in the 1980s, with artists like Juan Atkins, Derrick May, and Kevin Saunderson, known as the 'Belleville Three,' defining the genre.",
	"Disco's peak in the late 1970s saw hits like 'Stayin' Alive' by the Bee Gees and 'I Will Survive' by Gloria Gaynor dominate the charts.",
	'The Paradise Garage, a legendary NYC club, was a key venue for early dance music, with DJ Larry Levan pioneering a unique mixing style.',
	'The Roland TR-808 drum machine played a crucial role in the development of house, techno, and electro music, shaping dance music production.',
	"New York’s club culture in the 1970s and '80s helped shape dance music, with venues like Studio 54 and The Loft leading the way.",
	'Freestyle music, blending electro, hip-hop, and Latin influences, became popular in the mid-1980s, with artists like Lisa Lisa & Cult Jam and Shannon.',
	"The term 'house music' is said to come from Chicago's Warehouse nightclub, where Frankie Knuckles played extended dance sets.",
	"Electro-funk, pioneered by Afrika Bambaataa & The Soulsonic Force with 'Planet Rock' (1982), fused hip-hop with electronic beats.",
	"The rise of underground raves in the late 1980s and early '90s helped spread house and techno across the US beyond club culture.",
	"Voguing, a dance style linked to New York’s ballroom scene, was popularized by Madonna’s 'Vogue' (1990) but has roots in LGBTQ+ ballroom culture.",
	'DJ Kool Herc’s breakbeat techniques in the 1970s helped influence both hip-hop and early dance music, leading to the birth of breakdancing.',
	"Sampling played a huge role in early house and hip-hop, with tracks like 'Pump Up the Volume' by M|A|R|R|S using multiple samples to create a dance hit.",
	"Chicago’s 'Jack your body' phrase in house music was a call to dance, with Steve 'Silk' Hurley’s 1986 track of the same name being a major hit.",
	'The influence of disco remained strong in 1980s dance music, with post-disco and boogie emerging as funkier, electronic-driven styles.',
	'Early techno in Detroit was influenced by futuristic themes and Kraftwerk’s electronic sound, merging mechanical beats with funk and soul influences.',
	'The rise of acid house in the late 1980s, using the Roland TB-303 bass synth, helped influence later rave and electronic dance music.',
	'Breakbeats became a key part of early hip-hop and electronic dance music, with DJs isolating drum sections to keep dancers moving.',
	"Giorgio Moroder’s production of Donna Summer’s 'I Feel Love' (1977) revolutionized dance music with its fully electronic sound.",
	'The warehouse party scene in Chicago and New York provided safe spaces for marginalized communities to celebrate dance music and self-expression.',
]

const cultureCommand = (channel, tags, args, client) => {
	let randomIndex = Math.floor(Math.random() * classicDanceMusicFacts.length)
	let randomFact = classicDanceMusicFacts[randomIndex]
	client.say(channel, randomFact)
}

module.exports = {
	cultureCommand: cultureCommand,
}
