import LocomotiveScroll from '../../../src/locomotive-scroll';

(function() {

    // 페이지 로딩 중에 'is-loading' 클래스 제거하고 'is-loaded' 클래스 추가
    document.documentElement.classList.add('is-loaded');
    document.documentElement.classList.remove('is-loading');

    // 0.3초(300밀리초) 후에 'is-ready' 클래스 추가
    setTimeout(() => {
        document.documentElement.classList.add('is-ready');
    }, 300)

    // LocomotiveScroll 설정 옵션
    let options = {
        el: document.querySelector('#js-scroll'), // 스크롤 효과를 적용할 요소 선택
        smooth: true, // 부드러운 스크롤 활성화
        getSpeed: true, // 스크롤 속도 정보 활성화
        getDirection: true // 스크롤 방향 정보 활성화
    }

    // 만약 페이지의 스크롤 요소가 수평 스크롤이라면 해당 옵션을 설정
    if (document.querySelector('#js-scroll').getAttribute('data-horizontal') == 'true') {
        options.direction = 'horizontal'; // 수평 스크롤 설정
        options.gestureDirection = 'both'; // 스와이프 제스처 활성화
        options.tablet = {
            smooth: true,
            direction: 'horizontal',
            horizontalGesture: true
        }
        options.smartphone = {
            smooth: true // 스마트폰에서 스무스 스크롤 비활성화
        }
        options.reloadOnContextChange = true
    }

    // 1초(1000밀리초) 후에 LocomotiveScroll 인스턴스 생성
    setTimeout(() => {
        const scroll = new LocomotiveScroll(options);

        // 동적 배경 및 글자색을 변경할 요소들을 저장하기 위한 배열 초기화
        let dynamicBackgrounds = [];
        let dynamicColorElements = [];

        // 스크롤 이벤트 리스너 등록
        scroll.on('scroll', (instance) => {
            const progress = (instance.scroll.y / instance.limit.y) * 100;

            // 보라색 HSL 값을 사용하고 백분율 값을 사용하여 배경색 변경
            const purpleColor = `hsl(270, 100%, ${progress}%)`;

            scroll.el.style.backgroundColor = purpleColor; // 전체 페이지 배경색 변경

            // 동적 배경색을 변경할 요소에도 동일한 색상 적용
            dynamicBackgrounds.forEach(obj => {
                obj.el.style.backgroundColor = purpleColor;
            });

            // 동적 글자색을 변경할 요소에 동일한 색상 적용
            dynamicColorElements.forEach(obj => {
                obj.el.style.color = purpleColor;
            });

            document.documentElement.setAttribute('data-direction', instance.direction); // 스크롤 방향 데이터 설정

        });

        // 'call' 이벤트 리스너 등록
        scroll.on('call', (value, way, obj) => {
            if (value === 'dynamicBackground') {
                if (way === 'enter') {
                    dynamicBackgrounds.push({
                        id: obj.id,
                        el: obj.el
                    });
                } else {
                    for (var i = 0; i < dynamicBackgrounds.length; i++) {
                        if (obj.id === dynamicBackgrounds[i].id) {
                            dynamicBackgrounds.splice(i, 1);
                        }
                    }
                }
            } else if (value === 'dynamicColor') {
                if (way === 'enter') {
                    dynamicColorElements.push({
                        id: obj.id,
                        el: obj.el
                    });
                } else {
                    for (var i = 0; i < dynamicColorElements.length; i++) {
                        if (obj.id === dynamicColorElements[i].id) {
                            dynamicColorElements.splice(i, 1);
                        }
                    }
                }
            }
        });

    }, 1000)

})();
