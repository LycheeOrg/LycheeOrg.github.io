let currentFeatureId = 0;
function nextFeatureId() {
  if (currentFeatureId >= 3) {
    currentFeatureId = 0;
  } else {
    currentFeatureId += 1;
  }
  return currentFeatureId;
}
function selectFeature(t) {
  const windowContent = document.querySelector('.showcase .window__content');
  const r = windowContent.src;
  const o = '' + r.substr(0, r.lastIndexOf('/') + 1) + t + '.jpg';
  const c = document.querySelector(".showcase__feature[data-id='" + t + "']");
  windowContent.src = o;
  document.querySelectorAll('.showcase__feature').forEach(function (f) {
    f.classList.remove('showcase__feature--active');
  });

  c.classList.add('showcase__feature--active');
}
const i = setInterval(function () {
  selectFeature(nextFeatureId());
}, 4e3);
document.querySelectorAll('.showcase__feature').forEach(function (feature) {
  feature.onclick = function (e) {
    e.preventDefault();
    clearInterval(i);
    selectFeature(this.getAttribute('data-id'));
    return false;
  };
});

console.log('main.js loaded');