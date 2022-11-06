const s = skrollr.init({
	forceHeight: false
});
if (s.isMobile() || document.body.offsetWidth <= 960) {
	s.destroy();
}
