// 웹 청첩장 스크립트

document.addEventListener('DOMContentLoaded', async function() {
  console.log('청첩장 페이지가 로드되었습니다.');

  // config.json 로드 및 렌더링
  const config = await loadConfig();
  if (config) {
    renderPage(config);
  } else {
    console.error('config.json 로드 실패. 기본 하드코딩 데이터를 사용합니다.');
  }

  initGallery();
  initAccountCopy();
});

/* ===================================
   유틸리티 함수
   =================================== */

/**
 * XSS 방지를 위한 HTML 이스케이프 함수
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ===================================
   Config 로딩
   =================================== */

/**
 * config.json 파일을 비동기로 로드
 * @returns {Promise<Object|null>} config 객체 또는 null
 */
async function loadConfig() {
  try {
    const response = await fetch('./config.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: config.json 로드 실패`);
    }
    const config = await response.json();
    console.log('config.json 로드 성공:', config);
    return config;
  } catch (error) {
    console.error('config.json 로딩 실패:', error);
    return null;
  }
}

/* ===================================
   페이지 렌더링
   =================================== */

/**
 * 전체 페이지를 config 데이터로 렌더링
 * @param {Object} config - config.json 데이터
 */
function renderPage(config) {
  renderMeta(config);
  renderHero(config);
  renderCouple(config);
  renderCeremony(config);
  renderTransport(config);
  renderAccount(config);
  renderFooter(config);
}

/**
 * 메타 태그 업데이트
 */
function renderMeta(config) {
  if (!config.meta) return;

  // 페이지 제목
  if (config.meta.title) {
    document.title = config.meta.title;
  }

  // 메타 description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && config.meta.description) {
    metaDesc.setAttribute('content', config.meta.description);
  }

  // OG 태그
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && config.meta.title) {
    ogTitle.setAttribute('content', config.meta.title);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && config.meta.description) {
    ogDesc.setAttribute('content', config.meta.description);
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && config.meta.ogImage) {
    ogImage.setAttribute('content', config.meta.ogImage);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl && config.meta.ogUrl) {
    ogUrl.setAttribute('content', config.meta.ogUrl);
  }
}

/**
 * 히어로 섹션 렌더링
 */
function renderHero(config) {
  const groomNameEl = document.querySelector('.groom-name');
  const brideNameEl = document.querySelector('.bride-name');
  const heroDateEl = document.querySelector('.hero-date');
  const heroMessageEl = document.querySelector('.hero-message');

  if (groomNameEl && config.groom) {
    groomNameEl.textContent = config.groom.nameEn || config.groom.name;
  }

  if (brideNameEl && config.bride) {
    brideNameEl.textContent = config.bride.nameEn || config.bride.name;
  }

  if (heroDateEl && config.wedding) {
    heroDateEl.textContent = config.wedding.dateDisplay || config.wedding.date;
  }

  if (heroMessageEl && config.messages && config.messages.hero) {
    heroMessageEl.innerHTML = escapeHtml(config.messages.hero).replace(/\n/g, '<br>');
  }
}

/**
 * 신랑/신부 소개 섹션 렌더링
 */
function renderCouple(config) {
  // 신랑 정보
  if (config.groom) {
    const groomNameEl = document.querySelector('.couple-card:nth-of-type(1) .couple-name');
    const groomParentsEl = document.querySelector('.couple-card:nth-of-type(1) .couple-parents');

    if (groomNameEl) {
      groomNameEl.textContent = config.groom.name;
    }

    if (groomParentsEl && config.groom.parents) {
      groomParentsEl.innerHTML = `
        <span class="parent-label">아버지</span> ${escapeHtml(config.groom.parents.father)} <span class="parent-separator">·</span>
        <span class="parent-label">어머니</span> ${escapeHtml(config.groom.parents.mother)}
      `;
    }
  }

  // 신부 정보
  if (config.bride) {
    const brideNameEl = document.querySelector('.couple-card:nth-of-type(2) .couple-name');
    const brideParentsEl = document.querySelector('.couple-card:nth-of-type(2) .couple-parents');

    if (brideNameEl) {
      brideNameEl.textContent = config.bride.name;
    }

    if (brideParentsEl && config.bride.parents) {
      brideParentsEl.innerHTML = `
        <span class="parent-label">아버지</span> ${escapeHtml(config.bride.parents.father)} <span class="parent-separator">·</span>
        <span class="parent-label">어머니</span> ${escapeHtml(config.bride.parents.mother)}
      `;
    }
  }

  // 인사말
  const greetingEl = document.querySelector('.couple-message p');
  if (greetingEl && config.messages && config.messages.greeting) {
    greetingEl.innerHTML = escapeHtml(config.messages.greeting).replace(/\n/g, '<br>');
  }
}

/**
 * 예식 정보 섹션 렌더링
 */
