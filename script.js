// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  // 1. Select all input fields / controls
  const form = document.querySelector('form');
  const avatarInput = document.getElementById('avatar');
  const fnameInput = document.getElementById('fname');
  const emailInput = document.getElementById('email');
  const githubInput = document.getElementById('github');

  const uploadArea = document.querySelector('.upload-area');
  const uploadImg = uploadArea.querySelector('img');
  const uploadError = document.getElementById('upload-error');
  const removeImgBtn = document.querySelector('.remove-img');
  const changeImgBtn = document.querySelector('.change-img');

  const MAX_SIZE = 500 * 1024; // 500KB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
  let previewUrl = null;

  // helper: show error text
  function showUploadError(msg) {
    uploadError.textContent = msg;
    uploadError.style.display = msg ? 'block' : 'none';
  }

  // simple HTML escape for injected values
  function escapeHtml(s = '') {
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  // 2. Validate each field sequentially (returns boolean)
  function validateFieldsSequentially() {
    // Full name
    const name = fnameInput.value.trim();
    if (!name) {
      fnameInput.setCustomValidity('Please enter your full name.');
      fnameInput.reportValidity();
      return false;
    }
    fnameInput.setCustomValidity('');

    // Email (uses browser built-in validation)
    const email = emailInput.value.trim();
    if (!email) {
      emailInput.setCustomValidity('Please enter your email address.');
      emailInput.reportValidity();
      return false;
    }
    emailInput.setCustomValidity('');
    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return false;
    }

    // GitHub
    const github = githubInput.value.trim();
    if (!github) {
      githubInput.setCustomValidity('Please enter your GitHub username.');
      githubInput.reportValidity();
      return false;
    }
    githubInput.setCustomValidity('');

    // Avatar file (required)
    const file = avatarInput.files[0];
    if (!file) {
      showUploadError('Please upload an avatar (JPG or PNG, max 500KB).');
      return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      showUploadError('Invalid file type. Use JPG or PNG.');
      return false;
    }
    if (file.size > MAX_SIZE) {
      showUploadError('File too large. Please upload a photo under 500KB.');
      return false;
    }

    // all good
    showUploadError('');
    return true;
  }

  // 3. Image preview + show buttons
  function showPreview(file) {
    // revoke previous
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
    previewUrl = URL.createObjectURL(file);
    uploadImg.src = previewUrl;
    uploadImg.classList.add('preview-active');
    // reveal buttons
    removeImgBtn.style.display = 'inline-block';
    changeImgBtn.style.display = 'inline-block';
    showUploadError('');
  }

  function clearPreview() {
    avatarInput.value = '';
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
    uploadImg.src = 'assets/images/icon-upload.svg';
    uploadImg.classList.remove('preview-active');
    removeImgBtn.style.display = 'none';
    changeImgBtn.style.display = 'none';
    showUploadError('');
  }

  // avatar change listener
  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (!file) {
      clearPreview();
      return;
    }

    // validate file type/size before preview
    if (!ALLOWED_TYPES.includes(file.type)) {
      showUploadError('Invalid file type. Use JPG or PNG.');
      avatarInput.value = '';
      return;
    }
    if (file.size > MAX_SIZE) {
      showUploadError('File too large. Please upload a photo under 500KB.');
      avatarInput.value = '';
      return;
    }

    showPreview(file);
  });

  // remove / change buttons
  removeImgBtn.addEventListener('click', () => {
    clearPreview();
  });

  changeImgBtn.addEventListener('click', () => {
    avatarInput.click();
  });

  // helper: open a new window and write a populated ticket (uses ticket.css)
  function openTicketWindow({ name, email, github, avatarDataUrl }) {
    const w = window.open('', '_blank');
    if (!w) {
      alert('Popup blocked. Allow popups for this site to view the ticket.');
      return;
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeGithub = escapeHtml(github);

    const html = `<!doctype html>
        <html lang="en">
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Your Ticket</title>
        <link rel="stylesheet" href="ticket.css">
        </head>
        <body>
          <header class="header-center">
            <img src="assets/images/logo-full.svg" alt="Coding Conf logo" class="logo-conf">
            <h1>Congrats, <span class="name">${safeName}</span></h1>
            <h1>Your ticket is ready.</h1>
            <p class="subheading">We've emailed your ticket to <span class="email">${safeEmail}</span> and will send updates in the run up to the event.</p>
          </header>

          <div class="ticket-container">
            <div class="ticket-content">
              <div class="ticket-header">
                <img src="assets/images/logo-mark.svg" alt="logo mark" class="logo-mark">
                <div>
                  <h2>Coding Conf</h2>
                  <p class="date-location">Jan 31, 2025 / Austin, TX</p>
                </div>
              </div>

              <div class="ticket-user">
                <img src="${avatarDataUrl}" alt="avatar" class="user-avatar">
                <div class="user-details">
                  <p class="user-name">${safeName}</p>
                  <div class="github-handle">
                    <img src="assets/images/icon-github.svg" alt="" class="github-avatar">
                    <p>${safeGithub}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="ticket-number">
              <p>#01609</p>
            </div>
          </div>
        </body>
        </html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // 4. On submit, run sequential validation and proceed if ok
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = validateFieldsSequentially();
    if (!ok) return;

    const data = {
      name: fnameInput.value.trim(),
      email: emailInput.value.trim(),
      github: githubInput.value.trim()
    };

    const file = avatarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        openTicketWindow({ ...data, avatarDataUrl: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      // fallback avatar
      openTicketWindow({ ...data, avatarDataUrl: 'assets/images/image-avatar.jpg' });
    }
  });

  // initial state: hide image action buttons
  removeImgBtn.style.display = 'none';
  changeImgBtn.style.display = 'none';
});
// ...existing code...