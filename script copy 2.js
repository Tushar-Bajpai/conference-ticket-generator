// get references to form elements (safe to use elsewhere)
let form, avatarInput, uploadAreaImg, uploadError;
let fnameInput, emailInput, githubInput;
let removeImgBtn, changeImgBtn, submitBtn;

document.addEventListener('DOMContentLoaded', () => {
  form = document.querySelector('form');
  avatarInput = document.getElementById('avatar');
  uploadAreaImg = document.querySelector('.upload-area img');
  uploadError = document.getElementById('upload-error');

  fnameInput = document.getElementById('fname');
  emailInput = document.getElementById('email');
  githubInput = document.getElementById('github');

  removeImgBtn = document.querySelector('.remove-img');
  changeImgBtn = document.querySelector('.change-img');
  submitBtn = document.querySelector('.submit-btn');

 // console.log({ form, avatarInput, uploadAreaImg, fnameInput, emailInput, githubInput });

// ...existing code...
  const MAX_SIZE = 500 * 1024; // 500KB
  let prevAvatarUrl = null;

  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (!file) return;

    const allowed = /^image\/(png|jpe?g)$/i;
    if (!allowed.test(file.type)) {
      uploadError.textContent = 'Only PNG or JPEG images are allowed.';
      uploadError.style.display = 'block';
      avatarInput.value = '';
      return;
    }

    if (file.size > MAX_SIZE) {
      uploadError.textContent = 'File too large. Please upload a photo under 500KB.';
      uploadError.style.display = 'block';
      avatarInput.value = '';
      return;
    }

    uploadError.style.display = 'none';
    if (prevAvatarUrl) URL.revokeObjectURL(prevAvatarUrl);
    prevAvatarUrl = URL.createObjectURL(file);
    uploadAreaImg.src = prevAvatarUrl;
    uploadAreaImg.classList.add('preview-active');
  });

  removeImgBtn.addEventListener('click', () => {
    avatarInput.value = '';
    if (prevAvatarUrl) { URL.revokeObjectURL(prevAvatarUrl); prevAvatarUrl = null; }
    uploadAreaImg.src = 'assets/images/icon-upload.svg';
    uploadAreaImg.classList.remove('preview-active');
    uploadError.style.display = 'none';
  });

  changeImgBtn.addEventListener('click', () => 
    avatarInput.click());

  // helper if you need to persist the image as a data URL
  function fileToDataURL(file, cb) {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  }
// ...existing code...
});

