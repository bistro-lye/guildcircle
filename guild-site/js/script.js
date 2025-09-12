document.addEventListener('DOMContentLoaded', function() {

    // スクロール時のヘッダー表示・非表示
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }
            lastScrollY = window.scrollY;
        });
    }

    // SPナビゲーション（ハンバーガーメニュー）
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.createElement('div');
    navMenu.className = 'nav-menu';
    navMenu.innerHTML = `
        <ul>
            <li><a href="index.html">ホーム</a></li>
            <li class="has-sub">
                <a href="#">GUILDについて</a>
                <ul class="sub-menu">
                    <li><a href="about.html">理念</a></li>
                    <li><a href="members.html">メンバー紹介</a></li>
                </ul>
            </li>
            <li class="has-sub">
                <a href="#">活動内容</a>
                <ul class="sub-menu">
                    <li><a href="daily-activities.html">普段の活動</a></li>
                    <li><a href="achievements.html">これまでの実績</a></li>
                </ul>
            </li>
            <li><a href="join-us.html">GUILDに参加する</a></li> <li class="has-sub">
            <li class="has-sub">
                <a href="tie-up.html">タイアップ</a>
                <ul class="sub-menu">
                    <li><a href="tie-up.html">お手伝いできること</a></li>
                </ul>
            </li>
            <li><a href="faq.html">よくある質問</a></li>
            <li><a href="contact.html">お問い合わせ</a></li>
        </ul>
    `;
    document.body.appendChild(navMenu);

    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            menuIcon.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
    }
    
    const hasSubLinks = document.querySelectorAll('.has-sub > a');
    hasSubLinks.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const subMenu = this.nextElementSibling;
            if (subMenu) {
                subMenu.classList.toggle('open');
                this.classList.toggle('open');
            }
        });
    });

    // モーダル関連のJavaScript
    const modalLinks = document.querySelectorAll('[data-modal-target]');
    const modalContainer = document.getElementById('modal-container');
    const modalClose = document.querySelector('.modal-close');
    const modalContents = document.querySelectorAll('.modal-content');

    if (modalLinks.length > 0) {
        modalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.dataset.modalTarget;
                const targetModal = document.getElementById(targetId);

                modalContents.forEach(content => {
                    content.style.display = 'none';
                });

                if (targetModal && modalContainer) {
                    targetModal.style.display = 'block';
                    modalContainer.classList.add('active');
                }
            });
        });
    }

    if (modalClose && modalContainer) {
        modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            modalContainer.classList.remove('active');
        });
    }

    // お問い合わせボタンのモーダル機能
    const contactButton = document.querySelector('.contact-button');
    const contactModal = document.getElementById('contact-modal');
    const contactModalClose = document.querySelector('#contact-modal .modal-close');

    if (contactButton && contactModal) {
        contactButton.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
        });

        if (contactModalClose) {
            contactModalClose.addEventListener('click', (e) => {
                e.preventDefault();
                contactModal.classList.remove('active');
            });
        }
        
        // モーダルの外側をクリックしたら閉じる
        contactModal.addEventListener('click', (e) => {
            if (e.target.id === 'contact-modal') {
                contactModal.classList.remove('active');
            }
        });
    }

    // 画像スライダー
    document.querySelectorAll('.slider').forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const wrapper = slider.querySelector('.slider-wrapper');
        const prevButton = slider.querySelector('.prev-button');
        const nextButton = slider.querySelector('.next-button');
        const dotsContainer = slider.querySelector('.slider-dots');
        const items = slider.querySelectorAll('.slider-item');

        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        // ドットを生成
        for (let i = 0; i < items.length; i++) {
            const dot = document.createElement('span');
            dotsContainer.appendChild(dot);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
        }

        const dots = dotsContainer.querySelectorAll('span');
        updateSlider();

        // 次へ・前へボタン
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            updateSlider();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });

        // スライダーを更新する関数
        function updateSlider() {
            currentTranslate = -currentIndex * container.offsetWidth;
            wrapper.style.transform = `translateX(${currentTranslate}px)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // フリック操作
        wrapper.addEventListener('mousedown', startDrag);
        wrapper.addEventListener('mouseup', endDrag);
        wrapper.addEventListener('mouseleave', endDrag);
        wrapper.addEventListener('mousemove', drag);
        
        // タッチデバイス用
        wrapper.addEventListener('touchstart', startDrag);
        wrapper.addEventListener('touchend', endDrag);
        wrapper.addEventListener('touchmove', drag);

        function startDrag(e) {
            isDragging = true;
            startPos = getPositionX(e);
            prevTranslate = currentTranslate;
            wrapper.classList.add('is-dragging');
        }

        function endDrag() {
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentIndex < items.length - 1) {
                currentIndex += 1;
            }
            if (movedBy > 100 && currentIndex > 0) {
                currentIndex -= 1;
            }

            updateSlider();
            wrapper.classList.remove('is-dragging');
        }

        function drag(e) {
            if (!isDragging) return;
            const currentPos = getPositionX(e);
            currentTranslate = prevTranslate + currentPos - startPos;
            wrapper.style.transform = `translateX(${currentTranslate}px)`;
        }

        function getPositionX(e) {
            return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }
    });

    // FAQアコーディオン
    document.querySelectorAll('.faq-question').forEach(item => {
        item.addEventListener('click', () => {
            const parentItem = item.parentNode;
            const answer = parentItem.querySelector('.faq-answer');

            if (answer) {
                const isActive = item.classList.contains('active');
                
                // すべての回答を閉じる
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.style.maxHeight = '0';
                });
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                });

                // クリックされたアイテムを開く/閉じる
                if (!isActive) {
                    const scrollHeight = answer.scrollHeight;
                    answer.style.maxHeight = scrollHeight + 'px';
                    item.classList.add('active');
                }
            }
        });
    });

});