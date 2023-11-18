# Nice Market
NicePay 결제 시스템 연동 온라인 커머스 하이브리드 앱

## 프로젝트 개요

Nice Market은 사용자가 온라인에서 상품을 조회하고, 장바구니에 추가/삭제, 그리고 결제를 진행할 수 있는 웹 애플리케이션입니다.
React Native와 Express.js를 기반으로 구축되었으며, 사용자 인증과 상품 관리, 장바구니 관리, 주문 및 결제 처리 등의 주요 기능을 제공합니다.

## 주요 기능

- 상품 조회
- 장바구니에 상품 추가/삭제
- 결제
- 주문 내역 확인

## 기술 스택

### 프론트엔드

- React Native: 웹과 네이티브 앱 모두에서 동작하는 애플리케이션을 구축하기 위해 선택했습니다.
- Expo: 하나의 코드로 iOS와 Android 앱을 모두 실행할 수 있어, 하이브리드 앱을 만드는 데 유용했습니다. 웹에서 또한 테스트할 수 있었습니다.
- TypeScript: 정적 타입 언어로, 변수와 함수의 타입을 명시적으로 지정하도록 하여 안정적인 코드를 작성할 수 있었습니다.

### 백엔드

- Node.js: JavaScript를 사용하여 프론트엔드와 일관성 있는 개발을 지원합니다.

### 데이터베이스

- MySQL: 복잡한 데이터 관계를 유지관리하는 데 용이한 관계형 데이터베이스를 제공합니다.

## 데이터베이스 설계

데이터베이스 설계는 다음과 같습니다. 

- Users: 사용자 정보를 저장합니다. 주요 필드로는 user_id, username, password, email, created_at이 있습니다.
- Products: 상품 정보를 저장합니다. 주요 필드로는 product_id, name, description, price, image, stock이 있습니다.
- Carts: 장바구니를 관리합니다. 주요 필드로는 cart_id와 user_id가 있습니다.
- CartItems: 각 장바구니에 담긴 상품들을 관리합니다. 주요 필드로는 cart_item_id, cart_id, product_id, quantity가 있습니다.
- Orders: 주문을 관리합니다. 주요 필드로는 order_id, user_id, created_at이 있습니다.
- OrderItems: 각 주문에 포함된 상품들을 관리합니다. 주요 필드로는 order_item_id, order_id, product_id, quantity, price가 있습니다.

## 사용자 인터페이스

사용자 인터페이스는 다음과 같은 화면으로 구성되어 있습니다.

- 로그인/회원가입 화면
- 홈 화면 (제품 목록 표시)
- 장바구니 화면
- 상품 상세 화면
- 결제 화면
- 주문 내역 화면

## API 목록

![image](https://github.com/hyunseo-k/nice_market/assets/79782180/ec57ac02-2527-4fb8-a4a6-b69ff305c1ee)
다양한 API를 제공하여 사용자 인증, 제품 관리, 장바구니 관리, 주문 및 결제 처리 등의 기능을 지원합니다.

## 결제 처리

NicePay 결제창 API를 연동하여, 사용자가 결제를 진행할 수 있도록 했습니다.

## 배포

Docker와 쿠버네티스를 이용하여 애플리케이션을 배포했습니다.

