function goBack() {
    window.history.back();
  }


  function toggleFullscreenImage(src) {
  let overlay = document.getElementById('fullscreen-image-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'fullscreen-image-overlay';
    overlay.classList.add('fullscreen-image-overlay');
    overlay.innerHTML = `<img src="${src}" alt="Full-size image" />`;
    overlay.onclick = () => toggleFullscreenImage(null);
    document.body.appendChild(overlay);
  } else {
    document.body.removeChild(overlay);
  }
}