function renderCeremony(config) {
  if (!config.wedding) return;

  // 날짜
  const dateTextEl = document.querySelector('.date-text time');
  if (dateTextEl) {
    dateTextEl.textContent = config.wedding.dateDisplay || config.wedding.date;
    dateTextEl.setAttribute('datetime', config.wedding.date);
  }

  // 시간
  const timeTextEl = document.querySelector('.time-text time');
  if (timeTextEl) {
    timeTextEl.textContent = config.wedding.timeDisplay || config.wedding.time;
    timeTextEl.setAttribute('datetime', config.wedding.time);
  }

  // 예식장 정보
  if (config.wedding.venue) {
    const venueNameEl = document.querySelector('.venue-name');
    const venueHallEl = document.querySelector('.venue-hall');
    const venueAddressEl = document.querySelector('.venue-address');
    const mapLinkEl = document.querySelector('#ceremony .map-link');

    if (venueNameEl) {
      venueNameEl.textContent = config.wedding.venue.name;
    }

    if (venueHallEl) {
      venueHallEl.textContent = config.wedding.venue.hall;
    }

    if (venueAddressEl) {
      venueAddressEl.innerHTML = `
        ${escapeHtml(config.wedding.venue.address)}<br>
        ${escapeHtml(config.wedding.venue.building)}
      `;
    }

    if (mapLinkEl && config.wedding.venue.mapUrl) {
      mapLinkEl.setAttribute('href', config.wedding.venue.mapUrl);
    }
  }
}

/**
 * 교통 안내 섹션 렌더링
 */
function renderTransport(config) {
  if (!config.transport) return;

  // 지하철
  if (config.transport.subway) {
    const subwayCard = document.querySelector('.transport-card:nth-of-type(1) .transport-content');
    if (subwayCard) {
      subwayCard.innerHTML = `
        <p><strong>${escapeHtml(config.transport.subway.line)}</strong> ${escapeHtml(config.transport.subway.exit)}</p>
        <p class="transport-detail">${escapeHtml(config.transport.subway.walkTime)}</p>
      `;
    }
  }

  // 버스
  if (config.transport.bus) {
    const busCard = document.querySelector('.transport-card:nth-of-type(2) .transport-content');
    if (busCard) {
      busCard.innerHTML = `
        <p><strong>간선</strong> ${escapeHtml(config.transport.bus.mainLine)}</p>
        <p><strong>지선</strong> ${escapeHtml(config.transport.bus.branchLine)}</p>
        <p class="transport-detail">${escapeHtml(config.transport.bus.station)}</p>
      `;
    }
  }

  // 자가용
  if (config.transport.car) {
    const carCard = document.querySelector('.transport-card:nth-of-type(3) .transport-content');
    if (carCard) {
      carCard.innerHTML = `
        <p><strong>주차</strong> ${escapeHtml(config.transport.car.parking)}</p>
        <p class="transport-detail">${escapeHtml(config.transport.car.detail)}</p>
      `;
    }
  }

  // 카카오맵 링크
  if (config.wedding && config.wedding.venue && config.wedding.venue.mapUrl) {
    const transportMapLink = document.querySelector('#transport .map-link');
    if (transportMapLink) {
      transportMapLink.setAttribute('href', config.wedding.venue.mapUrl);
    }
  }
}

/**
 * 계좌 정보 섹션 렌더링
 */
function renderAccount(config) {
  // 신랑측 계좌
  if (config.groom && config.groom.accounts) {
    const groomCardEl = document.querySelector('.account-card:nth-of-type(1)');
    if (groomCardEl) {
      // 기존 account-item 제거
      const existingItems = groomCardEl.querySelectorAll('.account-item');
      existingItems.forEach(item => item.remove());

      // 새 계좌 정보 추가
      config.groom.accounts.forEach(account => {
        const accountHTML = `
          <div class="account-item">
            <p class="account-owner">${escapeHtml(account.owner)}</p>
            <p class="account-info">
              <span class="account-bank">${escapeHtml(account.bank)}</span>
              <span class="account-number">${escapeHtml(account.number)}</span>
            </p>
            <button class="copy-button"
                    data-account="${escapeHtml(account.numberRaw)}"
                    aria-label="${escapeHtml(account.owner)} 계좌번호 복사">
              계좌번호 복사
            </button>
          </div>
        `;
        groomCardEl.insertAdjacentHTML('beforeend', accountHTML);
      });
    }
  }

  // 신부측 계좌
  if (config.bride && config.bride.accounts) {
    const brideCardEl = document.querySelector('.account-card:nth-of-type(2)');
    if (brideCardEl) {
      // 기존 account-item 제거
      const existingItems = brideCardEl.querySelectorAll('.account-item');
      existingItems.forEach(item => item.remove());

      // 새 계좌 정보 추가
      config.bride.accounts.forEach(account => {
        const accountHTML = `
          <div class="account-item">
            <p class="account-owner">${escapeHtml(account.owner)}</p>
            <p class="account-info">
              <span class="account-bank">${escapeHtml(account.bank)}</span>
              <span class="account-number">${escapeHtml(account.number)}</span>
            </p>
            <button class="copy-button"
                    data-account="${escapeHtml(account.numberRaw)}"
                    aria-label="${escapeHtml(account.owner)} 계좌번호 복사">
              계좌번호 복사
            </button>
          </div>
        `;
        brideCardEl.insertAdjacentHTML('beforeend', accountHTML);
      });
    }
  }

  // 계좌 복사 버튼 이벤트 재등록
  initAccountCopy();
}

/**
 * 푸터 렌더링
 */
function renderFooter(config) {
  if (!config.messages || !config.messages.footer) return;

  const footerMessageEl = document.querySelector('.footer-message');
  if (footerMessageEl) {
    footerMessageEl.innerHTML = escapeHtml(config.messages.footer).replace(/\n/g, '<br>');
  }
}

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
