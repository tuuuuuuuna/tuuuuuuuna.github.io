// 웹 청첩장 스크립트

document.addEventListener('DOMContentLoaded', function() {
  console.log('청첩장 페이지가 로드되었습니다.');

  initGallery();
  initAccountCopy();
});

/* ===================================
   사진 갤러리 & 라이트박스
   =================================== */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxCurrent = document.getElementById('lightbox-current');
  const lightboxTotal = document.getElementById('lightbox-total');
  const lightboxPlaceholderText = document.querySelector('.lightbox-placeholder-text');

  if (!lightbox || galleryItems.length === 0) return;

  let currentIndex = 0;
  const totalImages = galleryItems.length;
  let focusedElementBeforeModal = null;

  // 총 이미지 개수 표시
  lightboxTotal.textContent = totalImages;

  // 갤러리 아이템 클릭 이벤트
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });

    // Enter 키 지원
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openLightbox(index);
      }
    });
  });

  // 라이트박스 열기
  function openLightbox(index) {
    currentIndex = index;
    focusedElementBeforeModal = document.activeElement;

    updateLightboxImage();
    lightbox.removeAttribute('hidden');
    lightbox.focus();

    // body 스크롤 방지
    document.body.style.overflow = 'hidden';

    // 포커스 트랩 활성화
    trapFocus(lightbox);
  }

  // 라이트박스 닫기
  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';

    // 이전에 포커스되었던 요소로 복귀
    if (focusedElementBeforeModal) {
      focusedElementBeforeModal.focus();
    }
  }

  // 라이트박스 이미지 업데이트
  function updateLightboxImage() {
    lightboxCurrent.textContent = currentIndex + 1;
    lightboxPlaceholderText.textContent = `사진 ${currentIndex + 1}`;

    // 이전/다음 버튼 활성화 상태
    lightboxPrev.disabled = currentIndex === 0;
    lightboxNext.disabled = currentIndex === totalImages - 1;
  }

  // 이전 사진
  function showPrevImage() {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightboxImage();
    }
  }

  // 다음 사진
  function showNextImage() {
    if (currentIndex < totalImages - 1) {
      currentIndex++;
      updateLightboxImage();
    }
  }

  // 이벤트 리스너
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  // 배경 클릭 시 닫기
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // 키보드 네비게이션
  document.addEventListener('keydown', (e) => {
    if (lightbox.hasAttribute('hidden')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });

  // 포커스 트랩 구현
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }
}

/* ===================================
   계좌번호 복사 기능
   =================================== */
function initAccountCopy() {
  const copyButtons = document.querySelectorAll('.copy-button');
  const toast = document.getElementById('copy-toast');

  if (copyButtons.length === 0) return;

  copyButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const accountNumber = this.getAttribute('data-account');

      try {
        // Clipboard API 사용
        await navigator.clipboard.writeText(accountNumber);

        // 버튼 상태 변경
        const originalText = this.textContent;
        this.textContent = '복사 완료!';
        this.classList.add('copied');

        // 토스트 메시지 표시
        showToast();

        // 2초 후 원래 상태로 복원
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('copied');
        }, 2000);

      } catch (err) {
        console.error('복사 실패:', err);

        // Clipboard API 지원하지 않는 경우 대체 방법
        fallbackCopy(accountNumber, this);
      }
    });
  });

  // 토스트 메시지 표시 함수
  function showToast() {
    if (!toast) return;

    toast.removeAttribute('hidden');

    setTimeout(() => {
      toast.setAttribute('hidden', '');
    }, 2000);
  }

  // 대체 복사 방법 (구형 브라우저용)
  function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      const originalText = button.textContent;
      button.textContent = '복사 완료!';
      button.classList.add('copied');

      showToast();

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('대체 복사 방법도 실패:', err);
      button.textContent = '복사 실패';
      setTimeout(() => {
        button.textContent = '계좌번호 복사';
      }, 2000);
    }

    document.body.removeChild(textArea);
  }
}