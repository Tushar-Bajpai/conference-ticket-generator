
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const avatarInput = document.getElementById('avatar');
  const uploadError = document.getElementById('upload-error');
  const uploadImg = document.querySelector('.upload-area img');

  const MAX_SIZE = 500 * 1024; // 500KB
  let prevAvatarUrl = null;

  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (!file) return;

    // validate type and size
    const allowed = /^image\/(png|jpe?g)$/i;
    if (!allowed.test(file.type) || file.size > MAX_SIZE) {
      uploadError.style.display = 'block';
      avatarInput.value = ''; // clear invalid file
      uploadImg.src = 'assets/images/icon-upload.svg';
      uploadImg.classList.remove('preview-active');
      return;
    }

    uploadError.style.display = 'none';
    // preview (fast and releases automatically on navigation)
    if (prevAvatarUrl) {
      URL.revokeObjectURL(prevAvatarUrl);
    }
    prevAvatarUrl = URL.createObjectURL(file);
    uploadImg.src = prevAvatarUrl;
    uploadImg.classList.add('preview-active');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fname = document.getElementById('fname');
    const email = document.getElementById('email');
    const github = document.getElementById('github');

    [fname, email, github].forEach(i => i.setCustomValidity(''));

    // trim and validate emptiness
    const values = {
      fname: fname.value.trim(),
      email: email.value.trim(),
      github: github.value.trim()
    };

    let firstInvalid = null;
    if (!values.fname) {
      fname.setCustomValidity('Please enter your full name.');
      firstInvalid = firstInvalid || fname;
    }
    if (!values.email) {
      email.setCustomValidity('Please enter your email address.');
      firstInvalid = firstInvalid || email;
    }
    if (!values.github) {
      github.setCustomValidity('Please enter your GitHub username.');
      firstInvalid = firstInvalid || github;
    }

    if (firstInvalid) {
      firstInvalid.reportValidity();
      return;
    }

    //fallback 
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const formData = new FormData(form);
    // read values: formData.get('fname'), formData.get('email'), formData.get('github')
    // avatar file is formData.get('avatar') (File object)
    console.log({
      name: formData.get('fname'),
      email: formData.get('email'),
      github: formData.get('github'),
      avatarName: formData.get('avatar')?.name
    });

    // TODO: handle submission / generate ticket UI
  });


  const removeImgBtn = document.querySelector('.remove-img');
  const changeImgBtn = document.querySelector('.change-img');

  removeImgBtn.addEventListener('click', () => {
    
      avatarInput.value = '';
          if (prevAvatarUrl) {
            URL.revokeObjectURL(prevAvatarUrl);
            prevAvatarUrl = null;
          }
          uploadImg.src = 'assets/images/icon-upload.svg';
          uploadImg.classList.remove('preview-active');
          uploadError.style.display = 'none';
  });

  changeImgBtn.addEventListener('click', () => {
    avatarInput.click();
    
  });

  
  document.querySelector('.submit-btn')
    .addEventListener('click', ()=>{
        
        
  });
});
